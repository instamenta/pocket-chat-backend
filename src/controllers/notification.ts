import {Request, Response} from "express";
import status_codes from '@instamenta/http-status-codes'
import NotificationRepository from "../repositories/notification";
import {notification_types} from "../utilities/enumerations";
import {BaseController} from "../base/controller.base";
import {Validate} from "../validators";
import * as T from '../types';

export default class NotificationController extends BaseController<NotificationRepository> {

	public createNotification(
		_request: Request<object, object, {
			recipient: string,
			type: notification_types,
			seen: boolean,
			content: string
		}>,
		response: Response
	) {
		try {
			response.status(status_codes.NOT_IMPLEMENTED).end();
		} catch (error) {
			this.errorHandler(error, response);
		}
	}

	public async listNotifications(
		request: Request<object, object, object, { filter?: 'all' | 'seen' | 'unseen' }>,
		response: Response<T.Notification.Populated[]>
	) {
		try {
			const notifications = await this.repository.listNotifications(
				Validate.uuid.parse(request.user.id),
				request.query.filter
			);

			response.status(status_codes.OK).json(notifications);
		} catch (error) {
			this.errorHandler(error, response);
		}
	}

	public async markNotificationAsSeen(
		request: Request<{ id: string }>,
		response: Response<void>
	) {
		try {
			const messages = await this.repository.markNotificationAsSeen(
				Validate.uuid.parse(request.params.id),
			);

			if (!messages) {
				console.error(`${this.constructor.name}.markNotificationAsSeen(): Failed to update notification`);
				return response.status(status_codes.INTERNAL_SERVER_ERROR).end();
			}

			response.status(status_codes.OK).end();
		} catch (error) {
			this.errorHandler(error, response);
		}
	}

	public async markAllNotificationsAsSeen(
		request: Request,
		response: Response<void>
	) {
		try {
			const messages = await this.repository.markAllNotificationsAsSeen(
				Validate.uuid.parse(request.user.id),
			);

			if (!messages) {
				console.error(`${this.constructor.name}.markAllNotificationsAsSeen(): Failed to update notifications`, request.params);
				return response.status(status_codes.INTERNAL_SERVER_ERROR).end();
			}

			response.status(status_codes.OK).end();
		} catch (error) {
			this.errorHandler(error, response);
		}
	}

}
