import { Request, Response } from "express";
import { ShortRepository } from "../repositories/short";
import { Notificator } from "../utilities/notificator";
import { BaseController } from "../base/controller.base";
import * as T from '../types';
import VLogger from "@instamenta/vlogger";
export declare class ShortController extends BaseController<ShortRepository> {
    private readonly notificator;
    constructor(repository: ShortRepository, logger: VLogger, notificator: Notificator);
    createShort(request: Request<object, object, {
        videoUrl: string;
        description: string;
    }>, response: Response<{
        id: string;
    }>): Promise<Response<{
        id: string;
    }, Record<string, any>> | undefined>;
    listShorts(request: Request, response: Response<T.Short.Populated[]>): Promise<void>;
    listShortsByUsername(request: Request<{
        id: string;
    }>, response: Response<T.Short.Populated[]>): Promise<void>;
    getShortById(request: Request<{
        shortId: string;
    }>, response: Response<T.Short.Populated>): Promise<Response<T.Short.Populated, Record<string, any>> | undefined>;
    likeShort(request: Request<{
        id: string;
    }>, response: Response<void>): Promise<void>;
    listCommentsByShort(request: Request<{
        shortId: string;
    }>, response: Response<T.Comment.Populated[]>): Promise<void>;
    createShortComment(request: Request<{
        shortId: string;
    }, object, {
        content: string;
    }>, response: Response<T.Comment.Comment>): Promise<void>;
    deleteShortComment(request: Request<{
        commentId: string;
    }>, response: Response<void>): Promise<void>;
    likeShortComment(request: Request<{
        commentId: string;
    }>, response: Response<void>): Promise<void>;
    getCommentById(request: Request<{
        commentId: string;
    }>, response: Response<T.Comment.Comment & {
        likes_count: number;
    }>): Promise<Response<T.Comment.Comment & {
        likes_count: number;
    }, Record<string, any>> | undefined>;
}
//# sourceMappingURL=short.d.ts.map