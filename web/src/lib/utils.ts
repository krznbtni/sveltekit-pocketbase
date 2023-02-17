const { randomBytes } = await import('node:crypto');
import type { BaseAuthStore } from 'pocketbase';

export function serializedNonPOJO(obj: BaseAuthStore['model']) {
	/// Native JS.
	/// Creates a deep clone of an object.
	/// It is equivalent to JSON.parse.
	return structuredClone(obj);
}

export function generateUsername(name: string) {
	const id = randomBytes(2).toString('hex');
	return `${name.slice(0, 5)}${id}`;
}

export function getImageURL(
	collectionId: number,
	recordId: string,
	fileName: string,
	size = '0x0',
) {
	return `http://localhost:8090/api/files/${collectionId}/${recordId}/${fileName}?thumb=${size}`;
}
