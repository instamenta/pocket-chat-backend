import {Request, Response} from "express";
import {create_story_schema, name_schema, uuid_schema} from "../validators";
import status_codes from '@instamenta/http-status-codes'
import {controllerErrorHandler} from "../utilities";
import ShortRepository from "../repositories/short";
import {I_ShortPopulated} from "../types/short";

export default class ShortController {
	constructor(private readonly repository: ShortRepository) {
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

}
