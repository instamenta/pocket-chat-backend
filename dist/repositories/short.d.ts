import { BaseRepository } from "../base/repository.base";
import { ShortStruct } from "../types/short";
import { CommentStructure, PopulatedCommentStructure } from "../types/comment";
export declare class ShortRepository extends BaseRepository {
    createShort(userId: string, videoUrl: string, description: string): Promise<string>;
    listShorts(userId: string): Promise<ShortStruct[]>;
    listShortsById(userId: string): Promise<ShortStruct[]>;
    getShortById(id: string): Promise<ShortStruct | null>;
    likeShort(shortId: string, userId: string): Promise<boolean>;
    listCommentsByShortId(shortId: string, userId: string): Promise<PopulatedCommentStructure[]>;
    createShortComment(shortId: string, userId: string, content: string): Promise<CommentStructure>;
    deleteShortComment(commentId: string, userId: string): Promise<boolean>;
    likeShortComment(commentId: string, userId: string): Promise<void>;
    getCommentById(id: string): Promise<(CommentStructure & {
        likes_count: number;
    }) | null>;
}
//# sourceMappingURL=short.d.ts.map