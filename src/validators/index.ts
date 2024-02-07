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
	password: z.string()
		.min(8, {message: 'Password must be at least 8 characters'}),
	email: z.string()
		.email({message: 'Invalid email address'}),
});

export const login_user_schema = z.object({
	username: z.string()
		.min(3, {message: 'Username must be at least 3 characters'})
		.max(32, {message: 'Username cannot exceed 32 characters'}),
	password: z.string()
		.min(8, {message: 'Password must be at least 8 characters'}),
});

export const sender_recipient_schema = z.object({
	sender: z.string().uuid({message: 'Sender must be a valid UUID'}),
	recipient: z.string().uuid({message: 'Recipient must be a valid UUID'}),
})

export const uuid_schema = z.string().uuid({message: 'Must be a valid UUID'});

export const name_schema = z.string()
	.min(3, {message: 'Username must be at least 3 characters'})
	.max(32, {message: 'Username cannot exceed 32 characters'})
;

export const create_message_schema = z.object({
	sender: z.string().uuid({message: 'Sender must be a valid UUID'}),
	recipient: z.string().uuid({message: 'Recipient must be a valid UUID'}),
	friendship: z.string().uuid({message: 'Friendship must be a valid UUID'}),
	content: z.string().min(1, {message: "Invalid content size"}),
});

export const message_schema = z.object({
	type: z.string(),
	sender: z.string().uuid({message: 'Sender must be a valid UUID'}),
	recipient: z.string().uuid({message: 'Recipient must be a valid UUID'}),
	content: z.string().min(1, {message: "Invalid content size"}),
	date: z.string().default(new Date().toISOString),
})

export const video_call_invitation_request_schema = z.object({
	type: z.string(),
	room: z.string().uuid({message: 'Room must be a valid UUID'}),
	sender: z.string().uuid({message: 'Sender must be a valid UUID'}),
	recipient: z.string().uuid({message: 'Recipient must be a valid UUID'}),
})