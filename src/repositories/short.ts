import {Client} from "pg";
import {I_ShortPopulated} from "../types/short";

export default class ShortRepository {
	constructor(private readonly database: Client) {
	}

	private errorHandler(error: unknown | Error, method: string): never {
		throw new Error(`${this.constructor.name}.${method}(): Error`, {cause: error});
	}

	async createShort(userId: string, videoUrl: string, description: string) {
		return this.database.query<{ id: string }>(`

                INSERT INTO "shorts" (user_id, video_url, description)
                VALUES ($1, $2, $3)
                RETURNING id
			`,
			[userId, videoUrl, description]
		).then((data) => data.rows[0].id)

			.catch(e => this.errorHandler(e, 'createShort'));
	}

	async listShorts(userId: string) {
		const query = `SELECT u.id      AS user_id,
                          u.picture as user_picture,
                          u.username,
                          u.first_name,
                          u.last_name,
                          s.video_url,
                          s.description,
                          s.created_at,
                          s.id
                   FROM shorts s
                            JOIN users u ON u.id = s.user_id
                   ORDER BY s.created_at DESC`;
		// --                    WHERE s.user_id != $1
		try {
			const result = await this.database.query<I_ShortPopulated>(query, [
				// userId
			]);
			console.log(result.rows);
			return result.rows;
		} catch (error) {
			this.errorHandler(error, 'listShorts');
		}
	}

	async listShortsById(userId: string) {
		const query = `SELECT u.id      AS user_id,
                          u.picture as user_picture,
                          u.username,
                          u.first_name,
                          u.last_name,
                          s.video_url,
                          s.description,
                          s.created_at,
                          s.id
                   FROM shorts s
                            JOIN users u ON u.id = s.user_id
                   WHERE s.user_id = $1
                   ORDER BY s.created_at DESC`;
		try {
			const result = await this.database.query<I_ShortPopulated>(query, [userId]);
			return result.rows;
		} catch (error) {
			this.errorHandler(error, 'listShortsById');
		}
	}
}
