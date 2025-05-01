import {
  NotificationRepository,
  PublicationRepository,
  CommentRepository,
  ShortRepository,
  StoryRepository,
} from "../repositories";
import { NotificationTypes } from "./enumerations";
import { NotImplementedError } from "@instamenta/vanilla-utility-pack";
import * as T from "../types";
import VLogger, { IVlog } from "@instamenta/vlogger";

export class Notificator {
  private readonly log: IVlog;

  public constructor(
    private readonly repository: NotificationRepository,
    private readonly publication: PublicationRepository,
    private readonly comment: CommentRepository,
    private readonly short: ShortRepository,
    private readonly story: StoryRepository,
    logger: VLogger,
  ) {
    this.log = logger.getVlogger(this.constructor.name);
  }

  public async handleNotification(data: T.Notification.Data) {
    this.log.info({
      f: "handleNotification",
      m: "Creating notification of type",
    });

    switch (data.type) {
      case NotificationTypes.LIKE:
        await this.#handleLikeNotification(data);
        break;
      case NotificationTypes.MESSAGE:
        await this.#handleMessageNotification(data);
        break;
      case NotificationTypes.COMMENT:
        await this.#handleCommentNotification(data);
        break;
      case NotificationTypes.LIKE_COMMENT:
        await this.#handleLikeCommentNotification(data);
        break;
      //* Short Handlers
      case NotificationTypes.LIKE_SHORT:
        await this.#handleLikeShortNotification(data);
        break;
      case NotificationTypes.COMMENT_SHORT:
        await this.#handleCommentShortNotification(data);
        break;
      case NotificationTypes.LIKE_SHORT_COMMENT:
        await this.#handleLikeShortCommentNotification(data);
        break;
      //* Story Handlers
      case NotificationTypes.LIKE_STORY:
        await this.#handleLikeStoryNotification(data);
        break;
      case NotificationTypes.COMMENT_STORY:
        await this.#handleCommentStoryNotification(data);
        break;
      case NotificationTypes.LIKE_STORY_COMMENT:
        await this.#handleLikeStoryCommentNotification(data);
        break;
      case NotificationTypes.CALL:
      case NotificationTypes.LIVE:
        throw new NotImplementedError(
          `TODO: Notification handler for type ${String(data.type)} is not implemented`,
        );
    }
  }

  /**
   ** Like Publication
   */
  async #handleLikeNotification(data: T.Notification.Data) {
    if (!data.referenceId) {
      this.log.error({ e: data, m: "No reference id for like notification" });
      return;
    }

    const [publication, notification] = await Promise.all([
      this.publication.getPublicationById(data.referenceId),
      this.repository.getNotificationByReferenceId(data.referenceId),
    ]);

    if (!publication) {
      this.log.error({
        f: "#handleLikeNotification",
        m: "Publication not found",
        e: data,
      });
      return;
    }
    data.content = publication.likesCount.toString();
    data.recipientId = publication.publisherId;

