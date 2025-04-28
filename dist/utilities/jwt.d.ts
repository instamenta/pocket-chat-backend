import { NextFunction, Request, Response } from 'express';
import * as T from '../types';
export declare function signToken(userData: T.User.Payload): string;
export declare function verifyToken(token: string): T.User.Payload | null;
export declare function setTokenCookie(response: Response, token: string): void;
export declare function getTokenFromCookie(request: Request): string | null;
export declare function authenticate(request: Request, response: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
export declare function getUser(token: string): T.User.Payload | null;
export declare function removeTokenFromCookie(response: Response): void;
//# sourceMappingURL=jwt.d.ts.map