export interface UserPayload {
	id: string;
	email: string;
	picture: string;
	username: string;
}

declare global {
	namespace Express {
		interface Request {
			user: UserPayload;
			cookies: {
				[key: string]: string;
			};
		}
	}
}

export interface I_Friendship {
	id: string,
	sender_id: string,
	created_at: string,
	recipient_id: string,
	friendship_status: 'accepted' | 'pending'
}

export interface I_Notifications {
	id: string,
	type: string,
	seen: boolean,
	content: string,
	sender_id: string,
	created_at: string,
	recipient_id: string,
}