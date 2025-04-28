import { Middlewares } from "../middlewares";
import { FriendController } from "../controllers/friend";
import { BaseRouter } from "../base/router.base";

export class FriendRouter extends BaseRouter<FriendController> {
  initialize(c: FriendController) {
    // @ts-expect-error - to assign handlers
    this.router.get(
      "/",
      Middlewares.isAuthorized,
      c.listFriendRequests.bind(c),
    );
    // @ts-expect-error - to assign handlers
    this.router.get("/one/:id", Middlewares.isAuthorized, c.getById.bind(c));
    // @ts-expect-error - to assign handlers
    this.router.get(
      "/requests",
      Middlewares.isAuthorized,
      c.listFriendRequestsOnly.bind(c),
    );
    // @ts-expect-error - to assign handlers
    this.router.get(
      "/sent",
      Middlewares.isAuthorized,
      c.listFriendSentOnly.bind(c),
    );
    // @ts-expect-error - to assign handlers
    this.router.get(
      "/:id/mutual",
      Middlewares.isAuthorized,
      c.listMutualFriendsByUsers.bind(c),
    );

    // @ts-expect-error - to assign handlers
    this.router.get(
      "/recommendations",
      Middlewares.isAuthorized,
      c.listFriendRecommendations.bind(c),
    );
    // @ts-expect-error - to assign handlers
    this.router.get(
      "/:id",
      Middlewares.isAuthorized,
      c.listFriendsByUserId.bind(c),
    );
    // @ts-expect-error - to assign handlers
    this.router.get(
      "/username/:username",
      Middlewares.isAuthorized,
      c.listFriendsByUsername.bind(c),
    );
    // @ts-expect-error - to assign handlers
    this.router.get(
      "/:id/count",
      Middlewares.isAuthorized,
      c.getFriendsCountByUserId.bind(c),
    );

    // @ts-expect-error - to assign handlers
    this.router.post(
      "/:id",
      Middlewares.isAuthorized,
      c.sendFriendRequest.bind(c),
    );
    // @ts-expect-error - to assign handlers
    this.router.delete(
      "/:id",
      Middlewares.isAuthorized,
      c.deleteFriendRequest.bind(c),
    );
    // @ts-expect-error - to assign handlers
    this.router.put(
      "/:id/accept",
      Middlewares.isAuthorized,
      c.acceptFriendRequest.bind(c),
    );
    // @ts-expect-error - to assign handlers
    this.router.put(
      "/:id/decline",
      Middlewares.isAuthorized,
      c.declineFriendRequest.bind(c),
    );
    // @ts-expect-error - to assign handlers
    this.router.get(
      "/:sender/:recipient",
      Middlewares.isAuthorized,
      c.getBySenderAndRecipient.bind(c),
    );
  }
}
