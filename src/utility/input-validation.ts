import { object, string, TypeOf } from 'zod';

export const loginUserSchema = object({
	body: object({
		account: string({
			invalid_type_error: 'Invalid Account',
			required_error: 'Account is required',
		}).email('Invalid account or password'),
		password: string({ required_error: 'Password is required' }).min(
			5,
			'Invalid account or password'
		),
	}),
});

export const registerUserSchema = object({
	body: object({
		username: string({ required_error: 'Username is required' }),
		account: string({ required_error: 'Email is required' }).email(
			'Invalid account or password'
		),
		password: string({ required_error: 'Password is required' }).min(
			5,
			'Invalid account or password'
		),
	}),
});

export type LoginUserInput = TypeOf<typeof loginUserSchema>['body'];
export type RegisterUserInput = TypeOf<typeof registerUserSchema>['body'];
