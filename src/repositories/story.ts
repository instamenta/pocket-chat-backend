import {Client} from "pg";
import {T_FeedStory, T_StoryFull} from "../types";

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


	async listFriendStoriesByUsername(username: string) {
		const friendStoriesQuery = `
        SELECT s.id,
               s.image_url,
               s.created_at,
               u.username AS friend_username,
               u.picture  AS friend_picture
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

}

// SELECT * FROM "stories"
// WHERE created_at > NOW() - INTERVAL '24 hours';

// SELECT * FROM "stories"
// WHERE user_id = :user_id; -- :user_id is a placeholder for the actual user ID
