export interface UserPayload {
	id: string;
	username: string;
	email: string;
	picture: string;
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
	created_at: string,
	sender_id: string,
	recipient_id: string,
	friendship_status: 'accepted' | 'pending'
}