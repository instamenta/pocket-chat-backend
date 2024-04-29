import {Request, Response} from "express";
import status_codes from '@instamenta/http-status-codes'
import FriendRepository from "../repositories/friend";
import NotificationRepository from "../repositories/notification";
import BaseController from "../base/controller.base";
import Validate from "../validators";
import * as T from '../types'

export default class FriendController extends BaseController<FriendRepository> {
	constructor(
		repository: FriendRepository,
		private readonly notification: NotificationRepository
	) {
		super(repository);
	}

	public async sendFriendRequest(r: Request<{ id: string }>, w: Response<{ friendship_id: string }>) {
		try {
			const {sender, recipient} = Validate.sender_recipient.parse({sender: r.user.id, recipient: r.params.id})

			const status = await this.repository.sendFriendRequest(sender, recipient);

			if (!status) {
				console.log(`${this.constructor.name}.sendFriendRequest(): Failed to send friend request`);
				return w.status(status_codes.BAD_GATEWAY).end();
			}

			w.status(status_codes.OK).json({friendship_id: status});
		} catch (error) {
			this.errorHandler(error, w);
		}
	}

	public async listFriendRequestsOnly(r: Request, w: Response<T.Friend.RequestData[]>) {
		try {
			const id = Validate.uuid.parse(r.user.id);

			const list = await this.repository.listFriendRequestsOnly(id);
			if (!list) {
				console.log(`${this.constructor.name}.listFriendRequestsOnly(): Failed to get friend request`);
				return w.status(status_codes.BAD_GATEWAY).end();
			}

			w.status(status_codes.OK).json(list);
		} catch (error) {
			this.errorHandler(error, w);
		}
	}

	public async listFriendSentOnly(r: Request, w: Response<T.Friend.RequestData[]>) {
		try {
			const id = Validate.uuid.parse(r.user.id);

			const list = await this.repository.listFriendSentOnly(id);

			if (!list) {
				console.log(`${this.constructor.name}.listFriendSentOnly(): Failed to get friend request`);
				return w.status(status_codes.BAD_GATEWAY).end();
			}

			w.status(status_codes.OK).json(list);
		} catch (error) {
			this.errorHandler(error, w);
		}
	}

	public async listFriendRequests(r: Request, w: Response<T.Friend.RequestData[]>) {
		try {
			const id = Validate.uuid.parse(r.user.id);

			const friendRequests = await this.repository.listFriendRequests(id);

			if (!friendRequests) {
				console.log(`${this.constructor.name}.listFriendRequests(): Failed to get friend request`);
				return w.status(status_codes.BAD_GATEWAY).end();
			}

			w.status(status_codes.OK).json(friendRequests);
		} catch (error) {
			this.errorHandler(error, w);
		}
	}

	public async listFriendRecommendations(r: Request, w: Response<{
		id: string,
		first_name: string,
		picture: string,
		username: string
	}[]>) {
		try {
			const id = Validate.uuid.parse(r.user.id);

			const recommendations = await this.repository.listFriendRecommendations(id);

			if (!recommendations) {
				console.log(`${this.constructor.name}.listFriendRecommendations(): Failed to get friend request`);
				return w.status(status_codes.BAD_GATEWAY).end();
			}

			w.status(status_codes.OK).json(recommendations);
		} catch (error) {
			this.errorHandler(error, w);
		}
	}

	public async acceptFriendRequest(r: Request<{ id: string }>, w: Response<void>) {
		try {
			const {sender, recipient} = Validate.sender_recipient.parse({sender: r.user.id, recipient: r.params.id})

			const status = await this.repository.acceptFriendRequest(sender, recipient);

			if (!status) {
				console.log(`${this.constructor.name}.acceptFriendRequest(): Failed to accept friend request`);
				return w.status(status_codes.BAD_GATEWAY).end();
			}

			w.status(status_codes.OK).end();
		} catch (error) {
			this.errorHandler(error, w);
		}
	}

	public async deleteFriendRequest(r: Request<{ id: string }>, w: Response<{ friendship_id: boolean }>) {
		try {
			const {sender, recipient} = Validate.sender_recipient.parse({sender: r.user.id, recipient: r.params.id})

			const status = await this.repository.deleteFriendRequest(sender, recipient);

			if (!status) {
				console.log(`${this.constructor.name}.deleteFriendRequest(): Failed to delete friend request`);
				return w.status(status_codes.BAD_GATEWAY).end();
			}

			w.status(status_codes.OK).json({friendship_id: status});
		} catch (error) {
			this.errorHandler(error, w);
		}
	}

