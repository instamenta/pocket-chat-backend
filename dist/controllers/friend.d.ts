import { Request, Response } from "express";
import FriendRepository from "../repositories/friend";
import { BaseController } from "../base/controller.base";
import * as T from '../types';
export default class FriendController extends BaseController<FriendRepository> {
    sendFriendRequest(request: Request<{
        id: string;
    }>, response: Response<{
        friendship_id: string;
    }>): Promise<Response<{
        friendship_id: string;
    }, Record<string, any>> | undefined>;
    listFriendRequestsOnly(request: Request, response: Response<T.Friend.RequestData[]>): Promise<void>;
    listFriendSentOnly(request: Request, response: Response<T.Friend.RequestData[]>): Promise<void>;
    listFriendRequests(request: Request, response: Response<T.Friend.RequestData[]>): Promise<void>;
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
        friendship_id: boolean;
    }>): Promise<Response<{
        friendship_id: boolean;
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
    }>, response: Response<T.Friend.Mutual[]>): Promise<void>;
    listFriendsByUserId(request: Request<{
        id: string;
    }>, response: Response<T.User.Schema[]>): Promise<void>;
    listFriendsByUsername(request: Request<{
        username: string;
    }>, response: Response<T.User.Schema[]>): Promise<void>;
    getBySenderAndRecipient(request: Request<{
        sender: string;
        recipient: string;
    }>, response: Response<T.Friend.Friendship>): Promise<void>;
    getById(request: Request<{
        id: string;
    }>, response: Response<T.Friend.Friendship>): Promise<void>;
}
//# sourceMappingURL=friend.d.ts.map