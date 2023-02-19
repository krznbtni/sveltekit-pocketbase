import { error } from '@sveltejs/kit';
import { serializeNonPOJOs } from '$lib/utils';
import type { ClientResponseError } from 'pocketbase';
import type { PageServerLoad } from './$types';
import type { Project } from '$lib/types';

export const load = (async ({ locals }) => {
	const getProjects = async () => {
		try {
			return serializeNonPOJOs(
				await locals.pb.collection('projects').getFullList<Project>(undefined),
			);
		} catch (err) {
			const e = err as ClientResponseError;
			console.log('Error:', e);
			throw error(e.status, e.message);
		}
	};

	return {
		projects: getProjects(),
	};
}) satisfies PageServerLoad;
