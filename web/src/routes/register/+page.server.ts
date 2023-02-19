import { error, fail, redirect } from '@sveltejs/kit';
import { generateUsername, validateData } from '$lib/utils';
import { registerUserSchema } from '$lib/schemas';
import type { Actions, PageServerLoad } from './$types';

export const load = (({ locals }) => {
	if (locals.user) {
		return {
			user: locals.user,
		};
	}

	return {
		user: undefined,
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	register: async ({ locals, request }) => {
		const { formData, errors } = await validateData(await request.formData(), registerUserSchema);

		if (errors) {
			return fail(400, {
				data: formData,
				errors: errors.fieldErrors,
			});
		}

		const username = generateUsername(formData.name?.split(' ').join('')).toLowerCase();

		try {
			await locals.pb.collection('users').create({ username, ...formData });
			await locals.pb.collection('users').requestVerification(formData.email);
		} catch (err) {
			console.log('Error:', err);
			throw error(500, 'Something went wrong');
		}

		throw redirect(303, '/login');
	},
};