	public async declineFriendRequest(r: Request<{ id: string }>, w: Response<void>) {
		try {
			const {sender, recipient} = Validate.sender_recipient.parse({sender: r.user.id, recipient: r.params.id})

			const status = await this.repository.declineFriendRequest(sender, recipient);

			if (!status) {
				console.log(`${this.constructor.name}.declineFriendRequest(): Failed to delete friend request`);
				return w.status(status_codes.BAD_GATEWAY).end();
			}

			w.status(status_codes.OK).end();
		} catch (error) {
			this.errorHandler(error, w);
		}
	}

	public async getFriendsCountByUserId(r: Request<{ id: string }>, w: Response<{ count: number }>) {
		try {
			const id = Validate.uuid.parse(r.params.id);

			const count = await this.repository.getFriendsCountByUserId(id);
			if (!count) {
				console.log(`${this.constructor.name}.listFriendsByUserId(): Failed to get friends count`);
				return w.status(status_codes.BAD_GATEWAY).end();
			}

			console.log(count)

			w.status(status_codes.OK).json({count});
		} catch (error) {
			this.errorHandler(error, w);
		}
	}

	public async getFriendsByUserIdAndSender(r: Request<{ id: string }>, w: Response) {
		try {
			const recipientId = Validate.uuid.parse(r.params.id);
			const senderId = Validate.uuid.parse(r.user.id);

			const friends = await this.repository.getFriendsByUserIdAndSender(senderId, recipientId);
			// @ts-ignore
			if (!friends) {
				console.log(`${this.constructor.name}.getFriendsByUserIdAndSender(): Failed to list friends`);
				return w.status(status_codes.BAD_GATEWAY).end();
			}

			console.log(friends);

			w.status(status_codes.OK).json(friends);
		} catch (error) {
			this.errorHandler(error, w);
		}
	}


	public async listMutualFriendsByUsers(r: Request<{ id: string }>, w: Response<T.Friend.Mutual[]>) {
		try {
			const recipientId = Validate.uuid.parse(r.params.id);
			const senderId = Validate.uuid.parse(r.user.id);

			const friends = await this.repository.listMutualFriendsByUsers(senderId, recipientId);
			if (!friends) {
				console.log(`${this.constructor.name}.listFriendsByUserId(): Failed to list friends`);
				return w.status(status_codes.BAD_GATEWAY).end();
			}

			console.log(friends);

			w.status(status_codes.OK).json(friends);
		} catch (error) {
			this.errorHandler(error, w);
		}
	}

	public async listFriendsByUserId(r: Request<{ id: string }>, w: Response<T.User.Schema[]>) {
		try {
			const id = Validate.uuid.parse(r.params.id);

			const friends = await this.repository.listFriendsByUserId(id);
			if (!friends) {
				console.log(`${this.constructor.name}.listFriendsByUserId(): Failed to list friends`);
				return w.status(status_codes.BAD_GATEWAY).end();
			}

			w.status(status_codes.OK).json(friends);
		} catch (error) {
			this.errorHandler(error, w);
		}
	}

	public async listFriendsByUsername(r: Request<{ username: string }>, w: Response<T.User.Schema[]>) {
		try {
			const username = Validate.name.parse(r.params.username);

			const friends = await this.repository.listFriendsByUsername(username);
			if (!friends) {
				console.log(`${this.constructor.name}.listFriendsByUsername(): Failed to list friends`);
				return w.status(status_codes.BAD_GATEWAY).end();
			}

			w.status(status_codes.OK).json(friends);
		} catch (error) {
			this.errorHandler(error, w);
		}
	}

	public async getBySenderAndRecipient(r: Request<{
		sender: string,
		recipient: string
	}>, w: Response<T.Friend.Friendship>) {
		try {
			const sender = Validate.uuid.parse(r.params.sender);
			const recipient = Validate.uuid.parse(r.params.recipient);

			const friendship = await this.repository.getBySenderAndRecipient(sender, recipient);

			if (!friendship) {
				console.log(`${this.constructor.name}.getBySenderAndRecipient(): Failed to get friendship`);
				return w.status(status_codes.BAD_GATEWAY).end();
			}

			w.status(status_codes.OK).json(friendship);
		} catch (error) {
			this.errorHandler(error, w);
		}
	}

	public async getById(r: Request<{ id: string }>, w: Response<T.Friend.Friendship>) {
		try {
			const friendship_id = Validate.uuid.parse(r.params.id);

			// @ts-ignore
			const friendship = await this.repository.getById(friendship_id);

			if (!friendship) {
				console.log(`${this.constructor.name}.getBySenderAndRecipient(): Failed to get friendship`);
				return w.status(status_codes.BAD_GATEWAY).end();
			}

			w.status(status_codes.OK).json(friendship);
		} catch (error) {
			this.errorHandler(error, w);
		}
	}

}