import { updateProfileSchema } from '$lib/schemas';
import { validateData } from '$lib/utils';
import { error, fail, redirect } from '@sveltejs/kit';
import { serialize } from 'object-to-formdata';
import type { Actions, PageServerLoad } from './$types';

export const load = (({ locals }) => {
	if (!locals.pb.authStore.isValid) {
		throw redirect(303, '/login');
	}
}) satisfies PageServerLoad;

export const actions: Actions = {
	updateProfile: async ({ request, locals }) => {
		const body = await request.formData();
		const userAvatar = body.get('avatar');

		if (userAvatar && userAvatar instanceof File && userAvatar.size === 0) {
			body.delete('avatar');
		}

		const { formData, errors } = await validateData(body, updateProfileSchema);
		const { avatar, ...rest } = formData;

		if (errors) {
			return fail(400, {
				data: rest,
				errors: errors.fieldErrors,
			});
		}

		try {
			if (locals?.user?.id) {
				const { name, avatar } = await locals.pb
					.collection('users')
					.update(locals?.user?.id, serialize(formData));
				locals.user.name = name;
				locals.user.avatar = avatar;
			}
		} catch (err) {
			console.log(err);
			throw error(400, 'Something went wrong updating your profile');
		}

		return {
			success: true,
		};
	},
};
