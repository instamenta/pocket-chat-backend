import { z } from "zod";
import * as Validate from "../validators";
import { MessageStatusUnion } from "./unions";
export type CreateMessageRequestStruct = z.infer<typeof Validate.createMessage>;
export interface MessageStruct {
    id: string;
    edited: boolean;
    content: string;
    sender_id: string;
    created_at: string;
    updated_at: string;
    recipient_id: string;
    friendship_id: string;
    images?: string[];
    files?: string[];
    message_status: MessageStatusUnion;
}
export interface ConversationsStruct {
    created_at: string;
    first_name: string;
    last_message: string;
    last_name: string;
    message_id: string;
    user_id: string;
    username: string;
    picture: string;
}
//# sourceMappingURL=messageStruct.d.ts.map