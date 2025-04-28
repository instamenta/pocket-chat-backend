"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentRouter = void 0;
const middlewares_1 = require("../middlewares");
const router_base_1 = require("../base/router.base");
class CommentRouter extends router_base_1.BaseRouter {
    initialize(c) {
        this.router.get("/:publicationId", middlewares_1.Middlewares.isAuthorized, c.listByPublication.bind(c));
        this.router.get("/:commentId/details", c.getCommentById.bind(c));
        this.router.post("/:publicationId", middlewares_1.Middlewares.isAuthorized, c.create.bind(c));
        this.router.delete("/:commentId", middlewares_1.Middlewares.isAuthorized, c.delete.bind(c));
        this.router.put("/:commentId", middlewares_1.Middlewares.isAuthorized, c.like.bind(c));
    }
}
exports.CommentRouter = CommentRouter;
