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
