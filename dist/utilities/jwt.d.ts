import { Request, Response } from "express";
import { UserDataPayloadStruct } from "../types/user";
export declare function signToken(userData: UserDataPayloadStruct): string;
export declare function verifyToken(token: string): UserDataPayloadStruct | null;
export declare function getTokenFromCookie(request: Request): string | null;
export declare function removeTokenFromCookie(response: Response): void;
//# sourceMappingURL=jwt.d.ts.map