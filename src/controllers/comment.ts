import {Request, Response} from 'express';
import CommentRepository from '../repositories/comment';
import statusCodes from '@instamenta/http-status-codes';
import {z} from "zod";
import {notification_types} from "../utilities/enumerations";
import Notificator from "../utilities/notificator";
import BaseController from "../base/controller.base";
import Validate from "../validators";
import * as T from '../types'
import VLogger from "@instamenta/vlogger";

export default class CommentController extends BaseController<CommentRepository> {
	constructor(
		repository: CommentRepository,
		logger: VLogger,
		private readonly notificator: Notificator,
	) {
		super(repository, logger);
	}

	public async listByPublication(r: Request<{ publicationId: string }>, w: Response<T.Comment.Populated[]>) {
		this.log.log('listByPublication');
		try {
			const publicationId = Validate.uuid.parse(r.params.publicationId);
			const userId = Validate.uuid.parse(r.user.id);

			const comments = await this.repository.listCommentsByPublication(publicationId, userId);

			w.status(statusCodes.OK).json(comments);
		} catch (error) {
			this.errorHandler(error, w);
		}
	}

	public async create(r: Request<{ publicationId: string }, {}, { content: string }>, w: Response<T.Comment.Comment>) {
		this.log.log('create');
		try {
			const publicationId = Validate.uuid.parse(r.params.publicationId);
			const userId = Validate.uuid.parse(r.user.id);
			const content = z.string().min(1).parse(r.body.content);

			const comment = await this.repository.createComment(publicationId, userId, content);

			w.status(statusCodes.CREATED).json(comment);

			await this.notificator.handleNotification({
				type: notification_types.COMMENT,
				reference_id: publicationId,
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

	public async delete(r: Request<{ commentId: string }>, w: Response<void>) {
		this.log.log('delete');
		try {
			const commentId = Validate.uuid.parse(r.params.commentId);
			const userId = Validate.uuid.parse(r.user.id);

			await this.repository.deleteComment(commentId, userId);

			w.status(statusCodes.NO_CONTENT).end();
		} catch (error) {
			this.errorHandler(error, w);
		}
	}

	public async like(r: Request<{ commentId: string }>, w: Response<void>) {
		this.log.log('like');
		try {
			const commentId = Validate.uuid.parse(r.params.commentId);
			const userId = Validate.uuid.parse(r.user.id);

			await this.repository.likeComment(commentId, userId);

			await this.notificator.handleNotification({
				type: notification_types.LIKE_COMMENT,
				reference_id: commentId,
				recipient_id: '',
				sender_id: userId,
				content: '',
				seen: false,
			})
				.catch(e => this.log.error({e}));

			w.status(statusCodes.OK).end();
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
				this.log.error({e: `Not found`, m: commentId});
				return w.status(statusCodes.NOT_FOUND).end();
			}

			w.status(statusCodes.OK).json(comment);
		} catch (error) {
			this.errorHandler(error, w);
		}
	}
}
