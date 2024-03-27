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
               u.first_name,
               u.last_name,
               CASE WHEN cl.comment_id IS NOT NULL THEN TRUE ELSE FALSE END AS liked_by_user,
               COALESCE(l.likes_count, 0) AS likes_count
        FROM comments c
                 JOIN users u ON c.user_id = u.id
                 LEFT JOIN comment_likes cl ON c.id = cl.comment_id AND cl.user_id = $2
                 LEFT JOIN (
            SELECT comment_id, COUNT(*) AS likes_count
            FROM comment_likes
            GROUP BY comment_id
        ) l ON c.id = l.comment_id
        WHERE c.publication_id = $1
        ORDER BY c.created_at DESC;
		`;
		try {
			const result = await this.database.query<T_PopulatedComment>(query, [publicationId, userId]);
			return result.rows;
		} catch (error) {
			this.errorHandler(error, 'listCommentsByPublication');
		}
	}

	async createComment(publicationId: string, userId: string, content: string): Promise<T_Comment> {
		const insertQuery = `
        INSERT INTO comments (content, publication_id, user_id)
        VALUES ($1, $2, $3)
        RETURNING *`;

		const updateQuery = `
        UPDATE publications
        SET comments_count = comments_count + 1
        WHERE id = $1`;

		try {
			const insertResult = await this.database.query<T_Comment>(insertQuery, [content, publicationId, userId]);
			if (insertResult.rows.length === 0) {
				throw new Error('Failed to insert comment');
			}

			await this.database.query(updateQuery, [publicationId]);
			return insertResult.rows[0];
		} catch (error) {
			this.errorHandler(error, 'createComment');
		}
	}

	async deleteComment(commentId: string, userId: string): Promise<boolean> {
		const query = `
        DELETE
        FROM comments
        WHERE id = $1
          AND user_id = $2`;
		try {
			const result = await this.database.query(query, [commentId, userId]);
			return !!result.rowCount
		} catch (error) {
			this.errorHandler(error, 'deleteComment');
		}
	}

	async getCommentById(id: string) {
		const query = `
        SELECT c.id,
               c.user_id,
               COUNT(cl.user_id) AS likes_count
        FROM comments c
                 LEFT JOIN comment_likes cl ON c.id = cl.comment_id
        WHERE c.id = $1
        GROUP BY c.id;
		`;
		try {
			const result = await this.database.query<{id: string, user_id: string, likes_count}>(query, [id]);
			return result.rowCount ? result.rows[0] : null;
		} catch (error) {
			this.errorHandler(error, 'listCommentsByPublication');
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
