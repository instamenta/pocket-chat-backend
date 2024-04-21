import {Request, Response} from "express";
import {uuid_schema} from "../validators";
import status_codes from '@instamenta/http-status-codes'
import LiveRepository from "../repositories/live";
import {E_LiveStates, T_LiveMessagePopulated, T_LivePopulated} from "../types/live";
import ControllerBase from "../base/controller.base";

export default class LiveController extends ControllerBase<LiveRepository> {

	public async createLive(
		r: Request<{}, {}>,
		w: Response<{ id: string }>
	) {
		try {
			const userId = uuid_schema.parse(r.user.id);

			const shortId = await this.repository.createLive(userId);

			if (!shortId) {
				console.error(`${this.constructor.name}.createLive(): Failed to create live`);
				return w.status(status_codes.INTERNAL_SERVER_ERROR).end();
			}

			w.status(status_codes.CREATED).json({id: shortId});
		} catch (error) {
			this.errorHandler(error, w);
		}
	}

	public async listLives(r: Request, w: Response<T_LivePopulated[]>) {
		try {
			const userId = uuid_schema.parse(r.user.id);

			const lives = await this.repository.listLives(userId);

			if (!lives) {
				console.error(`${this.constructor.name}.listLives(): Failed to list lives`);
				return w.status(status_codes.INTERNAL_SERVER_ERROR).end();
			}

			w.status(status_codes.OK).json(lives);
		} catch (error) {
			this.errorHandler(error, w);
		}
	}

	public async listLiveMessages(r: Request<{ liveId: string }>, w: Response<T_LiveMessagePopulated[]>) {
		try {
			const liveId = uuid_schema.parse(r.params.liveId);

			const messages = await this.repository.listLiveMessages(liveId);

			if (!messages) {
				console.error(`${this.constructor.name}.listLiveMessages(): Failed to list live messages`);
				return w.status(status_codes.INTERNAL_SERVER_ERROR).end();
			}

			w.status(status_codes.OK).json(messages);
		} catch (error) {
			this.errorHandler(error, w);
		}
	}


	public async updateLiveState(r: Request<{ state: E_LiveStates }>, w: Response) {
		try {
			const userId = uuid_schema.parse(r.user.id);

			if (!['active', 'paused', 'ended'].includes(r.params.state)) {
				console.error(`${this.constructor.name}.lives(): Invalid State`, r.params);
				return w.status(status_codes.BAD_REQUEST).end();
			}

			const lives = await this.repository.updateLiveState(userId, r.params.state);

			if (!lives) {
				console.error(`${this.constructor.name}.updateLiveState(): Failed to update live state`);
				return w.status(status_codes.INTERNAL_SERVER_ERROR).end();
			}

			w.status(status_codes.OK).end();
		} catch (error) {
			this.errorHandler(error, w);
		}
	}

}
