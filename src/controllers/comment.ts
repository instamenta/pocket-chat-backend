import { Request, Response } from "express";
import { CommentRepository } from "../repositories";
import statusCodes from "@instamenta/http-status-codes";
import { z } from "zod";
import { NotificationTypes } from "../utilities/enumerations";
import { Notificator } from "../utilities/notificator";
import { BaseController } from "../base/controller.base";
import * as Validate from "../validators";
import * as T from "../types";
import VLogger from "@instamenta/vlogger";

export class CommentController extends BaseController<CommentRepository> {
  public constructor(
    repository: CommentRepository,
    logger: VLogger,
    private readonly notificator: Notificator,
  ) {
    super(repository, logger);
  }

  public async listByPublication(
    request: Request<{ publicationId: string }>,
    response: Response<T.Comment.Populated[]>,
  ) {
    this.log.log("listByPublication");
    try {
      const publicationId = Validate.uuid.parse(request.params.publicationId);
      const userId = Validate.uuid.parse(request.user.id);

      const comments = await this.repository.listCommentsByPublication(
        publicationId,
        userId,
      );

      response.status(statusCodes.OK).json(comments);
    } catch (error) {
      this.errorHandler(error, response);
    }
  }

  public async create(
    request: Request<{ publicationId: string }, object, { content: string }>,
    response: Response<T.Comment.Comment>,
  ) {
    this.log.log("create");
    try {
      const publicationId = Validate.uuid.parse(request.params.publicationId);
      const userId = Validate.uuid.parse(request.user.id);
      const content = z.string().min(1).parse(request.body.content);

      const comment = await this.repository.createComment(
        publicationId,
        userId,
        content,
      );

      response.status(statusCodes.CREATED).json(comment);

      await this.notificator
        .handleNotification({
          type: NotificationTypes.COMMENT,
          referenceId: publicationId,
          recipientId: "",
          senderId: userId,
          content: content,
          seen: false,
        })
        .catch((error: unknown) => {
          this.log.error({ e: error });
        });
    } catch (error) {
      this.errorHandler(error, response);
    }
  }

  public async delete(
    request: Request<{ commentId: string }>,
    response: Response<void>,
  ) {
    this.log.log("delete");
    try {
      const commentId = Validate.uuid.parse(request.params.commentId);
      const userId = Validate.uuid.parse(request.user.id);

      await this.repository.deleteComment(commentId, userId);

      response.status(statusCodes.NO_CONTENT).end();
    } catch (error) {
      this.errorHandler(error, response);
    }
  }

  public async like(
    request: Request<{ commentId: string }>,
    response: Response<void>,
  ) {
    this.log.log("like");
    try {
      const commentId = Validate.uuid.parse(request.params.commentId);
      const userId = Validate.uuid.parse(request.user.id);

      await this.repository.likeComment(commentId, userId);

      await this.notificator
        .handleNotification({
          type: NotificationTypes.LIKE_COMMENT,
          referenceId: commentId,
          recipientId: "",
          senderId: userId,
          content: "",
          seen: false,
        })
        .catch((error: unknown) => {
          this.log.error({ e: error });
        });

      response.status(statusCodes.OK).end();
    } catch (error) {
      this.errorHandler(error, response);
    }
  }

  public async getCommentById(
    request: Request<{ commentId: string }>,
    response: Response<
      T.Comment.Comment & {
        likes_count: number;
      }
    >,
  ) {
    this.log.log("getCommentById");
    try {
      const commentId = Validate.uuid.parse(request.params.commentId);

      const comment = await this.repository.getCommentById(commentId);

      if (!comment) {
        this.log.error({ e: `Not found`, m: commentId });
        return response.status(statusCodes.NOT_FOUND).end();
      }

      response.status(statusCodes.OK).json(comment);
    } catch (error) {
      this.errorHandler(error, response);
    }
  }
}
