import {Request, Response} from "express";
import status_codes from '@instamenta/http-status-codes'
import statusCodes from '@instamenta/http-status-codes'
import ShortRepository from "../repositories/short";
import {z} from "zod";
import {notification_types} from "../utilities/enumerations";
import Notificator from "../utilities/notificator";
import BaseController from "../base/controller.base";
import Validate from "../validators";
import * as T from '../types'
import VLogger from "@instamenta/vlogger";

export default class ShortController extends BaseController<ShortRepository> {
	constructor(
		repository: ShortRepository,
		logger: VLogger,
		private readonly notificator: Notificator,
	) {
		super(repository, logger);
	}

	public async createShort(
		r: Request<{}, { videoUrl: string, description: string }>,
		w: Response<{ id: string }>
	) {
		this.log.log('createShort');
		try {
			const {userId, videoUrl, description} = Validate.create_story.parse({
				userId: r.user.id,
				videoUrl: r.body.videoUrl,
				description: r.body.description
			});

			const shortId = await this.repository.createShort(userId, videoUrl, description);

			if (!shortId) {
				this.log.error({e: `Failed to send message`});
				return w.status(status_codes.INTERNAL_SERVER_ERROR).end();
			}

			w.status(status_codes.CREATED).json({id: shortId});
		} catch (error) {
			this.errorHandler(error, w);
		}
	}

	public async listShorts(r: Request, w: Response<T.Short.Populated[]>) {
		this.log.log('listShorts');
		try {
			const userId = Validate.uuid.parse(r.user.id);

			const shorts = await this.repository.listShorts(userId);

			if (!shorts) {
				this.log.error({e: `Failed to get stories`, m: userId});
				return w.status(status_codes.INTERNAL_SERVER_ERROR).end();
			}

			w.status(status_codes.OK).json(shorts);
		} catch (error) {
			this.errorHandler(error, w);
		}
	}

	public async listShortsByUsername(r: Request<{ id: string }>, w: Response<T.Short.Populated[]>) {
		this.log.log('listShortsByUsername');
		try {
			const userId = Validate.uuid.parse(r.params.id);

			const stories = await this.repository.listShortsById(userId);

			if (!stories) {
				this.log.error({e: 'Failed to get stories', m: userId})
				return w.status(status_codes.INTERNAL_SERVER_ERROR).end();
			}

			w.status(status_codes.OK).json(stories);
		} catch (error) {
			this.errorHandler(error, w);
		}
	}

	public async getShortById(r: Request<{ shortId: string }>, w: Response<T.Short.Populated>) {
		this.log.log('getShortById');
		try {
			const shortId = Validate.uuid.parse(r.params.shortId);

			const short = await this.repository.getShortById(shortId);

			if (!short) {
				this.log.error({e: `Not found`, m: shortId});
				return w.status(statusCodes.NOT_FOUND).end();
			}

			w.status(statusCodes.OK).json(short);

		} catch (error) {
			this.errorHandler(error, w);
		}
	}

	public async likeShort(r: Request<{ id: string }>, w: Response<void>) {
		this.log.log('likeShort');
		try {
			const shortId = Validate.uuid.parse(r.params.id);
			const userId = Validate.uuid.parse(r.user.id);

			const isLiked = await this.repository.likeShort(shortId, userId);

			w.status(statusCodes.OK).end();

			if (!isLiked) {
				return this.log.info({m: 'Unliking short'});
			} else {
				this.log.info({m: 'Liking short'});
			}

			await this.notificator.handleNotification({
				type: notification_types.LIKE_SHORT,
				reference_id: shortId,
				recipient_id: '',
				sender_id: userId,
				content: '',
				seen: false,
			})
				.catch(e => this.log.error({e}));

		} catch (error) {
			this.errorHandler(error, w);
		}
	}

	public async listCommentsByShort(r: Request<{ shortId: string }>, w: Response<T.Comment.Populated[]>) {
		this.log.log('listCommentsByShort');
		try {
			const shortId = Validate.uuid.parse(r.params.shortId);
			const userId = Validate.uuid.parse(r.user.id);

			const comments = await this.repository.listCommentsByShortId(shortId, userId);

			w.status(statusCodes.OK).json(comments);
		} catch (error) {
			this.errorHandler(error, w);
		}
	}

	public async createShortComment(r: Request<{ shortId: string }, {}, {
		content: string
	}>, w: Response<T.Comment.Comment>) {
		this.log.log('createShortComment');
		try {
			const shortId = Validate.uuid.parse(r.params.shortId);
			const userId = Validate.uuid.parse(r.user.id);
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
			})
				.catch(e => this.log.error({e}));

		} catch (error) {
			this.errorHandler(error, w);
		}
	}

	public async deleteShortComment(r: Request<{ commentId: string }>, w: Response<void>) {
		this.log.log('deleteShortComment');
		try {
			const commentId = Validate.uuid.parse(r.params.commentId);
			const userId = Validate.uuid.parse(r.user.id);

			await this.repository.deleteShortComment(commentId, userId);

			w.status(statusCodes.NO_CONTENT).end();
		} catch (error) {
			this.errorHandler(error, w);
		}
	}

	public async likeShortComment(r: Request<{ commentId: string }>, w: Response<void>) {
		this.log.log('likeShortComment');
		try {
			const commentId = Validate.uuid.parse(r.params.commentId);
			const userId = Validate.uuid.parse(r.user.id);

			await this.repository.likeShortComment(commentId, userId);

			w.status(statusCodes.OK).end();

			await this.notificator.handleNotification({
				type: notification_types.LIKE_SHORT_COMMENT,
				reference_id: commentId,
				recipient_id: '',
				sender_id: userId,
				content: '',
				seen: false,
			})
				.catch((e) => this.log.error({e}));

		} catch (error) {
			this.errorHandler(error, w);
		}
	}

	public async getCommentById(r: Request<{ commentId: string }>, w: Response<T.Comment.Comment & {
		likes_count: number
	}>) {
		this.log.log('getCommentById');
		try {
			const commentId = Validate.uuid.parse(r.params.commentId);

			const comment = await this.repository.getCommentById(commentId);

			if (!comment) {
				this.log.error({m: `Not found ${commentId}`, e: ''});
				return w.status(statusCodes.NOT_FOUND).end();
			}

			w.status(statusCodes.OK).json(comment);
		} catch (error) {
			this.errorHandler(error, w);
		}
	}
}
