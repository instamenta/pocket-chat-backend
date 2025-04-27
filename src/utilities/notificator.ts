import {NotificationRepository} from "../repositories/notification";
import {notification_types} from "./enumerations";
import {PublicationsRepository} from "../repositories/publication";
import {CommentRepository} from "../repositories/comment";
import {ShortRepository} from "../repositories/short";
import {StoryRepository} from "../repositories/story";
import {NotImplementedError} from '@instamenta/vanilla-utility-pack';
import * as T from '../types'

export class Notificator {
	constructor(
		private readonly repository: NotificationRepository,
		private readonly publication: PublicationsRepository,
		private readonly comment: CommentRepository,
		private readonly short: ShortRepository,
		private readonly story: StoryRepository,
	) {
	}

	public async handleNotification(data: T.Notification.Data) {
		console.log(`${this.constructor.name}.handleNotification(): Creating notification of type`, data.type);

		switch (data.type) {
			case notification_types.LIKE:
				await this.#handleLikeNotification(data);
				break;
			case notification_types.MESSAGE:
				await this.#handleMessageNotification(data);
				break;
			case notification_types.COMMENT:
				await this.#handleCommentNotification(data);
				break;
			case notification_types.LIKE_COMMENT:
				await this.#handleLikeCommentNotification(data);
				break;
			//* Short Handlers
			case notification_types.LIKE_SHORT:
				await this.#handleLikeShortNotification(data);
				break;
			case notification_types.COMMENT_SHORT:
				await this.#handleCommentShortNotification(data);
				break;
			case notification_types.LIKE_SHORT_COMMENT:
				await this.#handleLikeShortCommentNotification(data);
				break;
			//* Story Handlers
			case notification_types.LIKE_STORY:
				await this.#handleLikeStoryNotification(data);
				break;
			case notification_types.COMMENT_STORY:
				await this.#handleCommentStoryNotification(data);
				break;
			case notification_types.LIKE_STORY_COMMENT:
				await this.#handleLikeStoryCommentNotification(data);
				break;
			case notification_types.CALL:
				throw new NotImplementedError(`TODO: Notification handler for type ${data.type} is not implemented`)
			case notification_types.LIVE:
				throw new NotImplementedError(`TODO: Notification handler for type ${data.type} is not implemented`)
		}
	}

	/**
	 ** Like Publication
	 */
	async #handleLikeNotification(data: T.Notification.Data) {
		if (!data.reference_id) { console.error('No reference id for like notification', data); return; }

		const [publication, notification] = await Promise.all([
			this.publication.getPublicationById(data.reference_id),
			this.repository.getNotificationByReferenceId(data.reference_id),
		]);

		if (!publication) {
			console.error(`${this.constructor.name}.#handleLikeNotification(): Publication not found`, data); return;
		}
		data.content = publication.likes_count.toString();
		data.recipient_id = publication.publisher_id;

