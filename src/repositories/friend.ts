import {Client} from 'pg';
import {I_UserSchema} from "../types/user";

type T_FriendRequestData = {
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

	public async sendFriendRequest(sender: string, recipient: string) {
		return this.database.query<{ id: string }>(`
        INSERT INTO friendships (sender_id, recipient_id)
        VALUES ($1, $2)
        RETURNING id;
		`, [sender, recipient])
			.then((data) => data.rows[0].id)
			.catch((error) => {
				console.error(`${this.constructor.name}.sendFriendRequest(): Error`, error);
				return null
			});
	}

	public async deleteFriendRequest(sender: string, recipient: string) {
		return this.database.query(`
        DELETE
        FROM friendships
        WHERE sender_id = $1
          AND recipient_id = $2
		`, [sender, recipient])
			.then((data) => !!data.rowCount)
			.catch((error) => {
				console.error(`${this.constructor.name}.sendFriendRequest(): Error`, error);
				return null
			});
	}

	public async declineFriendRequest(sender: string, recipient: string) {
		return this.database.query(`
        DELETE
        FROM friendships
        WHERE sender_id = $2
          AND recipient_id = $1;
		`, [sender, recipient])
			.then((data) => !!data.rowCount)
			.catch((error) => {
				throw new Error(`${this.constructor.name}.declineFriendRequest(): Error`, {cause: error})
			});
	}

	public async listFriendRecommendations(id: string) {
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
		`, [id])
			.then((data) => data.rows)
			.catch((error) => {
				console.error(`${this.constructor.name}.listFriendRecommendations(): Error`, error);
				return null
			});
	}

	public async acceptFriendRequest(sender: string, recipient: string) {
		return this.database.query(`
        UPDATE friendships
        SET friendship_status = 'accepted'
        WHERE sender_id = $2
          AND recipient_id = $1;
		`, [sender, recipient])
			.then((data) => !!data.rowCount)
			.catch((error) => {
				throw new Error(`${this.constructor.name}.acceptFriendRequest(): Error`, {cause: error})
			});
	}

	public async listFriendsByUserId(id: string) {
		return this.database.query<I_UserSchema>(`
        SELECT *
        FROM friendships f
                 JOIN users u
                      ON (f.sender_id = u.id AND f.recipient_id = $1)
                          OR (f.recipient_id = u.id AND f.sender_id = $1);
		`, [id])
			.then((data) => data.rows)
			.catch((error) => {
				throw new Error(`${this.constructor.name}.listFriendsByUserId(): Error`, {cause: error})
			});
	}

	public async listFriendRequests(id: string) {
		return this.database.query<T_FriendRequestData[]>(`
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
			`, [id]
		)
			.then((data) => data.rows)
			.catch((error) =>
				console.error(`${this.constructor.name}.sendFriendRequest(): Error`, error));
	}

	public async listFriendRequestsOnly(id: string) {
		return this.database.query<T_FriendRequestData[]>(`
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
			`, [id]
		)
			.then((data) => data.rows)
			.catch((error) =>
				console.error(`${this.constructor.name}.listFriendRequestsOnly(): Error`, error));
	}

	public async listFriendSentOnly(id: string) {
		return this.database.query<T_FriendRequestData[]>(`
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
			`, [id]
		)
			.then((data) => data.rows)
			.catch((error) =>
				console.error(`${this.constructor.name}.listFriendSentOnly(): Error`, error));
	}

}


