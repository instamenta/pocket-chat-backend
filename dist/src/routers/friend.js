"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const middlewares_1 = require("../middlewares");
const router_base_1 = __importDefault(require("../base/router.base"));
class FriendRouter extends router_base_1.default {
    initialize(c) {
        this.router.get('/maikati/:id', middlewares_1.isAuthorized, c.getFriendsByUserIdAndSender.bind(c));
        this.router.get('/', middlewares_1.isAuthorized, c.listFriendRequests.bind(c));
        this.router.get('/one/:id', middlewares_1.isAuthorized, c.getById.bind(c));
        this.router.get('/requests', middlewares_1.isAuthorized, c.listFriendRequestsOnly.bind(c));
        this.router.get('/sent', middlewares_1.isAuthorized, c.listFriendSentOnly.bind(c));
        this.router.get('/:id/mutual', middlewares_1.isAuthorized, c.listMutualFriendsByUsers.bind(c));
        this.router.get('/recommendations', middlewares_1.isAuthorized, c.listFriendRecommendations.bind(c));
        this.router.get('/:id', middlewares_1.isAuthorized, c.listFriendsByUserId.bind(c));
        this.router.get('/username/:username', middlewares_1.isAuthorized, c.listFriendsByUsername.bind(c));
        this.router.get('/:id/count', middlewares_1.isAuthorized, c.getFriendsCountByUserId.bind(c));
        this.router.post('/:id', middlewares_1.isAuthorized, c.sendFriendRequest.bind(c));
        this.router.delete('/:id', middlewares_1.isAuthorized, c.deleteFriendRequest.bind(c));
        this.router.put('/:id/accept', middlewares_1.isAuthorized, c.acceptFriendRequest.bind(c));
        this.router.put('/:id/decline', middlewares_1.isAuthorized, c.declineFriendRequest.bind(c));
        this.router.get('/:sender/:recipient', middlewares_1.isAuthorized, c.getBySenderAndRecipient.bind(c));
    }
}
exports.default = FriendRouter;
