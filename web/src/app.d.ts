import type PocketBase from 'pocketbase';

import type { User } from '$lib/types';

// See https://kit.svelte.dev/docs/types#app for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			pb: PocketBase;
			user?: User;
		}

		// interface Error {}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
