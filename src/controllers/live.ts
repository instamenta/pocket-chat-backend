import {Request, Response} from "express";
import status_codes from '@instamenta/http-status-codes'
import LiveRepository from "../repositories/live";
import {BaseController} from "../base/controller.base";
import {Validate} from "../validators";
import * as T from '../types'

export default class LiveController extends BaseController<LiveRepository> {

	public async createLive(
		request: Request<object, object>,
		response: Response<{ id: string }>
	) {
		try {
			const userId = Validate.uuid.parse(request.user.id);

			const shortId = await this.repository.createLive(userId);

			if (!shortId) {
				console.error(`${this.constructor.name}.createLive(): Failed to create live`);
				return response.status(status_codes.INTERNAL_SERVER_ERROR).end();
			}

			response.status(status_codes.CREATED).json({id: shortId});
		} catch (error) {
			this.errorHandler(error, response);
		}
	}

	public async listLives(request: Request, response: Response<T.Live.Populated[]>) {
		try {
			const userId = Validate.uuid.parse(request.user.id);

			const lives = await this.repository.listLives(userId);

			response.status(status_codes.OK).json(lives);
		} catch (error) {
			this.errorHandler(error, response);
		}
	}

	public async listLiveMessages(request: Request<{ liveId: string }>, response: Response<T.Live.MessagePopulated[]>) {
		try {
			const liveId = Validate.uuid.parse(request.params.liveId);

			const messages = await this.repository.listLiveMessages(liveId);

			response.status(status_codes.OK).json(messages);
		} catch (error) {
			this.errorHandler(error, response);
		}
	}


	public async updateLiveState(request: Request<{ state: T.U.LiveStates }>, response: Response) {
		try {
			const userId = Validate.uuid.parse(request.user.id);

			if (!['active', 'paused', 'ended'].includes(request.params.state)) {
				console.error(`${this.constructor.name}.lives(): Invalid State`, request.params);
				return response.status(status_codes.BAD_REQUEST).end();
			}

			const lives = await this.repository.updateLiveState(userId, request.params.state);

			if (!lives) {
				console.error(`${this.constructor.name}.updateLiveState(): Failed to update live state`);
				return response.status(status_codes.INTERNAL_SERVER_ERROR).end();
			}

			response.status(status_codes.OK).end();
		} catch (error) {
			this.errorHandler(error, response);
		}
	}

}
