import {NextFunction, Request, Response} from 'express';
import JWT from '../utilities/jwt';
import status_codes from "@instamenta/http-status-codes";
import {TokenExpiredError} from "jsonwebtoken";

export const Middlewares = {isAuthorized, isGuest, errorHandler};

export function isGuest(request: Request, response: Response, next: NextFunction) {
	const token = JWT.getTokenFromCookie(request);

	if (token) {
		try {
			const user = JWT.verifyToken(token)
			if (user) {
				console.log('Middleware.isGuest(): FORBIDDEN', user);

				return response.status(status_codes.FORBIDDEN).json({message: 'User is already authenticated'});
			}
		} catch (error: unknown) {
			if (error instanceof TokenExpiredError) {
				console.log('Middleware.isGuest(): Token expired');
				JWT.removeTokenFromCookie(response);
			}

			return response.status(status_codes.EXPECTATION_FAILED).end();
		}
	}
	next();
}

export function  isAuthorized(request: Request, response: Response, next: NextFunction) {
	const token = JWT.getTokenFromCookie(request);
	if (!token) {
		console.log('Middleware.isAuthorized(): UNAUTHORIZED');

		return response.status(status_codes.UNAUTHORIZED).json({message: 'User is not authenticated'});
	}

	const user = JWT.verifyToken(token);
	if (!user) {
		console.log('Middleware.isAuthorized(): UNAUTHORIZED')

		return response.status(status_codes.UNAUTHORIZED).json({message: 'Invalid token'});
	}
	request.user = user;
	next();
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(error: Error, _request: Request, response: Response, _next: NextFunction) {
	console.error(error.stack);

	response.status(status_codes.INTERNAL_SERVER_ERROR).json({error: 'Internal Server Error'});
}


