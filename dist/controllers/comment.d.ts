import { CommentRepository } from "../repositories";
import { Notificator } from "../utilities/notificator";
import { BaseController } from "../base/controller.base";
import type VLogger from "@instamenta/vlogger";
import type { Request, Response } from "express";
import type { CommentStructure, PopulatedCommentStructure } from "../types/comments";
export declare class CommentController extends BaseController<CommentRepository> {
    private readonly notificator;
    constructor(repository: CommentRepository, logger: VLogger, notificator: Notificator);
    listByPublication(request: Request<{
        publicationId: string;
    }>, response: Response<PopulatedCommentStructure[]>): Promise<void>;
    create(request: Request<{
        publicationId: string;
    }, object, {
        content: string;
    }>, response: Response<CommentStructure>): Promise<void>;
    delete(request: Request<{
        commentId: string;
    }>, response: Response<void>): Promise<void>;
    like(request: Request<{
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
//# sourceMappingURL=comment.d.ts.map