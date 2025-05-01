import { Request, Response } from "express";
import * as T from "../types";
export declare function signToken(userData: T.User.UserDataPayloadStruct): string;
export declare function verifyToken(token: string): T.User.UserDataPayloadStruct | null;
export declare function getTokenFromCookie(request: Request): string | null;
export declare function removeTokenFromCookie(response: Response): void;
//# sourceMappingURL=jwt.d.ts.map