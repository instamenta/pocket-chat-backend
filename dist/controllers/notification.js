"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const http_status_codes_1 = __importDefault(require("@instamenta/http-status-codes"));
const controller_base_1 = require("../base/controller.base");
const validators_1 = require("../validators");
class NotificationController extends controller_base_1.BaseController {
    createNotification(_request, response) {
        try {
            response.status(http_status_codes_1.default.NOT_IMPLEMENTED).end();
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async listNotifications(request, response) {
        try {
            const notifications = await this.repository.listNotifications(validators_1.Validate.uuid.parse(request.user.id), request.query.filter);
            response.status(http_status_codes_1.default.OK).json(notifications);
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async markNotificationAsSeen(request, response) {
        try {
            const messages = await this.repository.markNotificationAsSeen(validators_1.Validate.uuid.parse(request.params.id));
            if (!messages) {
                console.error(`${this.constructor.name}.markNotificationAsSeen(): Failed to update notification`);
                return response.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).end();
            }
            response.status(http_status_codes_1.default.OK).end();
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async markAllNotificationsAsSeen(request, response) {
        try {
            const messages = await this.repository.markAllNotificationsAsSeen(validators_1.Validate.uuid.parse(request.user.id));
            if (!messages) {
                console.error(`${this.constructor.name}.markAllNotificationsAsSeen(): Failed to update notifications`, request.params);
                return response.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).end();
            }
            response.status(http_status_codes_1.default.OK).end();
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
}
exports.NotificationController = NotificationController;
