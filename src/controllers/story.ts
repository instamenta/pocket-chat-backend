import {Request, Response} from "express";
import {name_schema, uuid_schema} from "../validators";
import status_codes from '@instamenta/http-status-codes'
import statusCodes from '@instamenta/http-status-codes'
import {controllerErrorHandler} from "../utilities";
import StoryRepository from "../repositories/story";
import {z} from "zod";
import {T_FeedStory, T_StoryFull} from "../types";
import {T_Comment, T_PopulatedComment} from "../types/comment";
import {notification_types} from "../utilities/enumerations";
import Notificator from "../utilities/notificator";

export default class StoryController {
	constructor(
		private readonly repository: StoryRepository,
		private readonly notificator: Notificator
	) {
	}

	public async createStory(
		r: Request<{}, {}, {
			imageUrl: string,
		}>,
		w: Response<{ id: string }>
	) {
		try {
			const userId = uuid_schema.parse(r.user.id);
			const imageUrl = z.string().url().parse(r.body.imageUrl);

			const storyId = await this.repository.createStory({userId, imageUrl});

			if (!storyId) {
				console.error(`${this.constructor.name}.createStory(): Failed to send message`);
				return w.status(status_codes.INTERNAL_SERVER_ERROR).end();
			}

			w.status(status_codes.CREATED).json({id: storyId});
		} catch (error) {
			controllerErrorHandler(error, w);
		}
	}

	public async listStories(r: Request, w: Response<T_FeedStory[]>) {
		try {
			const userId = uuid_schema.parse(r.user.id);

			const stories = await this.repository.listStories(userId);

			if (!stories) {
				console.error(`${this.constructor.name}.listStories(): Failed to get stories`);
				return w.status(status_codes.INTERNAL_SERVER_ERROR).end();
			}

			w.status(status_codes.OK).json(stories);
		} catch (error) {
			controllerErrorHandler(error, w);
		}
	}

	public async listFeedStories(r: Request, w: Response<T_FeedStory[]>) {
		try {
			const userId = uuid_schema.parse(r.user.id);

			const stories = await this.repository.listFeedStories(userId);

			if (!stories) {
				console.error(`${this.constructor.name}.listStories(): Failed to get stories`);
				return w.status(status_codes.INTERNAL_SERVER_ERROR).end();
			}

			w.status(status_codes.OK).json(stories);
		} catch (error) {
			controllerErrorHandler(error, w);
		}
	}

	public async listFriendStoriesByUsername(r: Request<{ username: string }>, w: Response<T_StoryFull[]>) {
		try {
			const userId = name_schema.parse(r.params.username);

			const stories = await this.repository.listFriendStoriesByUsername(userId);

			if (!stories) {
				console.error(`${this.constructor.name}.listStories(): Failed to get stories`);
				return w.status(status_codes.INTERNAL_SERVER_ERROR).end();
			}

			w.status(status_codes.OK).json(stories);
		} catch (error) {
			controllerErrorHandler(error, w);
		}
	}


	public async likeStory(r: Request<{ id: string }>, w: Response<void>) {
		try {
			const storyId = uuid_schema.parse(r.params.id);
			const userId = uuid_schema.parse(r.user.id);

			await this.repository.likeStory(storyId, userId);

			w.status(statusCodes.OK).end();

			await this.notificator.handleNotification({
				type: notification_types.LIKE_STORY,
				reference_id: '',
				recipient_id: '',
				sender_id: userId,
				content: '',
				seen: false,
			}).catch(console.error);

		} catch (error) {
			controllerErrorHandler(error, w);
		}
	}


	public async listCommentsByStory(r: Request<{ storyId: string }>, w: Response<T_PopulatedComment[]>) {
		try {
			const storyId = uuid_schema.parse(r.params.storyId);
			const userId = uuid_schema.parse(r.user.id);

			const comments = await this.repository.listCommentsByStoryId(storyId, userId);

			w.status(statusCodes.OK).json(comments);
		} catch (error) {
			controllerErrorHandler(error, w);
		}
	}

	public async createStoryComment(r: Request<{ storyId: string }, {}, { content: string }>, w: Response<T_Comment>) {
		try {
			const storyId = uuid_schema.parse(r.params.storyId);
			const userId = uuid_schema.parse(r.user.id);
			const content = z.string().min(1).parse(r.body.content);

			const comment = await this.repository.createStoryComment(storyId, userId, content);

			w.status(statusCodes.CREATED).json(comment);
		} catch (error) {
			controllerErrorHandler(error, w);
		}
	}

	public async deleteStoryComment(r: Request<{ commentId: string }>, w: Response<void>) {
		try {
			const commentId = uuid_schema.parse(r.params.commentId);
			const userId = uuid_schema.parse(r.user.id);

			await this.repository.deleteStoryComment(commentId, userId);

			w.status(statusCodes.NO_CONTENT).end();
		} catch (error) {
			controllerErrorHandler(error, w);
		}
	}

	public async likeStoryComment(r: Request<{ commentId: string }>, w: Response<void>) {
		try {
			const commentId = uuid_schema.parse(r.params.commentId);
			const userId = uuid_schema.parse(r.user.id);

			await this.repository.likeStoryComment(commentId, userId);
			w.status(statusCodes.OK).end();
		} catch (error) {
			controllerErrorHandler(error, w);
		}
	}


}
