import {Client} from "pg";
import {T_FeedStory, T_StoryFull} from "../types";
import {T_Comment, T_PopulatedComment} from "../types/comment";

export default class StoryRepository {
	constructor(private readonly database: Client) {
	}

	private errorHandler(error: unknown | Error, method: string): never {
		throw new Error(`${this.constructor.name}.${method}(): Error`, {cause: error});
	}

	async createStory({userId, imageUrl}: { userId: string, imageUrl: string }) {
		return this.database.query<{ id: string }>(`

                INSERT INTO "stories" (user_id, image_url)
                VALUES ($1, $2)
                RETURNING id
			`,
			[userId, imageUrl]
		).then((data) => data.rows[0].id)

			.catch(e => this.errorHandler(e, 'createNotification'));
	}

	async listStories(userId: string) {
		const query = `SELECT u.id AS user_id,
                          u.picture as user_picture,
                          u.username,
                          u.first_name,
                          u.last_name,
                          s.image_url
                   FROM stories s
                            JOIN
                        friendships f ON s.user_id = f.sender_id OR s.user_id = f.recipient_id
                            JOIN
                        users u ON u.id = s.user_id
                   WHERE s.created_at > NOW() - INTERVAL '24 hours'
                     AND (f.sender_id = $1 OR f.recipient_id = $1)
                     AND s.user_id != $1;`;
		try {
			const result = await this.database.query<T_FeedStory>(query, [userId]);
			return result.rows;
		} catch (error) {
			this.errorHandler(error, 'listStories');
		}
	}

	async listFeedStories(userId: string) {
		const query = `
        SELECT DISTINCT ON (u.id) u.id AS user_id,
                                  u.picture as user_picture,
                                  u.username,
                                  u.first_name,
                                  u.last_name,
                                  s.image_url
        FROM stories s
                 JOIN
             users u ON s.user_id = u.id
                 JOIN
             (SELECT sender_id AS friend_id
              FROM friendships
              WHERE recipient_id = $1
                AND friendship_status = 'accepted'
              UNION
              SELECT recipient_id AS friend_id
              FROM friendships
              WHERE sender_id = $1
                AND friendship_status = 'accepted') AS f ON f.friend_id = s.user_id
        WHERE s.created_at > NOW() - INTERVAL '24 hours'
        ORDER BY u.id, s.created_at DESC
		`;

		try {
			const result = await this.database.query<T_FeedStory>(query, [userId]);
			return result.rows;
		} catch (error) {
			this.errorHandler(error, 'listFeedStories');
		}
	}

	async getStoryById (id: string) {
		const query = `
        SELECT user_id, id, likes_count
        FROM stories
        WHERE id = $1`;
		try {
			const result = await this.database.query<{ user_id: string, id: string, likes_count: string }>(query, [id]);
			return result.rowCount ? result.rows[0] : null;
		} catch (error) {
			this.errorHandler(error, 'listFeedStories');
		}
	}


	async listFriendStoriesByUsername(username: string) {
		const friendStoriesQuery = `
        SELECT s.id,
               s.image_url,
               s.created_at,
               u.username AS friend_username,
               u.picture  AS friend_picture,
               s.comments_count,
               s.likes_count
        FROM users u
                 JOIN friendships f ON f.sender_id = u.id OR f.recipient_id = u.id
                 JOIN stories s ON s.user_id = u.id
        WHERE (f.sender_id = (SELECT id FROM users WHERE username = $1) OR
               f.recipient_id = (SELECT id FROM users WHERE username = $1))
          AND s.created_at > NOW() - INTERVAL '24 hours'
          AND u.username != $1
		`;

		try {
			const result = await this.database.query<T_StoryFull>(friendStoriesQuery, [username]);
			return result.rows;
		} catch (error) {
			this.errorHandler(error, 'listFriendStoriesByUsername');
		}
	}


