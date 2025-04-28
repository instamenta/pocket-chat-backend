import { Middlewares } from "../middlewares";
import { StoryController } from "../controllers/story";
import { BaseRouter } from "../base/router.base";

export class StoryRouter extends BaseRouter<StoryController> {
  initialize(c: StoryController) {
    // @ts-expect-error - to assign handlers
    this.router.get("/", Middlewares.isAuthorized, c.listStories.bind(c));

    // @ts-expect-error - to assign handlers
    this.router.post("/", Middlewares.isAuthorized, c.createStory.bind(c));

    this.router.get(
      "/feed",
      // @ts-expect-error - to assign handlers
      Middlewares.isAuthorized,
      c.listFeedStories.bind(c),
    );

    this.router.get(
      "/:username",
      // @ts-expect-error - to assign handlers
      Middlewares.isAuthorized,
      c.listFriendStoriesByUsername.bind(c),
    );

    //* Likes
    // @ts-expect-error - to assign handlers
    this.router.put("/:id/like", Middlewares.isAuthorized, c.likeStory.bind(c));

    //* Comments
    this.router.get(
      "/comments/:shortId",
      // @ts-expect-error - to assign handlers
      Middlewares.isAuthorized,
      c.listCommentsByStory.bind(c),
    );

    this.router.post(
      "/comments/:shortId",
      // @ts-expect-error - to assign handlers
      Middlewares.isAuthorized,
      c.createStoryComment.bind(c),
    );

    this.router.delete(
      "/comments/:commentId",
      // @ts-expect-error - to assign handlers
      Middlewares.isAuthorized,
      c.deleteStoryComment.bind(c),
    );

    this.router.put(
      "/comments/:commentId",
      // @ts-expect-error - to assign handlers
      Middlewares.isAuthorized,
      c.likeStoryComment.bind(c),
    );
  }
}
