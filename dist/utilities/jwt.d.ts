import { Request, Response } from "express";
import * as T from "../types";
export declare function signToken(userData: T.User.Payload): string;
export declare function verifyToken(token: string): T.User.Payload | null;
export declare function getTokenFromCookie(request: Request): string | null;
export declare function removeTokenFromCookie(response: Response): void;
//# sourceMappingURL=jwt.d.ts.map