		if (notification) {
			await this.repository.updateNotification(notification.id, data.content, data.seen, data.type, data.sender_id);
		} else {
			await this.repository.createNotification(data);
		}
	}

	/**
	 ** Chat Message
	 */
	async #handleMessageNotification(data: T.Notification.Data) {
		const notification = await this.repository.getNotificationBySenderAndRecipient(
			data.sender_id,
			data.recipient_id,
			data.type
		);

		if (notification) {
			await this.repository.updateNotification(notification.id, data.content, data.seen, data.type, data.sender_id);
		} else {
			await this.repository.createNotification(data);
		}
	}

	/**
	 ** Comment Publication
	 */
	async #handleCommentNotification(data: T.Notification.Data) {
		if (!data.reference_id) { console.error('No reference id for comment notification', data); return; }

		const [publication, notification] = await Promise.all([
			this.publication.getPublicationById(data.reference_id),
			this.repository.getNotificationByReferenceId(data.reference_id),
		]);

		if (!publication) {
			console.error(`${this.constructor.name}.#handleCommentNotification(): Publication not found`, data); return;
		}

		data.recipient_id = publication.publisher_id;

		if (notification) {
			await this.repository.updateNotification(notification.id, data.content, data.seen, data.type, data.sender_id);
		} else {
			await this.repository.createNotification(data);
		}
	}

	/**
	 ** Like Comment Publication
	 */
	async #handleLikeCommentNotification(data: T.Notification.Data) {
		if (!data.reference_id) { console.error('No reference id for comment notification', data); return; }

		const [comment, notification] = await Promise.all([
			this.comment.getCommentById(data.reference_id),
			this.repository.getNotificationByReferenceId(data.reference_id),
		]);

		if (!comment) {
			console.error(`${this.constructor.name}.#handleLikeCommentNotification(): Comment not found`, data); return;
		}

		data.content = comment.likes_count.toString();
		data.recipient_id = comment.user_id;

		if (notification) {
			await this.repository.updateNotification(notification.id, data.content, data.seen, data.type, data.sender_id);
		} else {
			await this.repository.createNotification(data);
		}
	}

	/**
	 ** Like Short
	 */
	async #handleLikeShortNotification(data: T.Notification.Data) {
		if (!data.reference_id) { console.error('No reference id for like short', data); return; }

		const [short, notification] = await Promise.all([
			this.short.getShortById(data.reference_id),
			this.repository.getNotificationByReferenceId(data.reference_id),
		]);

		if (!short) {
			console.error(`${this.constructor.name}.#handleLikeShortNotification(): Not found`, data); return;
		}

		data.content = short.likes_count.toString();
		data.recipient_id = short.user_id;

		if (notification) {
			await this.repository.updateNotification(notification.id, data.content, data.seen, data.type, data.sender_id);
		} else {
			await this.repository.createNotification(data);
		}
	}

	/**
	 ** Comment Short
	 */
	async #handleCommentShortNotification(data: T.Notification.Data) {
		if (!data.reference_id) { console.error('No reference id for comment notification', data); return; }

		const [short, notification] = await Promise.all([
			this.short.getShortById(data.reference_id),
			this.repository.getNotificationByReferenceId(data.reference_id),
		]);

		if (!short) {
			console.error(`${this.constructor.name}.#handleCommentShortNotification(): Short not found`, data); return;
		}

		data.recipient_id = short.user_id;

		if (notification) {
			await this.repository.updateNotification(notification.id, data.content, data.seen, data.type, data.sender_id);
		} else {
			await this.repository.createNotification(data);
		}
	}

	/**
	 ** Like Comment Short
	 */
	async #handleLikeShortCommentNotification(data: T.Notification.Data) {
		if (!data.reference_id) { console.error('No reference id for comment notification', data); return; }

		const [comment, notification] = await Promise.all([
			this.short.getCommentById(data.reference_id),
			this.repository.getNotificationByReferenceId(data.reference_id),
		]);

		if (!comment) {
			console.error(`${this.constructor.name}.#handleLikeShortCommentNotification(): Comment not found`, data); return;
		}

		data.content = comment.likes_count.toString();
		data.recipient_id = comment.user_id;

		if (notification) {
			await this.repository.updateNotification(notification.id, data.content, data.seen, data.type, data.sender_id);
		} else {
			await this.repository.createNotification(data);
		}
	}

	/**
	 ** Like Story
	 */
	async #handleLikeStoryNotification(data: T.Notification.Data) {
		if (!data.reference_id) { console.error('No reference id for like story', data); return; }

		const [story, notification] = await Promise.all([
			this.story.getStoryById(data.reference_id),
			this.repository.getNotificationByReferenceId(data.reference_id),
		]);

		if (!story) {
			console.error(`${this.constructor.name}.#handleLikeStorytNotification(): Not found`, data); return;
		}

		data.content = story.likes_count.toString();
		data.recipient_id = story.user_id;

		if (notification) {
			await this.repository.updateNotification(notification.id, data.content, data.seen, data.type, data.sender_id);
		} else {
			await this.repository.createNotification(data);
		}
	}

	/**
	 ** Comment Story
	 */
	async #handleCommentStoryNotification(data: T.Notification.Data) {
		if (!data.reference_id) { console.error('No reference id for comment notification', data); return; }

		const [publication, notification] = await Promise.all([
			this.publication.getPublicationById(data.reference_id),
			this.repository.getNotificationByReferenceId(data.reference_id),
		]);

		if (!publication) {
			console.error(`${this.constructor.name}.#handleCommentStoryNotification(): Comment not found`, data); return;
		}

		data.recipient_id = publication.publisher_id;

		if (notification) {
			await this.repository.updateNotification(notification.id, data.content, data.seen, data.type, data.sender_id);
		} else {
			await this.repository.createNotification(data);
		}
	}

	/**
	 ** Like Comment Story
	 */
	async #handleLikeStoryCommentNotification(data: T.Notification.Data) {
		if (!data.reference_id) { console.error('No reference id for comment notification', data); return; }

		const [comment, notification] = await Promise.all([
			this.story.getCommentById(data.reference_id),
			this.repository.getNotificationByReferenceId(data.reference_id),
		]);

		if (!comment) {
			console.error(`${this.constructor.name}.#handleLikeStoryCommentNotification(): Comment not found`, data); return;
		}

		data.content = comment.likes_count.toString();
		data.recipient_id = comment.user_id;

		if (notification) {
			await this.repository.updateNotification(notification.id, data.content, data.seen, data.type, data.sender_id);
		} else {
			await this.repository.createNotification(data);
		}
	}
}