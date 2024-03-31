import {Request, Response} from "express";
import {create_story_schema, uuid_schema} from "../validators";
import status_codes from '@instamenta/http-status-codes'
import statusCodes from '@instamenta/http-status-codes'
import {controllerErrorHandler} from "../utilities";
import ShortRepository from "../repositories/short";
import {I_ShortPopulated} from "../types/short";
import {T_Comment, T_PopulatedComment} from "../types/comment";
import {z} from "zod";
import {notification_types} from "../utilities/enumerations";
import Notificator from "../utilities/notificator";

export default class ShortController {
	constructor(
		private readonly repository: ShortRepository,
		private readonly notificator: Notificator,
	) {
	}

	public async createShort(
		r: Request<{}, { videoUrl: string, description: string }>,
		w: Response<{ id: string }>
	) {
		try {
			const {userId, videoUrl, description} = create_story_schema.parse({
				userId: r.user.id,
				videoUrl: r.body.videoUrl,
				description: r.body.description
			});

			const shortId = await this.repository.createShort(userId, videoUrl, description);

			if (!shortId) {
				console.error(`${this.constructor.name}.createShort(): Failed to send message`);
				return w.status(status_codes.INTERNAL_SERVER_ERROR).end();
			}

			w.status(status_codes.CREATED).json({id: shortId});
		} catch (error) {
			controllerErrorHandler(error, w);
		}
	}

	public async listShorts(r: Request, w: Response<I_ShortPopulated[]>) {
		try {
			const userId = uuid_schema.parse(r.user.id);

			const shorts = await this.repository.listShorts(userId);

			if (!shorts) {
				console.error(`${this.constructor.name}.listShorts(): Failed to get stories`);
				return w.status(status_codes.INTERNAL_SERVER_ERROR).end();
			}

			w.status(status_codes.OK).json(shorts);
		} catch (error) {
			controllerErrorHandler(error, w);
		}
	}

	public async listShortsByUsername(r: Request<{ id: string }>, w: Response<I_ShortPopulated[]>) {
		try {
			const userId = uuid_schema.parse(r.params.id);

			const stories = await this.repository.listShortsById(userId);

			if (!stories) {
				console.error(`${this.constructor.name}.listStories(): Failed to get stories`);
				return w.status(status_codes.INTERNAL_SERVER_ERROR).end();
			}

			w.status(status_codes.OK).json(stories);
		} catch (error) {
			controllerErrorHandler(error, w);
		}
	}

	public async getShortById(r: Request<{ shortId: string }>, w: Response<I_ShortPopulated>) {
		try {
			const shortId = uuid_schema.parse(r.params.shortId);

			const short = await this.repository.getShortById(shortId);

			if (!short) {
				console.error(`${this.constructor.name}.getShortById(): Not found`, shortId);
				return w.status(statusCodes.NOT_FOUND).end();
			}

			w.status(statusCodes.OK).json(short);

		} catch (error) {
			controllerErrorHandler(error, w);
		}
	}

	public async likeShort(r: Request<{ id: string }>, w: Response<void>) {
		try {
			const shortId = uuid_schema.parse(r.params.id);
			const userId = uuid_schema.parse(r.user.id);

			const isLiked = await this.repository.likeShort(shortId, userId);

			w.status(statusCodes.OK).end();

			if (!isLiked) return console.log('Unliking short')
			console.log('Liking short')
			await this.notificator.handleNotification({
				type: notification_types.LIKE_SHORT,
				reference_id: shortId,
				recipient_id: '',
				sender_id: userId,
				content: '',
				seen: false,
			}).catch(console.error);

		} catch (error) {
			controllerErrorHandler(error, w);
		}
	}

	public async listCommentsByShort(r: Request<{ shortId: string }>, w: Response<T_PopulatedComment[]>) {
		try {
			const shortId = uuid_schema.parse(r.params.shortId);
			const userId = uuid_schema.parse(r.user.id);

			const comments = await this.repository.listCommentsByShortId(shortId, userId);

			w.status(statusCodes.OK).json(comments);
		} catch (error) {
			controllerErrorHandler(error, w);
		}
	}

	public async createShortComment(r: Request<{ shortId: string }, {}, { content: string }>, w: Response<T_Comment>) {
		try {
			const shortId = uuid_schema.parse(r.params.shortId);
			const userId = uuid_schema.parse(r.user.id);
			const content = z.string().min(1).parse(r.body.content);

			const comment = await this.repository.createShortComment(shortId, userId, content);

			w.status(statusCodes.CREATED).json(comment);

			await this.notificator.handleNotification({
				type: notification_types.COMMENT_SHORT,
				reference_id: shortId,
				recipient_id: '',
				sender_id: userId,
				content: content,
				seen: false,
			}).catch(console.error);

		} catch (error) {
			controllerErrorHandler(error, w);
		}
	}

	public async deleteShortComment(r: Request<{ commentId: string }>, w: Response<void>) {
		try {
			const commentId = uuid_schema.parse(r.params.commentId);
			const userId = uuid_schema.parse(r.user.id);

			await this.repository.deleteShortComment(commentId, userId);

			w.status(statusCodes.NO_CONTENT).end();
		} catch (error) {
			controllerErrorHandler(error, w);
		}
	}

	public async likeShortComment(r: Request<{ commentId: string }>, w: Response<void>) {
		try {
			const commentId = uuid_schema.parse(r.params.commentId);
			const userId = uuid_schema.parse(r.user.id);

			await this.repository.likeShortComment(commentId, userId);

			w.status(statusCodes.OK).end();

			await this.notificator.handleNotification({
				type: notification_types.LIKE_SHORT_COMMENT,
				reference_id: commentId,
				recipient_id: '',
				sender_id: userId,
				content: '',
				seen: false,
			}).catch(console.error);

		} catch (error) {
			controllerErrorHandler(error, w);
		}
	}

	public async getCommentById(r: Request<{ commentId: string }>, w: Response<T_Comment & { likes_count: number }>) {
		try {
			const commentId = uuid_schema.parse(r.params.commentId);

			const comment = await this.repository.getCommentById(commentId);

			if (!comment) {
				console.error(`${this.constructor.name}.getCommentById(): Not found`, commentId);
				return w.status(statusCodes.NOT_FOUND).end();
			}

			w.status(statusCodes.OK).json(comment);
		} catch (error) {
			controllerErrorHandler(error, w);
		}
	}
}
