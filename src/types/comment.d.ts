export type Comment = {
	id: string
	content: string
	created_at: string
	publication_id: string
	user_id: string
}

export type Populated = {
	id: string
	content: string
	created_at: string
	publication_id: string
	user_id: string
	username: string
	picture: string
	liked_by_user: boolean
	first_name: string
	last_name: string
	likes_count: number
}