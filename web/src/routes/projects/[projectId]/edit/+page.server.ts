import { updateProjectSchema } from '$lib/schemas';
import { serializeNonPOJOs, validateData } from '$lib/utils';
import { error, fail, redirect } from '@sveltejs/kit';
import { serialize } from 'object-to-formdata';
import type { ClientResponseError } from 'pocketbase';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ locals, params }) => {
	if (!locals.pb.authStore.isValid) {
		throw error(401, 'Unauthorized');
	}

	try {
		const project = serializeNonPOJOs(
			await locals.pb.collection('projects').getOne(params.projectId),
		);

		if (locals.user.id === project.user) {
			return { project };
		} else {
			throw error(403, 'Forbidden');
		}
	} catch (err) {
		const e = err as ClientResponseError;
		console.log('Error: ', e);
		throw error(e.status, e.message);
	}
}) satisfies PageServerLoad;

export const actions: Actions = {
	updateProject: async ({ request, locals, params }) => {
		const body = await request.formData();
		const thumb = body.get('thumbnail');

		if (thumb && thumb instanceof File && thumb.size === 0) {
			body.delete('thumbnail');
		}

		const { formData, errors } = await validateData(body, updateProjectSchema);

		const { thumbnail, ...rest } = formData;

		if (errors) {
			return fail(400, {
				data: rest,
				errors: errors.fieldErrors,
			});
		}

		try {
			await locals.pb.collection('projects').update(params.projectId, serialize(formData));
		} catch (err) {
			const e = err as ClientResponseError;
			console.log('Error: ', e);
			throw error(e.status, e.message);
		}

		throw redirect(303, '/my/projects');
	},

	deleteThumbnail: async ({ locals, params }) => {
		try {
			await locals.pb.collection('projects').update(params.projectId, { thumbnail: null });
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
