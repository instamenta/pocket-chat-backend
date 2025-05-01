import { Request, Response } from "express";
import { NotificationRepository } from "../repositories/notification";
import { NotificationTypes } from "../utilities/enumerations";
import { BaseController } from "../base/controller.base";
import * as T from "../types";
export declare class NotificationController extends BaseController<NotificationRepository> {
    createNotification(_request: Request<object, object, {
        recipient: string;
        type: NotificationTypes;
        seen: boolean;
        content: string;
    }>, response: Response): void;
    listNotifications(request: Request<object, object, object, {
        filter?: "all" | "seen" | "unseen";
    }>, response: Response<T.Notification.PopulatedNotificationStruct[]>): Promise<void>;
    markNotificationAsSeen(request: Request<{
        id: string;
    }>, response: Response<void>): Promise<Response<void, Record<string, any>> | undefined>;
    markAllNotificationsAsSeen(request: Request, response: Response<void>): Promise<Response<void, Record<string, any>> | undefined>;
}
//# sourceMappingURL=notification.d.ts.map