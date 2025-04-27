import { Request, Response } from "express";
import MessageRepository from "../repositories/message";
import BaseController from "../base/controller.base";
import * as T from '../types';
export default class MessageController extends BaseController<MessageRepository> {
    sendMessage(r: Request<object, object, {
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
    }, object, object, {
        skip?: string;
        limit?: string;
    }>, w: Response<T.Message.Message[]>): Promise<void>;
    listMessagesByUsers(r: Request<{
        user1: string;
        user2: string;
    }, object, object, {
        skip?: string;
        limit?: string;
    }>, w: Response<T.Message.Message[]>): Promise<void>;
    updateMessageStatus(r: Request<{
        id: string;
    }, object, {
        status: string;
    }>, w: Response<{
        success: boolean;
    }>): Promise<Response<{
        success: boolean;
    }, Record<string, any>> | undefined>;
    listConversations(r: Request, w: Response<T.Message.Conversations[]>): Promise<void>;
}
//# sourceMappingURL=message.d.ts.map