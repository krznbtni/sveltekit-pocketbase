import type { Record } from 'pocketbase';

export interface Project extends Record {
	name: string;
	tagline: string;
	description?: string;
	thumbnail?: string;
	user: string;
	url: string;
}
