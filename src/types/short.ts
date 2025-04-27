export type Short = {
	id: string
	user_id: string
	video_url: string
	description: string
	created_at: string
	likes_count: number
	comments_count: number
}

export type Populated = {
	id: string
	user_id: string
	user_picture: string
	username: string
	first_name: string
	last_name: string
	video_url: string
	description: string
	created_at: string
	likes_count: number
	comments_count: number
	liked_by_user: boolean
}