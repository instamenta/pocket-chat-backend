import { Request, Response } from "express";
import NotificationRepository from "../repositories/notification";
import { notification_types } from "../utilities/enumerations";
import BaseController from "../base/controller.base";
import * as T from '../types';
export default class NotificationController extends BaseController<NotificationRepository> {
    createNotification(_request: Request<object, object, {
        recipient: string;
        type: notification_types;
        seen: boolean;
        content: string;
    }>, response: Response): void;
    listNotifications(r: Request<object, object, object, {
        filter?: 'all' | 'seen' | 'unseen';
    }>, w: Response<T.Notification.Populated[]>): Promise<void>;
    markNotificationAsSeen(r: Request<{
        id: string;
    }>, w: Response<void>): Promise<Response<void, Record<string, any>> | undefined>;
    markAllNotificationsAsSeen(r: Request, w: Response<void>): Promise<Response<void, Record<string, any>> | undefined>;
}
//# sourceMappingURL=notification.d.ts.map