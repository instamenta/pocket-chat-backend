import { BaseRepository } from "../base/repository.base";
import type { QueryResult } from "pg";
import type { ConversationsStruct, CreateMessageRequestStruct, MessageStruct } from "../types/messages";

export class MessageRepository extends BaseRepository {
  public async createMessage({
    sender,
    recipient,
    content,
    friendship,
    images = [],
    files = [],
  }: CreateMessageRequestStruct): Promise<string> {
    try {
      const data = await this.database.query<{ id: string }>(
        `
                INSERT INTO "messages" (sender_id,
                                        recipient_id,
                                        friendship_id,
                                        content,
                                        images,
                                        files)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id
			`,
        [sender, recipient, friendship, content, images, files],
      );
      return data.rows[0].id;
    } catch (error) {
      this.errorHandler(error, "createMessage");
    }
  }

  public async getMessagesByFriendshipId(
    friendshipId: string,
    skip = 0,
    limit = 20,
  ) {
    try {
      const data = await this.database.query<MessageStruct>(
        `
                SELECT *
                FROM messages
                WHERE friendship_id = $1
                ORDER BY created_at DESC
                OFFSET $2 LIMIT $3
			`,
        [friendshipId, skip, limit],
      );
      return data.rows;
    } catch (error) {
      return this.errorHandler(error, "getMessagesByFriendshipId");
    }
  }

  public async getMessagesByUsers(
    user1: string,
    user2: string,
    skip = 0,
    limit = 20,
  ) {
    try {
      const data = await this.database.query<MessageStruct>(
        `
                SELECT *
                FROM messages
                WHERE sender_id = $1 AND recipient_id = $2
                   OR sender_id = $2 AND recipient_id = $1
                ORDER BY created_at DESC
                OFFSET $3 LIMIT $4
			`,
        [user1, user2, skip, limit],
      );
      return data.rows;
    } catch (error) {
      return this.errorHandler(error, "getMessagesByUsers");
    }
  }

  public async updateMessageStatus(id: string, status: string): Promise<number | null> {
    try {
      const data = await this.database.query<object>(
        `
                UPDATE messages
                SET message_status = $2,
                    updated_at     = NOW()
                WHERE id = $1;
			`,
        [id, status],
      );
      return data.rowCount ?? null;
    } catch (error) {
      return this.errorHandler(error, "updateMessageStatus");
    }
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
      const result: QueryResult<ConversationsStruct> =
        await this.database.query(query, [userId]);
      return result.rows;
    } catch (error) {
      this.errorHandler(error, "listConversations");
    }
  }
}
