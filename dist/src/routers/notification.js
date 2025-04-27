"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const middlewares_1 = require("../middlewares");
const router_base_1 = __importDefault(require("../base/router.base"));
class NotificationRouter extends router_base_1.default {
    initialize(c) {
        // @ts-expect-error - to assign handlers
        this.router.get('/', middlewares_1.Middlewares.isAuthorized, c.listNotifications.bind(c));
        // @ts-expect-error - to assign handlers
        this.router.post('/', middlewares_1.Middlewares.isAuthorized, c.createNotification.bind(c));
        // @ts-expect-error - to assign handlers
        this.router.put('/', middlewares_1.Middlewares.isAuthorized, c.markAllNotificationsAsSeen.bind(c));
        // @ts-expect-error - to assign handlers
        this.router.put('/:id', middlewares_1.Middlewares.isAuthorized, c.markNotificationAsSeen.bind(c));
    }
}
exports.default = NotificationRouter;
