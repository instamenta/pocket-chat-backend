import {Request, Response} from "express";
import {name_schema, uuid_schema} from "../validators";
import status_codes from '@instamenta/http-status-codes'
import {controllerErrorHandler} from "../utilities";
import StoryRepository from "../repositories/story";
import {z} from "zod";
import {T_StoryFull} from "../types";

export default class StoryController {
	constructor(private readonly repository: StoryRepository) {
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

	public async listStories(r: Request, w: Response) {
		try {
			const userId = uuid_schema.parse(r.params.recipientId);

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

	public async listFeedStories(r: Request, w: Response<T_StoryFull[]>) {
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


}
