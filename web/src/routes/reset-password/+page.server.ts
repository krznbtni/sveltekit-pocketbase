import { error } from '@sveltejs/kit';
import type { Actions } from './$types';

type RequestData = {
	email?: string;
};

export const actions: Actions = {
	resetPassword: async ({ request, locals }) => {
		const body: RequestData = Object.fromEntries(await request.formData());

		if (!body.email) {
			return;
		}

		try {
			await locals.pb.collection('users').requestPasswordReset(body.email);

			return { success: true };
		} catch (err) {
			console.log('Error:', err);
			throw error(500, 'Something went wrong');
		}
	},
};
