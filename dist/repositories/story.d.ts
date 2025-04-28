import { BaseRepository } from "../base/repository.base";
import * as T from "../types";
export declare class StoryRepository extends BaseRepository {
    createStory({ userId, imageUrl, }: {
        userId: string;
        imageUrl: string;
    }): Promise<string>;
    listStories(userId: string): Promise<T.Story.Feed[]>;
    listFeedStories(userId: string): Promise<T.Story.Feed[]>;
    getStoryById(id: string): Promise<{
        user_id: string;
        id: string;
        likes_count: string;
    } | null>;
    listFriendStoriesByUsername(username: string): Promise<T.Story.Full[]>;
    likeStory(storyId: string, userId: string): Promise<void>;
    listCommentsByStoryId(storyId: string, userId: string): Promise<T.Comment.Populated[]>;
    createStoryComment(storyId: string, userId: string, content: string): Promise<T.Comment.Comment>;
    deleteStoryComment(commentId: string, userId: string): Promise<boolean>;
    likeStoryComment(commentId: string, userId: string): Promise<void>;
    getCommentById(id: string): Promise<{
        id: string;
        user_id: string;
        likes_count: number;
    } | null>;
}
//# sourceMappingURL=story.d.ts.map