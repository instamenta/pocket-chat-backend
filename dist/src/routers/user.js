"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const middlewares_1 = require("../middlewares");
const router_base_1 = __importDefault(require("../base/router.base"));
class UserRouter extends router_base_1.default {
    initialize(c) {
        // @ts-expect-error - to assign handlers
        this.router.post('/sign-up', middlewares_1.Middlewares.isGuest, c.signUp.bind(c));
        // @ts-expect-error - to assign handlers
        this.router.post('/sign-in', middlewares_1.Middlewares.isGuest, c.signIn.bind(c));
        // @ts-expect-error - to assign handlers
        this.router.get('/', c.listUsers.bind(c));
        // @ts-expect-error - to assign handlers
        this.router.get('/auth', middlewares_1.Middlewares.isAuthorized, c.authUser.bind(c));
        // @ts-expect-error - to assign handlers
        this.router.get('/:id', c.getUserById.bind(c));
        // @ts-expect-error - to assign handlers
        this.router.get('/username/:username', c.getUserByUsername.bind(c));
        // @ts-expect-error - to assign handlers
        this.router.put('/', middlewares_1.Middlewares.isAuthorized, c.updateProfilePublicInformation.bind(c));
        // @ts-expect-error - to assign handlers
        this.router.put('/picture', middlewares_1.Middlewares.isAuthorized, c.updateProfilePicture.bind(c));
        // @ts-expect-error - to assign handlers
        this.router.put('/bio', middlewares_1.Middlewares.isAuthorized, c.updateBio.bind(c));
    }
}
exports.default = UserRouter;
