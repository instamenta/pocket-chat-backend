"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FriendRouter = void 0;
const middlewares_1 = require("../middlewares");
const router_base_1 = require("../base/router.base");
class FriendRouter extends router_base_1.BaseRouter {
    initialize(c) {
        this.router.get('/', middlewares_1.Middlewares.isAuthorized, c.listFriendRequests.bind(c));
        this.router.get('/one/:id', middlewares_1.Middlewares.isAuthorized, c.getById.bind(c));
        this.router.get('/requests', middlewares_1.Middlewares.isAuthorized, c.listFriendRequestsOnly.bind(c));
        this.router.get('/sent', middlewares_1.Middlewares.isAuthorized, c.listFriendSentOnly.bind(c));
        this.router.get('/:id/mutual', middlewares_1.Middlewares.isAuthorized, c.listMutualFriendsByUsers.bind(c));
        this.router.get('/recommendations', middlewares_1.Middlewares.isAuthorized, c.listFriendRecommendations.bind(c));
        this.router.get('/:id', middlewares_1.Middlewares.isAuthorized, c.listFriendsByUserId.bind(c));
        this.router.get('/username/:username', middlewares_1.Middlewares.isAuthorized, c.listFriendsByUsername.bind(c));
        this.router.get('/:id/count', middlewares_1.Middlewares.isAuthorized, c.getFriendsCountByUserId.bind(c));
        this.router.post('/:id', middlewares_1.Middlewares.isAuthorized, c.sendFriendRequest.bind(c));
        this.router.delete('/:id', middlewares_1.Middlewares.isAuthorized, c.deleteFriendRequest.bind(c));
        this.router.put('/:id/accept', middlewares_1.Middlewares.isAuthorized, c.acceptFriendRequest.bind(c));
        this.router.put('/:id/decline', middlewares_1.Middlewares.isAuthorized, c.declineFriendRequest.bind(c));
        this.router.get('/:sender/:recipient', middlewares_1.Middlewares.isAuthorized, c.getBySenderAndRecipient.bind(c));
    }
}
exports.FriendRouter = FriendRouter;
