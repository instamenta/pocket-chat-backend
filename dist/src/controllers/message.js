"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = __importDefault(require("@instamenta/http-status-codes"));
const controller_base_1 = __importDefault(require("../base/controller.base"));
const validators_1 = __importDefault(require("../validators"));
class MessageController extends controller_base_1.default {
    async sendMessage(r, w) {
        try {
            const message = validators_1.default.create_message.parse({
                sender: r.user.id,
                recipient: r.body.recipient,
                content: r.body.content,
                friendship: r.body.friendship,
                images: r.body.images,
                files: r.body.files,
            });
            const messageId = await this.repository.createMessage(message);
            if (!messageId) {
                console.error(`${this.constructor.name}.sendMessage(): Failed to send message`);
                return w.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).end();
            }
            w.status(http_status_codes_1.default.CREATED).json({ id: messageId });
        }
        catch (error) {
            this.errorHandler(error, w);
        }
    }
    async listMessagesByFriendship(r, w) {
        try {
            const messages = await this.repository.getMessagesByFriendshipId(validators_1.default.uuid.parse(r.params.friendshipId), Number.parseInt(r.query.skip || '0', 10), Number.parseInt(r.query.limit || '20', 10));
            if (!messages) {
                console.error(`${this.constructor.name}.listMessagesByFriendship(): Failed to get messages`);
                return w.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).end();
            }
            w.status(http_status_codes_1.default.OK).json(messages);
        }
        catch (error) {
            this.errorHandler(error, w);
        }
    }
    async listMessagesByUsers(r, w) {
        try {
            const messages = await this.repository.getMessagesByUsers(validators_1.default.uuid.parse(r.params.user1), validators_1.default.uuid.parse(r.params.user2), Number.parseInt(r.query.skip || '0', 10), Number.parseInt(r.query.limit || '20', 10));
            if (!messages) {
                console.error(`${this.constructor.name}.listMessagesByUsers(): Failed to get messages`);
                return w.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).end();
            }
            w.status(http_status_codes_1.default.OK).json(messages);
        }
        catch (error) {
            this.errorHandler(error, w);
        }
    }
    async updateMessageStatus(r, w) {
        try {
            const result = await this.repository.updateMessageStatus(validators_1.default.uuid.parse(r.params.id), r.body.status);
            if (!result) {
                console.error(`${this.constructor.name}.updateMessageStatus(): Failed to update message status`);
                return w.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).end();
            }
            w.status(http_status_codes_1.default.OK).json({ success: true });
        }
        catch (error) {
            this.errorHandler(error, w);
        }
    }
    async listConversations(r, w) {
        try {
            const userId = validators_1.default.uuid.parse(r.user.id);
            const conversations = await this.repository.listConversations(userId);
            if (!conversations) {
                console.error(`${this.constructor.name}.listConversations(): Failed to list conversations`);
                return w.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).end();
            }
            w.status(http_status_codes_1.default.OK).json(conversations);
        }
        catch (error) {
            this.errorHandler(error, w);
        }
    }
}
exports.default = MessageController;
