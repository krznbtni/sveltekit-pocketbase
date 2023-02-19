import { error, fail, redirect } from '@sveltejs/kit';
import { loginUserSchema } from '$lib/schemas';
import { validateData } from '$lib/utils';
import type { Actions, PageServerLoad } from './$types';
import type { ClientResponseError } from 'pocketbase';

export const load = (({ locals }) => {
	if (locals.pb.authStore.isValid) {
		throw redirect(303, '/');
	}
}) satisfies PageServerLoad;

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
			const e = err as ClientResponseError;
			console.log('Error:', e);
			throw error(e.status, e.message);
		}

		throw redirect(303, '/');
	},
};
