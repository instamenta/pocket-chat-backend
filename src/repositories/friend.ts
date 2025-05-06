import { BaseRepository } from "../base/repository.base";
import {
  FriendshipRequestStruct,
  FriendshipStruct,
  MutualFriendshipStruct,
} from "../types/friend";
import { UserSchemaStruct } from "../types/user";

export class FriendRepository extends BaseRepository {
  public async sendFriendRequest(
    sender: string,
    recipient: string,
  ): Promise<string> {
    try {
      const data = await this.database.query<{ id: string }>(
        `
                INSERT INTO friendships (sender_id, recipient_id)
                VALUES ($1, $2)
                RETURNING id;
			`,
        [sender, recipient],
      );
      return data.rows[0].id;
    } catch (error) {
      this.errorHandler(error, "sendFriendRequest");
    }
  }

  public async deleteFriendRequest(
    sender: string,
    recipient: string,
  ): Promise<boolean> {
    try {
      const data = await this.database.query<object>(
        `
                DELETE
                FROM friendships
                WHERE sender_id = $1
                  AND recipient_id = $2
			`,
        [sender, recipient],
      );
      return !!data.rowCount;
    } catch (error) {
      this.errorHandler(error, "deleteFriendRequest");
    }
  }

  public async declineFriendRequest(
    sender: string,
    recipient: string,
  ): Promise<boolean> {
    try {
      const data = await this.database.query<object>(
        `
                DELETE
                FROM friendships
                WHERE sender_id = $2
                  AND recipient_id = $1;
			`,
        [sender, recipient],
      );
      return !!data.rowCount;
    } catch (error) {
      this.errorHandler(error, "declineFriendRequest");
    }
  }

  public async listFriendRecommendations(id: string) {
    try {
      const data = await this.database.query<
        Pick<UserSchemaStruct, "id" | "firstName" | "picture" | "username">
      >(
        `
                SELECT u.id, u.first_name, u.last_name, u.picture, u.username
                FROM users u
                         LEFT JOIN friendships f_sender
                                   ON u.id = f_sender.sender_id
                                       AND f_sender.recipient_id = $1
                         LEFT JOIN friendships f_recipient
                                   ON u.id = f_recipient.recipient_id
                                       AND f_recipient.sender_id = $1
                WHERE f_sender.id IS NULL
                  AND f_recipient.id IS NULL
                  AND u.id != $1;
			`,
        [id],
      );

      return data.rows;
    } catch (error) {
      this.errorHandler(error, "listFriendRecommendations");
    }
  }

  public async acceptFriendRequest(
    sender: string,
    recipient: string,
  ): Promise<boolean> {
    try {
      const data = await this.database.query<object>(
        `
                UPDATE friendships
                SET friendship_status = 'accepted'
                WHERE sender_id = $2
                  AND recipient_id = $1;
			`,
        [sender, recipient],
      );
      return !!data.rowCount;
    } catch (error) {
      this.errorHandler(error, "acceptFriendRequest");
    }
  }

  public async listMutualFriendsByUsers(user1: string, sender: string) {
    const query = `
        SELECT u.id as user_id,
               u.first_name,
               u.last_name,
               u.username
        FROM users u
                 INNER JOIN friendships f1 ON f1.sender_id = u.id AND f1.recipient_id = $1
                 INNER JOIN friendships f2 ON f2.sender_id = u.id AND f2.recipient_id = $2
        WHERE f1.friendship_status = 'accepted'
          AND f2.friendship_status = 'accepted'
          AND f1.recipient_id <> f2.recipient_id;
        ;`;
    try {
      const result = await this.database.query<MutualFriendshipStruct>(query, [
        user1,
        sender,
      ]);
      return result.rows;
    } catch (error) {
      this.errorHandler(error, "listMutualFriendsByUsers");
    }
  }

  public async getFriendsCountByUserId(id: string): Promise<number> {
    const query = `SELECT f.id
                   FROM friendships f
                            JOIN users u
                                 ON (f.sender_id = u.id AND f.recipient_id = $1)
                                     OR (f.recipient_id = u.id AND f.sender_id = $1)
                   WHERE f.friendship_status = 'accepted'
    ;`;
    try {
      const result = await this.database.query<{ id: string }>(query, [id]);
      return result.rowCount ?? 0;
    } catch (error) {
      this.errorHandler(error, "getFriendsCountByUserId");
    }
  }

