"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageRouter = void 0;
const middlewares_1 = require("../middlewares");
const router_base_1 = require("../base/router.base");
class MessageRouter extends router_base_1.BaseRouter {
    initialize(c) {
        this.router.post("/", middlewares_1.Middlewares.isAuthorized, c.sendMessage.bind(c));
        this.router.put("/:id", middlewares_1.Middlewares.isAuthorized, c.updateMessageStatus.bind(c));
        this.router.get("/conversations", middlewares_1.Middlewares.isAuthorized, c.listConversations.bind(c));
        this.router.get("/:friendshipId", c.listMessagesByFriendship.bind(c));
        this.router.get("/:user1/:user2", c.listMessagesByUsers.bind(c));
    }
}
exports.MessageRouter = MessageRouter;
