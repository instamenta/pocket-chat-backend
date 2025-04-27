import {publication_status} from "../utilities/enumerations"

export type Publication = {
	id: string
	created_at: string
	updated_at: string
	publication_status: publication_status
	images: string[]
	description: string
	publisher_id: string
	likes_count: number
	comments_count: number
	publisher: string
	group_id?: string
}

export type Recommendation = {
	id: string
	created_at: string
	updated_at: string
	publication_status: publication_status
	images: string[]
	description: string
	publisher_id: string
	likes_count: number
	comments_count: number
	publisher: string
	username: string
	picture: string
	liked_by_user: boolean
	first_name: string
	last_name: string
	group_id?: string
}
