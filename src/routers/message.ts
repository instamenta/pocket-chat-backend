import { Middlewares } from "../middlewares";
import { MessageController } from "../controllers";
import { BaseRouter } from "../base/router.base";

export class MessageRouter extends BaseRouter<MessageController> {
  protected initialize(c: MessageController) {
    // @ts-expect-error - to assign handlers
    this.router.post("/", Middlewares.isAuthorized, c.sendMessage.bind(c));

    this.router.put(
      "/:id",
      // @ts-expect-error - to assign handlers
      Middlewares.isAuthorized,
      c.updateMessageStatus.bind(c),
    );

    this.router.get(
      "/conversations",
      // @ts-expect-error - to assign handlers
      Middlewares.isAuthorized,
      c.listConversations.bind(c),
    );
    this.router.get("/:friendshipId", c.listMessagesByFriendship.bind(c));
    this.router.get("/:user1/:user2", c.listMessagesByUsers.bind(c));
  }
}
