import { notification_types } from "../utilities/enumerations";
import { BaseRepository } from "../base/repository.base";
import * as T from '../types';
export default class NotificationRepository extends BaseRepository {
    createNotification({ sender_id, recipient_id, type, seen, content, reference_id }: Omit<T.Notification.Notification, 'created_at' | 'id'>): Promise<string>;
    listNotifications(recipientId: string, filter?: 'all' | 'seen' | 'unseen'): Promise<T.Notification.Populated[]>;
    markNotificationAsSeen(id: string): Promise<number | null>;
    markAllNotificationsAsSeen(recipientId: string): Promise<number | null>;
    getNotificationByReferenceId(referenceId: string): Promise<T.Notification.Populated | null>;
    getNotificationBySenderAndRecipient(senderId: string, recipientId: string, type: notification_types): Promise<T.Notification.Populated | null>;
    updateNotification(id: string, content: string, seen: boolean, type: notification_types, senderId: string): Promise<void>;
}
//# sourceMappingURL=notification.d.ts.map