import * as U from './unions';

export type Story = {
	id: string
	user_id: string
	image_url: string
	created_at: string
	visibility: U.StoryVisibility
	likes_count: number
	comments_count: number
}

export type Feed = {
	id: string
	username: string
	first_name: string
	last_name: string
	user_picture: string
	image_url: string

	comments_count: number
	likes_count: number
}

export type Full = Story | {
	user_picture: string
	user_username: string
}