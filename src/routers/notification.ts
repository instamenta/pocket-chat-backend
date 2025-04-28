import { Middlewares } from "../middlewares";
import { NotificationController } from "../controllers/notification";
import { BaseRouter } from "../base/router.base";

export class NotificationRouter extends BaseRouter<NotificationController> {
  protected initialize(c: NotificationController) {
    // @ts-expect-error - to assign handlers
    this.router.get("/", Middlewares.isAuthorized, c.listNotifications.bind(c));

    this.router.post(
      "/",
      // @ts-expect-error - to assign handlers
      Middlewares.isAuthorized,
      c.createNotification.bind(c),
    );

    this.router.put(
      "/",
      // @ts-expect-error - to assign handlers
      Middlewares.isAuthorized,
      c.markAllNotificationsAsSeen.bind(c),
    );

    this.router.put(
      "/:id",
      // @ts-expect-error - to assign handlers
      Middlewares.isAuthorized,
      c.markNotificationAsSeen.bind(c),
    );
  }
}
