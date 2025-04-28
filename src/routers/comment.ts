import { CommentController } from "../controllers";
import { Middlewares } from "../middlewares";
import { BaseRouter } from "../base/router.base";

export class CommentRouter extends BaseRouter<CommentController> {
  initialize(c: CommentController) {
    // @ts-expect-error - to assign handlers
    this.router.get(
      "/:publicationId",
      Middlewares.isAuthorized,
      c.listByPublication.bind(c),
    );
    // @ts-expect-error - to assign handlers
    this.router.get("/:commentId/details", c.getCommentById.bind(c));
    // @ts-expect-error - to assign handlers
    this.router.post(
      "/:publicationId",
      Middlewares.isAuthorized,
      c.create.bind(c),
    );
    // @ts-expect-error - to assign handlers
    this.router.delete(
      "/:commentId",
      Middlewares.isAuthorized,
      c.delete.bind(c),
    );
    // @ts-expect-error - to assign handlers
    this.router.put("/:commentId", Middlewares.isAuthorized, c.like.bind(c));
  }
}
