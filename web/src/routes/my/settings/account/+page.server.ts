import { error } from '@sveltejs/kit';
import type { Actions } from './$types';

type UpdateEmail = {
	email?: string;
};

type UpdateUsername = {
	username?: string;
};

export const actions: Actions = {
	updateEmail: async ({ request, locals }) => {
		const data: UpdateEmail = Object.fromEntries(await request.formData());

		try {
			await locals.pb.collection('users').requestEmailChange(data.email);
		} catch (err) {
			throw error(err.status, err.message);
		}

		return {
			success: true,
		};
	},

	updateUsername: async ({ request, locals }) => {
		const data: UpdateUsername = Object.fromEntries(await request.formData());

		try {
			// Check if a user exists with the username we want to change to.
			// If it does not exist, Pocketbase will return a 404
			// which means we can continue with updating the usename.
			await locals.pb.collection('users').getFirstListItem(`username = "${data.username}"`);
		} catch (err) {
			if (err.status === 404) {
				try {
					if (locals.user) {
						const { username } = await locals.pb
							.collection('users')
							.update(locals.user.id, { username: data.username });

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
