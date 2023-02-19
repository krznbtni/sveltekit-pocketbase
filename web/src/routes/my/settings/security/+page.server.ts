import { error, fail, redirect } from '@sveltejs/kit';
import { updatePasswordSchema } from '$lib/schemas';
import { validateData } from '$lib/utils';
import type { Actions, PageServerLoad } from './$types';
import type { ClientResponseError } from 'pocketbase';

export const load = (({ locals }) => {
	if (!locals.pb.authStore.isValid) {
		throw redirect(303, '/login');
	}
}) satisfies PageServerLoad;

export const actions: Actions = {
	updatePassword: async ({ request, locals }) => {
		const { formData, errors } = await validateData(await request.formData(), updatePasswordSchema);

		if (errors) {
			return fail(400, {
				errors: errors.fieldErrors,
			});
		}

		try {
			if (locals.user) {
				await locals.pb.collection('users').update(locals.user.id, formData);
				// Force a logout
				locals.pb.authStore.clear();
			}
		} catch (err) {
			const e = err as ClientResponseError;
			console.log('Error:', e);
			throw error(e.status, e.message);
		}

		throw redirect(303, '/login');
	},
};
