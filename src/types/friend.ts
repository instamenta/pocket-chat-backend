import * as U from "./unions";

export type Friendship = {
	id: string
	sender_id: string
	created_at: string
	recipient_id: string
	friendship_status: U.FriendshipStatus
}

export type Mutual = {
	user_id: string
	first_name: string
	last_name: string
	username: string
}

export type RequestData = {
	id: string,
	first_name: string,
	last_name: string,
	picture: string,
	username: string,
	request_date: string,
	request_type: 'sent' | 'received'
}