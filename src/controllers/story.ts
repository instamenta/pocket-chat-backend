import {Request, Response} from "express";
import statusCodes from '@instamenta/http-status-codes'
import {StoryRepository} from "../repositories/story";
import {z} from "zod";
import {notification_types} from "../utilities/enumerations";
import {Notificator} from "../utilities/notificator";
import {BaseController} from "../base/controller.base";
import {Validate} from "../validators";
import * as T from '../types'
import VLogger from "@instamenta/vlogger";

export class StoryController extends BaseController<StoryRepository> {
	constructor(
		repository: StoryRepository,
		logger: VLogger,
		private readonly notificator: Notificator
	) {
		super(repository, logger);
	}

	public async createStory(
		request: Request<object, object, {
			imageUrl: string,
		}>,
		response: Response<{ id: string }>
	) {
		try {
			const userId = Validate.uuid.parse(request.user.id);
			const imageUrl = z.string().url().parse(request.body.imageUrl);

			const storyId = await this.repository.createStory({userId, imageUrl});

			if (!storyId) {
				console.error(`${this.constructor.name}.createStory(): Failed to send message`);
				return response.status(statusCodes.INTERNAL_SERVER_ERROR).end();
			}

			response.status(statusCodes.CREATED).json({id: storyId});
		} catch (error) {
			this.errorHandler(error, response);
		}
	}

	public async listStories(request: Request, response: Response<T.Story.Feed[]>) {
		try {
			const userId = Validate.uuid.parse(request.user.id);

			const stories = await this.repository.listStories(userId);

			response.status(statusCodes.OK).json(stories);
		} catch (error) {
			this.errorHandler(error, response);
		}
	}

	public async listFeedStories(request: Request, response: Response<T.Story.Feed[]>) {
		try {
			const userId = Validate.uuid.parse(request.user.id);

			const stories = await this.repository.listFeedStories(userId);

			response.status(statusCodes.OK).json(stories);
		} catch (error) {
			this.errorHandler(error, response);
		}
	}

	public async listFriendStoriesByUsername(request: Request<{ username: string }>, response: Response<T.Story.Full[]>) {
		try {
			const userId = Validate.name.parse(request.params.username);

			const stories = await this.repository.listFriendStoriesByUsername(userId);

			response.status(statusCodes.OK).json(stories);
		} catch (error) {
			this.errorHandler(error, response);
		}
	}


	public async likeStory(request: Request<{ id: string }>, response: Response<void>) {
		try {
			const storyId = Validate.uuid.parse(request.params.id);
			const userId = Validate.uuid.parse(request.user.id);

			await this.repository.likeStory(storyId, userId);

			response.status(statusCodes.OK).end();

			await this.notificator.handleNotification({
				type: notification_types.LIKE_STORY,
				reference_id: '',
				recipient_id: '',
				sender_id: userId,
				content: '',
				seen: false,
			}).catch(console.error);

		} catch (error) {
			this.errorHandler(error, response);
		}
	}


	public async listCommentsByStory(request: Request<{ storyId: string }>, response: Response<T.Comment.Populated[]>) {
		try {
			const storyId = Validate.uuid.parse(request.params.storyId);
			const userId = Validate.uuid.parse(request.user.id);

			const comments = await this.repository.listCommentsByStoryId(storyId, userId);

			response.status(statusCodes.OK).json(comments);
		} catch (error) {
			this.errorHandler(error, response);
		}
	}

	public async createStoryComment(request: Request<{ storyId: string }, object, { content: string }>, response: Response<T.Comment.Comment>) {
		try {
			const storyId = Validate.uuid.parse(request.params.storyId);
			const userId = Validate.uuid.parse(request.user.id);
			const content = z.string().min(1).parse(request.body.content);

			const comment = await this.repository.createStoryComment(storyId, userId, content);

			response.status(statusCodes.CREATED).json(comment);

			await this.notificator.handleNotification({
				type: notification_types.COMMENT_STORY,
				reference_id: storyId,
				recipient_id: '',
				sender_id: userId,
				content: content,
				seen: false,
			}).catch(console.error);

		} catch (error) {
			this.errorHandler(error, response);
		}
	}

	public async deleteStoryComment(request: Request<{ commentId: string }>, response: Response<void>) {
		try {
			const commentId = Validate.uuid.parse(request.params.commentId);
			const userId = Validate.uuid.parse(request.user.id);

			await this.repository.deleteStoryComment(commentId, userId);

			response.status(statusCodes.NO_CONTENT).end();
		} catch (error) {
			this.errorHandler(error, response);
		}
	}

	public async likeStoryComment(request: Request<{ commentId: string }>, response: Response<void>) {
		try {
			const commentId = Validate.uuid.parse(request.params.commentId);
			const userId = Validate.uuid.parse(request.user.id);

			await this.repository.likeStoryComment(commentId, userId);

			await this.notificator.handleNotification({
				type: notification_types.LIKE_STORY_COMMENT,
				reference_id: commentId,
				recipient_id: '',
				sender_id: userId,
				content: '',
				seen: false,
			}).catch(console.error);

			response.status(statusCodes.OK).end();
		} catch (error) {
			this.errorHandler(error, response);
		}
	}

}
