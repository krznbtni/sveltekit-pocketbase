import { createProjectSchema } from '$lib/schemas';
import { validateData } from '$lib/utils';
import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { serialize } from 'object-to-formdata';
import type { ClientResponseError } from 'pocketbase';

export const load = (async ({ locals }) => {
	if (!locals.pb.authStore.isValid) {
		throw redirect(303, '/login');
	}
}) satisfies PageServerLoad;

export const actions: Actions = {
	create: async ({ locals, request }) => {
		const body = await request.formData();
		const thumb = body.get('thumbnail');

		if (thumb && thumb instanceof File && thumb.size === 0) {
			body.delete('thumbnail');
		}

		body.append('user', locals.user?.id);

		const { formData, errors } = await validateData(body, createProjectSchema);
		const { thumbnail, ...rest } = formData;

		if (errors) {
			return fail(400, {
				data: rest,
				errors: errors.fieldErrors,
			});
		}

		try {
			await locals.pb.collection('projects').create(serialize(formData));
		} catch (err) {
			const e = err as ClientResponseError;
			console.log('Error: ', e);
			throw error(e.status, e.message);
		}

		throw redirect(303, '/my/projects');
	},
};
