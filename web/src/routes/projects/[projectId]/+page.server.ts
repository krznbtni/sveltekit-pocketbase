import { serializeNonPOJOs } from '$lib/utils';
import { error } from '@sveltejs/kit';
import type { ClientResponseError } from 'pocketbase';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals, params }) => {
	const getProject = async (projectId: string) => {
		try {
			return serializeNonPOJOs(await locals.pb.collection('projects').getOne(projectId));
		} catch (err) {
			const e = err as ClientResponseError;
			console.log('Error: ', e);
			throw error(e.status, e.message);
		}
	};

	return {
		project: getProject(params.projectId),
	};
}) satisfies PageServerLoad;
