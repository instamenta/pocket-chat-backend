import statusCodes from "@instamenta/http-status-codes";
import { FriendRepository } from "../repositories";
import { BaseController } from "../base/controller.base";
import * as Validate from "../validators";
import type { Request, Response } from "express";
import type { FriendshipRequestStruct, FriendshipStruct, MutualFriendshipStruct } from "../types/friend";
import type { UserSchemaStruct } from "../types/user";

export class FriendController extends BaseController<FriendRepository> {
  public async sendFriendRequest(
    request: Request<{ id: string }>,
    response: Response<{ friendshipId: string }>,
  ) {
    this.log.log("sendFriendRequest");
    try {
      const { sender, recipient } = Validate.senderRecipient.parse({
        sender: request.user.id,
        recipient: request.params.id,
      });

      const status = await this.repository.sendFriendRequest(sender, recipient);

      if (!status) {
        this.log.error({
          e: `Failed to send friend request`,
          m: `sender: ${sender}, recipient: ${recipient}`,
        });
        return response.status(statusCodes.BAD_GATEWAY).end();
      }

      response.status(statusCodes.OK).json({ friendshipId: status });
    } catch (error) {
      this.errorHandler(error, response);
    }
  }

  public async listFriendRequestsOnly(
    request: Request,
    response: Response<FriendshipRequestStruct[]>,
  ) {
    this.log.log("listFriendRequestsOnly");
    try {
      const id = Validate.uuid.parse(request.user.id);

      const list = await this.repository.listFriendRequestsOnly(id);

      response.status(statusCodes.OK).json(list);
    } catch (error) {
      this.errorHandler(error, response);
    }
  }

  public async listFriendSentOnly(
    request: Request,
    response: Response<FriendshipRequestStruct[]>,
  ) {
    this.log.log("listFriendSentOnly");
    try {
      const id = Validate.uuid.parse(request.user.id);

      const list = await this.repository.listFriendSentOnly(id);

      response.status(statusCodes.OK).json(list);
    } catch (error) {
      this.errorHandler(error, response);
    }
  }

  public async listFriendRequests(
    request: Request,
    response: Response<FriendshipRequestStruct[]>,
  ) {
    this.log.log("listFriendRequests");
    try {
      const id = Validate.uuid.parse(request.user.id);

      const friendRequests = await this.repository.listFriendRequests(id);

      response.status(statusCodes.OK).json(friendRequests);
    } catch (error) {
      this.errorHandler(error, response);
    }
  }

  public async listFriendRecommendations(
    request: Request,
    response: Response<
      {
        id: string;
        first_name: string;
        picture: string;
        username: string;
      }[]
    >,
  ) {
    this.log.log("listFriendRecommendations");
    try {
      const id = Validate.uuid.parse(request.user.id);

      const recommendations =
        await this.repository.listFriendRecommendations(id);

      response.status(statusCodes.OK).json(recommendations);
    } catch (error) {
      this.errorHandler(error, response);
    }
  }

  public async acceptFriendRequest(
    request: Request<{ id: string }>,
    response: Response<void>,
  ) {
    this.log.log("acceptFriendRequest");
    try {
      const { sender, recipient } = Validate.senderRecipient.parse({
        sender: request.user.id,
        recipient: request.params.id,
      });

      const status = await this.repository.acceptFriendRequest(
        sender,
        recipient,
      );

      if (!status) {
        this.log.error({
          e: `Failed to accept friend request`,
          m: `sender: ${sender}, recipient: ${recipient}`,
        });
        return response.status(statusCodes.BAD_GATEWAY).end();
      }

      response.status(statusCodes.OK).end();
    } catch (error) {
      this.errorHandler(error, response);
    }
  }

