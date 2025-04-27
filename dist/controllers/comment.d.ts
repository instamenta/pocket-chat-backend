import { Request, Response } from 'express';
import { CommentRepository } from '../repositories/comment';
import { Notificator } from "../utilities/notificator";
import { BaseController } from "../base/controller.base";
import * as T from '../types';
import VLogger from "@instamenta/vlogger";
export declare class CommentController extends BaseController<CommentRepository> {
    private readonly notificator;
    constructor(repository: CommentRepository, logger: VLogger, notificator: Notificator);
    listByPublication(request: Request<{
        publicationId: string;
    }>, response: Response<T.Comment.Populated[]>): Promise<void>;
    create(request: Request<{
        publicationId: string;
    }, object, {
        content: string;
    }>, response: Response<T.Comment.Comment>): Promise<void>;
    delete(request: Request<{
        commentId: string;
    }>, response: Response<void>): Promise<void>;
    like(request: Request<{
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
//# sourceMappingURL=comment.d.ts.map