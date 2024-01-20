import z from 'zod';

export const create_user_schema = z.object({
	firstName: z.string()
		.min(3, {message: 'First name must be at least 3 characters'})
		.max(32, {message: 'First name cannot exceed 32 characters'}),
	lastName: z.string()
		.min(3, {message: 'Last name must be at least 3 characters'})
		.max(32, {message: 'Last name cannot exceed 32 characters'}),
	username: z.string()
		.min(3, {message: 'Username must be at least 3 characters'})
		.max(32, {message: 'Username cannot exceed 32 characters'}),
	email: z.string()
		.email({message: 'Invalid email address'}),
	password: z.string()
		.min(8, {message: 'Password must be at least 8 characters'}),
});

export const login_user_schema = z.object({
	username: z.string()
		.min(3, {message: 'Username must be at least 3 characters'})
		.max(32, {message: 'Username cannot exceed 32 characters'}),
	password: z.string()
		.min(8, {message: 'Password must be at least 8 characters'}),
});

