import { Request, Response } from "express";
import { StoryRepository } from "../repositories";
import { Notificator } from "../utilities/notificator";
import { BaseController } from "../base/controller.base";
import VLogger from "@instamenta/vlogger";
import { FullStoryStruct, StoryFeedStruct } from "../types/story";
import { CommentStructure, PopulatedCommentStructure } from "../types/comment";
export declare class StoryController extends BaseController<StoryRepository> {
    private readonly notificator;
    constructor(repository: StoryRepository, logger: VLogger, notificator: Notificator);
    createStory(request: Request<object, object, {
        imageUrl: string;
    }>, response: Response<{
        id: string;
    }>): Promise<Response<{
        id: string;
    }, Record<string, any>> | undefined>;
    listStories(request: Request, response: Response<StoryFeedStruct[]>): Promise<void>;
    listFeedStories(request: Request, response: Response<StoryFeedStruct[]>): Promise<void>;
    listFriendStoriesByUsername(request: Request<{
        username: string;
    }>, response: Response<FullStoryStruct[]>): Promise<void>;
    likeStory(request: Request<{
        id: string;
    }>, response: Response<void>): Promise<void>;
    listCommentsByStory(request: Request<{
        storyId: string;
    }>, response: Response<PopulatedCommentStructure[]>): Promise<void>;
    createStoryComment(request: Request<{
        storyId: string;
    }, object, {
        content: string;
    }>, response: Response<CommentStructure>): Promise<void>;
    deleteStoryComment(request: Request<{
        commentId: string;
    }>, response: Response<void>): Promise<void>;
    likeStoryComment(request: Request<{
        commentId: string;
    }>, response: Response<void>): Promise<void>;
}
//# sourceMappingURL=story.d.ts.map