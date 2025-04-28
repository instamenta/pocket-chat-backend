import { NotificationTypes } from "../utilities/enumerations";
import * as T from "./index";
export interface Notification {
    id: string;
    type: NotificationTypes;
    seen: boolean;
    content: string;
    senderId: string;
    created_at: string;
    recipientId: string;
    referenceId?: string;
}
export interface Populated {
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
export type Data = Omit<T.Notification.Notification, "created_at" | "id">;
//# sourceMappingURL=notification.d.ts.map