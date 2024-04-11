import {Client} from 'pg';
import {I_UserSchema} from "../types/user";
import {I_Friendship, T_MutualFriend} from "../types";

export type T_FriendRequestData = {
	id: string,
	first_name: string,
	last_name: string,
	picture: string,
	username: string,
	request_date: string,
	request_type: 'sent' | 'received'
}

export default class FriendRepository {
	constructor(private readonly database: Client) {
	}

	private errorHandler(error: unknown | Error, method: string): never {
		throw new Error(`${this.constructor.name}.${method}(): Error`, {cause: error});
	}

	public sendFriendRequest(sender: string, recipient: string) {
		return this.database.query<{ id: string }>(`

                INSERT INTO friendships (sender_id, recipient_id)
                VALUES ($1, $2)
                RETURNING id;
			`,
			[sender, recipient]
		).then((data) => data.rows[0].id)

			.catch(e => this.errorHandler(e, 'sendFriendRequest'));

	}

	public deleteFriendRequest(sender: string, recipient: string) {
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

	public declineFriendRequest(sender: string, recipient: string) {
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

	public listFriendRecommendations(id: string) {
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

	public acceptFriendRequest(sender: string, recipient: string) {
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

	public async listMutualFriendsByUsers(sender: string, recipient: string) {
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

	public async getFriendsCountByUserId(id: string) {
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

	public listFriendsByUserId(id: string) {
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

	public listFriendRequests(id: string) {
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

	public listFriendRequestsOnly(id: string) {
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

	public listFriendSentOnly(id: string) {
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

	public getBySenderAndRecipient(sender: string, recipient: string) {
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

	public getById(id: string) {
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


