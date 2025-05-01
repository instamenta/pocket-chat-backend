import { Request, Response } from "express";
import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";
import { SECURITY } from "./config";
import * as T from "../types";

const jwtSecret: Secret = SECURITY.JWT_SECRET;
const signOptions: SignOptions = { expiresIn: SECURITY.JWT_EXPIRATION_TIME };

export function signToken(userData: T.User.UserDataPayloadStruct): string {
  return jwt.sign(userData as object, jwtSecret, signOptions);
}

export function verifyToken(token: string): T.User.UserDataPayloadStruct | null {
  try {
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    return decoded as T.User.UserDataPayloadStruct;
  } catch {
    return null;
  }
}

export function getTokenFromCookie(request: Request): string | null {
  return request.cookies[SECURITY.JWT_TOKEN_NAME] || null;
}

export function removeTokenFromCookie(response: Response): void {
  response.setHeader("Set-Cookie", [
    "X-Authorization-Token=;" +
      "Expires=Thu, 01 Jan 1970 00:00:00 GMT;" +
      "HttpOnly; Path=/;",
  ]);
}
