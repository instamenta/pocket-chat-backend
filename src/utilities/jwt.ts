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

	static setTokenCookie(res: Response, token: string): void {
		res.cookie(SECURITY.JWT_TOKEN_NAME, token, {httpOnly: true});
	}

	static getTokenFromCookie(req: Request): string | null {
		return req.cookies[SECURITY.JWT_TOKEN_NAME] || null;
	}

	static authenticate(req: Request, res: Response, next: NextFunction): any {
		const token = this.getTokenFromCookie(req);
		if (!token) return res.status(401).json({message: 'Unauthorized'});

		const user = this.verifyToken(token);
		if (!user) return res.status(401).json({message: 'Unauthorized'});

		(req as any).user = user;
		next();
	}
}

export default JWT;
