import type { PageServerLoad } from './$types';
import { getProjects } from '$lib/services/ProjectService';

export const load = (async ({ locals }) => {
	return {
		projects: getProjects(locals),
	};
}) satisfies PageServerLoad;
