import { Request, Response } from "express";
import NotificationRepository from "../repositories/notification";
import { notification_types } from "../utilities/enumerations";
import BaseController from "../base/controller.base";
import * as T from '../types';
export default class NotificationController extends BaseController<NotificationRepository> {
    createNotification(r: Request<{}, {}, {
        recipient: string;
        type: notification_types;
        seen: boolean;
        content: string;
    }>, w: Response): Promise<void>;
    listNotifications(r: Request<{}, {}, {}, {
        filter?: 'all' | 'seen' | 'unseen';
    }>, w: Response<T.Notification.Populated[]>): Promise<Response<T.Notification.Populated[], Record<string, any>> | undefined>;
    markNotificationAsSeen(r: Request<{
        id: string;
    }>, w: Response<void>): Promise<Response<void, Record<string, any>> | undefined>;
    markAllNotificationsAsSeen(r: Request, w: Response<void>): Promise<Response<void, Record<string, any>> | undefined>;
}
//# sourceMappingURL=notification.d.ts.map