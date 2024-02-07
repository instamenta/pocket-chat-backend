import {Router} from 'express';
import {isAuthorized} from "../middlewares";
import NotificationController from "../controllers/notification";

export default class NotificationRouter {

	private readonly router: Router = Router();
	private readonly controller: NotificationController;

	constructor(controller: NotificationController) {
		this.controller = controller;
		this.initialize(this.controller);
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

