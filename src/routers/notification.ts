import {isAuthorized} from "../middlewares";
import NotificationController from "../controllers/notification";
import RouterBase from "../base/router.base";

export default class NotificationRouter extends RouterBase<NotificationController> {
	initializeRoutes(c: NotificationController) {
		this.router.get('/', isAuthorized, c.listNotifications.bind(c))
		this.router.post('/', isAuthorized, c.createNotification.bind(c));
		this.router.put('/', isAuthorized, c.markAllNotificationsAsSeen.bind(c));
		this.router.put('/:id', isAuthorized, c.markNotificationAsSeen.bind(c));
	}
}

