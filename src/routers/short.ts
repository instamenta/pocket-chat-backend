import { Middlewares } from "../middlewares";
import { ShortController } from "../controllers/short";
import { BaseRouter } from "../base/router.base";

export class ShortRouter extends BaseRouter<ShortController> {
  initialize(c: ShortController) {
    // @ts-expect-error - to assign handlers
    this.router.post("/", Middlewares.isAuthorized, c.createShort.bind(c));
    // @ts-expect-error - to assign handlers
    this.router.get("/", Middlewares.isAuthorized, c.listShorts.bind(c));
    // @ts-expect-error - to assign handlers
    this.router.get(
      "/:id",
      Middlewares.isAuthorized,
      c.listShortsByUsername.bind(c),
    );
    // @ts-expect-error - to assign handlers
    this.router.get("/:shortId/details", c.getShortById.bind(c));

    //* Likes
    // @ts-expect-error - to assign handlers
    this.router.put("/:id/like", Middlewares.isAuthorized, c.likeShort.bind(c));

    //* Comments
    // @ts-expect-error - to assign handlers
    this.router.get("/comments/details", c.getCommentById.bind(c));
    // @ts-expect-error - to assign handlers
    this.router.get(
      "/comments/:shortId",
      Middlewares.isAuthorized,
      c.listCommentsByShort.bind(c),
    );
    // @ts-expect-error - to assign handlers
    this.router.post(
      "/comments/:shortId",
      Middlewares.isAuthorized,
      c.createShortComment.bind(c),
    );
    // @ts-expect-error - to assign handlers
    this.router.delete(
      "/comments/:commentId",
      Middlewares.isAuthorized,
      c.deleteShortComment.bind(c),
    );
    // @ts-expect-error - to assign handlers
    this.router.put(
      "/comments/:commentId",
      Middlewares.isAuthorized,
      c.likeShortComment.bind(c),
    );
  }
}
