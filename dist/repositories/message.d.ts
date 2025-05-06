import { BaseRepository } from "../base/repository.base";
import type { ConversationsStruct, CreateMessageRequestStruct, MessageStruct } from "../types/message";
export declare class MessageRepository extends BaseRepository {
    createMessage({ sender, recipient, content, friendship, images, files, }: CreateMessageRequestStruct): Promise<string>;
    getMessagesByFriendshipId(friendshipId: string, skip?: number, limit?: number): Promise<MessageStruct[]>;
    getMessagesByUsers(user1: string, user2: string, skip?: number, limit?: number): Promise<MessageStruct[]>;
    updateMessageStatus(id: string, status: string): Promise<number | null>;
    listConversations(userId: string): Promise<ConversationsStruct[]>;
}
//# sourceMappingURL=message.d.ts.map