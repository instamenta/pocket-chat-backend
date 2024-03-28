import {Request, Response} from 'express';
import CommentRepository from '../repositories/comment';
import statusCodes from '@instamenta/http-status-codes';
import {controllerErrorHandler} from '../utilities';
import {uuid_schema} from "../validators";
import {T_Comment, T_PopulatedComment} from "../types/comment";
import {z} from "zod";
import {notification_types} from "../utilities/enumerations";
import Notificator from "../utilities/notificator";

export default class CommentController {
	constructor(
		private readonly repository: CommentRepository,
		private readonly notificator: Notificator,
	) {
	}

	public async listByPublication(r: Request<{ publicationId: string }>, w: Response<T_PopulatedComment[]>) {
		try {
			const publicationId = uuid_schema.parse(r.params.publicationId);
			const userId = uuid_schema.parse(r.user.id);

			const comments = await this.repository.listCommentsByPublication(publicationId, userId);

			w.status(statusCodes.OK).json(comments);
		} catch (error) {
			controllerErrorHandler(error, w);
		}
	}

	public async create(r: Request<{ publicationId: string }, {}, { content: string }>, w: Response<T_Comment>) {
		try {
			const publicationId = uuid_schema.parse(r.params.publicationId);
			const userId = uuid_schema.parse(r.user.id);
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
			}).catch(console.error);

		} catch (error) {
			controllerErrorHandler(error, w);
		}
	}

	public async delete(r: Request<{ commentId: string }>, w: Response<void>) {
		try {
			const commentId = uuid_schema.parse(r.params.commentId);
			const userId = uuid_schema.parse(r.user.id);

			await this.repository.deleteComment(commentId, userId);

			w.status(statusCodes.NO_CONTENT).end();
		} catch (error) {
			controllerErrorHandler(error, w);
		}
	}

	public async like(r: Request<{ commentId: string }>, w: Response<void>) {
		try {
			const commentId = uuid_schema.parse(r.params.commentId);
			const userId = uuid_schema.parse(r.user.id);

			await this.repository.likeComment(commentId, userId);

			await this.notificator.handleNotification({
				type: notification_types.LIKE_COMMENT,
				reference_id: commentId,
				recipient_id: '',
				sender_id: userId,
				content: '',
				seen: false,
			}).catch(console.error);

			w.status(statusCodes.OK).end();
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
