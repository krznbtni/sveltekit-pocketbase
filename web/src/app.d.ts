import type { default as Client, BaseAuthStore } from 'pocketbase';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			pb: Client;
			user?: BaseAuthStore['model'];
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
