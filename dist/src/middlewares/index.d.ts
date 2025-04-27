import { NextFunction as Next, Request, Response } from 'express';
export declare function isGuest(r: Request, w: Response, next: Next): Response<any, Record<string, any>> | undefined;
export declare function isAuthorized(r: Request, w: Response, next: Next): Response<any, Record<string, any>> | undefined;
export declare function errorHandler(err: Error, r: Request, w: Response, next: Next): void;
declare const Middlewares: {
    isGuest: typeof isGuest;
    isAuthorized: typeof isAuthorized;
    errorHandler: typeof errorHandler;
};
export default Middlewares;
//# sourceMappingURL=index.d.ts.map