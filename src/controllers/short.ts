import { Request, Response } from "express";
import statusCodes from "@instamenta/http-status-codes";
import { ShortRepository } from "../repositories/short";
import { z } from "zod";
import { notification_types } from "../utilities/enumerations";
import { Notificator } from "../utilities/notificator";
import { BaseController } from "../base/controller.base";
import * as Validate from "../validators";
import * as T from "../types";
import VLogger from "@instamenta/vlogger";

export class ShortController extends BaseController<ShortRepository> {
  constructor(
    repository: ShortRepository,
    logger: VLogger,
    private readonly notificator: Notificator,
  ) {
    super(repository, logger);
  }

  public async createShort(
    request: Request<object, object, { videoUrl: string; description: string }>,
    response: Response<{ id: string }>,
  ) {
    this.log.log("createShort");
    try {
      const { userId, videoUrl, description } = Validate.create_story.parse({
        userId: request.user.id,
        videoUrl: request.body.videoUrl,
        description: request.body.description,
      });

      const shortId = await this.repository.createShort(
        userId,
        videoUrl,
        description,
      );

      if (!shortId) {
        this.log.error({ e: `Failed to send message` });
        return response.status(statusCodes.INTERNAL_SERVER_ERROR).end();
      }

      response.status(statusCodes.CREATED).json({ id: shortId });
    } catch (error) {
      this.errorHandler(error, response);
    }
  }

  public async listShorts(
    request: Request,
    response: Response<T.Short.Populated[]>,
  ) {
    this.log.log("listShorts");
    try {
      const userId = Validate.uuid.parse(request.user.id);

      const shorts = await this.repository.listShorts(userId);

      response.status(statusCodes.OK).json(shorts);
    } catch (error) {
      this.errorHandler(error, response);
    }
  }

  public async listShortsByUsername(
    request: Request<{ id: string }>,
    response: Response<T.Short.Populated[]>,
  ) {
    this.log.log("listShortsByUsername");
    try {
      const userId = Validate.uuid.parse(request.params.id);

      const stories = await this.repository.listShortsById(userId);

      response.status(statusCodes.OK).json(stories);
    } catch (error) {
      this.errorHandler(error, response);
    }
  }

  public async getShortById(
    request: Request<{ shortId: string }>,
    response: Response<T.Short.Populated>,
  ) {
    this.log.log("getShortById");
    try {
      const shortId = Validate.uuid.parse(request.params.shortId);

      const short = await this.repository.getShortById(shortId);

      if (!short) {
        this.log.error({ e: `Not found`, m: shortId });
        return response.status(statusCodes.NOT_FOUND).end();
      }

      response.status(statusCodes.OK).json(short);
    } catch (error) {
      this.errorHandler(error, response);
    }
  }

  public async likeShort(
    request: Request<{ id: string }>,
    response: Response<void>,
  ) {
    this.log.log("likeShort");
    try {
      const shortId = Validate.uuid.parse(request.params.id);
      const userId = Validate.uuid.parse(request.user.id);

      const isLiked = await this.repository.likeShort(shortId, userId);

      response.status(statusCodes.OK).end();

      if (!isLiked) {
        this.log.info({ m: "Unliking short" });
        return;
      } else {
        this.log.info({ m: "Liking short" });
      }

      await this.notificator
        .handleNotification({
          type: notification_types.LIKE_SHORT,
          reference_id: shortId,
          recipient_id: "",
          sender_id: userId,
          content: "",
          seen: false,
        })
        .catch((error: unknown) => {
          this.log.error({ e: error });
        });
    } catch (error) {
      this.errorHandler(error, response);
    }
  }

  public async listCommentsByShort(
    request: Request<{ shortId: string }>,
    response: Response<T.Comment.Populated[]>,
  ) {
    this.log.log("listCommentsByShort");
    try {
      const shortId = Validate.uuid.parse(request.params.shortId);
      const userId = Validate.uuid.parse(request.user.id);

      const comments = await this.repository.listCommentsByShortId(
        shortId,
        userId,
      );

      response.status(statusCodes.OK).json(comments);
    } catch (error) {
      this.errorHandler(error, response);
    }
  }

  public async createShortComment(
    request: Request<{ shortId: string }, object, { content: string }>,
    response: Response<T.Comment.Comment>,
  ) {
    this.log.log("createShortComment");
    try {
      const shortId = Validate.uuid.parse(request.params.shortId);
      const userId = Validate.uuid.parse(request.user.id);
      const content = z.string().min(1).parse(request.body.content);

      const comment = await this.repository.createShortComment(
        shortId,
        userId,
        content,
      );

      response.status(statusCodes.CREATED).json(comment);

      await this.notificator
        .handleNotification({
          type: notification_types.COMMENT_SHORT,
          reference_id: shortId,
          recipient_id: "",
          sender_id: userId,
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

  public async deleteShortComment(
    request: Request<{ commentId: string }>,
    response: Response<void>,
  ) {
    this.log.log("deleteShortComment");
    try {
      const commentId = Validate.uuid.parse(request.params.commentId);
      const userId = Validate.uuid.parse(request.user.id);

      await this.repository.deleteShortComment(commentId, userId);

      response.status(statusCodes.NO_CONTENT).end();
    } catch (error) {
      this.errorHandler(error, response);
    }
  }

  public async likeShortComment(
    request: Request<{ commentId: string }>,
    response: Response<void>,
  ) {
    this.log.log("likeShortComment");
    try {
      const commentId = Validate.uuid.parse(request.params.commentId);
      const userId = Validate.uuid.parse(request.user.id);

      await this.repository.likeShortComment(commentId, userId);

      response.status(statusCodes.OK).end();

      await this.notificator
        .handleNotification({
          type: notification_types.LIKE_SHORT_COMMENT,
          reference_id: commentId,
          recipient_id: "",
          sender_id: userId,
          content: "",
          seen: false,
        })
        .catch((error: unknown) => {
          this.log.error({ e: error });
        });
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
        this.log.error({ m: `Not found ${commentId}`, e: "" });
        return response.status(statusCodes.NOT_FOUND).end();
      }

      response.status(statusCodes.OK).json(comment);
    } catch (error) {
      this.errorHandler(error, response);
    }
  }
}
