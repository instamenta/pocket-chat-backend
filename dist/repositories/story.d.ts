import { BaseRepository } from "../base/repository.base";
import { CommentStructure, PopulatedCommentStructure } from "../types/comment";
import { FullStoryStruct, StoryFeedStruct, StoryStruct } from "../types/story";
export declare class StoryRepository extends BaseRepository {
    createStory({ userId, imageUrl, }: {
        userId: string;
        imageUrl: string;
    }): Promise<string>;
    listStories(userId: string): Promise<StoryFeedStruct[]>;
    listFeedStories(userId: string): Promise<StoryFeedStruct[]>;
    getStoryById(id: string): Promise<Pick<StoryStruct, "id" | "userId" | "likesCount"> | null>;
    listFriendStoriesByUsername(username: string): Promise<FullStoryStruct[]>;
    likeStory(storyId: string, userId: string): Promise<void>;
    listCommentsByStoryId(storyId: string, userId: string): Promise<PopulatedCommentStructure[]>;
    createStoryComment(storyId: string, userId: string, content: string): Promise<CommentStructure>;
    deleteStoryComment(commentId: string, userId: string): Promise<boolean>;
    likeStoryComment(commentId: string, userId: string): Promise<void>;
    getCommentById(id: string): Promise<{
        id: string;
        userId: string;
        likesCount: number;
    } | null>;
}
//# sourceMappingURL=story.d.ts.map