import {I_UserSchema} from "../types/user";
import {I_Friendship, T_MutualFriend} from "../types";
import RepositoryBase from "../base/repository.base";

export type T_FriendRequestData = {
	id: string,
	first_name: string,
	last_name: string,
	picture: string,
	username: string,
	request_date: string,
	request_type: 'sent' | 'received'
}

export default class FriendRepository extends RepositoryBase {
	sendFriendRequest(sender: string, recipient: string) {
		return this.database.query<{ id: string }>(`

                INSERT INTO friendships (sender_id, recipient_id)
                VALUES ($1, $2)
                RETURNING id;
			`,
			[sender, recipient]
		).then((data) => data.rows[0].id)

			.catch(e => this.errorHandler(e, 'sendFriendRequest'));

	}

	deleteFriendRequest(sender: string, recipient: string) {
		return this.database.query(`

                DELETE
                FROM friendships
                WHERE sender_id = $1
                  AND recipient_id = $2
			`,
			[sender, recipient]
		).then((data) => !!data.rowCount)

			.catch(e => this.errorHandler(e, 'deleteFriendRequest'));
	}

	declineFriendRequest(sender: string, recipient: string) {
		return this.database.query(`

                DELETE
                FROM friendships
                WHERE sender_id = $2
                  AND recipient_id = $1;
			`,
			[sender, recipient]
		).then((data) => !!data.rowCount)

			.catch(e => this.errorHandler(e, 'declineFriendRequest'));
	}

	listFriendRecommendations(id: string) {
		return this.database.query<{ id: string, first_name: string, picture: string, username: string }>(`

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
			[id]
		).then((data) => data.rows)

			.catch(e => this.errorHandler(e, 'listFriendRecommendations'));
	}

	acceptFriendRequest(sender: string, recipient: string) {
		return this.database.query(`

                UPDATE friendships
                SET friendship_status = 'accepted'
                WHERE sender_id = $2
                  AND recipient_id = $1;
			`,
			[sender, recipient]
		).then((data) => !!data.rowCount)

			.catch(e => this.errorHandler(e, 'acceptFriendRequest'));
	}

	async listMutualFriendsByUsers(sender: string, recipient: string) {
		const query = `
        SELECT u.id as user_id, u.first_name, u.last_name, u.username
        FROM users u
                 INNER JOIN friendships f1 ON f1.sender_id = u.id AND f1.recipient_id = $1
                 INNER JOIN friendships f2 ON f2.sender_id = u.id AND f2.recipient_id = $2
        WHERE f1.friendship_status = 'accepted'
          AND f2.friendship_status = 'accepted'
          AND f1.recipient_id <> f2.recipient_id;
        ;`
		try {
			const result = await this.database.query<T_MutualFriend>(query, [sender, recipient])
			return result.rows;
		} catch (error) {
			this.errorHandler(error, 'listMutualFriendsByUsers');
		}
	}

	async getFriendsCountByUserId(id: string) {
		const query = `SELECT f.id
                   FROM friendships f
                            JOIN users u
                                 ON (f.sender_id = u.id AND f.recipient_id = $1)
                                     OR (f.recipient_id = u.id AND f.sender_id = $1)
                   WHERE f.friendship_status = 'accepted'
    ;`
		try {
			const result = await this.database.query(query, [id])
			return result.rowCount ?? 0;
		} catch (error) {
			this.errorHandler(error, 'getFriendsCountByUserId');
		}
	}

	listFriendsByUserId(id: string) {
		return this.database.query<I_UserSchema>(`

                SELECT *
                FROM friendships f
                         JOIN users u
                              ON (f.sender_id = u.id AND f.recipient_id = $1)
                                  OR (f.recipient_id = u.id AND f.sender_id = $1)
                WHERE f.friendship_status = 'accepted'
                ;`,
			[id]
		).then((data) => data.rows)

			.catch(e => this.errorHandler(e, 'listFriendsByUserId'));
	}

	async listFriendsByUsername(username: string, requester: string) {
		try {
			const data = await Promise.all([
				this.database.query<{ id: string }>(`SELECT id
                                             FROM users
                                             WHERE username = $1`, [username]),
				this.database.query<{ id: string }>(`SELECT id
                                             FROM users
                                             WHERE username = $1`, [requester]),
			]);

			const userData = data[0].rowCount ? data[0].rows[0] : null;
			const requesterData = data[1].rowCount ? data[1].rows[0] : null;

			if (!userData) throw new Error(`Failed to get user data for ${username}`)
			if (!requesterData) throw new Error(`Failed to get user data for ${requester}`)

			const friendsResult = await this.database.query<I_UserSchema & { friendship_status_with_requester: string }>(
				`SELECT u.*,
                COALESCE(
                        (SELECT friendship_status
                         FROM friendships
                         WHERE (sender_id = f.sender_id AND recipient_id = f.recipient_id)
                            OR (sender_id = f.recipient_id AND recipient_id = f.sender_id)),
                        'none'
                ) AS friendship_status_with_requester
         FROM friendships f
                  JOIN users u ON (f.sender_id = u.id OR f.recipient_id = u.id)
         WHERE (f.sender_id = $1 OR f.recipient_id = $1)
           AND f.friendship_status = 'accepted'`,
				[userData.id]
			);

			return friendsResult.rows.map(friend => ({
				...friend,
				is_friend_with_user: true,
				friendship_status_with_requester: friend.friendship_status_with_requester === 'accepted' ? 'friend' : 'sent'
			}));
		} catch (e) {
			this.errorHandler(e, 'listFriendsByUsername');
		}
	}

	listFriendRequests(id: string) {
		return this.database.query<T_FriendRequestData>(`

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
			[id]
		).then((data) => data.rows)

			.catch(e => this.errorHandler(e, 'listFriendRequests'));
	}

	listFriendRequestsOnly(id: string) {
		return this.database.query<T_FriendRequestData>(`

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
			[id]
		).then((data) => data.rows)

			.catch(e => this.errorHandler(e, 'listFriendRequestsOnly'));

	}

	listFriendSentOnly(id: string) {
		return this.database.query<T_FriendRequestData>(`
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
			[id]
		).then((data) => data.rows)

			.catch(e => this.errorHandler(e, 'listFriendSentOnly'));
	}

	getBySenderAndRecipient(sender: string, recipient: string) {
		return this.database.query<I_Friendship>(`

                SELECT *
                FROM friendships
                WHERE (sender_id = $1 AND recipient_id = $2)
                   OR (sender_id = $2 AND recipient_id = $1)
                LIMIT 1
			`,
			[sender, recipient]
		).then(data => data.rows[0] ?? null)

			.catch(e => this.errorHandler(e, 'getBySenderAndRecipient'));
	}

	getById(id: string) {
		return this.database.query<I_Friendship>(`

                SELECT *
                FROM friendships
                WHERE id = $1
                LIMIT 1
			`,
			[id]
		).then(data => data.rows[0] ?? null)

			.catch(e => this.errorHandler(e, 'getBySenderAndRecipient'));
	}

}


