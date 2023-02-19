import { updateEmailSchema, updateUsernameSchema } from '$lib/schemas';
import { validateData } from '$lib/utils';
import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { ClientResponseError } from 'pocketbase';

export const load = (({ locals }) => {
	if (!locals.pb.authStore.isValid) {
		throw redirect(303, '/login');
	}
}) satisfies PageServerLoad;

export const actions: Actions = {
	updateEmail: async ({ request, locals }) => {
		const { formData, errors } = await validateData(await request.formData(), updateEmailSchema);

		if (errors) {
			return fail(400, {
				data: formData,
				errors: errors.fieldErrors,
			});
		}

		try {
			await locals.pb.collection('users').requestEmailChange(formData.email);
		} catch (err) {
			console.log('Error: ', err);
			const e = err as ClientResponseError;
			throw error(e.status, e.data.message);
		}

		return {
			success: true,
			data: formData,
		};
	},

	updateUsername: async ({ request, locals }) => {
		const { formData, errors } = await validateData(await request.formData(), updateUsernameSchema);

		if (errors) {
			return fail(400, {
				data: formData,
				errors: errors.fieldErrors,
			});
		}

		try {
			// Check if a user exists with the username we want to change to.
			// If it does not exist, Pocketbase will return a 404
			// which means we can continue with updating the usename.
			await locals.pb.collection('users').getFirstListItem(`username = "${formData.username}"`);
		} catch (err) {
			if (err.status === 404) {
				try {
					if (locals.user) {
						const { username } = await locals.pb
							.collection('users')
							.update(locals.user.id, { username: formData.username });

						locals.user.username = username;
					}

					return { success: true };
				} catch (err2) {
					console.log('Error:', err2);
					throw error(err2.status, err2.message);
				}
			}

			console.log('Error:', err);
			throw error(err.status, err.message);
		}
	},
};
