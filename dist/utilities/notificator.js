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
    constructor(repository, publication, comment, short, story) {
        this.repository = repository;
        this.publication = publication;
        this.comment = comment;
        this.short = short;
        this.story = story;
    }
    async handleNotification(data) {
        console.log(`${this.constructor.name}.handleNotification(): Creating notification of type`, data.type);
        switch (data.type) {
            case enumerations_1.notification_types.LIKE:
                await this.#handleLikeNotification(data);
                break;
            case enumerations_1.notification_types.MESSAGE:
                await this.#handleMessageNotification(data);
                break;
            case enumerations_1.notification_types.COMMENT:
                await this.#handleCommentNotification(data);
                break;
            case enumerations_1.notification_types.LIKE_COMMENT:
                await this.#handleLikeCommentNotification(data);
                break;
            case enumerations_1.notification_types.LIKE_SHORT:
                await this.#handleLikeShortNotification(data);
                break;
            case enumerations_1.notification_types.COMMENT_SHORT:
                await this.#handleCommentShortNotification(data);
                break;
            case enumerations_1.notification_types.LIKE_SHORT_COMMENT:
                await this.#handleLikeShortCommentNotification(data);
                break;
            case enumerations_1.notification_types.LIKE_STORY:
                await this.#handleLikeStoryNotification(data);
                break;
            case enumerations_1.notification_types.COMMENT_STORY:
                await this.#handleCommentStoryNotification(data);
                break;
            case enumerations_1.notification_types.LIKE_STORY_COMMENT:
                await this.#handleLikeStoryCommentNotification(data);
                break;
            case enumerations_1.notification_types.CALL:
                throw new vanilla_utility_pack_1.NotImplementedError(`TODO: Notification handler for type ${data.type} is not implemented`);
            case enumerations_1.notification_types.LIVE:
                throw new vanilla_utility_pack_1.NotImplementedError(`TODO: Notification handler for type ${data.type} is not implemented`);
        }
    }
    async #handleLikeNotification(data) {
        if (!data.reference_id) {
            console.error('No reference id for like notification', data);
            return;
        }
        const [publication, notification] = await Promise.all([
            this.publication.getPublicationById(data.reference_id),
            this.repository.getNotificationByReferenceId(data.reference_id),
        ]);
        if (!publication) {
            console.error(`${this.constructor.name}.#handleLikeNotification(): Publication not found`, data);
            return;
        }
        data.content = publication.likes_count.toString();
        data.recipient_id = publication.publisher_id;
        if (notification) {
            await this.repository.updateNotification(notification.id, data.content, data.seen, data.type, data.sender_id);
        }
        else {
            await this.repository.createNotification(data);
        }
    }
    async #handleMessageNotification(data) {
        const notification = await this.repository.getNotificationBySenderAndRecipient(data.sender_id, data.recipient_id, data.type);
        if (notification) {
            await this.repository.updateNotification(notification.id, data.content, data.seen, data.type, data.sender_id);
        }
        else {
            await this.repository.createNotification(data);
        }
    }
    async #handleCommentNotification(data) {
        if (!data.reference_id) {
            console.error('No reference id for comment notification', data);
            return;
        }
        const [publication, notification] = await Promise.all([
            this.publication.getPublicationById(data.reference_id),
            this.repository.getNotificationByReferenceId(data.reference_id),
        ]);
        if (!publication) {
            console.error(`${this.constructor.name}.#handleCommentNotification(): Publication not found`, data);
            return;
        }
        data.recipient_id = publication.publisher_id;
        if (notification) {
            await this.repository.updateNotification(notification.id, data.content, data.seen, data.type, data.sender_id);
        }
        else {
            await this.repository.createNotification(data);
        }
    }
    async #handleLikeCommentNotification(data) {
        if (!data.reference_id) {
            console.error('No reference id for comment notification', data);
            return;
        }
        const [comment, notification] = await Promise.all([
            this.comment.getCommentById(data.reference_id),
            this.repository.getNotificationByReferenceId(data.reference_id),
        ]);
        if (!comment) {
            console.error(`${this.constructor.name}.#handleLikeCommentNotification(): Comment not found`, data);
            return;
        }
        data.content = comment.likes_count.toString();
        data.recipient_id = comment.user_id;
        if (notification) {
            await this.repository.updateNotification(notification.id, data.content, data.seen, data.type, data.sender_id);
        }
        else {
            await this.repository.createNotification(data);
        }
    }
    async #handleLikeShortNotification(data) {
        if (!data.reference_id) {
            console.error('No reference id for like short', data);
            return;
        }
        const [short, notification] = await Promise.all([
            this.short.getShortById(data.reference_id),
            this.repository.getNotificationByReferenceId(data.reference_id),
        ]);
        if (!short) {
            console.error(`${this.constructor.name}.#handleLikeShortNotification(): Not found`, data);
            return;
        }
        data.content = short.likes_count.toString();
        data.recipient_id = short.user_id;
        if (notification) {
            await this.repository.updateNotification(notification.id, data.content, data.seen, data.type, data.sender_id);
        }
        else {
            await this.repository.createNotification(data);
        }
    }
    async #handleCommentShortNotification(data) {
        if (!data.reference_id) {
            console.error('No reference id for comment notification', data);
            return;
        }
        const [short, notification] = await Promise.all([
            this.short.getShortById(data.reference_id),
            this.repository.getNotificationByReferenceId(data.reference_id),
        ]);
        if (!short) {
            console.error(`${this.constructor.name}.#handleCommentShortNotification(): Short not found`, data);
            return;
        }
        data.recipient_id = short.user_id;
        if (notification) {
            await this.repository.updateNotification(notification.id, data.content, data.seen, data.type, data.sender_id);
        }
        else {
            await this.repository.createNotification(data);
        }
    }
    async #handleLikeShortCommentNotification(data) {
        if (!data.reference_id) {
            console.error('No reference id for comment notification', data);
            return;
        }
        const [comment, notification] = await Promise.all([
            this.short.getCommentById(data.reference_id),
            this.repository.getNotificationByReferenceId(data.reference_id),
        ]);
        if (!comment) {
            console.error(`${this.constructor.name}.#handleLikeShortCommentNotification(): Comment not found`, data);
            return;
        }
        data.content = comment.likes_count.toString();
        data.recipient_id = comment.user_id;
        if (notification) {
            await this.repository.updateNotification(notification.id, data.content, data.seen, data.type, data.sender_id);
        }
        else {
            await this.repository.createNotification(data);
        }
    }
    async #handleLikeStoryNotification(data) {
        if (!data.reference_id) {
            console.error('No reference id for like story', data);
            return;
        }
        const [story, notification] = await Promise.all([
            this.story.getStoryById(data.reference_id),
            this.repository.getNotificationByReferenceId(data.reference_id),
        ]);
        if (!story) {
            console.error(`${this.constructor.name}.#handleLikeStorytNotification(): Not found`, data);
            return;
        }
        data.content = story.likes_count.toString();
        data.recipient_id = story.user_id;
        if (notification) {
            await this.repository.updateNotification(notification.id, data.content, data.seen, data.type, data.sender_id);
        }
        else {
            await this.repository.createNotification(data);
        }
    }
    async #handleCommentStoryNotification(data) {
        if (!data.reference_id) {
            console.error('No reference id for comment notification', data);
            return;
        }
        const [publication, notification] = await Promise.all([
            this.publication.getPublicationById(data.reference_id),
            this.repository.getNotificationByReferenceId(data.reference_id),
        ]);
        if (!publication) {
            console.error(`${this.constructor.name}.#handleCommentStoryNotification(): Comment not found`, data);
            return;
        }
        data.recipient_id = publication.publisher_id;
        if (notification) {
            await this.repository.updateNotification(notification.id, data.content, data.seen, data.type, data.sender_id);
        }
        else {
            await this.repository.createNotification(data);
        }
    }
    async #handleLikeStoryCommentNotification(data) {
        if (!data.reference_id) {
            console.error('No reference id for comment notification', data);
            return;
        }
        const [comment, notification] = await Promise.all([
            this.story.getCommentById(data.reference_id),
            this.repository.getNotificationByReferenceId(data.reference_id),
        ]);
        if (!comment) {
            console.error(`${this.constructor.name}.#handleLikeStoryCommentNotification(): Comment not found`, data);
            return;
        }
        data.content = comment.likes_count.toString();
        data.recipient_id = comment.user_id;
        if (notification) {
            await this.repository.updateNotification(notification.id, data.content, data.seen, data.type, data.sender_id);
        }
        else {
            await this.repository.createNotification(data);
        }
    }
}
exports.Notificator = Notificator;
