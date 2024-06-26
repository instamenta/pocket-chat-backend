import {isAuthorized} from '../middlewares';
import GroupController from "../controllers/group";
import BaseRouter from "../base/router.base";

export default class GroupRouter extends BaseRouter<GroupController> {
	initialize(c: GroupController) {
		this.router.get('/', isAuthorized, c.listGroups.bind(c));
		this.router.get('/:id', isAuthorized, c.getGroupById.bind(c));
		this.router.get('/list/:userId', c.listGroupsByUser.bind(c));
		this.router.get('/member/:id', isAuthorized, c.getMembersByGroupId.bind(c));
		this.router.get('/post/:groupId', isAuthorized, c.listPublications.bind(c));

		this.router.post('/', isAuthorized, c.createGroup.bind(c));
		this.router.post('/post', isAuthorized, c.createPublication.bind(c));
		this.router.put('/join/:id', isAuthorized, c.joinGroup.bind(c));
		this.router.put('/leave/:id', isAuthorized, c.leaveGroup.bind(c));
		this.router.put('/:groupId/:recipientId', isAuthorized, c.changeRole.bind(c));

		this.router.delete('/:groupId', isAuthorized, c.removeGroup.bind(c));
		this.router.delete('/:groupId/:recipientId', isAuthorized, c.removeMember.bind(c));
	}
}
