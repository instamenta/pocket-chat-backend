"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRouter = void 0;
const middlewares_1 = require("../middlewares");
const router_base_1 = require("../base/router.base");
class NotificationRouter extends router_base_1.BaseRouter {
    initialize(c) {
        this.router.get("/", middlewares_1.Middlewares.isAuthorized, c.listNotifications.bind(c));
        this.router.post("/", middlewares_1.Middlewares.isAuthorized, c.createNotification.bind(c));
        this.router.put("/", middlewares_1.Middlewares.isAuthorized, c.markAllNotificationsAsSeen.bind(c));
        this.router.put("/:id", middlewares_1.Middlewares.isAuthorized, c.markNotificationAsSeen.bind(c));
    }
}
exports.NotificationRouter = NotificationRouter;
