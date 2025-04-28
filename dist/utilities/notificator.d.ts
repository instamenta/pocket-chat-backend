import { NotificationRepository, PublicationRepository, CommentRepository, ShortRepository, StoryRepository } from "../repositories";
import * as T from "../types";
import VLogger from "@instamenta/vlogger";
export declare class Notificator {
    #private;
    private readonly repository;
    private readonly publication;
    private readonly comment;
    private readonly short;
    private readonly story;
    private readonly log;
    constructor(repository: NotificationRepository, publication: PublicationRepository, comment: CommentRepository, short: ShortRepository, story: StoryRepository, logger: VLogger);
    handleNotification(data: T.Notification.Data): Promise<void>;
}
//# sourceMappingURL=notificator.d.ts.map