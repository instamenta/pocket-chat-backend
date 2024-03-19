import {NextFunction, Request, Response} from 'express';
import jwt, {JwtPayload} from 'jsonwebtoken';
import {SECURITY} from "./config";
import {UserPayload} from "../types";

class JWT {
	private static secret = SECURITY.JWT_SECRET;

	static signToken(userData: UserPayload): string {
		return jwt.sign(
			userData,
			this.secret,
			{expiresIn: SECURITY.JWT_EXPIRATION_TIME}
		);
	}

	static verifyToken(token: string): UserPayload | null {
		try {
			const decoded = jwt.verify(token, this.secret) as JwtPayload;
			return decoded as UserPayload;
		} catch (error) {
			return null;
		}
	}

	static setTokenCookie(w: Response, token: string): void {
		w.cookie(SECURITY.JWT_TOKEN_NAME, token, {httpOnly: true});
	}

	static getTokenFromCookie(r: Request): string | null {
		return r.cookies[SECURITY.JWT_TOKEN_NAME] || null;
	}

	static authenticate(r: Request, w: Response, next: NextFunction) {
		const token = this.getTokenFromCookie(r);
		if (!token) return w.status(401).json({message: 'Unauthorized'});

		const user = this.verifyToken(token);
		if (!user) return w.status(401).json({message: 'Unauthorized'});

		(r as any).user = user;
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
