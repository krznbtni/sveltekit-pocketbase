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
