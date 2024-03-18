import {Client} from "pg";
import {I_Notifications, I_PopulatedNotification} from "../types";

export default class NotificationRepository {
	constructor(private readonly database: Client) {
	}

	private errorHandler(error: unknown | Error, method: string): never {
		throw new Error(`${this.constructor.name}.${method}(): Error`, {cause: error});
	}

	async createNotification({
		                         sender_id,
		                         recipient_id,
		                         type,
		                         seen,
		                         content,
		                         reference_id = ''
	                         }: Omit<I_Notifications, 'created_at' | 'id'>
	) {
		return this.database.query<{ id: string }>(`

                INSERT INTO "notifications" (sender_id, recipient_id, type, seen, content, reference_id)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id
			`,
			[sender_id, recipient_id, type, seen, content, reference_id]
		).then((data) => data.rows[0].id)

			.catch(e => this.errorHandler(e, 'createNotification'));
	}

	async listNotifications(recipientId: string, filter: 'all' | 'seen' | 'unseen' = 'all') {
		let query: string;

		switch (filter) {
			case "all":
				query = `SELECT n.id,
                        n.type,
                        n.seen,
                        n.content,
                        n.sender_id,
                        n.created_at,
                        n.recipient_id,
                        u.picture,
                        u.first_name,
                        u.last_name
                 FROM notifications n
                          JOIN "users" u ON n.recipient_id = u.id
                 WHERE n.recipient_id = $1
                 ORDER BY n.created_at DESC `
				break;
			case "unseen":
				query = `SELECT *
                 FROM notifications
                 WHERE recipient_id = $1
                   AND seen = false
                 ORDER BY created_at DESC `
				break;
			case "seen":
				query = `SELECT *
                 FROM notifications
                 WHERE recipient_id = $1
                   AND seen = true
                 ORDER BY created_at DESC `
				break;
			default:
				throw new Error(`Unknown filter type ${filter} ${recipientId}`);
		}

		return this.database.query<I_PopulatedNotification>(
			query,
			[recipientId]
		).then(data => data.rows)

			.catch(e => this.errorHandler(e, 'getNotifications'));
	}

	async markNotificationAsSeen(id: string) {
		return this.database.query(`

                UPDATE notifications
                SET seen = true
                WHERE id = $1
			`,
			[id]
		).then(data => data.rowCount ?? null)

			.catch(e => this.errorHandler(e, 'markNotificationAsSeen'));
	}

	async markAllNotificationsAsSeen(recipientId: string) {
		return this.database.query(`

                UPDATE notifications
                SET seen = true
                WHERE recipient_id = $1
			`,
			[recipientId]
		).then(data => data.rowCount ?? null)

			.catch(e => this.errorHandler(e, 'markNotificationAsSeen'));
	}
}