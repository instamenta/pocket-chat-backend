import { NotificationTypes } from "../utilities/enumerations";
import { BaseRepository } from "../base/repository.base";
import * as T from "../types";
export declare class NotificationRepository extends BaseRepository {
    createNotification({ senderId, recipientId, type, seen, content, referenceId, }: Omit<T.Notification.Notification, "created_at" | "id">): Promise<string>;
    listNotifications(recipientId: string, filter?: "all" | "seen" | "unseen"): Promise<T.Notification.Populated[]>;
    markNotificationAsSeen(id: string): Promise<number | null>;
    markAllNotificationsAsSeen(recipientId: string): Promise<number | null>;
    getNotificationByReferenceId(referenceId: string): Promise<T.Notification.Populated | null>;
    getNotificationBySenderAndRecipient(senderId: string, recipientId: string, type: NotificationTypes): Promise<T.Notification.Populated | null>;
    updateNotification(id: string, content: string, seen: boolean, type: NotificationTypes, senderId: string): Promise<void>;
}
//# sourceMappingURL=notification.d.ts.map