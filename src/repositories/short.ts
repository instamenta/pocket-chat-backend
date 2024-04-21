import {I_ShortPopulated} from "../types/short";
import {T_Comment, T_PopulatedComment} from "../types/comment";
import RepositoryBase from "../base/repository.base";

export default class ShortRepository extends RepositoryBase {
	async createShort(userId: string, videoUrl: string, description: string) {
		const query = `INSERT INTO "shorts" (user_id, video_url, description)
                   VALUES ($1, $2, $3)
                   RETURNING id`;
		try {
			const result = await this.database.query<{ id: string }>(query, [userId, videoUrl, description])
			return result.rows[0].id
		} catch (error) {
			this.errorHandler(error, 'createShort');
		}
	}

	async listShorts(userId: string) {
		const query = `SELECT u.id      AS user_id,
                          u.picture as user_picture,
                          u.username,
                          u.first_name,
                          u.last_name,
                          s.video_url,
                          s.description,
                          s.created_at,
                          s.likes_count,
                          s.comments_count,
                          s.id,
                          CASE WHEN sl.short_id IS NOT NULL THEN TRUE ELSE FALSE END
                                    AS liked_by_user
                   FROM shorts s
                            JOIN users u ON u.id = s.user_id
                            LEFT join short_likes sl ON s.id = sl.short_id AND sl.user_id = $1
                   ORDER BY s.created_at DESC`;
		// --                    WHERE s.user_id != $1
		try {
			const result = await this.database.query<I_ShortPopulated>(query, [userId]);
			return result.rows;
		} catch (error) {
			this.errorHandler(error, 'listShorts');
		}
	}

	async listShortsById(userId: string) {
		const query = `SELECT u.id      AS user_id,
                          u.picture as user_picture,
                          u.username,
                          u.first_name,
                          u.last_name,
                          s.video_url,
                          s.description,
                          s.created_at,
                          s.id,
                          s.comments_count,
                          s.likes_count,
                          CASE WHEN sl.short_id IS NOT NULL THEN TRUE ELSE FALSE END
                                    AS liked_by_user
                   FROM shorts s
                            JOIN users u ON u.id = s.user_id
                            LEFT join short_likes sl ON s.id = sl.short_id AND sl.user_id = $2
                   WHERE s.user_id = $1
                   ORDER BY s.created_at DESC`;
		try {
			const result = await this.database.query<I_ShortPopulated>(query, [userId]);
			return result.rows;
		} catch (error) {
			this.errorHandler(error, 'listShortsById');
		}
	}

	async getShortById(id: string) {
		const query = `SELECT u.id      AS user_id,
                          u.picture as user_picture,
                          u.username,
                          u.first_name,
                          u.last_name,
                          s.video_url,
                          s.description,
                          s.created_at,
                          s.id,
                          s.comments_count,
                          s.likes_count
                   FROM shorts s
                            JOIN users u ON u.id = s.user_id
                   WHERE s.id = $1
                   LIMIT 1`;
		try {
			const result = await this.database.query<I_ShortPopulated>(query, [id]);
			return result.rowCount ? result.rows[0] : null;
		} catch (error) {
			this.errorHandler(error, 'listShortsById');
		}
	}


	async likeShort(shortId: string, userId: string): Promise<boolean> {
		try {
			const likeExistsQuery = 'SELECT id FROM short_likes WHERE short_id = $1 AND user_id = $2';
			const likeExistsResult = await this.database.query(likeExistsQuery, [shortId, userId]);

			await this.database.query('BEGIN');

			if (likeExistsResult.rows.length > 0) {
				const removeLikeQuery = 'DELETE FROM short_likes WHERE short_id = $1 AND user_id = $2';
				const decrementLikeCountQuery = 'UPDATE shorts SET likes_count = likes_count - 1 WHERE id = $1';

				await Promise.all([
					await this.database.query(removeLikeQuery, [shortId, userId]),
					await this.database.query(decrementLikeCountQuery, [shortId]),
				]);
			} else {
				const addLikeQuery = 'INSERT INTO short_likes (short_id, user_id) VALUES ($1, $2)';
				const incrementLikeCountQuery = 'UPDATE shorts SET likes_count = likes_count + 1 WHERE id = $1';

				await Promise.all([
					await this.database.query(addLikeQuery, [shortId, userId]),
					await this.database.query(incrementLikeCountQuery, [shortId]),
				]);
			}

			await this.database.query('COMMIT');
			return !(likeExistsResult.rows.length > 0);
		} catch (error) {
			await this.database.query('ROLLBACK');
			throw error;
		}
	}

