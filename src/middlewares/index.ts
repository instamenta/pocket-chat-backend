import {NextFunction as Next, Request, Response} from 'express';
import JWT from '../utilities/jwt';
import status_codes from "@instamenta/http-status-codes";

export function isGuest(r: Request, w: Response, next: Next) {
	const token = JWT.getTokenFromCookie(r);

	if (token) {
		const user = JWT.verifyToken(token);

		if (user) return w.status(status_codes.FORBIDDEN)
			.json({message: 'Forbidden - User is already authenticated'});
	}
	next();
}

export function isAuthorized(r: Request, w: Response, next: Next) {
	const token = JWT.getTokenFromCookie(r);

	if (!token) return w.status(status_codes.UNAUTHORIZED)
		.json({message: 'Unauthorized - User is not authenticated'});

	const user = JWT.verifyToken(token);
	if (!user) return w.status(status_codes.UNAUTHORIZED)
		.json({message: 'Unauthorized - Invalid token'});

	r.user = user;
	next();
}

export function errorHandler(err: Error, r: Request, w: Response, next: Next) {
	console.error(err.stack);
	w.status(status_codes.INTERNAL_SERVER_ERROR)
		.json({error: 'Internal Server Error'});
}

const Middlewares = {isGuest, isAuthorized, errorHandler};

export default Middlewares;