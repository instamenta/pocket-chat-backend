import { Request, Response } from "express";
import statusCodes from "@instamenta/http-status-codes";
import { GroupRepository } from "../repositories/group";
import { BaseController } from "../base/controller.base";
import * as Validate from "../validators";
import * as T from "../types";

// TODO: Make post with percents based on all users engagement with post

export class GroupController extends BaseController<GroupRepository> {
  public async createGroup(
    request: Request<
      object,
      { id: string },
      { name: string; description: string; imageUrl: string }
    >,
    response: Response<{ id: string }>,
  ) {
    try {
      const { userId, name, description, imageUrl } =
        Validate.createGroup.parse({
          userId: request.user.id,
          name: request.body.name,
          description: request.body.description,
          imageUrl: request.body.imageUrl,
        });

      const groupId = await this.repository.createGroup(
        userId,
        name,
        description,
        imageUrl,
      );

      if (!groupId) {
        this.log.error({e: {}, f: 'createGroup', m: 'failed to create group'})
        return response.status(statusCodes.INTERNAL_SERVER_ERROR).end();
      }

      response.status(statusCodes.CREATED).json({ id: groupId });
    } catch (error) {
      this.errorHandler(error, response);
    }
  }

  public async removeGroup(
    request: Request<{ groupId: string }>,
    response: Response,
  ) {
    try {
      const userId = Validate.uuid.parse(request.user.id);
      const groupId = Validate.uuid.parse(request.params.groupId);

      const success = await this.repository.removeGroup(userId, groupId);

      if (!success) {
        this.log.error({e: {}, f: 'removeGroup', m: 'failed to remove group'})
        return response.status(statusCodes.INTERNAL_SERVER_ERROR).end();
      }

      response.status(statusCodes.CREATED).end();
    } catch (error) {
      this.errorHandler(error, response);
    }
  }

  public async listGroups(
    request: Request,
    response: Response<T.Group.Group[]>,
  ) {
    try {
      const userId = Validate.uuid.parse(request.user.id);

      const groups = await this.repository.listGroups(userId);

      response.status(statusCodes.OK).json(groups);
    } catch (error) {
      this.errorHandler(error, response);
    }
  }

  public async listGroupsByUser(
    request: Request<{ userId: string }>,
    response: Response<T.Group.Group[]>,
  ) {
    try {
      const userId = Validate.uuid.parse(request.params.userId);

      const groups = await this.repository.listGroupsByUser(userId);

      response.status(statusCodes.OK).json(groups);
    } catch (error) {
      this.errorHandler(error, response);
    }
  }

  public async getGroupById(
    request: Request<{ id: string }>,
    response: Response<T.Group.Group>,
  ) {
    try {
      const groupId = Validate.uuid.parse(request.params.id);

      const group = await this.repository.getGroupById(groupId);

      if (!group) {
        this.log.error({e: {}, f: 'getGroupById', m: 'failed to get group'})
        return response.status(statusCodes.INTERNAL_SERVER_ERROR).end();
      }

      response.status(statusCodes.OK).json(group);
    } catch (error) {
      this.errorHandler(error, response);
    }
  }

  public async joinGroup(request: Request<{ id: string }>, response: Response) {
    try {
      const groupId = Validate.uuid.parse(request.params.id);
      const userId = Validate.uuid.parse(request.user.id);

      const success = await this.repository.joinGroup(userId, groupId);

      if (!success) {
        this.log.error({e: {}, f: 'joinGroup', m: 'failed to join group'})
        return response.status(statusCodes.INTERNAL_SERVER_ERROR).end();
      }

      response.status(statusCodes.OK).end();
    } catch (error) {
      this.errorHandler(error, response);
    }
  }

  public async leaveGroup(
    request: Request<{ id: string }>,
    response: Response,
  ) {
    try {
      const groupId = Validate.uuid.parse(request.params.id);
      const userId = Validate.uuid.parse(request.user.id);

      const success = await this.repository.leaveGroup(userId, groupId);

      if (!success) {
        this.log.error({e: {}, f: 'leaveGroup', m: 'failed to leave group'})
        return response.status(statusCodes.INTERNAL_SERVER_ERROR).end();
      }

      response.status(statusCodes.OK).end();
    } catch (error) {
      this.errorHandler(error, response);
    }
  }

  public async changeRole(
    request: Request<
      { groupId: string; recipientId: string },
      object,
      { newRole: string }
    >,
    response: Response,
  ) {
    try {
      const groupId = Validate.uuid.parse(request.params.groupId);
      const senderId = Validate.uuid.parse(request.user.id);
      const recipientId = Validate.uuid.parse(request.params.recipientId);

      if (
        request.body.newRole !== "member" &&
        request.body.newRole !== "moderator"
      ) {
        throw new Error("Invalid Role");
      }

      const success = await this.repository.changeRole(
        groupId,
        senderId,
        recipientId,
        request.body.newRole,
      );

      if (!success) {
        this.log.error({e: {}, f: 'changeRole', m: 'failed to change role'})
        return response.status(statusCodes.INTERNAL_SERVER_ERROR).end();
      }

      response.status(statusCodes.OK).end();
    } catch (error) {
      this.errorHandler(error, response);
    }
  }

  public async removeMember(
    request: Request<{ groupId: string; recipientId: string }>,
    response: Response,
  ) {
    try {
      const groupId = Validate.uuid.parse(request.params.groupId);
      const senderId = Validate.uuid.parse(request.user.id);
      const recipientId = Validate.uuid.parse(request.params.recipientId);

      const success = await this.repository.removeMember(
        groupId,
        senderId,
        recipientId,
      );

      if (!success) {
        this.log.error({e: {}, f: 'removeMember', m: 'failed to remove member'})
        return response.status(statusCodes.INTERNAL_SERVER_ERROR).end();
      }

      response.status(statusCodes.OK).end();
    } catch (error) {
      this.errorHandler(error, response);
    }
  }

  public async getMembersByGroupId(
    request: Request<{ id: string }>,
    response: Response<T.Group.MemberPopulated[]>,
  ) {
    try {
      const groupId = Validate.uuid.parse(request.params.id);

      const members = await this.repository.getMembersByGroupId(groupId);

      response.status(statusCodes.OK).json(members);
    } catch (error) {
      this.errorHandler(error, response);
    }
  }

  public async createPublication(
    request: Request<
      object,
      { id: string },
      {
        description: string;
        images: string;
        publication_status: string;
        groupId: string;
      }
    >,
    response: Response<{ id: string }>,
  ) {
    try {
      const data = Validate.createPublication.parse({
        publisherId: Validate.uuid.parse(request.user.id),
        description: request.body.description,
        images: request.body.images,
        publicationStatus: request.body.publication_status,
      });

      const groupId = Validate.uuid.parse(request.body.groupId);

      const publicationId = await this.repository.createPublication({
        ...data,
        groupId,
      });

      response.status(statusCodes.CREATED).json({ id: publicationId });
    } catch (error) {
      this.errorHandler(error, response);
    }
  }

  public async listPublications(
    request: Request<{ groupId: string }>,
    response: Response<T.Publication.Publication[]>,
  ) {
    try {
      const groupId = Validate.uuid.parse(request.params.groupId);

      const publications = await this.repository.listPublications(groupId);

      response.status(statusCodes.OK).json(publications);
    } catch (error) {
      this.errorHandler(error, response);
    }
  }
}
