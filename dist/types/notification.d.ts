import { NotificationTypes } from "../utilities/enumerations";
export interface NotificationStruct {
    id: string;
    type: NotificationTypes;
    seen: boolean;
    content: string;
    senderId: string;
    createdAt: string;
    recipientId: string;
    referenceId?: string;
}
export interface PopulatedNotificationStruct {
    id: string;
    type: string;
    boolean: string;
    content: string;
    senderId: string;
    createdAt: string;
    recipientId: string;
    picture: string;
    firstName: string;
    seen: boolean;
    lastName: string;
    referenceId: string;
}
export type NotificationData = Omit<NotificationStruct, "createdAt" | "id">;
//# sourceMappingURL=notification.d.ts.map