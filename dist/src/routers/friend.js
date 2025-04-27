"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const middlewares_1 = require("../middlewares");
const router_base_1 = __importDefault(require("../base/router.base"));
class FriendRouter extends router_base_1.default {
    initialize(c) {
        // @ts-expect-error - to assign handlers
        this.router.get('/', middlewares_1.Middlewares.isAuthorized, c.listFriendRequests.bind(c));
        // @ts-expect-error - to assign handlers
        this.router.get('/one/:id', middlewares_1.Middlewares.isAuthorized, c.getById.bind(c));
        // @ts-expect-error - to assign handlers
        this.router.get('/requests', middlewares_1.Middlewares.isAuthorized, c.listFriendRequestsOnly.bind(c));
        // @ts-expect-error - to assign handlers
        this.router.get('/sent', middlewares_1.Middlewares.isAuthorized, c.listFriendSentOnly.bind(c));
        // @ts-expect-error - to assign handlers
        this.router.get('/:id/mutual', middlewares_1.Middlewares.isAuthorized, c.listMutualFriendsByUsers.bind(c));
        // @ts-expect-error - to assign handlers
        this.router.get('/recommendations', middlewares_1.Middlewares.isAuthorized, c.listFriendRecommendations.bind(c));
        // @ts-expect-error - to assign handlers
        this.router.get('/:id', middlewares_1.Middlewares.isAuthorized, c.listFriendsByUserId.bind(c));
        // @ts-expect-error - to assign handlers
        this.router.get('/username/:username', middlewares_1.Middlewares.isAuthorized, c.listFriendsByUsername.bind(c));
        // @ts-expect-error - to assign handlers
        this.router.get('/:id/count', middlewares_1.Middlewares.isAuthorized, c.getFriendsCountByUserId.bind(c));
        // @ts-expect-error - to assign handlers
        this.router.post('/:id', middlewares_1.Middlewares.isAuthorized, c.sendFriendRequest.bind(c));
        // @ts-expect-error - to assign handlers
        this.router.delete('/:id', middlewares_1.Middlewares.isAuthorized, c.deleteFriendRequest.bind(c));
        // @ts-expect-error - to assign handlers
        this.router.put('/:id/accept', middlewares_1.Middlewares.isAuthorized, c.acceptFriendRequest.bind(c));
        // @ts-expect-error - to assign handlers
        this.router.put('/:id/decline', middlewares_1.Middlewares.isAuthorized, c.declineFriendRequest.bind(c));
        // @ts-expect-error - to assign handlers
        this.router.get('/:sender/:recipient', middlewares_1.Middlewares.isAuthorized, c.getBySenderAndRecipient.bind(c));
    }
}
exports.default = FriendRouter;
