import { error, fail, redirect } from '@sveltejs/kit';
import { loginUserSchema } from '$lib/schemas';
import { validateData } from '$lib/utils';
import type { Actions } from './$types';

export const actions: Actions = {
	login: async ({ locals, request }) => {
		const { formData, errors } = await validateData(await request.formData(), loginUserSchema);

		if (errors) {
			return fail(400, {
				data: formData,
				errors: errors.fieldErrors,
			});
		}

		try {
			await locals.pb.collection('users').authWithPassword(formData.email, formData.password);

			if (!locals.pb?.authStore?.model?.verified) {
				locals.pb.authStore.clear();

				return {
					notVerified: true,
				};
			}
		} catch (err) {
			console.log('Error:', err);
			throw error(500, 'Something went wrong logging in');
		}

		throw redirect(303, '/');
	},
};
