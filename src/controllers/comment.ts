// CommentController.ts
import {Request, Response} from 'express';
import CommentRepository from '../repositories/comment';
import statusCodes from '@instamenta/http-status-codes';
import {controllerErrorHandler} from '../utilities';
import {uuid_schema} from "../validators";
import {T_Comment, T_PopulatedComment} from "../types/comment";
import {z} from "zod";
import NotificationRepository from "../repositories/notification";
import PublicationsRepository from "../repositories/publication";

export default class CommentController {
	constructor(
		private readonly repository: CommentRepository,
		private readonly notification: NotificationRepository,
		private readonly publication: PublicationsRepository,
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

			const publication = this.publication.getPublicationById(publicationId);
			if (!publication) {
				return console.error('Failed to get publication with id', publicationId);
			}

			// this.notification.createNotification({
			// 	reference_id: publicationId,
			// 	sender_id: userId,
			// 	content: content,
			// 	seen: false,
			//
			// });
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
			w.status(statusCodes.OK).end();
		} catch (error) {
			controllerErrorHandler(error, w);
		}
	}

}
