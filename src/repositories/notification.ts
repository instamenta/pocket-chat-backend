import {notification_types} from "../utilities/enumerations";
import BaseRepository from "../base/repository.base";
import * as T from '../types';

export default class NotificationRepository extends BaseRepository {

	async createNotification({
		                         sender_id,
		                         recipient_id,
		                         type,
		                         seen,
		                         content,
		                         reference_id = ''
	                         }: Omit<T.Notification.Notification, 'created_at' | 'id'>
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
                        u.last_name,
                        n.reference_id
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

		return this.database.query<T.Notification.Populated>(
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

	async getNotificationByReferenceId(referenceId: string) {
		const query = `SELECT n.id,
                          n.type,
                          n.seen,
                          n.content,
                          n.sender_id,
                          n.created_at,
                          n.recipient_id,
                          u.picture,
                          u.first_name,
                          u.last_name,
                          n.reference_id
                   FROM notifications n
                            JOIN "users" u ON n.recipient_id = u.id
                   WHERE n.reference_id = $1
		`;
		try {
			const data = await this.database.query<T.Notification.Populated>(query, [referenceId]);
			return data.rowCount ? data.rows[0] : null;
		} catch (error) {
			this.errorHandler(error, 'getNotificationByReferenceId')
		}
	}

	async getNotificationBySenderAndRecipient(senderId: string, recipientId: string, type: notification_types) {
		const query = `SELECT n.id,
                          n.type,
                          n.seen,
                          n.content,
                          n.sender_id,
                          n.created_at,
                          n.recipient_id,
                          u.picture,
                          u.first_name,
                          u.last_name,
                          n.reference_id
                   FROM notifications n
                            JOIN "users" u ON n.recipient_id = u.id
                   WHERE n.sender_id = $1
                     AND n.reference_id = $2
                     AND n.type = $3`;
		try {
			const data = await this.database.query<T.Notification.Populated>(query, [senderId, recipientId, type]);
			return data.rowCount ? data.rows[0] : null;
		} catch (error) {
			this.errorHandler(error, 'getNotificationBySenderAndRecipient')
		}
	}

	async updateNotification(id: string, content: string, seen: boolean, type: notification_types, senderId: string) {
		const query = `UPDATE notifications
                   SET content    = $2,
                       created_at = now(),
                       seen       = $3,
                       type       = $4,
                       sender_id  = $5
                   WHERE id = $1`;
		try {
			await this.database.query(query, [id, content, seen, type, senderId]);
		} catch (error) {
			this.errorHandler(error, 'getNotificationByReferenceId')
		}
	}
}