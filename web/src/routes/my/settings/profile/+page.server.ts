import { error } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	updateProfile: async ({ request, locals }) => {
		const data = await request.formData();

		const userAvatar = data.get('avatar');

		if (userAvatar && userAvatar instanceof File && userAvatar.size === 0) {
			data.delete('avatar');
		}

		try {
			if (locals?.user?.id) {
				const { name, avatar } = await locals.pb.collection('users').update(locals?.user?.id, data);
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
