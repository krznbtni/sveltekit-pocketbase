import { error } from '@sveltejs/kit';
import { ClientResponseError } from 'pocketbase';

import { serializeNonPOJOs } from '$lib/utils';
import type { Project } from '$lib/types';

export async function getProject(locals: App.Locals, id: string): Promise<Project> {
	try {
		const project = await locals.pb.collection('projects').getOne<Project>(id);
		return serializeNonPOJOs(project);
	} catch (err) {
		console.log('getProject -> Error:', err);

		if (err instanceof ClientResponseError) {
			throw error(err.status, err.data.message);
		} else {
			throw error(500, 'Something went wrong with fetching the project.');
		}
	}
}

export async function getProjects(locals: App.Locals, filter = ''): Promise<Project[]> {
	try {
		const projects = await locals.pb
			.collection('projects')
			.getFullList<Project>(undefined, { sort: '-created', filter });
		return serializeNonPOJOs(projects);
	} catch (err) {
		console.log('getProjects -> Error:', err);

		if (err instanceof ClientResponseError) {
			throw error(err.status, err.data.message);
		} else {
			throw error(500, 'Something went wrong with fetching the projects.');
		}
	}
}

export async function getUsersProjects(locals: App.Locals): Promise<Project[]> {
	try {
		const projects = await locals.pb
			.collection('projects')
			.getFullList<Project>(undefined, { filter: `user = "${locals?.user?.id}"` });
		return serializeNonPOJOs(projects);
	} catch (err) {
		console.log('getUsersProjects -> Error:', err);

		if (err instanceof ClientResponseError) {
			throw error(err.status, err.data.message);
		} else {
			throw error(500, "Something went wrong with fetching the user's projects.");
		}
	}
}

export async function getAllProjects(locals: App.Locals): Promise<Project[]> {
	try {
		const projects = await locals.pb
			.collection('projects')
			.getFullList<Project>(undefined, { sort: '-created' });
		return serializeNonPOJOs(projects);
	} catch (err) {
		console.log('getAllProjects -> Error:', err);

		if (err instanceof ClientResponseError) {
			throw error(err.status, err.data.message);
		} else {
			throw error(500, 'Something went wrong with fetching all projects.');
		}
	}
}
