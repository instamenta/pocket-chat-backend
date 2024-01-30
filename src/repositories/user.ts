import {create_user_schema} from "../validators";
import {I_UserSchema} from "../types/user";
import BCrypt from "../utilities/bcrypt";
import {Client} from 'pg';
import z from 'zod';

type T_getByUsername = {
	id: string,
	username: string,
	password: string,
	email: string,
	picture: string,
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
        SELECT id, username, password, email, username
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

}