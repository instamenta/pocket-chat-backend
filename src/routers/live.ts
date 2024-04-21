import {isAuthorized} from '../middlewares';
import LiveController from "../controllers/live";
import RouterBase from "../base/router.base";

export default class LiveRouter extends RouterBase<LiveController> {
	initializeRoutes(c: LiveController) {
		this.router.post('/', isAuthorized, c.createLive.bind(c));
		this.router.get('/', isAuthorized, c.listLives.bind(c));
		this.router.put('/:state', isAuthorized, c.updateLiveState.bind(c));
		this.router.get('/:liveId', isAuthorized, c.listLiveMessages.bind(c));
	}
}
