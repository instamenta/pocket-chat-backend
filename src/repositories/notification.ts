import { NotificationTypes } from "../utilities";
import { BaseRepository } from "../base/repository.base";
import type { NotificationStruct, PopulatedNotificationStruct } from "../types/notification";

export class NotificationRepository extends BaseRepository {
  public async createNotification({
    senderId,
    recipientId,
    type,
    seen,
    content,
    referenceId = "",
  }: Omit<NotificationStruct, "createdAt" | "id">) {
    try {
      const data = await this.database.query<{ id: string }>(
        `
                INSERT INTO "notifications" (sender_id, recipient_id, type, seen, content, reference_id)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id
			`,
        [senderId, recipientId, type, seen, content, referenceId],
      );
      return data.rows[0].id;
    } catch (error) {
      this.errorHandler(error, "createNotification");
    }
  }

  public async listNotifications(
    recipientId: string,
    filter: "all" | "seen" | "unseen" = "all",
  ) {
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

    try {
      const data = await this.database.query<PopulatedNotificationStruct>(
        query,
        [recipientId],
      );

      return data.rows;
    } catch (error) {
      this.errorHandler(error, "getNotifications");
    }
  }

  public async markNotificationAsSeen(id: string): Promise<number | null> {
    try {
      const data = await this.database.query<object>(
        `
                UPDATE notifications
                SET seen = true
                WHERE id = $1
			`,
        [id],
      );

      return data.rowCount ?? null;
    } catch (error) {
      this.errorHandler(error, "markNotificationAsSeen");
    }
  }

  public async markAllNotificationsAsSeen(recipientId: string): Promise<number | null> {
    try {
      const data = await this.database.query<object>(
        `
                UPDATE notifications
                SET seen = true
                WHERE recipient_id = $1
			`,
        [recipientId],
      );
      return data.rowCount ?? null;
    } catch (error) {
      this.errorHandler(error, "markNotificationAsSeen");
    }
  }

  public async getNotificationByReferenceId(referenceId: string) {
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
      const data =
        await this.database.query<PopulatedNotificationStruct>(
          query,
          [referenceId],
        );
      return data.rowCount ? data.rows[0] : null;
    } catch (error) {
      this.errorHandler(error, "getNotificationByReferenceId");
    }
  }

  public async getNotificationBySenderAndRecipient(
    senderId: string,
    recipientId: string,
    type: NotificationTypes,
  ) {
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
      const data =
        await this.database.query<PopulatedNotificationStruct>(
          query,
          [senderId, recipientId, type],
        );
      return data.rowCount ? data.rows[0] : null;
    } catch (error) {
      this.errorHandler(error, "getNotificationBySenderAndRecipient");
    }
  }

  public async updateNotification(
    id: string,
    content: string,
    seen: boolean,
    type: NotificationTypes,
    senderId: string,
  ) {
    const query = `UPDATE notifications
                   SET content    = $2,
                       created_at = now(),
                       seen       = $3,
                       type       = $4,
                       sender_id  = $5
                   WHERE id = $1`;
    try {
      await this.database.query<object>(query, [id, content, seen, type, senderId]);
    } catch (error) {
      this.errorHandler(error, "getNotificationByReferenceId");
    }
  }
}
