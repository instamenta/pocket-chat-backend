export interface UserPayload {
	id: string;
	username: string;
	email: string;
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
	namespace Express {
		interface Request {
			user?: UserPayload;
			cookies: {
				[key: string]: string;
			};
		}
	}
}