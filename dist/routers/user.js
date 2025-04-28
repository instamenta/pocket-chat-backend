"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
const middlewares_1 = require("../middlewares");
const router_base_1 = require("../base/router.base");
class UserRouter extends router_base_1.BaseRouter {
    initialize(c) {
        this.router.post("/sign-up", middlewares_1.Middlewares.isGuest, c.signUp.bind(c));
        this.router.post("/sign-in", middlewares_1.Middlewares.isGuest, c.signIn.bind(c));
        this.router.get("/", c.listUsers.bind(c));
        this.router.get("/auth", middlewares_1.Middlewares.isAuthorized, c.authUser.bind(c));
        this.router.get("/:id", c.getUserById.bind(c));
        this.router.get("/username/:username", c.getUserByUsername.bind(c));
        this.router.put("/", middlewares_1.Middlewares.isAuthorized, c.updateProfilePublicInformation.bind(c));
        this.router.put("/picture", middlewares_1.Middlewares.isAuthorized, c.updateProfilePicture.bind(c));
        this.router.put("/bio", middlewares_1.Middlewares.isAuthorized, c.updateBio.bind(c));
    }
}
exports.UserRouter = UserRouter;
