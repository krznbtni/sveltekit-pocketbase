import { error, redirect } from '@sveltejs/kit';
import type { ClientResponseError } from 'pocketbase';

export async function deleteRecord(
	locals: App.Locals,
	collectionName: string,
	recordId: string,
	redirectTo: string,
): Promise<void> {
	try {
		await locals.pb.collection(collectionName).delete(recordId as string);
	} catch (err) {
		console.log('Error:', err);
		const e = err as ClientResponseError;
		throw error(e.status, e.data.message);
	}

	throw redirect(303, redirectTo);
}
