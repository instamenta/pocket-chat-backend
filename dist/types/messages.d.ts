import { z } from "zod";
import * as Validate from "../validators";
import { MessageStatusUnion } from "./unions";
export type CreateMessageRequestStruct = z.infer<typeof Validate.createMessage>;
export interface MessageStruct {
    id: string;
    edited: boolean;
    content: string;
    senderId: string;
    createdAt: string;
    updatedAt: string;
    recipientId: string;
    friendshipId: string;
    images?: string[];
    files?: string[];
    messageStatus: MessageStatusUnion;
}
export interface ConversationsStruct {
    createdAt: string;
    firstName: string;
    lastMessage: string;
    lastName: string;
    messageId: string;
    userId: string;
    username: string;
    picture: string;
}
//# sourceMappingURL=messages.d.ts.map