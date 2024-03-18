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

	public async listByPublication(req: Request<{ publicationId: string }>, res: Response<T_PopulatedComment[]>) {
		try {
			const publicationId = uuid_schema.parse(req.params.publicationId);
			const userId = uuid_schema.parse(req.user.id);
			const comments = await this.repository.listCommentsByPublication(publicationId, userId);
			res.status(statusCodes.OK).json(comments);
		} catch (error) {
			controllerErrorHandler(error, res);
		}
	}

	public async create(req: Request<{ publicationId: string }, {}, { content: string }>, res: Response<T_Comment>) {
		try {
			const publicationId = uuid_schema.parse(req.params.publicationId);
			const userId = uuid_schema.parse(req.user.id);
			const content = z.string().min(1).parse(req.body.content);

			const comment = await this.repository.createComment(publicationId, userId, content);
			res.status(statusCodes.CREATED).json(comment);

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
			controllerErrorHandler(error, res);
		}
	}

	public async delete(req: Request<{ commentId: string }>, res: Response<void>) {
		try {
			const commentId = uuid_schema.parse(req.params.commentId);
			const userId = uuid_schema.parse(req.user.id);

			await this.repository.deleteComment(commentId, userId);
			res.status(statusCodes.NO_CONTENT).end();
		} catch (error) {
			controllerErrorHandler(error, res);
		}
	}

	public async like(req: Request<{ commentId: string }>, res: Response<void>) {
		try {
			const commentId = uuid_schema.parse(req.params.commentId);
			const userId = uuid_schema.parse(req.user.id);

			await this.repository.likeComment(commentId, userId);
			res.status(statusCodes.OK).end();
		} catch (error) {
			controllerErrorHandler(error, res);
		}
	}

}
