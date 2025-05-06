import { NotificationTypes } from "../utilities";
import { BaseRepository } from "../base/repository.base";
import type { NotificationStruct, PopulatedNotificationStruct } from "../types/notification";
export declare class NotificationRepository extends BaseRepository {
    createNotification({ senderId, recipientId, type, seen, content, referenceId, }: Omit<NotificationStruct, "createdAt" | "id">): Promise<string>;
    listNotifications(recipientId: string, filter?: "all" | "seen" | "unseen"): Promise<PopulatedNotificationStruct[]>;
    markNotificationAsSeen(id: string): Promise<number | null>;
    markAllNotificationsAsSeen(recipientId: string): Promise<number | null>;
    getNotificationByReferenceId(referenceId: string): Promise<PopulatedNotificationStruct | null>;
    getNotificationBySenderAndRecipient(senderId: string, recipientId: string, type: NotificationTypes): Promise<PopulatedNotificationStruct | null>;
    updateNotification(id: string, content: string, seen: boolean, type: NotificationTypes, senderId: string): Promise<void>;
}
//# sourceMappingURL=notification.d.ts.map