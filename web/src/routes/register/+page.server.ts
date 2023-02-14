import { error, redirect } from '@sveltejs/kit';
import { generateUsername } from '$lib/utils';
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

type RequestData = {
	name?: string;
	email?: string;
	password?: string;
	passwordConfirm?: string;
};

export const actions: Actions = {
	register: async ({ locals, request }) => {
		const body: RequestData = Object.fromEntries(await request.formData());

		if (!body.name) {
			return;
		}

		const username = generateUsername(body.name?.split(' ').join('')).toLowerCase();

		try {
			await locals.pb.collection('users').create({ username, ...body });

			// await locals.pb.collection('users').requestVerification(body.email);
		} catch (err) {
			console.log('Error:', err);
			throw error(500, 'Something went wrong');
		}

		throw redirect(303, '/login');
	},
};
