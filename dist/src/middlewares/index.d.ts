import { NextFunction, Request, Response } from 'express';
export declare class Middlewares {
    static isGuest(request: Request, response: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
    static isAuthorized(request: Request, response: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
    static errorHandler(error: Error, _request: Request, response: Response, _next: NextFunction): void;
}
//# sourceMappingURL=index.d.ts.map