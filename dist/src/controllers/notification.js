"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = __importDefault(require("@instamenta/http-status-codes"));
const controller_base_1 = __importDefault(require("../base/controller.base"));
const validators_1 = require("../validators");
class NotificationController extends controller_base_1.default {
    createNotification(_request, response) {
        try {
            response.status(http_status_codes_1.default.NOT_IMPLEMENTED).end();
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async listNotifications(r, w) {
        try {
            const notifications = await this.repository.listNotifications(validators_1.Validate.uuid.parse(r.user.id), r.query.filter);
            w.status(http_status_codes_1.default.OK).json(notifications);
        }
        catch (error) {
            this.errorHandler(error, w);
        }
    }
    async markNotificationAsSeen(r, w) {
        try {
            const messages = await this.repository.markNotificationAsSeen(validators_1.Validate.uuid.parse(r.params.id));
            if (!messages) {
                console.error(`${this.constructor.name}.markNotificationAsSeen(): Failed to update notification`);
                return w.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).end();
            }
            w.status(http_status_codes_1.default.OK).end();
        }
        catch (error) {
            this.errorHandler(error, w);
        }
    }
    async markAllNotificationsAsSeen(r, w) {
        try {
            const messages = await this.repository.markAllNotificationsAsSeen(validators_1.Validate.uuid.parse(r.user.id));
            if (!messages) {
                console.error(`${this.constructor.name}.markAllNotificationsAsSeen(): Failed to update notifications`, r.params);
                return w.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).end();
            }
            w.status(http_status_codes_1.default.OK).end();
        }
        catch (error) {
            this.errorHandler(error, w);
        }
    }
}
exports.default = NotificationController;
