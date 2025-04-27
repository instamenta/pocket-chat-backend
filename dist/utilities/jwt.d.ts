import { NextFunction, Request, Response } from 'express';
import * as T from '../types';
declare class JWT {
    private static secret;
    private static signOptions;
    static signToken(userData: T.User.Payload): string;
    static verifyToken(token: string): T.User.Payload | null;
    static setTokenCookie(response: Response, token: string): void;
    static getTokenFromCookie(request: Request): string | null;
    static authenticate(request: Request, response: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
    static getUser(token: string): T.User.Payload | null;
    static removeTokenFromCookie(response: Response): void;
}
export default JWT;
//# sourceMappingURL=jwt.d.ts.map