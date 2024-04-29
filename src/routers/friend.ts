import {isAuthorized} from "../middlewares";
import FriendController from "../controllers/friend";
import BaseRouter from "../base/router.base";

export default class FriendRouter extends BaseRouter<FriendController> {
	initialize(c: FriendController) {
		this.router.get('/maikati/:id', isAuthorized, c.getFriendsByUserIdAndSender.bind(c))

		this.router.get('/', isAuthorized, c.listFriendRequests.bind(c));
		this.router.get('/one/:id', isAuthorized, c.getById.bind(c));
		this.router.get('/requests', isAuthorized, c.listFriendRequestsOnly.bind(c));
		this.router.get('/sent', isAuthorized, c.listFriendSentOnly.bind(c));
		this.router.get('/:id/mutual', isAuthorized, c.listMutualFriendsByUsers.bind(c));

		this.router.get('/recommendations', isAuthorized, c.listFriendRecommendations.bind(c))
		this.router.get('/:id', isAuthorized, c.listFriendsByUserId.bind(c));
		this.router.get('/username/:username', isAuthorized, c.listFriendsByUsername.bind(c));
		this.router.get('/:id/count', isAuthorized, c.getFriendsCountByUserId.bind(c));

		this.router.post('/:id', isAuthorized, c.sendFriendRequest.bind(c));
		this.router.delete('/:id', isAuthorized, c.deleteFriendRequest.bind(c))
		this.router.put('/:id/accept', isAuthorized, c.acceptFriendRequest.bind(c));
		this.router.put('/:id/decline', isAuthorized, c.declineFriendRequest.bind(c));
		this.router.get('/:sender/:recipient', isAuthorized, c.getBySenderAndRecipient.bind(c))
	}

}

