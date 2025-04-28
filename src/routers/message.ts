import { Middlewares } from "../middlewares";
import { MessageController } from "../controllers/message";
import { BaseRouter } from "../base/router.base";

export class MessageRouter extends BaseRouter<MessageController> {
  initialize(c: MessageController) {
    // @ts-expect-error - to assign handlers
    this.router.post("/", Middlewares.isAuthorized, c.sendMessage.bind(c));
    // @ts-expect-error - to assign handlers
    this.router.put(
      "/:id",
      Middlewares.isAuthorized,
      c.updateMessageStatus.bind(c),
    );

    // @ts-expect-error - to assign handlers
    this.router.get(
      "/conversations",
      Middlewares.isAuthorized,
      c.listConversations.bind(c),
    );
    // @ts-expect-error - to assign handlers
    this.router.get("/:friendshipId", c.listMessagesByFriendship.bind(c));
    // @ts-expect-error - to assign handlers
    this.router.get("/:user1/:user2", c.listMessagesByUsers.bind(c));
  }
}