  public async deleteFriendRequest(
    request: Request<{ id: string }>,
    response: Response<{ friendshipId: boolean }>,
  ) {
    this.log.log("deleteFriendRequest");
    try {
      const { sender, recipient } = Validate.senderRecipient.parse({
        sender: request.user.id,
        recipient: request.params.id,
      });

      const status = await this.repository.deleteFriendRequest(
        sender,
        recipient,
      );

      if (!status) {
        this.log.error({
          e: `Failed to delete friend request`,
          m: `sender: ${sender}, recipient: ${recipient}`,
        });
        return response.status(statusCodes.BAD_GATEWAY).end();
      }

      response.status(statusCodes.OK).json({ friendshipId: status });
    } catch (error) {
      this.errorHandler(error, response);
    }
  }

  public async declineFriendRequest(
    request: Request<{ id: string }>,
    response: Response<void>,
  ) {
    this.log.log("declineFriendRequest");
    try {
      const { sender, recipient } = Validate.senderRecipient.parse({
        sender: request.user.id,
        recipient: request.params.id,
      });

      const status = await this.repository.declineFriendRequest(
        sender,
        recipient,
      );

      if (!status) {
        this.log.error({
          e: `Failed to delete friend request`,
          m: `sender: ${sender}, recipient: ${recipient}`,
        });
        return response.status(statusCodes.BAD_GATEWAY).end();
      }

      response.status(statusCodes.OK).end();
    } catch (error) {
      this.errorHandler(error, response);
    }
  }

  public async getFriendsCountByUserId(
    request: Request<{ id: string }>,
    response: Response<{ count: number }>,
  ) {
    this.log.log("getFriendsCountByUserId");
    try {
      const id = Validate.uuid.parse(request.params.id);

      const count = await this.repository.getFriendsCountByUserId(id);
      if (!count) {
        this.log.error({ e: `Failed to get friends count`, m: id });
        return response.status(statusCodes.BAD_GATEWAY).end();
      }

      response.status(statusCodes.OK).json({ count });
    } catch (error) {
      this.errorHandler(error, response);
    }
  }

  public async listMutualFriendsByUsers(
    request: Request<{ id: string }>,
    response: Response<MutualFriendshipStruct[]>,
  ) {
    this.log.log("listMutualFriendsByUsers");
    try {
      const sender = Validate.uuid.parse(request.user.id);
      const recipient = Validate.uuid.parse(request.params.id);

      const friends = await this.repository.listMutualFriendsByUsers(
        sender,
        recipient,
      );

      response.status(statusCodes.OK).json(friends);
    } catch (error) {
      this.errorHandler(error, response);
    }
  }

  public async listFriendsByUserId(
    request: Request<{ id: string }>,
    response: Response<UserSchemaStruct[]>,
  ) {
    this.log.log("listFriendsByUserId");
    try {
      const id = Validate.uuid.parse(request.params.id);

      const friends = await this.repository.listFriendsByUserId(id);

      response.status(statusCodes.OK).json(friends);
    } catch (error) {
      this.errorHandler(error, response);
    }
  }

  public async listFriendsByUsername(
    request: Request<{ username: string }>,
    response: Response<UserSchemaStruct[]>,
  ) {
    this.log.log("listFriendsByUsername");
    try {
      const username = Validate.name.parse(request.params.username);

      const friends = await this.repository.listFriendsByUsername(username);

      response.status(statusCodes.OK).json(friends);
    } catch (error) {
      this.errorHandler(error, response);
    }
  }

  public async getBySenderAndRecipient(
    request: Request<{
      sender: string;
      recipient: string;
    }>,
    response: Response<FriendshipStruct>,
  ) {
    this.log.log("getBySenderAndRecipient");
    try {
      const sender = Validate.uuid.parse(request.params.sender);
      const recipient = Validate.uuid.parse(request.params.recipient);

      const friendship = await this.repository.getBySenderAndRecipient(
        sender,
        recipient,
      );

      response.status(statusCodes.OK).json(friendship);
    } catch (error) {
      this.errorHandler(error, response);
    }
  }

  public async getById(
    request: Request<{ id: string }>,
    response: Response<FriendshipStruct>,
  ) {
    this.log.log("getById");
    try {
      const friendshipId = Validate.uuid.parse(request.params.id);

      const friendship = await this.repository.getById(friendshipId);

      response.status(statusCodes.OK).json(friendship);
    } catch (error) {
      this.errorHandler(error, response);
    }
  }
}
