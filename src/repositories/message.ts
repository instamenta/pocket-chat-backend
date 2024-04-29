import {QueryResult} from "pg";
import BaseRepository from "../base/repository.base";
import * as T from '../types';

export default class MessageRepository extends BaseRepository {

	public createMessage({sender, recipient, content, friendship, images = [], files = []}: T.Message.Create) {
		return this.database.query<{ id: string }>(`
                INSERT INTO "messages" (sender_id,
                                        recipient_id,
                                        friendship_id,
                                        content,
                                        images,
                                        files)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id
			`,
			[sender, recipient, friendship, content, images, files]
		).then((data) => data.rows[0].id)

			.catch(e => this.errorHandler(e, 'createMessage'));
	}

	public getMessagesByFriendshipId(friendship_id: string, skip: number = 0, limit: number = 20) {
		return this.database.query<T.Message.Message>(`
                SELECT *
                FROM messages
                WHERE friendship_id = $1
                ORDER BY created_at DESC
                OFFSET $2 LIMIT $3
			`,
			[friendship_id, skip, limit]
		).then(data => data.rows)

			.catch(e => this.errorHandler(e, 'getMessagesByFriendshipId'));
	}

	public getMessagesByUsers(user1: string, user2: string, skip: number = 0, limit: number = 20) {
		return this.database.query<T.Message.Message>(`
                SELECT *
                FROM messages
                WHERE sender_id = $1 AND recipient_id = $2
                   OR sender_id = $2 AND recipient_id = $1
                ORDER BY created_at DESC
                OFFSET $3 LIMIT $4
			`,
			[user1, user2, skip, limit]
		).then(data => data.rows)

			.catch(e => this.errorHandler(e, 'getMessagesByUsers'));
	}

	public updateMessageStatus(id: string, status: string) {
		return this.database.query(`
                UPDATE messages
                SET message_status = $2,
                    updated_at     = NOW()
                WHERE id = $1;
			`,
			[id, status]
		).then(data => data.rowCount ?? null)

			.catch(e => this.errorHandler(e, 'updateMessageStatus'));
	}

	public async listConversations(userId: string) {
		const query = `
        WITH DistinctConversations AS (SELECT CASE
                                                  WHEN sender_id = $1 THEN recipient_id
                                                  ELSE sender_id
                                                  END         AS other_user_id,
                                              MAX(created_at) as latest_message_time
                                       FROM messages
                                       WHERE sender_id = $1
                                          OR recipient_id = $1
                                       GROUP BY other_user_id),
             LatestMessages AS (SELECT m.id      AS message_id,
                                       m.content AS last_message,
                                       m.created_at,
                                       u.id      AS user_id,
                                       u.username,
                                       u.first_name,
                                       u.last_name,
                                       u.picture
                                FROM messages m
                                         JOIN DistinctConversations dc ON m.created_at = dc.latest_message_time
                                         JOIN users u ON u.id = dc.other_user_id
                                WHERE (m.sender_id = $1 AND m.recipient_id = dc.other_user_id)
                                   OR (m.recipient_id = $1 AND m.sender_id = dc.other_user_id))
        SELECT *
        FROM LatestMessages
        ORDER BY created_at DESC;
		`;
		try {
			const result: QueryResult<T.Message.Conversations> = await this.database.query(query, [userId]);
			return result.rows;
		} catch (error) {
			this.errorHandler(error, 'listConversations');
		}
	}

}