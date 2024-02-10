export interface T_Comment {
	id: string
	content: string
	created_at: string
	publication_id: string
	user_id: string
}

export interface T_PopulatedComment {
	id: string,
	content: string,
	created_at: string,
	publication_id: string,
	user_id: string,
	username: string,
	picture: string,
	liked_by_user: boolean
}