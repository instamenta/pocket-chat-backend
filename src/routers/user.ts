import { UserController } from "../controllers/user";
import { Middlewares } from "../middlewares";
import { BaseRouter } from "../base/router.base";

export class UserRouter extends BaseRouter<UserController> {
  initialize(c: UserController) {
    // @ts-expect-error - to assign handlers
    this.router.post("/sign-up", Middlewares.isGuest, c.signUp.bind(c));
    // @ts-expect-error - to assign handlers
    this.router.post("/sign-in", Middlewares.isGuest, c.signIn.bind(c));

    // @ts-expect-error - to assign handlers
    this.router.get("/", c.listUsers.bind(c));
    // @ts-expect-error - to assign handlers
    this.router.get("/auth", Middlewares.isAuthorized, c.authUser.bind(c));
    // @ts-expect-error - to assign handlers
    this.router.get("/:id", c.getUserById.bind(c));
    // @ts-expect-error - to assign handlers
    this.router.get("/username/:username", c.getUserByUsername.bind(c));

    // @ts-expect-error - to assign handlers
    this.router.put(
      "/",
      Middlewares.isAuthorized,
      c.updateProfilePublicInformation.bind(c),
    );
    // @ts-expect-error - to assign handlers
    this.router.put(
      "/picture",
      Middlewares.isAuthorized,
      c.updateProfilePicture.bind(c),
    );
    // @ts-expect-error - to assign handlers
    this.router.put("/bio", Middlewares.isAuthorized, c.updateBio.bind(c));
  }
}