    if (notification) {
      await this.repository.updateNotification(
        notification.id,
        data.content,
        data.seen,
        data.type,
        data.senderId,
      );
    } else {
      await this.repository.createNotification(data);
    }
  }

  /**
   ** Chat Message
   */
  async #handleMessageNotification(data: T.Notification.Data) {
    const notification =
      await this.repository.getNotificationBySenderAndRecipient(
        data.senderId,
        data.recipientId,
        data.type,
      );

    if (notification) {
      await this.repository.updateNotification(
        notification.id,
        data.content,
        data.seen,
        data.type,
        data.senderId,
      );
    } else {
      await this.repository.createNotification(data);
    }
  }

  /**
   ** Comment Publication
   */
  async #handleCommentNotification(data: T.Notification.Data) {
    if (!data.referenceId) {
      this.log.error({
        e: data,
        m: "No reference id for comment notification",
      });
      return;
    }

    const [publication, notification] = await Promise.all([
      this.publication.getPublicationById(data.referenceId),
      this.repository.getNotificationByReferenceId(data.referenceId),
    ]);

    if (!publication) {
      this.log.error({
        f: "#handleCommentNotification",
        m: "Publication not found",
        e: data,
      });
      return;
    }

    data.recipientId = publication.publisherId;

    if (notification) {
      await this.repository.updateNotification(
        notification.id,
        data.content,
        data.seen,
        data.type,
        data.senderId,
      );
    } else {
      await this.repository.createNotification(data);
    }
  }

  /**
   ** Like Comment Publication
   */
  async #handleLikeCommentNotification(data: T.Notification.Data) {
    if (!data.referenceId) {
      this.log.error({
        e: data,
        m: "No reference id for comment notification",
      });
      return;
    }

    const [comment, notification] = await Promise.all([
      this.comment.getCommentById(data.referenceId),
      this.repository.getNotificationByReferenceId(data.referenceId),
    ]);

    if (!comment) {
      this.log.error({
        f: "#handleLikeCommentNotification",
        m: "Comment not found",
        e: data,
      });
      return;
    }

    data.content = comment.likes_count.toString();
    data.recipientId = comment.userId;

    if (notification) {
      await this.repository.updateNotification(
        notification.id,
        data.content,
        data.seen,
        data.type,
        data.senderId,
      );
    } else {
      await this.repository.createNotification(data);
    }
  }

  /**
   ** Like Short
   */
  async #handleLikeShortNotification(data: T.Notification.Data) {
    if (!data.referenceId) {
      this.log.error({ e: data, m: "No reference id for like short" });
      return;
    }

    const [short, notification] = await Promise.all([
      this.short.getShortById(data.referenceId),
      this.repository.getNotificationByReferenceId(data.referenceId),
    ]);

    if (!short) {
      this.log.error({
        f: "#handleLikeShortNotification",
        m: "Not found",
        e: data,
      });
      return;
    }

    data.content = short.likesCount.toString();
    data.recipientId = short.userId;

    if (notification) {
      await this.repository.updateNotification(
        notification.id,
        data.content,
        data.seen,
        data.type,
        data.senderId,
      );
    } else {
      await this.repository.createNotification(data);
    }
  }

  /**
   ** Comment Short
   */
  async #handleCommentShortNotification(data: T.Notification.Data) {
    if (!data.referenceId) {
      this.log.error({
        e: data,
        m: "No reference id for comment notification",
      });
      return;
    }

    const [short, notification] = await Promise.all([
      this.short.getShortById(data.referenceId),
      this.repository.getNotificationByReferenceId(data.referenceId),
    ]);

    if (!short) {
      this.log.error({
        f: "#handleCommentShortNotification",
        m: "Short not found",
        e: data,
      });
      return;
    }

    data.recipientId = short.userId;

    if (notification) {
      await this.repository.updateNotification(
        notification.id,
        data.content,
        data.seen,
        data.type,
        data.senderId,
      );
    } else {
      await this.repository.createNotification(data);
    }
  }

  /**
   ** Like Comment Short
   */
  async #handleLikeShortCommentNotification(data: T.Notification.Data) {
    if (!data.referenceId) {
      this.log.error({
        e: data,
        m: "No reference id for comment notification",
      });
      return;
    }

    const [comment, notification] = await Promise.all([
      this.short.getCommentById(data.referenceId),
      this.repository.getNotificationByReferenceId(data.referenceId),
    ]);

    if (!comment) {
      this.log.error({
        f: "#handleLikeShortCommentNotification",
        m: "Comment not found",
        e: data,
      });
      return;
    }

    data.content = comment.likes_count.toString();
    data.recipientId = comment.userId;

    if (notification) {
      await this.repository.updateNotification(
        notification.id,
        data.content,
        data.seen,
        data.type,
        data.senderId,
      );
    } else {
      await this.repository.createNotification(data);
    }
  }

  /**
   ** Like Story
   */
  async #handleLikeStoryNotification(data: T.Notification.Data) {
    if (!data.referenceId) {
      this.log.error({ e: data, m: "No reference id for like notification" });
      return;
    }

    const [story, notification] = await Promise.all([
      this.story.getStoryById(data.referenceId),
      this.repository.getNotificationByReferenceId(data.referenceId),
    ]);

    if (!story) {
      this.log.error({
        f: "#handleLikeStoryNotification",
        m: "Story not found",
        e: data,
      });
      return;
    }

    data.content = story.likes_count.toString();
    data.recipientId = story.user_id;

    if (notification) {
      await this.repository.updateNotification(
        notification.id,
        data.content,
        data.seen,
        data.type,
        data.senderId,
      );
    } else {
      await this.repository.createNotification(data);
    }
  }

  /**
   ** Comment Story
   */
  async #handleCommentStoryNotification(data: T.Notification.Data) {
    if (!data.referenceId) {
      this.log.error({
        e: data,
        m: "No reference id for comment notification",
      });
      return;
    }

    const [publication, notification] = await Promise.all([
      this.publication.getPublicationById(data.referenceId),
      this.repository.getNotificationByReferenceId(data.referenceId),
    ]);

    if (!publication) {
      this.log.error({
        f: "#handleCommentStoryNotification",
        m: "Publication not found",
        e: data,
      });
      return;
    }

    data.recipientId = publication.publisherId;

    if (notification) {
      await this.repository.updateNotification(
        notification.id,
        data.content,
        data.seen,
        data.type,
        data.senderId,
      );
    } else {
      await this.repository.createNotification(data);
    }
  }

  /**
   ** Like Comment Story
   */
  async #handleLikeStoryCommentNotification(data: T.Notification.Data) {
    if (!data.referenceId) {
      this.log.error({
        e: data,
        m: "No reference id for comment notification",
      });
      return;
    }

    const [comment, notification] = await Promise.all([
      this.story.getCommentById(data.referenceId),
      this.repository.getNotificationByReferenceId(data.referenceId),
    ]);

    if (!comment) {
      this.log.error({
        f: "#handleLikeStoryCommentNotification",
        m: "Comment not found",
        e: data,
      });
      return;
    }

    data.content = comment.likes_count.toString();
    data.recipientId = comment.user_id;

    if (notification) {
      await this.repository.updateNotification(
        notification.id,
        data.content,
        data.seen,
        data.type,
        data.senderId,
      );
    } else {
      await this.repository.createNotification(data);
    }
  }
}
