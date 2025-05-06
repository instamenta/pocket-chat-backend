import { BaseRepository } from "../base/repository.base";
import { FriendshipRequestStruct, FriendshipStruct, MutualFriendshipStruct } from "../types/friend";
import { UserSchemaStruct } from "../types/user";
export declare class FriendRepository extends BaseRepository {
    sendFriendRequest(sender: string, recipient: string): Promise<string>;
    deleteFriendRequest(sender: string, recipient: string): Promise<boolean>;
    declineFriendRequest(sender: string, recipient: string): Promise<boolean>;
    listFriendRecommendations(id: string): Promise<Pick<UserSchemaStruct, "id" | "firstName" | "username" | "picture">[]>;
    acceptFriendRequest(sender: string, recipient: string): Promise<boolean>;
    listMutualFriendsByUsers(user1: string, sender: string): Promise<MutualFriendshipStruct[]>;
    getFriendsCountByUserId(id: string): Promise<number>;
    listFriendsByUserId(id: string): Promise<UserSchemaStruct[]>;
    listFriendsByUsername(username: string): Promise<UserSchemaStruct[]>;
    listFriendRequests(id: string): Promise<FriendshipRequestStruct[]>;
    listFriendRequestsOnly(id: string): Promise<FriendshipRequestStruct[]>;
    listFriendSentOnly(id: string): Promise<FriendshipRequestStruct[]>;
    getBySenderAndRecipient(sender: string, recipient: string): Promise<FriendshipStruct>;
    getById(id: string): Promise<FriendshipStruct>;
}
//# sourceMappingURL=friend.d.ts.map