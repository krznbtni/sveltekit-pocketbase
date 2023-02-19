import type { Handle } from '@sveltejs/kit';

import PocketBase from 'pocketbase';

import { serializedNonPOJO } from '$lib/utils';

/// Hooks are run on every request.
export const handle = (async ({ event, resolve }) => {
	event.locals.pb = new PocketBase('http://127.0.0.1:8090');

	// Grab the cookie from the browser if we have one.
	const cookie = event.request.headers.get('cookie') || '';

	// Send the cookie to the authStore.
	event.locals.pb.authStore.loadFromCookie(cookie);

	try {
		/// Get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
		if (event.locals.pb.authStore.isValid) {
			await event.locals.pb.collection('users').authRefresh();

			// Serialize the user model, and save the value in the locals object.
			// The locals object is unique for each user. This is how you distinguish users.
			event.locals.user = serializedNonPOJO(event.locals.pb.authStore.model);
		}
	} catch (_) {
		/// Clear the auth store on failed refresh.
		/// Same thing as logging out the user.
		event.locals.pb.authStore.clear();
		event.locals.user = undefined;
	}

	// Anything else that happens in the app, server side, happens inside the resolve.
	const response = await resolve(event);

	response.headers.set('set-cookie', event.locals.pb.authStore.exportToCookie({ secure: false }));

	return response;
}) satisfies Handle;
