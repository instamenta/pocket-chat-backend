import {T_CreateMessage, I_Message} from "../types/message";
import {Client} from "pg";

export default class MessageRepository {
	constructor(private readonly database: Client) {
	}

	private errorHandler(error: unknown | Error, method: string): never {
		throw new Error(`${this.constructor.name}.${method}(): Error`, {cause: error});
	}

	public createMessage({sender, recipient, content, friendship}: T_CreateMessage) {
		return this.database.query<{ id: string }>(`

                INSERT INTO "messages" (sender_id, recipient_id, friendship_id, content)
                VALUES ($1, $2, $3, $4)
                RETURNING id
			`,
			[sender, recipient, friendship, content]
		).then((data) => data.rows[0].id)

			.catch(e => this.errorHandler(e, 'createMessage'));
	}

	public getMessagesByFriendshipId(friendship_id: string, skip: number = 0, limit: number = 20) {
		return this.database.query<I_Message>(`

                SELECT *
                FROM messages
                WHERE friendship_id = $1
                ORDER BY created_at DESC
                OFFSET $2 LIMIT $3
			`,
			[friendship_id, skip, limit]
		).then(data => data.rows)

			.catch(e => this.errorHandler(e, 'getMessagesByFriendshipId'));
	}

	public getMessagesByUsers(user1: string, user2: string, skip: number = 0, limit: number = 20) {
		console.log(skip, limit)

		return this.database.query<I_Message>(`

                SELECT *
                FROM messages
                WHERE sender_id = $1 AND recipient_id = $2
                   OR sender_id = $2 AND recipient_id = $1
                ORDER BY created_at DESC
                OFFSET $3 LIMIT $4
			`,
			[user1, user2, skip, limit]
		).then(data => data.rows)

			.catch(e => this.errorHandler(e, 'getMessagesByUsers'));
	}

	public updateMessageStatus(id: string, status: string) {
		return this.database.query(`

                UPDATE messages
                SET message_status = $2,
                    updated_at     = NOW()
                WHERE id = $1;
			`,
			[id, status]
		).then(data => data.rowCount ?? null)

			.catch(e => this.errorHandler(e, 'updateMessageStatus'));
	}

}