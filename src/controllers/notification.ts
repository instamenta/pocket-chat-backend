import { Request, Response } from "express";
import statusCodes from "@instamenta/http-status-codes";
import { NotificationRepository } from "../repositories/notification";
import { NotificationTypes } from "../utilities/enumerations";
import { BaseController } from "../base/controller.base";
import * as Validate from "../validators";
import * as T from "../types";

export class NotificationController extends BaseController<NotificationRepository> {
  public createNotification(
    _request: Request<
      object,
      object,
      {
        recipient: string;
        type: NotificationTypes;
        seen: boolean;
        content: string;
      }
    >,
    response: Response,
  ) {
    try {
      response.status(statusCodes.NOT_IMPLEMENTED).end();
    } catch (error) {
      this.errorHandler(error, response);
    }
  }

  public async listNotifications(
    request: Request<
      object,
      object,
      object,
      { filter?: "all" | "seen" | "unseen" }
    >,
    response: Response<T.Notification.Populated[]>,
  ) {
    try {
      const notifications = await this.repository.listNotifications(
        Validate.uuid.parse(request.user.id),
        request.query.filter,
      );

      response.status(statusCodes.OK).json(notifications);
    } catch (error) {
      this.errorHandler(error, response);
    }
  }

  public async markNotificationAsSeen(
    request: Request<{ id: string }>,
    response: Response<void>,
  ) {
    try {
      const messages = await this.repository.markNotificationAsSeen(
        Validate.uuid.parse(request.params.id),
      );

      if (!messages) {
        console.error(
          `${this.constructor.name}.markNotificationAsSeen(): Failed to update notification`,
        );
        return response.status(statusCodes.INTERNAL_SERVER_ERROR).end();
      }

      response.status(statusCodes.OK).end();
    } catch (error) {
      this.errorHandler(error, response);
    }
  }

  public async markAllNotificationsAsSeen(
    request: Request,
    response: Response<void>,
  ) {
    try {
      const messages = await this.repository.markAllNotificationsAsSeen(
        Validate.uuid.parse(request.user.id),
      );

      if (!messages) {
        console.error(
          `${this.constructor.name}.markAllNotificationsAsSeen(): Failed to update notifications`,
          request.params,
        );
        return response.status(statusCodes.INTERNAL_SERVER_ERROR).end();
      }

      response.status(statusCodes.OK).end();
    } catch (error) {
      this.errorHandler(error, response);
    }
  }
}
