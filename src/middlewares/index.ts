import {NextFunction as Next, Request, Response} from 'express';
import JWT from '../utilities/jwt';
import status_codes from "@instamenta/http-status-codes";
import {TokenExpiredError} from "jsonwebtoken";

export function isGuest(r: Request, w: Response, next: Next) {
	const token = JWT.getTokenFromCookie(r);

	if (token) {
		try {
			const user = JWT.verifyToken(token)

			if (user) {
				console.log('Middleware.isGuest(): FORBIDDEN', user);

				return w.status(status_codes.FORBIDDEN).json({message: 'User is already authenticated'});
			}
		} catch (error: Error | TokenExpiredError | unknown) {
			if (error instanceof TokenExpiredError) {
				console.log('Middleware.isGuest(): Token expired');
				JWT.removeTokenFromCookie(w);
			}

			return w.status(status_codes.EXPECTATION_FAILED).end();
		}
	}
	next();
}

export function isAuthorized(r: Request, w: Response, next: Next) {
	const token = JWT.getTokenFromCookie(r);
	if (!token) {
		console.log('Middleware.isAuthorized(): UNAUTHORIZED');

		return w.status(status_codes.UNAUTHORIZED).json({message: 'User is not authenticated'});
	}

	const user = JWT.verifyToken(token);
	if (!user) {
		console.log('Middleware.isAuthorized(): UNAUTHORIZED')

		return w.status(status_codes.UNAUTHORIZED).json({message: 'Invalid token'});
	}
	r.user = user;
	next();
}

export function errorHandler(err: Error, r: Request, w: Response, next: Next) {
	console.error(err.stack);

	w.status(status_codes.INTERNAL_SERVER_ERROR).json({error: 'Internal Server Error'});
}

const Middlewares = {isGuest, isAuthorized, errorHandler};

export default Middlewares;