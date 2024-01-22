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
		const data = await this.database.query<T_getByUsername>(`
        SELECT id, username, password, email
        FROM users u
        WHERE u.username = $1
        LIMIT 1;
		`, [username]);

		console.log(data);

		return data.rows.length ? data.rows[0] : null;
	}

	public async updateLastActiveAtById(id: string) {
		const data = await this.database.query(`
        UPDATE users
        SET last_active_at = NOW()
        WHERE id = $1;
		`, [id]);

		console.log(data);

		return data.rowCount;
	}

	public async createUser({username, email, password, firstName, lastName}: z.infer<typeof create_user_schema>) {

		const hashedPassword = await BCrypt.hashPassword(password)

		try {
			const data = await this.database.query<{ id: string }>(`
                  INSERT INTO users ("username", "email", "password", "first_name", "last_name")
                  VALUES ($1, $2, $3, $4, $5)
                  RETURNING id;`
				, [username, email, hashedPassword, firstName, lastName])

			console.log(data)

			return data.rows[0].id;
		} catch (error) {
			console.error(error);
			return null;
		}
	}

	public async sendFriendRequest(sender: string, recipient: string) {
		const data = await this.database.query(`
					DO $$ 
					DECLARE
					    friend_id UUID;
					BEGIN
					    INSERT INTO friendships (sender_id, recipient_id)
					    VALUES ($1, $2)
					    RETURNING id INTO friend_id;
					
					    UPDATE users
					    SET friend_requests_send = friend_requests_send || ARRAY[friend_id]
					    WHERE id = $1;
					
					    UPDATE users
					    SET friend_requests_pending = friend_requests_pending || ARRAY[friend_id]
					    WHERE id = $2;
					END $$;
		`, [sender, recipient])
	}
}