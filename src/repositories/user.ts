import BCrypt from "../utilities/bcrypt";
import z from 'zod';
import {create_user_schema} from "../validators";
import {Client} from 'pg';
import {I_UserSchema} from "../types/user";

type T_getByUsername = {
	id: string,
	username: string,
	password: string,
	email: string
}

export default class UserRepository {
	constructor(private readonly database: Client) {
	}

	public async listUsers(skip: number = 0, limit: number = 0) {
		return this.database.query<Omit<I_UserSchema, 'updated_at'>>(`
        SELECT id,
               username,
               email,
               password,
               first_name,
               last_name,
               picture,
               created_at,
               last_active_at
        FROM users
        OFFSET $1 LIMIT $2
		`, [skip, limit])
			.then(data => data.rows)
			.catch((error) => {
				console.error(`${this.constructor.name}.listUsers(): Error`, error);
				return null;
			})
	}

	public async getByUsername(username: string): Promise<T_getByUsername | null> {
		return this.database.query<T_getByUsername>(`
        SELECT id, username, password, email
        FROM users u
        WHERE u.username = $1
        LIMIT 1;
		`, [username])
			.then((data) => data.rows.length ? data.rows[0] : null)
			.catch((error) => {
				console.error(`${this.constructor.name}.getByUsername(): Error`, error);
				return null;
			});
	}

	public async updateLastActiveAtById(id: string) {
		return this.database.query(`
        UPDATE users
        SET last_active_at = NOW()
        WHERE id = $1;
		`, [id])
			.then(data => data.rowCount ?? null)
			.catch((error) => {
				console.error(`${this.constructor.name}.updateLastActiveAtById(): Error`, error)
				return null;
			});
	}

	public async createUser({username, email, password, firstName, lastName}: z.infer<typeof create_user_schema>) {
		const hashedPassword = await BCrypt.hashPassword(password);

		return this.database.query<{ id: string }>(`
                INSERT INTO users ("username", "email", "password", "first_name", "last_name")
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id;`
			, [username, email, hashedPassword, firstName, lastName])
			.then((data) => data.rows[0].id)
			.catch((error) => {
				console.error(`${this.constructor.name}.createUser(): Error`, error);
				return null
			});
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
			.then((data) => data.rowCount)
			.catch((error) => {
				console.error(`${this.constructor.name}.sendFriendRequest(): Error`, error);
				return null
			});
	}

	public async getUserById(id: string) {
		return this.database.query<I_UserSchema>(`
        SELECT *
        FROM users
        WHERE id = $1
		`, [id])
			.then((data) => data.rowCount ? data.rows[0] : null)
			.catch((error) => {
				throw new Error(`${this.constructor.name}.getUserById(): Error`, {cause: error})
			});
	}

	public async getUserByUsername(username: string) {
		return this.database.query<I_UserSchema>(`
        SELECT *
        FROM users
        WHERE username = $1
		`, [username])
			.then((data) => data.rowCount ? data.rows[0] : null)
			.catch((error) => {
				throw new Error(`${this.constructor.name}.getUserByUsername(): Error`, {cause: error})
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
          AND f_recipient.id IS NULL;
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
			.catch((error) => {
				console.error(`${this.constructor.name}.sendFriendRequest(): Error`, error);
				return null
			});
	}

}

type T_FriendRequestData = {
	id: string,
	first_name: string,
	last_name: string,
	picture: string,
	username: string,
	request_date: string,
	request_type: 'sent' | 'received'
}