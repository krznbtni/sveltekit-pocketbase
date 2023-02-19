const { randomBytes } = await import('node:crypto');

import type { z, ZodError } from 'zod';
import { z as ZOD } from 'zod';
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

export const validateData = async <T extends z.ZodTypeAny>(
	formData: FormData,
	schema: T,
): Promise<{ formData: z.infer<T>; errors: z.inferFlattenedErrors<typeof schema> | null }> => {
	const body = Object.fromEntries(formData);

	try {
		const data = schema.parse(body);

		return {
			formData: data,
			errors: null,
		};
	} catch (err) {
		console.log('Error:', err);
		const errors = (err as ZodError).flatten();

		return {
			formData: body,
			errors,
		};
	}
};
