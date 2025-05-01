import * as U from "./unions";
import * as User from "./user";
import * as Story from "./stories";
import * as Short from "./shorts";
import * as Publication from "./publications";
import * as Message from "./messages";
import * as Live from "./live";
import * as Group from "./groups";
import * as Comment from "./comments";
import * as Notification from "./notifications";
import * as Friend from "./friend";

export {
  U,
  User,
  Live,
  Group,
  Story,
  Short,
  Friend,
  Message,
  Comment,
  Publication,
  Notification,
};

declare module "express" {
  interface Request {
    user: User.UserDataPayloadStruct;
    cookies: Record<string, string>;
  }
}
