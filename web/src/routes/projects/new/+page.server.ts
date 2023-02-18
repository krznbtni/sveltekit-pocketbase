import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	if (!locals.pb.authStore.isValid) {
		throw redirect(303, '/login');
	}
}) satisfies PageServerLoad;

export const actions: Actions = {
	create: async ({ locals, request }) => {
		const formData = await request.formData();
		const thumbnail = formData.get('thumbnail');

		if (thumbnail && thumbnail instanceof File && thumbnail.size === 0) {
			formData.delete('thumbnail');
		}

		formData.append('user', locals.user.id);

		try {
			await locals.pb.collection('projects').create(formData);
		} catch (err) {
			console.log('Error: ', err);
			throw error(err.status, err.message);
		}

		throw redirect(303, '/my/projects');
	},
};
