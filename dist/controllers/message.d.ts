import { Request, Response } from "express";
import MessageRepository from "../repositories/message";
import { BaseController } from "../base/controller.base";
import * as T from '../types';
export default class MessageController extends BaseController<MessageRepository> {
    sendMessage(request: Request<object, object, {
        recipient: string;
        content: string;
        friendship: string;
        images?: string[];
        files?: string[];
    }>, response: Response<{
        id: string;
    }>): Promise<Response<{
        id: string;
    }, Record<string, any>> | undefined>;
    listMessagesByFriendship(request: Request<{
        friendshipId: string;
    }, object, object, {
        skip?: string;
        limit?: string;
    }>, response: Response<T.Message.Message[]>): Promise<void>;
    listMessagesByUsers(request: Request<{
        user1: string;
        user2: string;
    }, object, object, {
        skip?: string;
        limit?: string;
    }>, response: Response<T.Message.Message[]>): Promise<void>;
    updateMessageStatus(request: Request<{
        id: string;
    }, object, {
        status: string;
    }>, response: Response<{
        success: boolean;
    }>): Promise<Response<{
        success: boolean;
    }, Record<string, any>> | undefined>;
    listConversations(request: Request, response: Response<T.Message.Conversations[]>): Promise<void>;
}
//# sourceMappingURL=message.d.ts.map