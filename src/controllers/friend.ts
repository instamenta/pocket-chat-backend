import {Request, Response} from "express";
import {sender_recipient_schema, uuid_schema} from "../validators";
import status_codes from '@instamenta/http-status-codes'
import {controllerErrorHandler} from "../utilities";
import FriendRepository, {T_FriendRequestData} from "../repositories/friend";
import {I_Friendship} from "../types";
import {I_UserSchema} from "../types/user";
import NotificationRepository from "../repositories/notification";

export default class FriendController {
	constructor(
		private readonly repository: FriendRepository,
		private readonly notification: NotificationRepository
	) {
	}

	public async sendFriendRequest(r: Request<{ id: string }>, w: Response<{ friendship_id: string }>) {
		try {
			const {sender, recipient} = sender_recipient_schema.parse({sender: r.user.id, recipient: r.params.id})

			const status = await this.repository.sendFriendRequest(sender, recipient);

			if (!status) {
				console.log(`${this.constructor.name}.sendFriendRequest(): Failed to send friend request`);
				return w.status(status_codes.BAD_GATEWAY).end();
			}

			w.status(status_codes.OK).json({friendship_id: status});
		} catch (error) {
			controllerErrorHandler(error, w);
		}
	}

	public async listFriendRequestsOnly(r: Request, w: Response<T_FriendRequestData[]>) {
		try {
			const id = uuid_schema.parse(r.user.id);

			const list = await this.repository.listFriendRequestsOnly(id);
			if (!list) {
				console.log(`${this.constructor.name}.listFriendRequestsOnly(): Failed to get friend request`);
				return w.status(status_codes.BAD_GATEWAY).end();
			}

			w.status(status_codes.OK).json(list);
		} catch (error) {
			controllerErrorHandler(error, w);
		}
	}

	public async listFriendSentOnly(r: Request, w: Response<T_FriendRequestData[]>) {
		try {
			const id = uuid_schema.parse(r.user.id);

			const list = await this.repository.listFriendSentOnly(id);
			if (!list) {
				console.log(`${this.constructor.name}.listFriendSentOnly(): Failed to get friend request`);
				return w.status(status_codes.BAD_GATEWAY).end();
			}

			w.status(status_codes.OK).json(list);
		} catch (error) {
			controllerErrorHandler(error, w);
		}
	}

	public async listFriendRequests(r: Request, w: Response<T_FriendRequestData[]>) {
		try {
			const id = uuid_schema.parse(r.user.id);

			const friendRequests = await this.repository.listFriendRequests(id);
			if (!friendRequests) {
				console.log(`${this.constructor.name}.listFriendRequests(): Failed to get friend request`);
				return w.status(status_codes.BAD_GATEWAY).end();
			}

			w.status(status_codes.OK).json(friendRequests);
		} catch (error) {
			controllerErrorHandler(error, w);
		}
	}

	public async listFriendRecommendations(r: Request, w: Response<{
		id: string,
		first_name: string,
		picture: string,
		username: string
	}[]>) {
		try {
			const id = uuid_schema.parse(r.user.id);

			const recommendations = await this.repository.listFriendRecommendations(id);
			if (!recommendations) {
				console.log(`${this.constructor.name}.listFriendRecommendations(): Failed to get friend request`);
				return w.status(status_codes.BAD_GATEWAY).end();
			}

			w.status(status_codes.OK).json(recommendations);
		} catch (error) {
			controllerErrorHandler(error, w);
		}
	}

	public async acceptFriendRequest(r: Request<{ id: string }>, w: Response<void>) {
		try {
			const {sender, recipient} = sender_recipient_schema.parse({sender: r.user.id, recipient: r.params.id})

			const status = await this.repository.acceptFriendRequest(sender, recipient);
			if (!status) {
				console.log(`${this.constructor.name}.acceptFriendRequest(): Failed to accept friend request`);
				return w.status(status_codes.BAD_GATEWAY).end();
			}

			w.status(status_codes.OK).end();
		} catch (error) {
			controllerErrorHandler(error, w);
		}
	}

	public async deleteFriendRequest(r: Request<{ id: string }>, w: Response<{ friendship_id: boolean }>) {
		try {
			const {sender, recipient} = sender_recipient_schema.parse({sender: r.user.id, recipient: r.params.id})

			const status = await this.repository.deleteFriendRequest(sender, recipient);

			if (!status) {
				console.log(`${this.constructor.name}.deleteFriendRequest(): Failed to delete friend request`);
				return w.status(status_codes.BAD_GATEWAY).end();
			}

			w.status(status_codes.OK).json({friendship_id: status});
		} catch (error) {
			controllerErrorHandler(error, w);
		}
	}

	public async declineFriendRequest(r: Request<{ id: string }>, w: Response<void>) {
		try {
			const {sender, recipient} = sender_recipient_schema.parse({sender: r.user.id, recipient: r.params.id})

			const status = await this.repository.declineFriendRequest(sender, recipient);
			if (!status) {
				console.log(`${this.constructor.name}.declineFriendRequest(): Failed to delete friend request`);
				return w.status(status_codes.BAD_GATEWAY).end();
			}

			w.status(status_codes.OK).end();
		} catch (error) {
			controllerErrorHandler(error, w);
		}
	}

	public async listFriendsByUserId(r: Request<{ id: string }>, w: Response<I_UserSchema[]>) {
		try {
			const id = uuid_schema.parse(r.params.id);

			const friends = await this.repository.listFriendsByUserId(id);
			if (!friends) {
				console.log(`${this.constructor.name}.listFriendsByUserId(): Failed to list friends`);
				return w.status(status_codes.BAD_GATEWAY).end();
			}

			w.status(status_codes.OK).json(friends);
		} catch (error) {
			controllerErrorHandler(error, w);
		}
	}

	public async getBySenderAndRecipient(r: Request<{ sender: string, recipient: string }>, w: Response<I_Friendship>) {
		try {
			const sender = uuid_schema.parse(r.params.sender);
			const recipient = uuid_schema.parse(r.params.recipient);

			const friendship = await this.repository.getBySenderAndRecipient(sender, recipient);
			if (!friendship) {
				console.log(`${this.constructor.name}.getBySenderAndRecipient(): Failed to get friendship`);
				return w.status(status_codes.BAD_GATEWAY).end();
			}

			w.status(status_codes.OK).json(friendship);
		} catch (error) {
			controllerErrorHandler(error, w);
		}
	}

	public async getById(r: Request<{ id: string }>, w: Response<I_Friendship>) {
		try {
			const friendship_id = uuid_schema.parse(r.params.id);

			const friendship = await this.repository.getById(friendship_id);
			if (!friendship) {
				console.log(`${this.constructor.name}.getBySenderAndRecipient(): Failed to get friendship`);
				return w.status(status_codes.BAD_GATEWAY).end();
			}

			w.status(status_codes.OK).json(friendship);
		} catch (error) {
			controllerErrorHandler(error, w);
		}
	}

}