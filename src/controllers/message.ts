import {Request, Response} from "express";
import status_codes from '@instamenta/http-status-codes'
import MessageRepository from "../repositories/message";
import BaseController from "../base/controller.base";
import Validate from "../validators";
import * as T from '../types'

export default class MessageController extends BaseController<MessageRepository> {

	public async sendMessage(
		r: Request<{}, {}, { recipient: string, content: string, friendship: string, images?: string[], files?: string[] }>,
		w: Response<{ id: string }>
	) {
		try {
			const message = Validate.create_message.parse({
				sender: r.user.id,
				recipient: r.body.recipient,
				content: r.body.content,
				friendship: r.body.friendship,
				images: r.body.images,
				files: r.body.files,
			});

			const messageId = await this.repository.createMessage(message);

			if (!messageId) {
				console.error(`${this.constructor.name}.sendMessage(): Failed to send message`);
				return w.status(status_codes.INTERNAL_SERVER_ERROR).end();
			}

			w.status(status_codes.CREATED).json({id: messageId});
		} catch (error) {
			this.errorHandler(error, w);
		}
	}

	public async listMessagesByFriendship(
		r: Request<{ friendshipId: string }, {}, {}, { skip?: string; limit?: string }>,
		w: Response<T.Message.Message[]>
	) {
		try {
			const messages = await this.repository.getMessagesByFriendshipId(
				Validate.uuid.parse(r.params.friendshipId),
				Number.parseInt(r.query.skip || '0', 10),
				Number.parseInt(r.query.limit || '20', 10)
			);

			if (!messages) {
				console.error(`${this.constructor.name}.listMessagesByFriendship(): Failed to get messages`);
				return w.status(status_codes.INTERNAL_SERVER_ERROR).end();
			}

			w.status(status_codes.OK).json(messages);
		} catch (error) {
			this.errorHandler(error, w);
		}
	}


	public async listMessagesByUsers(
		r: Request<{ user1: string, user2: string }, {}, {}, { skip?: string; limit?: string }>,
		w: Response<T.Message.Message[]>
	) {
		try {
			const messages = await this.repository.getMessagesByUsers(
				Validate.uuid.parse(r.params.user1),
				Validate.uuid.parse(r.params.user2),
				Number.parseInt(r.query.skip || '0', 10),
				Number.parseInt(r.query.limit || '20', 10)
			);

			if (!messages) {
				console.error(`${this.constructor.name}.listMessagesByUsers(): Failed to get messages`);
				return w.status(status_codes.INTERNAL_SERVER_ERROR).end();
			}

			w.status(status_codes.OK).json(messages);
		} catch (error) {
			this.errorHandler(error, w);
		}
	}

	public async updateMessageStatus(
		r: Request<{ id: string }, {}, { status: string }>,
		w: Response<{ success: boolean }>
	) {
		try {
			const result = await this.repository.updateMessageStatus(
				Validate.uuid.parse(r.params.id),
				r.body.status
			);

			if (!result) {
				console.error(`${this.constructor.name}.updateMessageStatus(): Failed to update message status`);
				return w.status(status_codes.INTERNAL_SERVER_ERROR).end();
			}

			w.status(status_codes.OK).json({success: true});
		} catch (error) {
			this.errorHandler(error, w);
		}
	}

	public async listConversations(
		r: Request,
		w: Response<T.Message.Conversations[]>
	) {
		try {
			const userId = Validate.uuid.parse(r.user.id);

			const conversations = await this.repository.listConversations(userId);

			if (!conversations) {
				console.error(`${this.constructor.name}.listConversations(): Failed to list conversations`);
				return w.status(status_codes.INTERNAL_SERVER_ERROR).end();
			}

			w.status(status_codes.OK).json(conversations);
		} catch (error) {
			this.errorHandler(error, w);
		}
	}

}
