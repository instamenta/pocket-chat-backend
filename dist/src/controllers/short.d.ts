import { Request, Response } from "express";
import ShortRepository from "../repositories/short";
import Notificator from "../utilities/notificator";
import BaseController from "../base/controller.base";
import * as T from '../types';
import VLogger from "@instamenta/vlogger";
export default class ShortController extends BaseController<ShortRepository> {
    private readonly notificator;
    constructor(repository: ShortRepository, logger: VLogger, notificator: Notificator);
    createShort(r: Request<{}, {
        videoUrl: string;
        description: string;
    }>, w: Response<{
        id: string;
    }>): Promise<Response<{
        id: string;
    }, Record<string, any>> | undefined>;
    listShorts(r: Request, w: Response<T.Short.Populated[]>): Promise<Response<T.Short.Populated[], Record<string, any>> | undefined>;
    listShortsByUsername(r: Request<{
        id: string;
    }>, w: Response<T.Short.Populated[]>): Promise<Response<T.Short.Populated[], Record<string, any>> | undefined>;
    getShortById(r: Request<{
        shortId: string;
    }>, w: Response<T.Short.Populated>): Promise<Response<T.Short.Populated, Record<string, any>> | undefined>;
    likeShort(r: Request<{
        id: string;
    }>, w: Response<void>): Promise<void>;
    listCommentsByShort(r: Request<{
        shortId: string;
    }>, w: Response<T.Comment.Populated[]>): Promise<void>;
    createShortComment(r: Request<{
        shortId: string;
    }, {}, {
        content: string;
    }>, w: Response<T.Comment.Comment>): Promise<void>;
    deleteShortComment(r: Request<{
        commentId: string;
    }>, w: Response<void>): Promise<void>;
    likeShortComment(r: Request<{
        commentId: string;
    }>, w: Response<void>): Promise<void>;
    getCommentById(r: Request<{
        commentId: string;
    }>, w: Response<T.Comment.Comment & {
        likes_count: number;
    }>): Promise<Response<T.Comment.Comment & {
        likes_count: number;
    }, Record<string, any>> | undefined>;
}
//# sourceMappingURL=short.d.ts.map