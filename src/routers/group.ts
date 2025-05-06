import { Middlewares } from "../middlewares";
import { GroupController } from "../controllers";
import { BaseRouter } from "../base/router.base";

export class GroupRouter extends BaseRouter<GroupController> {
  protected initialize(c: GroupController) {
    // @ts-expect-error - to assign handlers
    this.router.get("/", Middlewares.isAuthorized, c.listGroups.bind(c));

    // @ts-expect-error - to assign handlers
    this.router.get("/:id", Middlewares.isAuthorized, c.getGroupById.bind(c));

    this.router.get("/list/:userId", c.listGroupsByUser.bind(c));

    this.router.get(
      "/member/:id",
      // @ts-expect-error - to assign handlers
      Middlewares.isAuthorized,
      c.getMembersByGroupId.bind(c),
    );

    this.router.get(
      "/post/:groupId",
      // @ts-expect-error - to assign handlers
      Middlewares.isAuthorized,
      c.listPublications.bind(c),
    );

    // @ts-expect-error - to assign handlers
    this.router.post("/", Middlewares.isAuthorized, c.createGroup.bind(c));

    this.router.post(
      "/post",
      // @ts-expect-error - to assign handlers
      Middlewares.isAuthorized,
      c.createPublication.bind(c),
    );

    // @ts-expect-error - to assign handlers
    this.router.put("/join/:id", Middlewares.isAuthorized, c.joinGroup.bind(c));

    this.router.put(
      "/leave/:id",
      // @ts-expect-error - to assign handlers
      Middlewares.isAuthorized,
      c.leaveGroup.bind(c),
    );

    this.router.put(
      "/:groupId/:recipientId",
      // @ts-expect-error - to assign handlers
      Middlewares.isAuthorized,
      c.changeRole.bind(c),
    );

    this.router.delete(
      "/:groupId",
      // @ts-expect-error - to assign handlers
      Middlewares.isAuthorized,
      c.removeGroup.bind(c),
    );

    this.router.delete(
      "/:groupId/:recipientId",
      // @ts-expect-error - to assign handlers
      Middlewares.isAuthorized,
      c.removeMember.bind(c),
    );
  }
}
