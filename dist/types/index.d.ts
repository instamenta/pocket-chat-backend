import * as U from "./unions";
import * as User from "./user";
import * as Story from "./storyStruct";
import * as Short from "./shortStruct";
import * as Publication from "./publicationStruct";
import * as Message from "./messageStruct";
import * as Live from "./live";
import * as Group from "./groupStruct";
import * as Comment from "./comments";
import * as Notification from "./notificationStruct";
import * as Friend from "./friend";
export { U, User, Live, Group, Story, Short, Friend, Message, Comment, Publication, Notification, };
declare module "express" {
    interface Request {
        user: User.UserDataPayloadStruct;
        cookies: Record<string, string>;
    }
}
//# sourceMappingURL=index.d.ts.map