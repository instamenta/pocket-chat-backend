import {NextFunction, Request, Response} from 'express';
import jwt, {JwtPayload, Secret, SignOptions} from 'jsonwebtoken';
import {SECURITY} from "./config";
import * as T from '../types';

class JWT {
	private static secret: Secret = SECURITY.JWT_SECRET;
	private static signOptions: SignOptions = {expiresIn: SECURITY.JWT_EXPIRATION_TIME}

	static signToken(userData: T.User.Payload): string {
		return jwt.sign(
			userData as object,
			JWT.secret,
	JWT.signOptions
		);
	}

	static verifyToken(token: string): T.User.Payload | null {
		try {
			const decoded = jwt.verify(token, this.secret) as JwtPayload;
			return decoded as T.User.Payload;
		} catch {
			return null;
		}
	}

	static setTokenCookie(w: Response, token: string): void {
		w.cookie(SECURITY.JWT_TOKEN_NAME, token, {httpOnly: true});
	}

	static getTokenFromCookie(request: Request): string | null {
		return request.cookies[SECURITY.JWT_TOKEN_NAME] || null;
	}

	static authenticate(request: Request, response: Response, next: NextFunction) {
		const token = this.getTokenFromCookie(request);
		if (!token) return response.status(401).json({message: 'Unauthorized'});

		const user = this.verifyToken(token);
		if (!user) return response.status(401).json({message: 'Unauthorized'});

		request.user = user;
		next();
	}

	static getUser(token: string) {
		return this.verifyToken(token) ?? null;
	}

	static removeTokenFromCookie(w: Response): void {
		w.setHeader(
			'Set-Cookie',
			[
				'X-Authorization-Token=;'
				+ 'Expires=Thu, 01 Jan 1970 00:00:00 GMT;'
				+ 'HttpOnly; Path=/;',
			]
		);
	}
}

export default JWT;
