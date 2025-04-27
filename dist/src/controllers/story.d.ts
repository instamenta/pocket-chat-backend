import { Request, Response } from "express";
import StoryRepository from "../repositories/story";
import Notificator from "../utilities/notificator";
import BaseController from "../base/controller.base";
import * as T from '../types';
import VLogger from "@instamenta/vlogger";
export default class StoryController extends BaseController<StoryRepository> {
    private readonly notificator;
    constructor(repository: StoryRepository, logger: VLogger, notificator: Notificator);
    createStory(r: Request<{}, {}, {
        imageUrl: string;
    }>, w: Response<{
        id: string;
    }>): Promise<Response<{
        id: string;
    }, Record<string, any>> | undefined>;
    listStories(r: Request, w: Response<T.Story.Feed[]>): Promise<Response<T.Story.Feed[], Record<string, any>> | undefined>;
    listFeedStories(r: Request, w: Response<T.Story.Feed[]>): Promise<Response<T.Story.Feed[], Record<string, any>> | undefined>;
    listFriendStoriesByUsername(r: Request<{
        username: string;
    }>, w: Response<T.Story.Full[]>): Promise<Response<T.Story.Full[], Record<string, any>> | undefined>;
    likeStory(r: Request<{
        id: string;
    }>, w: Response<void>): Promise<void>;
    listCommentsByStory(r: Request<{
        storyId: string;
    }>, w: Response<T.Comment.Populated[]>): Promise<void>;
    createStoryComment(r: Request<{
        storyId: string;
    }, {}, {
        content: string;
    }>, w: Response<T.Comment.Comment>): Promise<void>;
    deleteStoryComment(r: Request<{
        commentId: string;
    }>, w: Response<void>): Promise<void>;
    likeStoryComment(r: Request<{
        commentId: string;
    }>, w: Response<void>): Promise<void>;
}
//# sourceMappingURL=story.d.ts.map