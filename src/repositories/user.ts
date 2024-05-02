import {I_HashingHandler} from "../utilities/bcrypt";
import z from 'zod';
import BaseRepository from "../base/repository.base";
import {Client} from "pg";
import * as T from '../types'
import Validate from "../validators";
import VLogger from "@instamenta/vlogger";

export default class UserRepository extends BaseRepository {
	constructor(
		client: Client,
		logger: VLogger,
		private readonly hashingHandler: I_HashingHandler
	) {
		super(client, logger);
	}

	public listUsers(skip: number = 0, limit: number = 0) {
		return this.database.query<Omit<T.User.Schema, 'updated_at'>>(`

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
			`,
			[skip, limit]
		).then(data => data.rows)

			.catch(e => this.errorHandler(e, 'listUsers'));
	}

	public getByUsername(username: string): Promise<T.User.GetByUsername | null> {
		return this.database.query<T.User.GetByUsername>(`

                SELECT id, username, password, email, username
                FROM users u
                WHERE u.username = $1
                LIMIT 1;
			`,
			[username]
		).then(data => data.rows.length ? data.rows[0] : null)

			.catch(e => this.errorHandler(e, 'getByUsername'));
	}

	public updateLastActiveAtById(id: string) {
		return this.database.query(`
                UPDATE users
                SET last_active_at = NOW()
                WHERE id = $1;
			`,
			[id]
		).then(data => data.rowCount ?? null)

			.catch(e => this.errorHandler(e, 'updateLastActiveAtById'));
	}

	public async createUser({username, email, password, firstName, lastName}: z.infer<typeof Validate.create_user>) {
		const hashedPassword = await this.hashingHandler.hashPassword(password);

		return this.database.query<{ id: string }>(`
                INSERT INTO users ("username", "email", "password", "first_name", "last_name")
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id;`
			,
			[username, email, hashedPassword, firstName, lastName]
		).then(data => data.rows[0].id)

			.catch(e => this.errorHandler(e, 'createUser'));
	}

	public getUserById(id: string) {
		return this.database.query<T.User.Schema>(`
                SELECT *
                FROM users
                WHERE id = $1
			`,
			[id]
		).then(data => data.rowCount ? data.rows[0] : null)

			.catch(e => this.errorHandler(e, 'getUserById'));
	}

	public getUserByUsername(username: string) {
		return this.database.query<T.User.Schema>(`
                SELECT *
                FROM users
                WHERE username = $1
			`,
			[username]
		).then(data => data.rowCount ? data.rows[0] : null)

			.catch(e => this.errorHandler(e, 'getUserByUsername'));
	}


	public updateProfilePicture(id: string, pictureUrl: string) {
		return this.database.query<T.User.Schema>(`
                UPDATE "users"
                SET picture = $2
                WHERE id = $1
                RETURNING *
			`,
			[id, pictureUrl]
		).then(data => data.rows.length ? data.rows[0] : null)

			.catch(e => this.errorHandler(e, 'updateProfilePicture'));
	}

	public updateBio(id: string, bio: string) {
		return this.database.query<T.User.Schema>(`
                UPDATE "users"
                SET bio = $2
                WHERE id = $1
                RETURNING *
			`,
			[id, bio]
		).then(data => data.rows.length ? data.rows[0] : null)
			.catch(e => this.errorHandler(e, 'updateProfilePicture'));
	}

	public updateProfilePublicInformation(
		id: string,
		{username, email, firstName, lastName}: { username?: string; email?: string; firstName?: string; lastName?: string }
	) {
		const fields = [];
		const values = [id];

		if (username) {
			fields.push(`username = $${fields.length + 2}`);
			values.push(username);
		}
		if (email) {
			fields.push(`email = $${fields.length + 2}`);
			values.push(email);
		}
		if (firstName) {
			fields.push(`first_name = $${fields.length + 2}`);
			values.push(firstName);
		}
		if (lastName) {
			fields.push(`last_name = $${fields.length + 2}`);
			values.push(lastName);
		}

		return this.database.query<T.User.Schema>(`
                UPDATE "users"
                SET ${fields.join(', ')}
                WHERE id = $1
                RETURNING *
			`,
			values
		).then(data => data.rows.length ? data.rows[0] : null)

			.catch(e => this.errorHandler(e, 'updateProfilePublicInformation'));
	}


}