import {isAuthorized} from "../middlewares";
import NotificationController from "../controllers/notification";
import BaseRouter from "../base/router.base";

export default class NotificationRouter extends BaseRouter<NotificationController> {
	initialize(c: NotificationController) {
		this.router.get('/', isAuthorized, c.listNotifications.bind(c))
		this.router.post('/', isAuthorized, c.createNotification.bind(c));
		this.router.put('/', isAuthorized, c.markAllNotificationsAsSeen.bind(c));
		this.router.put('/:id', isAuthorized, c.markNotificationAsSeen.bind(c));
	}
}

