export interface I_Short {
	id: string
	user_id: string
	video_url: string
	description: string
	created_at: string // Timestamp in ISO
	likes_count: number
	comments_count: number
}

export interface I_ShortPopulated {
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
}