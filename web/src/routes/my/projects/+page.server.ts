import { serializedNonPOJO } from '$lib/utils';
import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	if (!locals.pb.authStore.isValid) {
		throw redirect(303, '/login');
	}

	const getUsersProjects = async (userId: string) => {
		try {
			const projects = serializedNonPOJO(
				await locals.pb
					.collection('projects')
					.getFullList(undefined, { filter: `user = "${userId}"` }),
			);

			return projects;
		} catch (err) {
			console.log('Error:', err);
			throw error(err.status, err.message);
		}
	};

	return {
		projects: getUsersProjects(locals.user.id),
	};
}) satisfies PageServerLoad;

type DeleteProject = {
	id?: string;
};

export const actions: Actions = {
	deleteProject: async ({ locals, request }) => {
		const { id } = Object.fromEntries(await request.formData());

		try {
			await locals.pb.collection('projects').delete(id);
		} catch (err) {
			console.log('Error: ', err);
			throw error(err.status, err.message);
		}

		return {
			success: true,
		};
	},
};
