import { BaseRepository } from "../base/repository.base";
import * as T from "../types";
export declare class MessageRepository extends BaseRepository {
    createMessage({ sender, recipient, content, friendship, images, files, }: T.Message.Create): Promise<string>;
    getMessagesByFriendshipId(friendshipId: string, skip?: number, limit?: number): Promise<T.Message.Message[]>;
    getMessagesByUsers(user1: string, user2: string, skip?: number, limit?: number): Promise<T.Message.Message[]>;
    updateMessageStatus(id: string, status: string): Promise<number | null>;
    listConversations(userId: string): Promise<T.Message.Conversations[]>;
}
//# sourceMappingURL=message.d.ts.map