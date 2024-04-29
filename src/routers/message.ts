import {isAuthorized} from "../middlewares";
import MessageController from "../controllers/message";
import BaseRouter from "../base/router.base";

export default class MessageRouter extends BaseRouter<MessageController> {
	initialize(c: MessageController) {
		this.router.post('/', isAuthorized, c.sendMessage.bind(c));
		this.router.put('/:id', isAuthorized, c.updateMessageStatus.bind(c));

		this.router.get('/conversations', isAuthorized, c.listConversations.bind(c));
		this.router.get('/:friendshipId', c.listMessagesByFriendship.bind(c));
		this.router.get('/:user1/:user2', c.listMessagesByUsers.bind(c));
	}
}

