import {Client} from 'pg';
import {T_Comment, T_PopulatedComment} from "../types/comment";

export default class CommentRepository {
	constructor(private readonly database: Client) {
	}

	private errorHandler(error: unknown | Error, method: string): never {
		throw new Error(`${this.constructor.name}.${method}(): Error`, {cause: error});
	}

	async listCommentsByPublication(publicationId: string, userId: string) {
		const query = `
        SELECT c.id,
               c.content,
               c.created_at,
               c.publication_id,
               c.user_id,
               u.username,
               u.picture,
               CASE WHEN cl.comment_id IS NOT NULL THEN TRUE ELSE FALSE END AS liked_by_user
        FROM comments c
                 JOIN users u ON c.user_id = u.id
                 LEFT JOIN comment_likes cl ON c.id = cl.comment_id AND cl.user_id = $2
        WHERE c.publication_id = $1
        ORDER BY c.created_at DESC`;
		try {
			const result = await this.database.query<T_PopulatedComment>(query, [publicationId, userId]);
			return result.rows;
		} catch (error) {
			this.errorHandler(error, 'listCommentsByPublication');
		}
	}

	async createComment(publicationId: string, userId: string, content: string): Promise<T_Comment> {
		const query = `
            WITH inserted_comment AS (
                INSERT INTO comments (content, publication_id, user_id)
                VALUES ($1, $2, $3)
                RETURNING *
            )
            UPDATE publications
            SET comments_count = comments_count + 1
            WHERE id = $2
            RETURNING inserted_comment.*`;
		try {
			const result = await this.database.query<T_Comment>(query, [content, publicationId, userId]);
			return result.rows[0];
		} catch (error) {
			this.errorHandler(error, 'createComment');
		}
	}

	async deleteComment(commentId: string, userId: string): Promise<boolean> {
		const query = `
        DELETE
        FROM comments
        WHERE id = $1 AND user_id = $2`;
		try {
			const result = await this.database.query(query, [commentId, userId]);
			return !!result.rowCount
		} catch (error) {
			this.errorHandler(error, 'deleteComment');
		}
	}

	async likeComment(commentId: string, userId: string): Promise<void> {
		try {
			const likeExistsQuery = 'SELECT id FROM comment_likes WHERE comment_id = $1 AND user_id = $2';
			const likeExistsResult = await this.database.query(likeExistsQuery, [commentId, userId]);

			if (likeExistsResult.rows.length > 0) {
				const removeLikeQuery = 'DELETE FROM comment_likes WHERE comment_id = $1 AND user_id = $2';
				await this.database.query(removeLikeQuery, [commentId, userId]);
			} else {
				const addLikeQuery = 'INSERT INTO comment_likes (comment_id, user_id) VALUES ($1, $2)';
				await this.database.query(addLikeQuery, [commentId, userId]);
			}
		} catch (error) {
			this.errorHandler(error, 'likeComment');
		}
	}
}
