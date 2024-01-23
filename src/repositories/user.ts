import BCrypt from "../utilities/bcrypt";
import z from 'zod';
import {create_user_schema} from "../validators";
import {Client} from 'pg';

type T_getByUsername = {
	id: string,
	username: string,
	password: string,
	email: string
}

export default class UserRepository {
	constructor(private readonly database: Client) {
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
				console.error(`${this.constructor.name}.getByUsername(): Error`, error)
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
}