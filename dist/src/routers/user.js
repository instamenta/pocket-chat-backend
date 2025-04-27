"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const middlewares_1 = require("../middlewares");
const router_base_1 = __importDefault(require("../base/router.base"));
class UserRouter extends router_base_1.default {
    initialize(c) {
        this.router.post('/sign-up', middlewares_1.isGuest, c.signUp.bind(c));
        this.router.post('/sign-in', middlewares_1.isGuest, c.signIn.bind(c));
        this.router.get('/', c.listUsers.bind(c));
        this.router.get('/auth', middlewares_1.isAuthorized, c.authUser.bind(c));
        this.router.get('/:id', c.getUserById.bind(c));
        this.router.get('/username/:username', c.getUserByUsername.bind(c));
        this.router.put('/', middlewares_1.isAuthorized, c.updateProfilePublicInformation.bind(c));
        this.router.put('/picture', middlewares_1.isAuthorized, c.updateProfilePicture.bind(c));
        this.router.put('/bio', middlewares_1.isAuthorized, c.updateBio.bind(c));
    }
}
exports.default = UserRouter;
