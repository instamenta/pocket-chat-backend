import { BaseRepository } from "../base/repository.base";
import type { CommentStructure, PopulatedCommentStructure } from "../types/comment";
export declare class CommentRepository extends BaseRepository {
    listCommentsByPublication(publicationId: string, userId: string): Promise<PopulatedCommentStructure[]>;
    createComment(publicationId: string, userId: string, content: string): Promise<CommentStructure>;
    deleteComment(commentId: string, userId: string): Promise<boolean>;
    getCommentById(id: string): Promise<(CommentStructure & {
        likes_count: number;
    }) | null>;
    likeComment(commentId: string, userId: string): Promise<void>;
}
//# sourceMappingURL=comment.d.ts.map