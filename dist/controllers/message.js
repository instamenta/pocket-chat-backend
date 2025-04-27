"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = __importDefault(require("@instamenta/http-status-codes"));
const controller_base_1 = require("../base/controller.base");
const validators_1 = require("../validators");
class MessageController extends controller_base_1.BaseController {
    async sendMessage(request, response) {
        try {
            const message = validators_1.Validate.create_message.parse({
                sender: request.user.id,
                recipient: request.body.recipient,
                content: request.body.content,
                friendship: request.body.friendship,
                images: request.body.images,
                files: request.body.files,
            });
            const messageId = await this.repository.createMessage(message);
            if (!messageId) {
                console.error(`${this.constructor.name}.sendMessage(): Failed to send message`);
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
            const messages = await this.repository.getMessagesByFriendshipId(validators_1.Validate.uuid.parse(request.params.friendshipId), Number.parseInt(request.query.skip ?? '0', 10), Number.parseInt(request.query.limit ?? '20', 10));
            response.status(http_status_codes_1.default.OK).json(messages);
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async listMessagesByUsers(request, response) {
        try {
            const messages = await this.repository.getMessagesByUsers(validators_1.Validate.uuid.parse(request.params.user1), validators_1.Validate.uuid.parse(request.params.user2), Number.parseInt(request.query.skip ?? '0', 10), Number.parseInt(request.query.limit ?? '20', 10));
            response.status(http_status_codes_1.default.OK).json(messages);
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async updateMessageStatus(request, response) {
        try {
            const result = await this.repository.updateMessageStatus(validators_1.Validate.uuid.parse(request.params.id), request.body.status);
            if (!result) {
                console.error(`${this.constructor.name}.updateMessageStatus(): Failed to update message status`);
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
            const userId = validators_1.Validate.uuid.parse(request.user.id);
            const conversations = await this.repository.listConversations(userId);
            response.status(http_status_codes_1.default.OK).json(conversations);
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
}
exports.default = MessageController;