	async likeStory(storyId: string, userId: string): Promise<void> {
		try {
			await this.database.query('BEGIN');

			const likeExistsQuery = 'SELECT id FROM story_likes WHERE story_id = $1 AND user_id = $2';
			const likeExistsResult = await this.database.query(likeExistsQuery, [storyId, userId]);

			if (likeExistsResult.rows.length > 0) {
				const removeLikeQuery = 'DELETE FROM story_likes WHERE story_id = $1 AND user_id = $2';
				const decrementLikeCountQuery = 'UPDATE stories SET likes_count = likes_count - 1 WHERE id = $1';

				await Promise.all([
					await this.database.query(removeLikeQuery, [storyId, userId]),
					await this.database.query(decrementLikeCountQuery, [storyId]),
				]);
			} else {
				const addLikeQuery = 'INSERT INTO story_likes (story_id, user_id) VALUES ($1, $2)';
				const incrementLikeCountQuery = 'UPDATE stories SET likes_count = likes_count + 1 WHERE id = $1';

				await Promise.all([
					await this.database.query(addLikeQuery, [storyId, userId]),
					await this.database.query(incrementLikeCountQuery, [storyId]),
				]);
			}

			await this.database.query('COMMIT');
		} catch (error) {
			await this.database.query('ROLLBACK');
			throw error;
		}
	}

	async listCommentsByStoryId(storyId: string, userId: string) {
		const query = `
        SELECT c.id,
               c.content,
               c.created_at,
               c.story_id,
               c.user_id,
               u.username,
               u.picture,
               u.first_name,
               u.last_name,
               CASE WHEN cl.comment_id IS NOT NULL THEN TRUE ELSE FALSE END AS liked_by_user,
               COALESCE(l.likes_count, 0)                                   AS likes_count
        FROM story_comments c
                 JOIN users u ON c.user_id = u.id
                 LEFT JOIN comment_likes cl ON c.id = cl.comment_id AND cl.user_id = $2
                 LEFT JOIN (SELECT comment_id, COUNT(*) AS likes_count
                            FROM comment_likes
                            GROUP BY comment_id) l ON c.id = l.comment_id
        WHERE c.story_id = $1
        ORDER BY c.created_at DESC;
		`;
		try {
			const result = await this.database.query<T_PopulatedComment>(query, [storyId, userId]);
			return result.rows;
		} catch (error) {
			this.errorHandler(error, 'listCommentsByStoryId');
		}
	}

	async createStoryComment(storyId: string, userId: string, content: string): Promise<T_Comment> {
		const insertQuery = `
        INSERT INTO story_comments (content, story_id, user_id)
        VALUES ($1, $2, $3)
        RETURNING *`;

		const updateQuery = `
        UPDATE stories
        SET comments_count = comments_count + 1
        WHERE id = $1`;

		try {
			const insertResult = await this.database.query<T_Comment>(insertQuery, [content, storyId, userId]);
			if (insertResult.rows.length === 0) {
				throw new Error('Failed to insert comment');
			}

			await this.database.query(updateQuery, [storyId]);
			return insertResult.rows[0];
		} catch (error) {
			this.errorHandler(error, 'createStoryComment');
		}
	}

	async deleteStoryComment(commentId: string, userId: string): Promise<boolean> {
		const query = `
        DELETE
        FROM story_comments
        WHERE id = $1
          AND user_id = $2`;
		try {
			const result = await this.database.query(query, [commentId, userId]);
			return !!result.rowCount
		} catch (error) {
			this.errorHandler(error, 'deleteStoryComment');
		}
	}

	async likeStoryComment(commentId: string, userId: string): Promise<void> {
		try {
			const likeExistsQuery = 'SELECT id FROM story_comment_likes WHERE comment_id = $1 AND user_id = $2';
			const likeExistsResult = await this.database.query(likeExistsQuery, [commentId, userId]);

			if (likeExistsResult.rows.length > 0) {
				const removeLikeQuery = 'DELETE FROM story_comment_likes WHERE comment_id = $1 AND user_id = $2';
				await this.database.query(removeLikeQuery, [commentId, userId]);
			} else {
				const addLikeQuery = 'INSERT INTO story_comment_likes (comment_id, user_id) VALUES ($1, $2)';
				await this.database.query(addLikeQuery, [commentId, userId]);
			}
		} catch (error) {
			this.errorHandler(error, 'likeStoryComment');
		}
	}


}

