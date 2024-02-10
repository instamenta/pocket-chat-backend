import {Router} from 'express';
import {isAuthorized} from "../middlewares";
import NotificationController from "../controllers/notification";

export default class NotificationRouter {

	private readonly router: Router = Router();

	constructor(controller: NotificationController) {
		this.initialize(controller);
	}

	private initialize(c: NotificationController) {
		this.router.get('/', isAuthorized, c.createNotification.bind(c));
		this.router.post('/', isAuthorized, c.createNotification.bind(c));
		this.router.put('/', isAuthorized, c.markAllNotificationsAsSeen.bind(c));
		this.router.put('/:id', isAuthorized, c.markNotificationAsSeen.bind(c));
	}

	public getRouter(): Router {
		return this.router;
	}
}

