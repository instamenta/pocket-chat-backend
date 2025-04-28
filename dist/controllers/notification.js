"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const http_status_codes_1 = __importDefault(require("@instamenta/http-status-codes"));
const controller_base_1 = require("../base/controller.base");
const Validate = __importStar(require("../validators"));
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
            const notifications = await this.repository.listNotifications(Validate.uuid.parse(request.user.id), request.query.filter);
            response.status(http_status_codes_1.default.OK).json(notifications);
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async markNotificationAsSeen(request, response) {
        try {
            const messages = await this.repository.markNotificationAsSeen(Validate.uuid.parse(request.params.id));
            if (!messages) {
                this.log.error({ m: `Failed to update notification`, f: 'markNotificationAsSeen', e: {} });
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
            const messages = await this.repository.markAllNotificationsAsSeen(Validate.uuid.parse(request.user.id));
            if (!messages) {
                this.log.error({ m: `Failed to update notifications`, f: 'markAllNotificationsAsSeen', e: request.params });
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
