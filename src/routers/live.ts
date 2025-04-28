import { Middlewares } from "../middlewares";
import { LiveController } from "../controllers/live";
import { BaseRouter } from "../base/router.base";

export class LiveRouter extends BaseRouter<LiveController> {
  initialize(c: LiveController) {
    // @ts-expect-error - to assign handlers
    this.router.post("/", Middlewares.isAuthorized, c.createLive.bind(c));

    // @ts-expect-error - to assign handlers
    this.router.get("/", Middlewares.isAuthorized, c.listLives.bind(c));

    this.router.put(
      "/:state",
      // @ts-expect-error - to assign handlers
      Middlewares.isAuthorized,
      c.updateLiveState.bind(c),
    );

    this.router.get(
      "/:liveId",
      // @ts-expect-error - to assign handlers
      Middlewares.isAuthorized,
      c.listLiveMessages.bind(c),
    );
  }
}
