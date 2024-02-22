import {Request, Response} from "express";
import {create_notification_schema, uuid_schema} from "../validators";
import status_codes from '@instamenta/http-status-codes'
import {controllerErrorHandler} from "../utilities";
import NotificationRepository from "../repositories/notification";
import {I_Notifications} from "../types";

export default class NotificationController {
	constructor(private readonly repository: NotificationRepository) {
	}

	public async createNotification(
		r: Request<{}, {}, {
			recipient: string,
			type: string,
			seen: boolean,
			content: string
		}>,
		w: Response<{ id: string }>
	) {
		try {
			const notification = create_notification_schema.parse({
				type: r.body.type,
				seen: r.body.seen,
				sender: r.user.id,
				content: r.body.content,
				recipient: r.body.recipient,
			});

			const notificationId = await this.repository.createNotification({
				sender_id: r.user.id,
				seen: notification.seen,
				type: notification.type,
				content: notification.content,
				recipient_id: notification.recipient,
			});

			if (!notificationId) {
				console.error(`${this.constructor.name}.createNotification(): Failed to send message`);
				return w.status(status_codes.INTERNAL_SERVER_ERROR).end();
			}

			w.status(status_codes.CREATED).json({id: notificationId});
		} catch (error) {
			controllerErrorHandler(error, w);
		}
	}

	public async listNotifications(
		r: Request<{ recipientId: string }, {}, {}, { filter?: 'all' | 'seen' | 'unseen' }>,
		w: Response
	) {
		try {
			const notifications = await this.repository.listNotifications(
				uuid_schema.parse(r.params.recipientId),
				r.query.filter
			);

			if (!notifications) {
				console.error(`${this.constructor.name}.listNotifications(): Failed to get messages`);
				return w.status(status_codes.INTERNAL_SERVER_ERROR).end();
			}

			w.status(status_codes.OK).json(notifications);
		} catch (error) {
			controllerErrorHandler(error, w);
		}
	}

	public async markNotificationAsSeen(
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
			controllerErrorHandler(error, w);
		}
	}

	public async markAllNotificationsAsSeen(
		r: Request<{ recipientId: string }>,
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
			controllerErrorHandler(error, w);
		}
	}

}
