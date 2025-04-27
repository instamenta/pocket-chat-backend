import BaseRepository from "../base/repository.base";
import * as T from '../types';
export default class CommentRepository extends BaseRepository {
    listCommentsByPublication(publicationId: string, userId: string): Promise<T.Comment.Populated[]>;
    createComment(publicationId: string, userId: string, content: string): Promise<T.Comment.Comment>;
    deleteComment(commentId: string, userId: string): Promise<boolean>;
    getCommentById(id: string): Promise<(T.Comment.Comment & {
        likes_count: number;
    }) | null>;
    likeComment(commentId: string, userId: string): Promise<void>;
}
//# sourceMappingURL=comment.d.ts.map