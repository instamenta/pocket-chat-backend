"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const repository_base_1 = __importDefault(require("../base/repository.base"));
class FriendRepository extends repository_base_1.default {
    sendFriendRequest(sender, recipient) {
        return this.database.query(`

                INSERT INTO friendships (sender_id, recipient_id)
                VALUES ($1, $2)
                RETURNING id;
			`, [sender, recipient]).then((data) => data.rows[0].id)
            .catch(e => this.errorHandler(e, 'sendFriendRequest'));
    }
    deleteFriendRequest(sender, recipient) {
        return this.database.query(`

                DELETE
                FROM friendships
                WHERE sender_id = $1
                  AND recipient_id = $2
			`, [sender, recipient]).then((data) => !!data.rowCount)
            .catch(e => this.errorHandler(e, 'deleteFriendRequest'));
    }
    declineFriendRequest(sender, recipient) {
        return this.database.query(`

                DELETE
                FROM friendships
                WHERE sender_id = $2
                  AND recipient_id = $1;
			`, [sender, recipient]).then((data) => !!data.rowCount)
            .catch(e => this.errorHandler(e, 'declineFriendRequest'));
    }
    listFriendRecommendations(id) {
        return this.database.query(`

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
			`, [id]).then((data) => data.rows)
            .catch(e => this.errorHandler(e, 'listFriendRecommendations'));
    }
    acceptFriendRequest(sender, recipient) {
        return this.database.query(`

                UPDATE friendships
                SET friendship_status = 'accepted'
                WHERE sender_id = $2
                  AND recipient_id = $1;
			`, [sender, recipient]).then((data) => !!data.rowCount)
            .catch(e => this.errorHandler(e, 'acceptFriendRequest'));
    }
    async listMutualFriendsByUsers(user1, sender) {
        console.log({ user1, sender });
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
            const result = await this.database.query(query, [user1, sender]);
            return result.rows;
        }
        catch (error) {
            this.errorHandler(error, 'listMutualFriendsByUsers');
        }
    }
    async getFriendsCountByUserId(id) {
        const query = `SELECT f.id
                   FROM friendships f
                            JOIN users u
                                 ON (f.sender_id = u.id AND f.recipient_id = $1)
                                     OR (f.recipient_id = u.id AND f.sender_id = $1)
                   WHERE f.friendship_status = 'accepted'
    ;`;
        try {
            const result = await this.database.query(query, [id]);
            return result.rowCount ?? 0;
        }
        catch (error) {
            this.errorHandler(error, 'getFriendsCountByUserId');
        }
    }
    listFriendsByUserId(id) {
        return this.database.query(`

                SELECT *
                FROM friendships f
                         JOIN users u
                              ON (f.sender_id = u.id AND f.recipient_id = $1)
                                  OR (f.recipient_id = u.id AND f.sender_id = $1)
                WHERE f.friendship_status = 'accepted'
                ;`, [id]).then((data) => data.rows)
            .catch(e => this.errorHandler(e, 'listFriendsByUserId'));
    }
    listFriendsByUsername(username) {
        return this.database.query(`
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
			`, [username]).then((data) => data.rows)
            .catch(e => this.errorHandler(e, 'listFriendsByUsername'));
    }
    listFriendRequests(id) {
        return this.database.query(`

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
			`, [id]).then((data) => data.rows)
            .catch(e => this.errorHandler(e, 'listFriendRequests'));
    }
    listFriendRequestsOnly(id) {
        return this.database.query(`

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
			`, [id]).then((data) => data.rows)
            .catch(e => this.errorHandler(e, 'listFriendRequestsOnly'));
    }
    listFriendSentOnly(id) {
        return this.database.query(`
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
			`, [id]).then((data) => data.rows)
            .catch(e => this.errorHandler(e, 'listFriendSentOnly'));
    }
    getBySenderAndRecipient(sender, recipient) {
        return this.database.query(`

                SELECT *
                FROM friendships
                WHERE (sender_id = $1 AND recipient_id = $2)
                   OR (sender_id = $2 AND recipient_id = $1)
                LIMIT 1
			`, [sender, recipient]).then(data => data.rows[0] ?? null)
            .catch(e => this.errorHandler(e, 'getBySenderAndRecipient'));
    }
    async getFriendsByUserIdAndSender(user, sender_id) {
        const notMutual = await this.database.query(`
          WITH friendsList AS (SELECT (CASE WHEN $1 = sender_id THEN recipient_id ELSE sender_id END) as user_id
                               FROM friendships
                               WHERE (($1 = sender_id OR $1 = recipient_id) AND friendship_status = 'accepted'))
          SELECT u.*
          FROM users u
                   JOIN friendsList ON u.id = friendsList.user_id
                   JOIN friendships f ON
              (f.sender_id = u.id AND f.recipient_id != $2) OR
              (f.sender_id != $2 AND f.recipient_id = u.id)
			`, [user, sender_id]);
        console.log(notMutual.rowCount);
        // const mutual = await this.database.query(
        // 	`
        //       WITH friendsList AS (SELECT (CASE WHEN $1 = sender_id THEN recipient_id ELSE sender_id END) as user_id
        //                            FROM friendships
        //                            WHERE (($1 = sender_id OR $1 = recipient_id) AND friendship_status = 'accepted'))
        //       SELECT u.*
        //       FROM users u
        //                JOIN friendsList ON u.id = friendsList.user_id
        //                JOIN friendships f ON
        //           (f.sender_id = u.id AND f.recipient_id = $2) OR
        //           (f.sender_id = $2 AND f.recipient_id = u.id)
        // 	`,
        // 	[user, sender_id])
        // ;
        //
        // console.log(mutual.rows);
    }
    getById(id) {
        return this.database.query(`
                SELECT *
                FROM friendships
                WHERE id = $1
                LIMIT 1`, [id]).then(data => data.rows[0] ?? null)
            .catch(e => this.errorHandler(e, 'getBySenderAndRecipient'));
    }
}
exports.default = FriendRepository;
