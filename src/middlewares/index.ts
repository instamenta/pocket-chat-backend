import { NextFunction, Request, Response } from "express";
import * as JWT from "../utilities/jwt";
import statusCodes from "@instamenta/http-status-codes";
import { TokenExpiredError } from "jsonwebtoken";

export const Middlewares = { isAuthorized, isGuest, errorHandler };

export function isGuest(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const token = JWT.getTokenFromCookie(request);

  if (token) {
    try {
      const user = JWT.verifyToken(token);
      if (user) {
        // eslint-disable-next-line no-console
        console.log("Middleware.isGuest(): FORBIDDEN", user);

        return response
          .status(statusCodes.FORBIDDEN)
          .json({ message: "User is already authenticated" });
      }
    } catch (error: unknown) {
      if (error instanceof TokenExpiredError) {
        // eslint-disable-next-line no-console
        console.log("Middleware.isGuest(): Token expired");
        JWT.removeTokenFromCookie(response);
      }

      return response.status(statusCodes.EXPECTATION_FAILED).end();
    }
  }
  next();
}

export function isAuthorized(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const token = JWT.getTokenFromCookie(request);
  if (!token) {
    // eslint-disable-next-line no-console
    console.log("Middleware.isAuthorized(): UNAUTHORIZED");

    return response
      .status(statusCodes.UNAUTHORIZED)
      .json({ message: "User is not authenticated" });
  }

  const user = JWT.verifyToken(token);
  if (!user) {
    // eslint-disable-next-line no-console
    console.log("Middleware.isAuthorized(): UNAUTHORIZED");

    return response
      .status(statusCodes.UNAUTHORIZED)
      .json({ message: "Invalid token" });
  }
  (request as any).user = user;
  next();
}

export function errorHandler(
  error: Error,
  _request: Request,
  response: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) {
  // eslint-disable-next-line no-console
  console.error(error.stack);

  response
    .status(statusCodes.INTERNAL_SERVER_ERROR)
    .json({ error: "Internal Server Error" });
}
