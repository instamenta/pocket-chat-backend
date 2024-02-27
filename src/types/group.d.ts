import {group_roles} from "../utilities/enumerations";

export interface I_Group {
	id: string,
	owner_id: string,
	name: string,
	description: string,
	created_at: string,
	members_count: number,
}

export interface I_GroupMember {
	id: string,
	group_id: string,
	user_id: string,
	member_since: string,
	role: group_roles,
}

export interface I_GroupMemberPopulated {
	user_id: string
	username: string
	first_name: string
	last_name: string
	picture: string
	role: group_roles
	member_since: string
}


