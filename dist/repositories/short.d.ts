import { BaseRepository } from "../base/repository.base";
import * as T from "../types";
export declare class ShortRepository extends BaseRepository {
    createShort(userId: string, videoUrl: string, description: string): Promise<string>;
    listShorts(userId: string): Promise<T.Short.ShortStruct[]>;
    listShortsById(userId: string): Promise<T.Short.ShortStruct[]>;
    getShortById(id: string): Promise<T.Short.ShortStruct | null>;
    likeShort(shortId: string, userId: string): Promise<boolean>;
    listCommentsByShortId(shortId: string, userId: string): Promise<T.Comment.PopulatedCommentStructure[]>;
    createShortComment(shortId: string, userId: string, content: string): Promise<T.Comment.CommentStructure>;
    deleteShortComment(commentId: string, userId: string): Promise<boolean>;
    likeShortComment(commentId: string, userId: string): Promise<void>;
    getCommentById(id: string): Promise<(T.Comment.CommentStructure & {
        likes_count: number;
    }) | null>;
}
//# sourceMappingURL=short.d.ts.map