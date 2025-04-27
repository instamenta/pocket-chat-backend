"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiveRouter = void 0;
const middlewares_1 = require("../middlewares");
const router_base_1 = require("../base/router.base");
class LiveRouter extends router_base_1.BaseRouter {
    initialize(c) {
        this.router.post('/', middlewares_1.Middlewares.isAuthorized, c.createLive.bind(c));
        this.router.get('/', middlewares_1.Middlewares.isAuthorized, c.listLives.bind(c));
        this.router.put('/:state', middlewares_1.Middlewares.isAuthorized, c.updateLiveState.bind(c));
        this.router.get('/:liveId', middlewares_1.Middlewares.isAuthorized, c.listLiveMessages.bind(c));
    }
}
exports.LiveRouter = LiveRouter;
