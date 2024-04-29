export type Schema = {
	id: string
	email: string
	picture: string
	username: string
	password: string
	bio: string
	first_name: string
	last_name: string
	created_at: string
	updated_at: string
	last_active_at: string
}

export type Payload = {
	id: string
	email: string
	picture: string
	username: string
}

export type GetByUsername = {
	id: string,
	username: string,
	password: string,
	email: string,
	picture: string,
}