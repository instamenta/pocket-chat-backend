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
exports.MessageController = void 0;
const http_status_codes_1 = __importDefault(require("@instamenta/http-status-codes"));
const controller_base_1 = require("../base/controller.base");
const Validate = __importStar(require("../validators"));
class MessageController extends controller_base_1.BaseController {
    async sendMessage(request, response) {
        try {
            const message = Validate.createMessage.parse({
                sender: request.user.id,
                recipient: request.body.recipient,
                content: request.body.content,
                friendship: request.body.friendship,
                images: request.body.images,
                files: request.body.files,
            });
            const messageId = await this.repository.createMessage(message);
            if (!messageId) {
                this.log.error({
                    m: `Failed to send message`,
                    f: "sendMessage",
                    e: {},
                });
                return response.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).end();
            }
            response.status(http_status_codes_1.default.CREATED).json({ id: messageId });
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async listMessagesByFriendship(request, response) {
        try {
            const messages = await this.repository.getMessagesByFriendshipId(Validate.uuid.parse(request.params.friendshipId), Number.parseInt(request.query.skip ?? "0", 10), Number.parseInt(request.query.limit ?? "20", 10));
            response.status(http_status_codes_1.default.OK).json(messages);
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async listMessagesByUsers(request, response) {
        try {
            const messages = await this.repository.getMessagesByUsers(Validate.uuid.parse(request.params.user1), Validate.uuid.parse(request.params.user2), Number.parseInt(request.query.skip ?? "0", 10), Number.parseInt(request.query.limit ?? "20", 10));
            response.status(http_status_codes_1.default.OK).json(messages);
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async updateMessageStatus(request, response) {
        try {
            const result = await this.repository.updateMessageStatus(Validate.uuid.parse(request.params.id), request.body.status);
            if (!result) {
                this.log.error({
                    m: `Failed to update message status`,
                    f: "updateMessageStatus",
                    e: {},
                });
                return response.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).end();
            }
            response.status(http_status_codes_1.default.OK).json({ success: true });
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async listConversations(request, response) {
        try {
            const userId = Validate.uuid.parse(request.user.id);
            const conversations = await this.repository.listConversations(userId);
            response.status(http_status_codes_1.default.OK).json(conversations);
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
}
exports.MessageController = MessageController;
