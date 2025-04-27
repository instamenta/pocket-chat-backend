import { Request, Response } from "express";
import MessageRepository from "../repositories/message";
import BaseController from "../base/controller.base";
import * as T from '../types';
export default class MessageController extends BaseController<MessageRepository> {
    sendMessage(r: Request<{}, {}, {
        recipient: string;
        content: string;
        friendship: string;
        images?: string[];
        files?: string[];
    }>, w: Response<{
        id: string;
    }>): Promise<Response<{
        id: string;
    }, Record<string, any>> | undefined>;
    listMessagesByFriendship(r: Request<{
        friendshipId: string;
    }, {}, {}, {
        skip?: string;
        limit?: string;
    }>, w: Response<T.Message.Message[]>): Promise<Response<T.Message.Message[], Record<string, any>> | undefined>;
    listMessagesByUsers(r: Request<{
        user1: string;
        user2: string;
    }, {}, {}, {
        skip?: string;
        limit?: string;
    }>, w: Response<T.Message.Message[]>): Promise<Response<T.Message.Message[], Record<string, any>> | undefined>;
    updateMessageStatus(r: Request<{
        id: string;
    }, {}, {
        status: string;
    }>, w: Response<{
        success: boolean;
    }>): Promise<Response<{
        success: boolean;
    }, Record<string, any>> | undefined>;
    listConversations(r: Request, w: Response<T.Message.Conversations[]>): Promise<Response<T.Message.Conversations[], Record<string, any>> | undefined>;
}
//# sourceMappingURL=message.d.ts.map