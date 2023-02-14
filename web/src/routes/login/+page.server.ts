import { error, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

type RequestData = {
	email?: string;
	password?: string;
};

export const actions: Actions = {
	login: async ({ locals, request }) => {
		const body: RequestData = Object.fromEntries(await request.formData());

		if (!body.email || !body.password) {
			return;
		}

		try {
			await locals.pb.collection('users').authWithPassword(body.email, body.password);

			console.log(locals.pb?.authStore?.model);

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
