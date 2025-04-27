import z from 'zod';

export class Validate {
	public static create_user = z.object({
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

	public static login_user = z.object({
		username: z.string()
			.min(3, {message: 'Username must be at least 3 characters'})
			.max(32, {message: 'Username cannot exceed 32 characters'}),
		password: z.string()
			.min(8, {message: 'Password must be at least 8 characters'}),
	});

	public static sender_recipient = z.object({
		sender: z.string().uuid({message: 'Sender must be a valid UUID'}),
		recipient: z.string().uuid({message: 'Recipient must be a valid UUID'}),
	})

	public static uuid = z.string().uuid({message: 'Must be a valid UUID'});

	public static name = z.string()
		.min(3, {message: 'Username must be at least 3 characters'})
		.max(32, {message: 'Username cannot exceed 32 characters'})
	;

	public static create_message = z.object({
		sender: z.string().uuid({message: 'Sender must be a valid UUID'}),
		recipient: z.string().uuid({message: 'Recipient must be a valid UUID'}),
		friendship: z.string().uuid({message: 'Friendship must be a valid UUID'}),
		images: z.string().array().default([]),
		files: z.string().array().default([]),
		content: z.string(),
	});

	public static message = z.object({
		type: z.string(),
		sender: z.string().uuid({message: 'Sender must be a valid UUID'}),
		recipient: z.string().uuid({message: 'Recipient must be a valid UUID'}),
		content: z.string(),
		date: z.string().default(new Date().toISOString()),
		images: z.string().array().default([]),
		files: z.string().array().default([]),
	});

	public static live_message = z.object({
		type: z.string(),
		sender: z.string().uuid({message: 'Sender must be a valid UUID'}),
		liveId: z.string().uuid({message: 'LiveId must be a valid UUID'}),
		content: z.string(),
	})

	public static video_call_invitation_request = z.object({
		type: z.string(),
		room: z.string().uuid({message: 'Room must be a valid UUID'}),
		sender: z.string().uuid({message: 'Sender must be a valid UUID'}),
		recipient: z.string().uuid({message: 'Recipient must be a valid UUID'}),
	})

	public static create_notification = z.object({
		sender: z.string().uuid({message: 'Sender must be a valid UUID'}),
		recipient: z.string().uuid({message: 'Recipient must be a valid UUID'}),
		content: z.string().min(1, {message: "Invalid content size"}),
		seen: z.boolean().default(false),
		type: z.string()
	});

	public static update_profile_public_information = z.object({
		firstName: z.string()
			.min(3, {message: 'First name must be at least 3 characters'})
			.max(32, {message: 'First name cannot exceed 32 characters'})
			.optional(),
		lastName: z.string()
			.min(3, {message: 'Last name must be at least 3 characters'})
			.max(32, {message: 'Last name cannot exceed 32 characters'})
			.optional(),
		username: z.string()
			.min(3, {message: 'Username must be at least 3 characters'})
			.max(32, {message: 'Username cannot exceed 32 characters'})
			.optional(),
		email: z.string()
			.email({message: 'Invalid email address'})
			.optional(),
	})

	public static url = z.string().url();

	public static create_publication = z.object({
		publisher_id: z.string().uuid({message: 'Publisher ID must be a valid UUID'}),
		description: z.string().default(''),
		images: z.array(z.string()).min(1, {message: 'At least one image must be provided'}),
		publication_status: z.enum(['draft', 'published']),
	});

	public static update_publication = z.object({
		content: z.string().default('').optional(),
		images: z.array(z.string()).optional(),
		publication_status: z.enum(['draft', 'published']).optional(),
	});

	public static create_story = z.object({
		userId: z.string().uuid(),
		videoUrl: z.string(),
		description: z.string().default(''),
	});

	public static create_group = z.object({
		userId: z.string().uuid(),
		name: z.string(),
		description: z.string().default(''),
		imageUrl: z.string(),
	});
}

