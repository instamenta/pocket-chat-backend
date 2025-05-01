import { BaseRepository } from "../base/repository.base";
import * as T from "../types";
export declare class MessageRepository extends BaseRepository {
    createMessage({ sender, recipient, content, friendship, images, files, }: T.Message.CreateMessageRequestStruct): Promise<string>;
    getMessagesByFriendshipId(friendshipId: string, skip?: number, limit?: number): Promise<T.Message.MessageStruct[]>;
    getMessagesByUsers(user1: string, user2: string, skip?: number, limit?: number): Promise<T.Message.MessageStruct[]>;
    updateMessageStatus(id: string, status: string): Promise<number | null>;
    listConversations(userId: string): Promise<T.Message.ConversationsStruct[]>;
}
//# sourceMappingURL=message.d.ts.map