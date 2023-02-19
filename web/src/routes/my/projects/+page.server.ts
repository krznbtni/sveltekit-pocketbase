import { serializeNonPOJOs } from '$lib/utils';
import { error, redirect } from '@sveltejs/kit';
import type { ClientResponseError } from 'pocketbase';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	if (!locals.pb.authStore.isValid) {
		throw redirect(303, '/login');
	}

	const getUsersProjects = async (userId: string) => {
		try {
			return serializeNonPOJOs(
				await locals.pb
					.collection('projects')
					.getFullList(undefined, { filter: `user = "${userId}"` }),
			);
		} catch (err) {
			const e = err as ClientResponseError;
			console.log('Error: ', e);
			throw error(e.status, e.message);
		}
	};

	return {
		projects: getUsersProjects(locals.user?.id),
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
