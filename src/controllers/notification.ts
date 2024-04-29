import {Request, Response} from "express";
import status_codes from '@instamenta/http-status-codes'
import NotificationRepository from "../repositories/notification";
import {notification_types} from "../utilities/enumerations";
import BaseController from "../base/controller.base";
import Validate from "../validators";
import * as T from '../types';

export default class NotificationController extends BaseController<NotificationRepository> {

	public async createNotification(
		r: Request<{}, {}, {
			recipient: string,
			type: notification_types,
			seen: boolean,
			content: string
		}>,
		w: Response
	) {
		try {
			w.status(status_codes.NOT_IMPLEMENTED).end();
		} catch (error) {
			this.errorHandler(error, w);
		}
	}

	public async listNotifications(
		r: Request<{}, {}, {}, { filter?: 'all' | 'seen' | 'unseen' }>,
		w: Response<T.Notification.Populated[]>
	) {
		try {
			const notifications = await this.repository.listNotifications(
				Validate.uuid.parse(r.user.id),
				r.query.filter
			);

			if (!notifications) {
				console.error(`${this.constructor.name}.listNotifications(): Failed to get messages`);
				return w.status(status_codes.INTERNAL_SERVER_ERROR).end();
			}

			w.status(status_codes.OK).json(notifications);
		} catch (error) {
			this.errorHandler(error, w);
		}
	}

	public async markNotificationAsSeen(
		r: Request<{ id: string }>,
		w: Response<void>
	) {
		try {
			const messages = await this.repository.markNotificationAsSeen(
				Validate.uuid.parse(r.params.id),
			);

			if (!messages) {
				console.error(`${this.constructor.name}.markNotificationAsSeen(): Failed to update notification`);
				return w.status(status_codes.INTERNAL_SERVER_ERROR).end();
			}

			w.status(status_codes.OK).end();
		} catch (error) {
			this.errorHandler(error, w);
		}
	}

	public async markAllNotificationsAsSeen(
		r: Request,
		w: Response<void>
	) {
		try {
			const messages = await this.repository.markAllNotificationsAsSeen(
				Validate.uuid.parse(r.user.id),
			);

			if (!messages) {
				console.error(`${this.constructor.name}.markAllNotificationsAsSeen(): Failed to update notifications`, r.params);
				return w.status(status_codes.INTERNAL_SERVER_ERROR).end();
			}

			w.status(status_codes.OK).end();
		} catch (error) {
			this.errorHandler(error, w);
		}
	}

}