	async listCommentsByShortId(shortId: string, userId: string) {
		const query = `
        SELECT c.id,
               c.content,
               c.created_at,
               c.short_id,
               c.user_id,
               u.username,
               u.picture,
               u.first_name,
               u.last_name,
               CASE WHEN cl.comment_id IS NOT NULL THEN TRUE ELSE FALSE END AS liked_by_user,
               COALESCE(l.likes_count, 0)                                   AS likes_count
        FROM short_comments c
                 JOIN users u ON c.user_id = u.id
                 LEFT JOIN comment_likes cl ON c.id = cl.comment_id AND cl.user_id = $2
                 LEFT JOIN (SELECT comment_id, COUNT(*) AS likes_count
                            FROM comment_likes
                            GROUP BY comment_id) l ON c.id = l.comment_id
        WHERE c.short_id = $1
        ORDER BY c.created_at DESC;
		`;
		try {
			const result = await this.database.query<T_PopulatedComment>(query, [shortId, userId]);
			return result.rows;
		} catch (error) {
			this.errorHandler(error, 'listCommentsByShortId');
		}
	}

	async createShortComment(shortId: string, userId: string, content: string): Promise<T_Comment> {
		const insertQuery = `
        INSERT INTO short_comments (content, short_id, user_id)
        VALUES ($1, $2, $3)
        RETURNING *`;

		const updateQuery = `
        UPDATE shorts
        SET comments_count = comments_count + 1
        WHERE id = $1`;

		try {
			const insertResult = await this.database.query<T_Comment>(insertQuery, [content, shortId, userId]);
			if (insertResult.rows.length === 0) {
				throw new Error('Failed to insert comment');
			}

			await this.database.query(updateQuery, [shortId]);
			return insertResult.rows[0];
		} catch (error) {
			this.errorHandler(error, 'createShortComment');
		}
	}

	async deleteShortComment(commentId: string, userId: string): Promise<boolean> {
		const selectQuery = `SELECT short_id
                         FROM short_comments
                         WHERE id = $1`;

		const updateQuery = `UPDATE shorts
                         SET comments_count = comments_count - 1
                         WHERE id = $1`;

		const deleteQuery = `DELETE
                         FROM short_comments
                         WHERE id = $1
                           AND user_id = $2`;
		try {
			const short = await this.database.query<{ short_id: string }>(selectQuery, [commentId]);
			if (!short.rowCount) {
				throw new Error(`Failed to get short! Comment id ${commentId}`);
			}

			await this.database.query(updateQuery, [short.rows[0].short_id]);

			const result = await this.database.query(deleteQuery, [commentId, userId]);
			return !!result.rowCount
		} catch (error) {
			this.errorHandler(error, 'deleteShortComment');
		}
	}

	async likeShortComment(commentId: string, userId: string): Promise<void> {
		try {
			const likeExistsQuery = 'SELECT id FROM short_comment_likes WHERE comment_id = $1 AND user_id = $2';
			const likeExistsResult = await this.database.query(likeExistsQuery, [commentId, userId]);

			if (likeExistsResult.rows.length > 0) {
				const removeLikeQuery = 'DELETE FROM short_comment_likes WHERE comment_id = $1 AND user_id = $2';
				await this.database.query(removeLikeQuery, [commentId, userId]);
			} else {
				const addLikeQuery = 'INSERT INTO short_comment_likes (comment_id, user_id) VALUES ($1, $2)';
				await this.database.query(addLikeQuery, [commentId, userId]);
			}
		} catch (error) {
			this.errorHandler(error, 'likeShortComment');
		}
	}

	async getCommentById(id: string) {
		const query = `
        SELECT c.*,
               COUNT(cl.user_id) AS likes_count
        FROM short_comments c
                 LEFT JOIN short_comment_likes cl ON c.id = cl.comment_id
        WHERE c.id = $1
        GROUP BY c.id;
		`;
		try {
			const result = await this.database.query<T_Comment & { likes_count: number }>(query, [id]);
			return result.rowCount ? result.rows[0] : null;
		} catch (error) {
			this.errorHandler(error, 'getCommentById');
		}
	}

}
