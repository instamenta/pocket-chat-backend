"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notificator = void 0;
const enumerations_1 = require("./enumerations");
const vanilla_utility_pack_1 = require("@instamenta/vanilla-utility-pack");
class Notificator {
    repository;
    publication;
    comment;
    short;
    story;
    log;
    constructor(repository, publication, comment, short, story, logger) {
        this.repository = repository;
        this.publication = publication;
        this.comment = comment;
        this.short = short;
        this.story = story;
        this.log = logger.getVlogger(this.constructor.name);
    }
    async handleNotification(data) {
        this.log.info({ f: "handleNotification", m: 'Creating notification of type' });
        switch (data.type) {
            case enumerations_1.NotificationTypes.LIKE:
                await this.#handleLikeNotification(data);
                break;
            case enumerations_1.NotificationTypes.MESSAGE:
                await this.#handleMessageNotification(data);
                break;
            case enumerations_1.NotificationTypes.COMMENT:
                await this.#handleCommentNotification(data);
                break;
            case enumerations_1.NotificationTypes.LIKE_COMMENT:
                await this.#handleLikeCommentNotification(data);
                break;
            case enumerations_1.NotificationTypes.LIKE_SHORT:
                await this.#handleLikeShortNotification(data);
                break;
            case enumerations_1.NotificationTypes.COMMENT_SHORT:
                await this.#handleCommentShortNotification(data);
                break;
            case enumerations_1.NotificationTypes.LIKE_SHORT_COMMENT:
                await this.#handleLikeShortCommentNotification(data);
                break;
            case enumerations_1.NotificationTypes.LIKE_STORY:
                await this.#handleLikeStoryNotification(data);
                break;
            case enumerations_1.NotificationTypes.COMMENT_STORY:
                await this.#handleCommentStoryNotification(data);
                break;
            case enumerations_1.NotificationTypes.LIKE_STORY_COMMENT:
                await this.#handleLikeStoryCommentNotification(data);
                break;
            case enumerations_1.NotificationTypes.CALL:
                throw new vanilla_utility_pack_1.NotImplementedError(`TODO: Notification handler for type ${String(data.type)} is not implemented`);
            case enumerations_1.NotificationTypes.LIVE:
                throw new vanilla_utility_pack_1.NotImplementedError(`TODO: Notification handler for type ${String(data.type)} is not implemented`);
        }
    }
    async #handleLikeNotification(data) {
        if (!data.referenceId) {
            this.log.error({ e: data, m: 'No reference id for like notification' });
            return;
        }
        const [publication, notification] = await Promise.all([
            this.publication.getPublicationById(data.referenceId),
            this.repository.getNotificationByReferenceId(data.referenceId),
        ]);
        if (!publication) {
            this.log.error({ f: '#handleLikeNotification', m: 'Publication not found', e: data });
            return;
        }
        data.content = publication.likes_count.toString();
        data.recipientId = publication.publisher_id;
        if (notification) {
            await this.repository.updateNotification(notification.id, data.content, data.seen, data.type, data.senderId);
        }
        else {
            await this.repository.createNotification(data);
        }
    }
    async #handleMessageNotification(data) {
        const notification = await this.repository.getNotificationBySenderAndRecipient(data.senderId, data.recipientId, data.type);
        if (notification) {
            await this.repository.updateNotification(notification.id, data.content, data.seen, data.type, data.senderId);
        }
        else {
            await this.repository.createNotification(data);
        }
    }
    async #handleCommentNotification(data) {
        if (!data.referenceId) {
            this.log.error({ e: data, m: 'No reference id for comment notification' });
            return;
        }
        const [publication, notification] = await Promise.all([
            this.publication.getPublicationById(data.referenceId),
            this.repository.getNotificationByReferenceId(data.referenceId),
        ]);
        if (!publication) {
            this.log.error({ f: '#handleCommentNotification', m: 'Publication not found', e: data });
            return;
        }
        data.recipientId = publication.publisher_id;
        if (notification) {
            await this.repository.updateNotification(notification.id, data.content, data.seen, data.type, data.senderId);
        }
        else {
            await this.repository.createNotification(data);
        }
    }
    async #handleLikeCommentNotification(data) {
        if (!data.referenceId) {
            this.log.error({ e: data, m: 'No reference id for comment notification' });
            return;
        }
        const [comment, notification] = await Promise.all([
            this.comment.getCommentById(data.referenceId),
            this.repository.getNotificationByReferenceId(data.referenceId),
        ]);
        if (!comment) {
            this.log.error({ f: '#handleLikeCommentNotification', m: 'Comment not found', e: data });
            return;
        }
        data.content = comment.likes_count.toString();
        data.recipientId = comment.user_id;
        if (notification) {
            await this.repository.updateNotification(notification.id, data.content, data.seen, data.type, data.senderId);
        }
        else {
            await this.repository.createNotification(data);
        }
    }
    async #handleLikeShortNotification(data) {
        if (!data.referenceId) {
            this.log.error({ e: data, m: 'No reference id for like short' });
            return;
        }
        const [short, notification] = await Promise.all([
            this.short.getShortById(data.referenceId),
            this.repository.getNotificationByReferenceId(data.referenceId),
        ]);
        if (!short) {
            this.log.error({ f: '#handleLikeShortNotification', m: 'Not found', e: data });
            return;
        }
        data.content = short.likes_count.toString();
        data.recipientId = short.user_id;
        if (notification) {
            await this.repository.updateNotification(notification.id, data.content, data.seen, data.type, data.senderId);
        }
        else {
            await this.repository.createNotification(data);
        }
    }
    async #handleCommentShortNotification(data) {
        if (!data.referenceId) {
            this.log.error({ e: data, m: 'No reference id for comment notification' });
            return;
        }
        const [short, notification] = await Promise.all([
            this.short.getShortById(data.referenceId),
            this.repository.getNotificationByReferenceId(data.referenceId),
        ]);
        if (!short) {
            this.log.error({ f: '#handleCommentShortNotification', m: 'Short not found', e: data });
            return;
        }
        data.recipientId = short.user_id;
        if (notification) {
            await this.repository.updateNotification(notification.id, data.content, data.seen, data.type, data.senderId);
        }
        else {
            await this.repository.createNotification(data);
        }
    }
    async #handleLikeShortCommentNotification(data) {
        if (!data.referenceId) {
            this.log.error({ e: data, m: 'No reference id for comment notification' });
            return;
        }
        const [comment, notification] = await Promise.all([
            this.short.getCommentById(data.referenceId),
            this.repository.getNotificationByReferenceId(data.referenceId),
        ]);
        if (!comment) {
            this.log.error({ f: '#handleLikeShortCommentNotification', m: 'Comment not found', e: data });
            return;
        }
        data.content = comment.likes_count.toString();
        data.recipientId = comment.user_id;
        if (notification) {
            await this.repository.updateNotification(notification.id, data.content, data.seen, data.type, data.senderId);
        }
        else {
            await this.repository.createNotification(data);
        }
    }
    async #handleLikeStoryNotification(data) {
        if (!data.referenceId) {
            this.log.error({ e: data, m: 'No reference id for like notification' });
            return;
        }
        const [story, notification] = await Promise.all([
            this.story.getStoryById(data.referenceId),
            this.repository.getNotificationByReferenceId(data.referenceId),
        ]);
        if (!story) {
            this.log.error({ f: '#handleLikeStoryNotification', m: 'Story not found', e: data });
            return;
        }
        data.content = story.likes_count.toString();
        data.recipientId = story.user_id;
        if (notification) {
            await this.repository.updateNotification(notification.id, data.content, data.seen, data.type, data.senderId);
        }
        else {
            await this.repository.createNotification(data);
        }
    }
    async #handleCommentStoryNotification(data) {
        if (!data.referenceId) {
            this.log.error({ e: data, m: 'No reference id for comment notification' });
            return;
        }
        const [publication, notification] = await Promise.all([
            this.publication.getPublicationById(data.referenceId),
            this.repository.getNotificationByReferenceId(data.referenceId),
        ]);
        if (!publication) {
            this.log.error({ f: '#handleCommentStoryNotification', m: 'Publication not found', e: data });
            return;
        }
        data.recipientId = publication.publisher_id;
        if (notification) {
            await this.repository.updateNotification(notification.id, data.content, data.seen, data.type, data.senderId);
        }
        else {
            await this.repository.createNotification(data);
        }
    }
    async #handleLikeStoryCommentNotification(data) {
        if (!data.referenceId) {
            this.log.error({ e: data, m: 'No reference id for comment notification' });
            return;
        }
        const [comment, notification] = await Promise.all([
            this.story.getCommentById(data.referenceId),
            this.repository.getNotificationByReferenceId(data.referenceId),
        ]);
        if (!comment) {
            this.log.error({ f: '#handleLikeStoryCommentNotification', m: 'Comment not found', e: data });
            return;
        }
        data.content = comment.likes_count.toString();
        data.recipientId = comment.user_id;
        if (notification) {
            await this.repository.updateNotification(notification.id, data.content, data.seen, data.type, data.senderId);
        }
        else {
            await this.repository.createNotification(data);
        }
    }
}
exports.Notificator = Notificator;
