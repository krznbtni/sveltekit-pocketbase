import { getUsersProjects } from '$lib/services/ProjectService';
import { error, redirect } from '@sveltejs/kit';
import type { ClientResponseError } from 'pocketbase';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	if (!locals.pb.authStore.isValid) {
		throw redirect(303, '/login');
	}

	return {
		projects: getUsersProjects(locals),
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	deleteProject: async ({ locals, request }) => {
		const { id } = Object.fromEntries(await request.formData());

		try {
			await locals.pb.collection('projects').delete(id);
		} catch (err) {
			const e = err as ClientResponseError;
			console.log('Error: ', e);
			throw error(e.status, e.message);
		}

		return {
			success: true,
		};
	},
};
