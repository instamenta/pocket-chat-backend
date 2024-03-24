export interface UserPayload {
	id: string
	email: string
	picture: string
	username: string
}

declare global {
	namespace Express {
		interface Request {
			user: UserPayload
			cookies: {
				[key: string]: string
			}
		}
	}
}

export interface I_Friendship {
	id: string,
	sender_id: string,
	created_at: string,
	recipient_id: string,
	friendship_status: 'accepted' | 'pending'
}

export interface I_Notifications {
	id: string,
	type: string,
	seen: boolean,
	content: string,
	sender_id: string,
	created_at: string,
	recipient_id: string,
	reference_id?: string,
}

export interface I_PopulatedNotification {
	id: string
	type: string
	boolean: string
	content: string
	sender_id: string
	created_at: string
	recipient_id: string
	picture: string
	first_name: string
	last_name: string
}

type E_StoryVisibility = 'public' | 'private' | 'archive'

interface I_Story {
	id: string
	user_id: string
	image_url: string
	created_at: string // Timestamp with time zone
	visibility: E_StoryVisibility
	likes_count: number
	comments_count: number
}

export type T_FeedStory = {
	id: string
	username: string
	first_name: string
	last_name: string
	user_picture: string
	image_url: string
}

export type T_StoryFull = I_Story | {
	user_picture: string,
	user_username: string
}