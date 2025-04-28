"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupRouter = void 0;
const middlewares_1 = require("../middlewares");
const router_base_1 = require("../base/router.base");
class GroupRouter extends router_base_1.BaseRouter {
    initialize(c) {
        this.router.get("/", middlewares_1.Middlewares.isAuthorized, c.listGroups.bind(c));
        this.router.get("/:id", middlewares_1.Middlewares.isAuthorized, c.getGroupById.bind(c));
        this.router.get("/list/:userId", c.listGroupsByUser.bind(c));
        this.router.get("/member/:id", middlewares_1.Middlewares.isAuthorized, c.getMembersByGroupId.bind(c));
        this.router.get("/post/:groupId", middlewares_1.Middlewares.isAuthorized, c.listPublications.bind(c));
        this.router.post("/", middlewares_1.Middlewares.isAuthorized, c.createGroup.bind(c));
        this.router.post("/post", middlewares_1.Middlewares.isAuthorized, c.createPublication.bind(c));
        this.router.put("/join/:id", middlewares_1.Middlewares.isAuthorized, c.joinGroup.bind(c));
        this.router.put("/leave/:id", middlewares_1.Middlewares.isAuthorized, c.leaveGroup.bind(c));
        this.router.put("/:groupId/:recipientId", middlewares_1.Middlewares.isAuthorized, c.changeRole.bind(c));
        this.router.delete("/:groupId", middlewares_1.Middlewares.isAuthorized, c.removeGroup.bind(c));
        this.router.delete("/:groupId/:recipientId", middlewares_1.Middlewares.isAuthorized, c.removeMember.bind(c));
    }
}
exports.GroupRouter = GroupRouter;
