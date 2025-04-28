import { Request, Response } from "express";
import statusCodes from "@instamenta/http-status-codes";
import { MessageRepository } from "../repositories/message";
import { BaseController } from "../base/controller.base";
import * as Validate from "../validators";
import * as T from "../types";

export class MessageController extends BaseController<MessageRepository> {
  public async sendMessage(
    request: Request<
      object,
      object,
      {
        recipient: string;
        content: string;
        friendship: string;
        images?: string[];
        files?: string[];
      }
    >,
    response: Response<{ id: string }>,
  ) {
    try {
      const message = Validate.createMessage.parse({
        sender: request.user.id,
        recipient: request.body.recipient,
        content: request.body.content,
        friendship: request.body.friendship,
        images: request.body.images,
        files: request.body.files,
      });

      const messageId = await this.repository.createMessage(message);

      if (!messageId) {
        this.log.error({
          m: `Failed to send message`,
          f: "sendMessage",
          e: {},
        });
        return response.status(statusCodes.INTERNAL_SERVER_ERROR).end();
      }

      response.status(statusCodes.CREATED).json({ id: messageId });
    } catch (error) {
      this.errorHandler(error, response);
    }
  }

  public async listMessagesByFriendship(
    request: Request<
      { friendshipId: string },
      object,
      object,
      { skip?: string; limit?: string }
    >,
    response: Response<T.Message.Message[]>,
  ) {
    try {
      const messages = await this.repository.getMessagesByFriendshipId(
        Validate.uuid.parse(request.params.friendshipId),
        Number.parseInt(request.query.skip ?? "0", 10),
        Number.parseInt(request.query.limit ?? "20", 10),
      );

      response.status(statusCodes.OK).json(messages);
    } catch (error) {
      this.errorHandler(error, response);
    }
  }

  public async listMessagesByUsers(
    request: Request<
      { user1: string; user2: string },
      object,
      object,
      { skip?: string; limit?: string }
    >,
    response: Response<T.Message.Message[]>,
  ) {
    try {
      const messages = await this.repository.getMessagesByUsers(
        Validate.uuid.parse(request.params.user1),
        Validate.uuid.parse(request.params.user2),
        Number.parseInt(request.query.skip ?? "0", 10),
        Number.parseInt(request.query.limit ?? "20", 10),
      );

      response.status(statusCodes.OK).json(messages);
    } catch (error) {
      this.errorHandler(error, response);
    }
  }

  public async updateMessageStatus(
    request: Request<{ id: string }, object, { status: string }>,
    response: Response<{ success: boolean }>,
  ) {
    try {
      const result = await this.repository.updateMessageStatus(
        Validate.uuid.parse(request.params.id),
        request.body.status,
      );

      if (!result) {
        this.log.error({
          m: `Failed to update message status`,
          f: "updateMessageStatus",
          e: {},
        });
        return response.status(statusCodes.INTERNAL_SERVER_ERROR).end();
      }

      response.status(statusCodes.OK).json({ success: true });
    } catch (error) {
      this.errorHandler(error, response);
    }
  }

  public async listConversations(
    request: Request,
    response: Response<T.Message.Conversations[]>,
  ) {
    try {
      const userId = Validate.uuid.parse(request.user.id);

      const conversations = await this.repository.listConversations(userId);

      response.status(statusCodes.OK).json(conversations);
    } catch (error) {
      this.errorHandler(error, response);
    }
  }
}
