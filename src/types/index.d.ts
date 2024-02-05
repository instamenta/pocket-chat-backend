import {I_UserSchema} from "./user";

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

declare global {
	namespace "node:http" {

		interface IncomingMessage {
			user: I_UserSchema
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