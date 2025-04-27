import { NextFunction, Request, Response } from 'express';
export declare const Middlewares: {
    isAuthorized: typeof isAuthorized;
    isGuest: typeof isGuest;
    errorHandler: typeof errorHandler;
};
export declare function isGuest(request: Request, response: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
export declare function isAuthorized(request: Request, response: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
export declare function errorHandler(error: Error, _request: Request, response: Response, _next: NextFunction): void;
//# sourceMappingURL=index.d.ts.map