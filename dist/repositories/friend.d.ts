import { BaseRepository } from "../base/repository.base";
import * as T from '../types';
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
    listMutualFriendsByUsers(user1: string, sender: string): Promise<T.Friend.Mutual[]>;
    getFriendsCountByUserId(id: string): Promise<number>;
    listFriendsByUserId(id: string): Promise<T.User.Schema[]>;
    listFriendsByUsername(username: string): Promise<T.User.Schema[]>;
    listFriendRequests(id: string): Promise<T.Friend.RequestData[]>;
    listFriendRequestsOnly(id: string): Promise<T.Friend.RequestData[]>;
    listFriendSentOnly(id: string): Promise<T.Friend.RequestData[]>;
    getBySenderAndRecipient(sender: string, recipient: string): Promise<T.Friend.Friendship>;
    getById(id: string): Promise<T.Friend.Friendship>;
}
//# sourceMappingURL=friend.d.ts.map