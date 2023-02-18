import { error, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

type UpdatePassword = {
	password?: string;
	oldPassword?: string;
	passwordConfirm?: string;
};

export const actions: Actions = {
	updatePassword: async ({ request, locals }) => {
		const data: UpdatePassword = Object.fromEntries(await request.formData());

		try {
			if (locals.user) {
				await locals.pb.collection('users').update(locals.user.id, data);
				// Force a logout
				locals.pb.authStore.clear();
			}
		} catch (err) {
			console.log('Error:', err);
			throw error(err.status, err.message);
		}

		throw redirect(303, '/login');
	},
};
