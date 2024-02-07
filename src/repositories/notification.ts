import {Client} from "pg";
import {I_Notifications} from "../types";

export default class NotificationRepository {
	constructor(private readonly database: Client) {
	}

	private errorHandler(error: unknown | Error, method: string): never {
		throw new Error(`${this.constructor.name}.${method}(): Error`, {cause: error});
	}

	async createNotification({sender_id, recipient_id, type, seen, content}: Omit<I_Notifications, 'created_at' | 'id'>
	) {
		return this.database.query<{ id: string }>(`

                INSERT INTO "notifications" (sender_id, recipient_id, type, seen, content)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id
			`,
			[sender_id, recipient_id, type, seen, content]
		).then((data) => data.rows[0].id)

			.catch(e => this.errorHandler(e, 'createNotification'));
	}

	async listNotifications(recipientId: string, filter: 'all' | 'seen' | 'unseen' = 'all'): Promise<I_Notifications[]> {
		let query: string;

		switch (filter) {
			case "all":
				query = `SELECT *
                 FROM notifications
                 WHERE recipient_id = $1
                 ORDER BY created_at DESC `
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

		return this.database.query<I_Notifications>(
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