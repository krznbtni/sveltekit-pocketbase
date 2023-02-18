import { serializedNonPOJO } from '$lib/utils';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals, params }) => {
	const getProject = async (projectId: string) => {
		try {
			const project = serializedNonPOJO(await locals.pb.collection('projects').getOne(projectId));
			return project;
		} catch (err) {
			console.log('Error:', err);
			throw error(err.status, err.message);
		}
	};

	return {
		project: getProject(params.projectId),
	};
}) satisfies PageServerLoad;
