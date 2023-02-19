import type { Record } from 'pocketbase';

interface User extends Record {
	name: string;
	avatar?: string;
	username: string;
}

interface Project extends Record {
	name: string;
	tagline: string;
	description?: string;
	thumbnail?: string;
	user: string;
	url: string;
}
