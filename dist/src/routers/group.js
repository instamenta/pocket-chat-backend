"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const middlewares_1 = require("../middlewares");
const router_base_1 = __importDefault(require("../base/router.base"));
class GroupRouter extends router_base_1.default {
    initialize(c) {
        // @ts-expect-error - to assign handlers
        this.router.get('/', middlewares_1.Middlewares.isAuthorized, c.listGroups.bind(c));
        // @ts-expect-error - to assign handlers
        this.router.get('/:id', middlewares_1.Middlewares.isAuthorized, c.getGroupById.bind(c));
        // @ts-expect-error - to assign handlers
        this.router.get('/list/:userId', c.listGroupsByUser.bind(c));
        // @ts-expect-error - to assign handlers
        this.router.get('/member/:id', middlewares_1.Middlewares.isAuthorized, c.getMembersByGroupId.bind(c));
        // @ts-expect-error - to assign handlers
        this.router.get('/post/:groupId', middlewares_1.Middlewares.isAuthorized, c.listPublications.bind(c));
        // @ts-expect-error - to assign handlers
        this.router.post('/', middlewares_1.Middlewares.isAuthorized, c.createGroup.bind(c));
        // @ts-expect-error - to assign handlers
        this.router.post('/post', middlewares_1.Middlewares.isAuthorized, c.createPublication.bind(c));
        // @ts-expect-error - to assign handlers
        this.router.put('/join/:id', middlewares_1.Middlewares.isAuthorized, c.joinGroup.bind(c));
        // @ts-expect-error - to assign handlers
        this.router.put('/leave/:id', middlewares_1.Middlewares.isAuthorized, c.leaveGroup.bind(c));
        // @ts-expect-error - to assign handlers
        this.router.put('/:groupId/:recipientId', middlewares_1.Middlewares.isAuthorized, c.changeRole.bind(c));
        // @ts-expect-error - to assign handlers
        this.router.delete('/:groupId', middlewares_1.Middlewares.isAuthorized, c.removeGroup.bind(c));
        // @ts-expect-error - to assign handlers
        this.router.delete('/:groupId/:recipientId', middlewares_1.Middlewares.isAuthorized, c.removeMember.bind(c));
    }
}
exports.default = GroupRouter;
