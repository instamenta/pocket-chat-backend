import {group_roles} from "../utilities/enumerations";

export type Group = {
	id: string,
	owner_id: string,
	name: string,
	description: string,
	created_at: string,
	members_count: number,
	image_url: string,
}

export type Member = {
	id: string,
	group_id: string,
	user_id: string,
	member_since: string,
	role: group_roles,
}

export type MemberPopulated = {
	user_id: string
	username: string
	first_name: string
	last_name: string
	picture: string
	role: group_roles
	member_since: string
}


