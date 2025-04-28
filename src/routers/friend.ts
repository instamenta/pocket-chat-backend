import { Middlewares } from "../middlewares";
import { FriendController } from "../controllers";
import { BaseRouter } from "../base/router.base";

export class FriendRouter extends BaseRouter<FriendController> {
  initialize(c: FriendController) {
    this.router.get(
      "/",
        // @ts-expect-error - to assign handlers
      Middlewares.isAuthorized,
      c.listFriendRequests.bind(c),
    );
    // @ts-expect-error - to assign handlers
    this.router.get("/one/:id", Middlewares.isAuthorized, c.getById.bind(c));
    this.router.get(
      "/requests",
        // @ts-expect-error - to assign handlers
      Middlewares.isAuthorized,
      c.listFriendRequestsOnly.bind(c),
    );
    this.router.get(
      "/sent",
        // @ts-expect-error - to assign handlers
      Middlewares.isAuthorized,
      c.listFriendSentOnly.bind(c),
    );
    this.router.get(
      "/:id/mutual",
        // @ts-expect-error - to assign handlers
      Middlewares.isAuthorized,
      c.listMutualFriendsByUsers.bind(c),
    );
    this.router.get(
      "/recommendations",
        // @ts-expect-error - to assign handlers
      Middlewares.isAuthorized,
      c.listFriendRecommendations.bind(c),
    );
    this.router.get(
      "/:id",
        // @ts-expect-error - to assign handlers
      Middlewares.isAuthorized,
      c.listFriendsByUserId.bind(c),
    );
    this.router.get(
      "/username/:username",
        // @ts-expect-error - to assign handlers
      Middlewares.isAuthorized,
      c.listFriendsByUsername.bind(c),
    );
    this.router.get(
      "/:id/count",
        // @ts-expect-error - to assign handlers
      Middlewares.isAuthorized,
      c.getFriendsCountByUserId.bind(c),
    );
    this.router.post(
      "/:id",
        // @ts-expect-error - to assign handlers
      Middlewares.isAuthorized,
      c.sendFriendRequest.bind(c),
    );
    this.router.delete(
      "/:id",
        // @ts-expect-error - to assign handlers
      Middlewares.isAuthorized,
      c.deleteFriendRequest.bind(c),
    );
    this.router.put(
      "/:id/accept",
        // @ts-expect-error - to assign handlers
      Middlewares.isAuthorized,
      c.acceptFriendRequest.bind(c),
    );
    this.router.put(
      "/:id/decline",
        // @ts-expect-error - to assign handlers
      Middlewares.isAuthorized,
      c.declineFriendRequest.bind(c),
    );
    this.router.get(
      "/:sender/:recipient",
        // @ts-expect-error - to assign handlers
      Middlewares.isAuthorized,
      c.getBySenderAndRecipient.bind(c),
    );
  }
}
