import {Client} from "pg";
import {E_LiveStates, T_LiveMessagePopulated, T_LivePopulated} from "../types/live";

export default class LiveRepository {
	constructor(private readonly database: Client) {
	}

	private errorHandler(error: unknown | Error, method: string): never {
		throw new Error(`${this.constructor.name}.${method}(): Error`, {cause: error});
	}

	async createLive(userId: string) {
		return this.database.query<{ id: string }>(`

                INSERT INTO "lives" (user_id)
                VALUES ($1)
                RETURNING id
			`,
			[userId]
		).then((data) => data.rows[0].id)

			.catch(e => this.errorHandler(e, 'createLive'));
	}

	async listLives(userId: string) {
		const query = `SELECT u.id      AS user_id,
                          u.picture as user_picture,
                          u.username,
                          u.first_name,
                          u.last_name,
                          l.state,
                          l.created_at,
                          l.id
                   FROM "lives" l
                            JOIN users u ON u.id = l.user_id
                   WHERE l.state = 'active'
                     AND u.id != $1
                   ORDER BY l.created_at DESC
		`;
		try {
			const result = await this.database.query<T_LivePopulated>(query, [userId]);
			return result.rows;
		} catch (error) {
			this.errorHandler(error, 'listLives');
		}
	}

	async getLiveById(liveId: string) {
		const query = `SELECT id, state
                   FROM "lives"
                   WHERE state = 'active'
                     AND id = $1`;
		try {
			const result = await this.database.query(query, [liveId]);
			return !!result.rowCount;
		} catch (error) {
			this.errorHandler(error, 'getLiveById');
		}
	}

	async updateLiveState(userId: string, state: E_LiveStates) {
		const query = `
        UPDATE "lives"
        SET state = $1
        WHERE user_id = $2
		`;
		try {
			const result = await this.database.query(query, [state, userId]);
			return !!result.rowCount;
		} catch (error) {
			this.errorHandler(error, 'updateLiveState');
		}
	}

	async createLiveMessage(liveId: string, userId: string, content: string) {
		return this.database.query<{ id: string }>(`

                INSERT INTO "lives_messages" ( live_id, sender_id, content)
                VALUES ($1, $2, $3)
                RETURNING id
			`,
			[liveId, userId, content]
		).then((data) => data.rows[0].id)

			.catch(e => this.errorHandler(e, 'createLiveMessage'));
	}

	async listLiveMessages(liveId: string) {
		const query = `SELECT u.id      AS user_id,
                          u.picture as user_picture,
                          u.username,
                          u.first_name,
                          u.last_name,
                          lm.content,
                          lm.created_at,
                          lm.id
                   FROM "lives_messages" lm
                            JOIN users u ON u.id = lm.sender_id
                   ORDER BY lm.created_at DESC
		`;
		try {
			const result = await this.database.query<T_LiveMessagePopulated>(query, [liveId]);
			return result.rows;
		} catch (error) {
			this.errorHandler(error, 'listLiveMessages');
		}
	}
}
