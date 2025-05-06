import { Request, Response } from "express";
import { ShortRepository } from "../repositories/short";
import { Notificator } from "../utilities/notificator";
import { BaseController } from "../base/controller.base";
import VLogger from "@instamenta/vlogger";
import { ShortStruct } from "../types/short";
import { CommentStructure, PopulatedCommentStructure } from "../types/comment";
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
    listShorts(request: Request, response: Response<ShortStruct[]>): Promise<void>;
    listShortsByUsername(request: Request<{
        id: string;
    }>, response: Response<ShortStruct[]>): Promise<void>;
    getShortById(request: Request<{
        shortId: string;
    }>, response: Response<ShortStruct>): Promise<Response<ShortStruct, Record<string, any>> | undefined>;
    likeShort(request: Request<{
        id: string;
    }>, response: Response<void>): Promise<void>;
    listCommentsByShort(request: Request<{
        shortId: string;
    }>, response: Response<PopulatedCommentStructure[]>): Promise<void>;
    createShortComment(request: Request<{
        shortId: string;
    }, object, {
        content: string;
    }>, response: Response<CommentStructure>): Promise<void>;
    deleteShortComment(request: Request<{
        commentId: string;
    }>, response: Response<void>): Promise<void>;
    likeShortComment(request: Request<{
        commentId: string;
    }>, response: Response<void>): Promise<void>;
    getCommentById(request: Request<{
        commentId: string;
    }>, response: Response<CommentStructure & {
        likes_count: number;
    }>): Promise<Response<CommentStructure & {
        likes_count: number;
    }, Record<string, any>> | undefined>;
}
//# sourceMappingURL=short.d.ts.map