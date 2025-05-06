import { PublicationController } from "../controllers/publication";
import { Middlewares } from "../middlewares";
import { BaseRouter } from "../base/router.base";

export class PublicationRouter extends BaseRouter<PublicationController> {
  protected initialize(c: PublicationController) {
    // @ts-expect-error - to assign handlers
    this.router.get("/", Middlewares.isAuthorized, c.listPublications.bind(c));

    this.router.get(
      "/recommendations",
      // @ts-expect-error - to assign handlers
      Middlewares.isAuthorized,
      c.getRecommendations.bind(c),
    );

    this.router.get(
      "/:id",
      // @ts-expect-error - to assign handlers
      Middlewares.isAuthorized,
      c.getPublicationById.bind(c),
    );

    this.router.get("/user/:id", c.getPublicationsByUserId.bind(c));

    this.router.get("/user/:id/count", c.getPublicationsCountByUserId.bind(c));

    this.router.post(
      "/",
      // @ts-expect-error - to assign handlers
      Middlewares.isAuthorized,
      c.createPublication.bind(c),
    );

    this.router.put(
      "/:id",
      // @ts-expect-error - to assign handlers
      Middlewares.isAuthorized,
      c.updatePublication.bind(c),
    );

    this.router.put(
      "/:id/like",
      // @ts-expect-error - to assign handlers
      Middlewares.isAuthorized,
      c.likePublication.bind(c),
    );
  }
}
