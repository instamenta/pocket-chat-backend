import { CommentController } from "../controllers";
import { Middlewares } from "../middlewares";
import { BaseRouter } from "../base/router.base";

export class CommentRouter extends BaseRouter<CommentController> {
  initialize(c: CommentController) {
    this.router.get(
      "/:publicationId",
      // @ts-expect-error - to assign handlers
      Middlewares.isAuthorized,
      c.listByPublication.bind(c),
    );

    // @ts-expect-error - to assign handlers
    this.router.get("/:commentId/details", c.getCommentById.bind(c));

    this.router.post(
      "/:publicationId",
      // @ts-expect-error - to assign handlers
      Middlewares.isAuthorized,
      c.create.bind(c),
    );

    this.router.delete(
      "/:commentId",
      // @ts-expect-error - to assign handlers
      Middlewares.isAuthorized,
      c.delete.bind(c),
    );

    // @ts-expect-error - to assign handlers
    this.router.put("/:commentId", Middlewares.isAuthorized, c.like.bind(c));
  }
}
