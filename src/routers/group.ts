import {Middlewares} from '../middlewares';
import GroupController from "../controllers/group";
import BaseRouter from "../base/router.base";

export default class GroupRouter extends BaseRouter<GroupController> {
	initialize(c: GroupController) {
		// @ts-expect-error - to assign handlers
		this.router.get('/', Middlewares.isAuthorized, c.listGroups.bind(c));
		// @ts-expect-error - to assign handlers
		this.router.get('/:id', Middlewares.isAuthorized, c.getGroupById.bind(c));
		// @ts-expect-error - to assign handlers
		this.router.get('/list/:userId', c.listGroupsByUser.bind(c));
		// @ts-expect-error - to assign handlers
		this.router.get('/member/:id', Middlewares.isAuthorized, c.getMembersByGroupId.bind(c));
		// @ts-expect-error - to assign handlers
		this.router.get('/post/:groupId', Middlewares.isAuthorized, c.listPublications.bind(c));

		// @ts-expect-error - to assign handlers
		this.router.post('/', Middlewares.isAuthorized, c.createGroup.bind(c));
		// @ts-expect-error - to assign handlers
		this.router.post('/post', Middlewares.isAuthorized, c.createPublication.bind(c));
		// @ts-expect-error - to assign handlers
		this.router.put('/join/:id', Middlewares.isAuthorized, c.joinGroup.bind(c));
		// @ts-expect-error - to assign handlers
		this.router.put('/leave/:id', Middlewares.isAuthorized, c.leaveGroup.bind(c));
		// @ts-expect-error - to assign handlers
		this.router.put('/:groupId/:recipientId', Middlewares.isAuthorized, c.changeRole.bind(c));

		// @ts-expect-error - to assign handlers
		this.router.delete('/:groupId', Middlewares.isAuthorized, c.removeGroup.bind(c));
		// @ts-expect-error - to assign handlers
		this.router.delete('/:groupId/:recipientId', Middlewares.isAuthorized, c.removeMember.bind(c));
	}
}
