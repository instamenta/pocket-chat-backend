import { NotificationRepository, PublicationRepository, CommentRepository, ShortRepository, StoryRepository } from "../repositories";
import VLogger from "@instamenta/vlogger";
import { NotificationData } from "../types/notifications";
export declare class Notificator {
    #private;
    private readonly repository;
    private readonly publication;
    private readonly comment;
    private readonly short;
    private readonly story;
    private readonly log;
    constructor(repository: NotificationRepository, publication: PublicationRepository, comment: CommentRepository, short: ShortRepository, story: StoryRepository, logger: VLogger);
    handleNotification(data: NotificationData): Promise<void>;
}
//# sourceMappingURL=notificator.d.ts.map