  public async listFriendsByUserId(id: string) {
    try {
      const data = await this.database.query<UserSchemaStruct>(
        `
                SELECT *
                FROM friendships f
                         JOIN users u
                              ON (f.sender_id = u.id AND f.recipient_id = $1)
                                  OR (f.recipient_id = u.id AND f.sender_id = $1)
                WHERE f.friendship_status = 'accepted'
                ;`,
        [id],
      );
      return data.rows;
    } catch (error) {
      this.errorHandler(error, "listFriendsByUserId");
    }
  }

  public async listFriendsByUsername(username: string) {
    try {
      const data = await this.database.query<UserSchemaStruct>(
        `
                SELECT DISTINCT u.*
                FROM friendships f
                         JOIN users u ON (f.sender_id = u.id OR f.recipient_id = u.id)
                WHERE f.friendship_status = 'accepted'
                  AND (f.sender_id = (SELECT id
                                      FROM users
                                      WHERE username = $1)
                    OR f.recipient_id = (SELECT id
                                         FROM users
                                         WHERE username = $1)
                    );
			`,
        [username],
      );
      return data.rows;
    } catch (error) {
      this.errorHandler(error, "listFriendsByUsername");
    }
  }

  public async listFriendRequests(id: string) {
    try {
      const data = await this.database.query<FriendshipRequestStruct>(
        `
                SELECT u.id,
                       u.first_name,
                       u.last_name,
                       u.picture,
                       u.username,
                       f.created_at AS request_date,
                       CASE
                           WHEN f.sender_id = $1
                               AND friendship_status != 'accepted'
                               THEN 'sent'
                           WHEN f.recipient_id = $1
                               AND friendship_status != 'accepted'
                               THEN 'received'
                           END
                                    AS request_type
                FROM friendships f
                         JOIN users u ON (f.sender_id = u.id AND f.recipient_id = $1)
                    OR (f.recipient_id = u.id AND f.sender_id = $1);
			`,
        [id],
      );
      return data.rows;
    } catch (error) {
      this.errorHandler(error, "listFriendRequests");
    }
  }

  public async listFriendRequestsOnly(id: string) {
    try {
      const data = await this.database.query<FriendshipRequestStruct>(
        `
                SELECT u.id,
                       u.first_name,
                       u.last_name,
                       u.picture,
                       u.username,
                       f.created_at AS request_date
                FROM friendships f
                         JOIN users u ON f.sender_id = u.id
                WHERE f.recipient_id = $1
                  AND friendship_status != 'accepted';
			`,
        [id],
      );
      return data.rows;
    } catch (error) {
      this.errorHandler(error, "listFriendRequestsOnly");
    }
  }

  public async listFriendSentOnly(id: string) {
    try {
      const data = await this.database.query<FriendshipRequestStruct>(
        `
                SELECT u.id,
                       u.first_name,
                       u.last_name,
                       u.picture,
                       u.username,
                       f.created_at AS request_date
                FROM friendships f
                         JOIN users u ON f.recipient_id = u.id
                WHERE f.sender_id = $1
                  AND friendship_status != 'accepted';
			`,
        [id],
      );
      return data.rows;
    } catch (error) {
      this.errorHandler(error, "listFriendSentOnly");
    }
  }

  public async getBySenderAndRecipient(sender: string, recipient: string) {
    try {
      const data = await this.database.query<FriendshipStruct>(
        `
                SELECT *
                FROM friendships
                WHERE (sender_id = $1 AND recipient_id = $2)
                   OR (sender_id = $2 AND recipient_id = $1)
                LIMIT 1
			`,
        [sender, recipient],
      );
      return data.rows[0] ?? null;
    } catch (error) {
      this.errorHandler(error, "getBySenderAndRecipient");
    }
  }

  public async getById(id: string) {
    try {
      const data = await this.database.query<FriendshipStruct>(
        `
                SELECT *
                FROM friendships
                WHERE id = $1
                LIMIT 1`,
        [id],
      );
      return data.rows[0] ?? null;
    } catch (error) {
      this.errorHandler(error, "getBySenderAndRecipient");
    }
  }
}
