import { NotificationRepository } from "../repositories/notification";
import { PublicationRepository } from "../repositories/publication";
import { CommentRepository } from "../repositories/comment";
import { ShortRepository } from "../repositories/short";
import { StoryRepository } from "../repositories/story";
import * as T from '../types';
export declare class Notificator {
    #private;
    private readonly repository;
    private readonly publication;
    private readonly comment;
    private readonly short;
    private readonly story;
    constructor(repository: NotificationRepository, publication: PublicationRepository, comment: CommentRepository, short: ShortRepository, story: StoryRepository);
    handleNotification(data: T.Notification.Data): Promise<void>;
}
//# sourceMappingURL=notificator.d.ts.map