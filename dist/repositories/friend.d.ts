import { BaseRepository } from "../base/repository.base";
import * as T from "../types";
export declare class FriendRepository extends BaseRepository {
    sendFriendRequest(sender: string, recipient: string): Promise<string>;
    deleteFriendRequest(sender: string, recipient: string): Promise<boolean>;
    declineFriendRequest(sender: string, recipient: string): Promise<boolean>;
    listFriendRecommendations(id: string): Promise<{
        id: string;
        first_name: string;
        picture: string;
        username: string;
    }[]>;
    acceptFriendRequest(sender: string, recipient: string): Promise<boolean>;
    listMutualFriendsByUsers(user1: string, sender: string): Promise<T.Friend.MutualFriendshipStruct[]>;
    getFriendsCountByUserId(id: string): Promise<number>;
    listFriendsByUserId(id: string): Promise<T.User.UserSchemaStruct[]>;
    listFriendsByUsername(username: string): Promise<T.User.UserSchemaStruct[]>;
    listFriendRequests(id: string): Promise<T.Friend.FriendshipRequestStruct[]>;
    listFriendRequestsOnly(id: string): Promise<T.Friend.FriendshipRequestStruct[]>;
    listFriendSentOnly(id: string): Promise<T.Friend.FriendshipRequestStruct[]>;
    getBySenderAndRecipient(sender: string, recipient: string): Promise<T.Friend.FriendshipStruct>;
    getById(id: string): Promise<T.Friend.FriendshipStruct>;
}
//# sourceMappingURL=friend.d.ts.map