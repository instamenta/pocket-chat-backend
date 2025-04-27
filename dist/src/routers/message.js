"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const middlewares_1 = require("../middlewares");
const router_base_1 = __importDefault(require("../base/router.base"));
class MessageRouter extends router_base_1.default {
    initialize(c) {
        // @ts-expect-error - to assign handlers
        this.router.post('/', middlewares_1.Middlewares.isAuthorized, c.sendMessage.bind(c));
        // @ts-expect-error - to assign handlers
        this.router.put('/:id', middlewares_1.Middlewares.isAuthorized, c.updateMessageStatus.bind(c));
        // @ts-expect-error - to assign handlers
        this.router.get('/conversations', middlewares_1.Middlewares.isAuthorized, c.listConversations.bind(c));
        // @ts-expect-error - to assign handlers
        this.router.get('/:friendshipId', c.listMessagesByFriendship.bind(c));
        // @ts-expect-error - to assign handlers
        this.router.get('/:user1/:user2', c.listMessagesByUsers.bind(c));
    }
}
exports.default = MessageRouter;
