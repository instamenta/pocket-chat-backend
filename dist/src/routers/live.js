"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const middlewares_1 = require("../middlewares");
const router_base_1 = __importDefault(require("../base/router.base"));
class LiveRouter extends router_base_1.default {
    initialize(c) {
        // @ts-expect-error - to assign handlers
        this.router.post('/', middlewares_1.Middlewares.isAuthorized, c.createLive.bind(c));
        // @ts-expect-error - to assign handlers
        this.router.get('/', middlewares_1.Middlewares.isAuthorized, c.listLives.bind(c));
        // @ts-expect-error - to assign handlers
        this.router.put('/:state', middlewares_1.Middlewares.isAuthorized, c.updateLiveState.bind(c));
        // @ts-expect-error - to assign handlers
        this.router.get('/:liveId', middlewares_1.Middlewares.isAuthorized, c.listLiveMessages.bind(c));
    }
}
exports.default = LiveRouter;
