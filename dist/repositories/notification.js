"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const repository_base_1 = require("../base/repository.base");
class NotificationRepository extends repository_base_1.BaseRepository {
    async createNotification({ sender_id, recipient_id, type, seen, content, reference_id = '' }) {
        return this.database.query(`
                INSERT INTO "notifications" (sender_id, recipient_id, type, seen, content, reference_id)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id
			`, [sender_id, recipient_id, type, seen, content, reference_id]).then((data) => data.rows[0].id)
            .catch((error) => this.errorHandler(error, 'createNotification'));
    }
    async listNotifications(recipientId, filter = 'all') {
        let query;
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
                 ORDER BY n.created_at DESC `;
                break;
            case "unseen":
                query = `SELECT *
                 FROM notifications
                 WHERE recipient_id = $1
                   AND seen = false
                 ORDER BY created_at DESC `;
                break;
            case "seen":
                query = `SELECT *
                 FROM notifications
                 WHERE recipient_id = $1
                   AND seen = true
                 ORDER BY created_at DESC `;
                break;
        }
        return this.database.query(query, [recipientId]).then(data => data.rows)
            .catch((error) => this.errorHandler(error, 'getNotifications'));
    }
    async markNotificationAsSeen(id) {
        return this.database.query(`
                UPDATE notifications
                SET seen = true
                WHERE id = $1
			`, [id]).then(data => data.rowCount ?? null)
            .catch((error) => this.errorHandler(error, 'markNotificationAsSeen'));
    }
    async markAllNotificationsAsSeen(recipientId) {
        return this.database.query(`
                UPDATE notifications
                SET seen = true
                WHERE recipient_id = $1
			`, [recipientId]).then(data => data.rowCount ?? null)
            .catch((error) => this.errorHandler(error, 'markNotificationAsSeen'));
    }
    async getNotificationByReferenceId(referenceId) {
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
            const data = await this.database.query(query, [referenceId]);
            return data.rowCount ? data.rows[0] : null;
        }
        catch (error) {
            this.errorHandler(error, 'getNotificationByReferenceId');
        }
    }
    async getNotificationBySenderAndRecipient(senderId, recipientId, type) {
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
            const data = await this.database.query(query, [senderId, recipientId, type]);
            return data.rowCount ? data.rows[0] : null;
        }
        catch (error) {
            this.errorHandler(error, 'getNotificationBySenderAndRecipient');
        }
    }
    async updateNotification(id, content, seen, type, senderId) {
        const query = `UPDATE notifications
                   SET content    = $2,
                       created_at = now(),
                       seen       = $3,
                       type       = $4,
                       sender_id  = $5
                   WHERE id = $1`;
        try {
            await this.database.query(query, [id, content, seen, type, senderId]);
        }
        catch (error) {
            this.errorHandler(error, 'getNotificationByReferenceId');
        }
    }
}
exports.default = NotificationRepository;
