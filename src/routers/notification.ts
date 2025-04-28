import { Middlewares } from "../middlewares";
import { NotificationController } from "../controllers/notification";
import { BaseRouter } from "../base/router.base";

export class NotificationRouter extends BaseRouter<NotificationController> {
  initialize(c: NotificationController) {
    // @ts-expect-error - to assign handlers
    this.router.get("/", Middlewares.isAuthorized, c.listNotifications.bind(c));
    // @ts-expect-error - to assign handlers
    this.router.post(
      "/",
      Middlewares.isAuthorized,
      c.createNotification.bind(c),
    );
    // @ts-expect-error - to assign handlers
    this.router.put(
      "/",
      Middlewares.isAuthorized,
      c.markAllNotificationsAsSeen.bind(c),
    );
    // @ts-expect-error - to assign handlers
    this.router.put(
      "/:id",
      Middlewares.isAuthorized,
      c.markNotificationAsSeen.bind(c),
    );
  }
}
