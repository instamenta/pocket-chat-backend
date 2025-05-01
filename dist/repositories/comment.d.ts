import { BaseRepository } from "../base/repository.base";
import * as T from "../types";
export declare class CommentRepository extends BaseRepository {
    listCommentsByPublication(publicationId: string, userId: string): Promise<T.Comment.PopulatedCommentStructure[]>;
    createComment(publicationId: string, userId: string, content: string): Promise<T.Comment.CommentStructure>;
    deleteComment(commentId: string, userId: string): Promise<boolean>;
    getCommentById(id: string): Promise<(T.Comment.CommentStructure & {
        likes_count: number;
    }) | null>;
    likeComment(commentId: string, userId: string): Promise<void>;
}
//# sourceMappingURL=comment.d.ts.map