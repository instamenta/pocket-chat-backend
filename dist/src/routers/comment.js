"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const middlewares_1 = require("../middlewares");
const router_base_1 = __importDefault(require("../base/router.base"));
class CommentRouter extends router_base_1.default {
    initialize(c) {
        // @ts-expect-error - to assign handlers
        this.router.get('/:publicationId', middlewares_1.Middlewares.isAuthorized, c.listByPublication.bind(c));
        // @ts-expect-error - to assign handlers
        this.router.get('/:commentId/details', c.getCommentById.bind(c));
        // @ts-expect-error - to assign handlers
        this.router.post('/:publicationId', middlewares_1.Middlewares.isAuthorized, c.create.bind(c));
        // @ts-expect-error - to assign handlers
        this.router.delete('/:commentId', middlewares_1.Middlewares.isAuthorized, c.delete.bind(c));
        // @ts-expect-error - to assign handlers
        this.router.put('/:commentId', middlewares_1.Middlewares.isAuthorized, c.like.bind(c));
    }
}
exports.default = CommentRouter;
