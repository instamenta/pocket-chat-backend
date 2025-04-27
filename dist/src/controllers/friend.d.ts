import { Request, Response } from "express";
import FriendRepository from "../repositories/friend";
import NotificationRepository from "../repositories/notification";
import BaseController from "../base/controller.base";
import * as T from '../types';
import VLogger from "@instamenta/vlogger";
export default class FriendController extends BaseController<FriendRepository> {
    private readonly notification;
    constructor(repository: FriendRepository, logger: VLogger, notification: NotificationRepository);
    sendFriendRequest(r: Request<{
        id: string;
    }>, w: Response<{
        friendship_id: string;
    }>): Promise<Response<{
        friendship_id: string;
    }, Record<string, any>> | undefined>;
    listFriendRequestsOnly(r: Request, w: Response<T.Friend.RequestData[]>): Promise<Response<T.Friend.RequestData[], Record<string, any>> | undefined>;
    listFriendSentOnly(r: Request, w: Response<T.Friend.RequestData[]>): Promise<Response<T.Friend.RequestData[], Record<string, any>> | undefined>;
    listFriendRequests(r: Request, w: Response<T.Friend.RequestData[]>): Promise<Response<T.Friend.RequestData[], Record<string, any>> | undefined>;
    listFriendRecommendations(r: Request, w: Response<{
        id: string;
        first_name: string;
        picture: string;
        username: string;
    }[]>): Promise<Response<{
        id: string;
        first_name: string;
        picture: string;
        username: string;
    }[], Record<string, any>> | undefined>;
    acceptFriendRequest(r: Request<{
        id: string;
    }>, w: Response<void>): Promise<Response<void, Record<string, any>> | undefined>;
    deleteFriendRequest(r: Request<{
        id: string;
    }>, w: Response<{
        friendship_id: boolean;
    }>): Promise<Response<{
        friendship_id: boolean;
    }, Record<string, any>> | undefined>;
    declineFriendRequest(r: Request<{
        id: string;
    }>, w: Response<void>): Promise<Response<void, Record<string, any>> | undefined>;
    getFriendsCountByUserId(r: Request<{
        id: string;
    }>, w: Response<{
        count: number;
    }>): Promise<Response<{
        count: number;
    }, Record<string, any>> | undefined>;
    getFriendsByUserIdAndSender(r: Request<{
        id: string;
    }>, w: Response): Promise<Response<any, Record<string, any>> | undefined>;
    listMutualFriendsByUsers(r: Request<{
        id: string;
    }>, w: Response<T.Friend.Mutual[]>): Promise<Response<T.Friend.Mutual[], Record<string, any>> | undefined>;
    listFriendsByUserId(r: Request<{
        id: string;
    }>, w: Response<T.User.Schema[]>): Promise<Response<T.User.Schema[], Record<string, any>> | undefined>;
    listFriendsByUsername(r: Request<{
        username: string;
    }>, w: Response<T.User.Schema[]>): Promise<Response<T.User.Schema[], Record<string, any>> | undefined>;
    getBySenderAndRecipient(r: Request<{
        sender: string;
        recipient: string;
    }>, w: Response<T.Friend.Friendship>): Promise<Response<T.Friend.Friendship, Record<string, any>> | undefined>;
    getById(r: Request<{
        id: string;
    }>, w: Response<T.Friend.Friendship>): Promise<Response<T.Friend.Friendship, Record<string, any>> | undefined>;
}
//# sourceMappingURL=friend.d.ts.map