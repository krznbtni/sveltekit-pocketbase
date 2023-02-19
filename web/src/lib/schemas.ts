import { z } from 'zod';

export const loginUserSchema = z.object({
	email: z
		.string({ required_error: 'Email is required' })
		.email({ message: 'Email must be a valid email' }),
	password: z.string({ required_error: 'Password is required' }),
});

export const registerUserSchema = z
	.object({
		name: z
			.string({ required_error: 'Name is required' })
			.regex(/^[a-zA-Z\s]*$/, { message: 'Name can only contain letters and spaces.' })
			.min(2, { message: 'Name must be at least 2 characters' })
			.max(64, { message: 'Name must be less than 64 characters' })
			.trim(),
		email: z
			.string({ required_error: 'Email is required' })
			.email({ message: 'Email must be a valid email' }),

		password: z
			.string({ required_error: 'Password is required' })
			.regex(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*#?&])[a-zA-Z\d@$!%*#?&]{8,}$/, {
				message:
					'Password must be a minimum of 8 characters & contain at least one letter, one number, and one special character.',
			}),

		passwordConfirm: z
			.string({ required_error: 'Confirm password is required' })
			.regex(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*#?&])[a-zA-Z\d@$!%*#?&]{8,}$/, {
				message:
					'Password must be a minimum of 8 characters & contain at least one letter, one number, and one special character.',
			}),
	})
	.superRefine(({ passwordConfirm, password }, ctx) => {
		if (passwordConfirm !== password) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Password & Confirm Password must match',
				path: ['password'],
			});

			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Password & Confirm Password must match',
				path: ['passwordConfirm'],
			});
		}
	});
