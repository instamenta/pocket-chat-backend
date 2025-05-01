import { Request, Response } from "express";
import { FriendRepository } from "../repositories";
import { BaseController } from "../base/controller.base";
import * as T from "../types";
export declare class FriendController extends BaseController<FriendRepository> {
    sendFriendRequest(request: Request<{
        id: string;
    }>, response: Response<{
        friendshipId: string;
    }>): Promise<Response<{
        friendshipId: string;
    }, Record<string, any>> | undefined>;
    listFriendRequestsOnly(request: Request, response: Response<T.Friend.FriendshipRequestStruct[]>): Promise<void>;
    listFriendSentOnly(request: Request, response: Response<T.Friend.FriendshipRequestStruct[]>): Promise<void>;
    listFriendRequests(request: Request, response: Response<T.Friend.FriendshipRequestStruct[]>): Promise<void>;
    listFriendRecommendations(request: Request, response: Response<{
        id: string;
        first_name: string;
        picture: string;
        username: string;
    }[]>): Promise<void>;
    acceptFriendRequest(request: Request<{
        id: string;
    }>, response: Response<void>): Promise<Response<void, Record<string, any>> | undefined>;
    deleteFriendRequest(request: Request<{
        id: string;
    }>, response: Response<{
        friendshipId: boolean;
    }>): Promise<Response<{
        friendshipId: boolean;
    }, Record<string, any>> | undefined>;
    declineFriendRequest(request: Request<{
        id: string;
    }>, response: Response<void>): Promise<Response<void, Record<string, any>> | undefined>;
    getFriendsCountByUserId(request: Request<{
        id: string;
    }>, response: Response<{
        count: number;
    }>): Promise<Response<{
        count: number;
    }, Record<string, any>> | undefined>;
    listMutualFriendsByUsers(request: Request<{
        id: string;
    }>, response: Response<T.Friend.MutualFriendshipStruct[]>): Promise<void>;
    listFriendsByUserId(request: Request<{
        id: string;
    }>, response: Response<T.User.UserSchemaStruct[]>): Promise<void>;
    listFriendsByUsername(request: Request<{
        username: string;
    }>, response: Response<T.User.UserSchemaStruct[]>): Promise<void>;
    getBySenderAndRecipient(request: Request<{
        sender: string;
        recipient: string;
    }>, response: Response<T.Friend.FriendshipStruct>): Promise<void>;
    getById(request: Request<{
        id: string;
    }>, response: Response<T.Friend.FriendshipStruct>): Promise<void>;
}
//# sourceMappingURL=friend.d.ts.map