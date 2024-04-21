import {Request, Response} from "express";
import {uuid_schema} from "../validators";
import status_codes from '@instamenta/http-status-codes'
import NotificationRepository from "../repositories/notification";
import {I_PopulatedNotification} from "../types";
import {notification_types} from "../utilities/enumerations";
import ControllerBase from "../base/controller.base";

export default class NotificationController extends ControllerBase<NotificationRepository> {

	async createNotification(
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

	async listNotifications(
		r: Request<{}, {}, {}, { filter?: 'all' | 'seen' | 'unseen' }>,
		w: Response<I_PopulatedNotification[]>
	) {
		try {
			const notifications = await this.repository.listNotifications(
				uuid_schema.parse(r.user.id),
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

	async markNotificationAsSeen(
		r: Request<{ id: string }>,
		w: Response<void>
	) {
		try {
			const messages = await this.repository.markNotificationAsSeen(
				uuid_schema.parse(r.params.id),
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

	async markAllNotificationsAsSeen(
		r: Request,
		w: Response<void>
	) {
		try {
			const messages = await this.repository.markAllNotificationsAsSeen(
				uuid_schema.parse(r.user.id),
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
