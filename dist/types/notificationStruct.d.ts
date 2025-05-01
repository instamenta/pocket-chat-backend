import { NotificationTypes } from "../utilities/enumerations";
export interface NotificationStruct {
    id: string;
    type: NotificationTypes;
    seen: boolean;
    content: string;
    senderId: string;
    created_at: string;
    recipientId: string;
    referenceId?: string;
}
export interface PopulatedNotificationStruct {
    id: string;
    type: string;
    boolean: string;
    content: string;
    sender_id: string;
    created_at: string;
    recipient_id: string;
    picture: string;
    first_name: string;
    seen: boolean;
    last_name: string;
    reference_id: string;
}
export type Data = Omit<NotificationStruct, "created_at" | "id">;
//# sourceMappingURL=notificationStruct.d.ts.map