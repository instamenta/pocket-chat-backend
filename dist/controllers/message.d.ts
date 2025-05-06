import { Request, Response } from "express";
import { MessageRepository } from "../repositories";
import { BaseController } from "../base/controller.base";
import { ConversationsStruct, MessageStruct } from "../types/message";
export declare class MessageController extends BaseController<MessageRepository> {
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
    }>, response: Response<MessageStruct[]>): Promise<void>;
    listMessagesByUsers(request: Request<{
        user1: string;
        user2: string;
    }, object, object, {
        skip?: string;
        limit?: string;
    }>, response: Response<MessageStruct[]>): Promise<void>;
    updateMessageStatus(request: Request<{
        id: string;
    }, object, {
        status: string;
    }>, response: Response<{
        success: boolean;
    }>): Promise<Response<{
        success: boolean;
    }, Record<string, any>> | undefined>;
    listConversations(request: Request, response: Response<ConversationsStruct[]>): Promise<void>;
}
//# sourceMappingURL=message.d.ts.map