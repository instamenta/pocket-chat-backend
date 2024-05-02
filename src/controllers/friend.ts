import {Request, Response} from "express";
import status_codes from '@instamenta/http-status-codes'
import FriendRepository from "../repositories/friend";
import NotificationRepository from "../repositories/notification";
import BaseController from "../base/controller.base";
import Validate from "../validators";
import * as T from '../types'
import VLogger from "@instamenta/vlogger";

// TODO: Notifications for Friend Related Events

export default class FriendController extends BaseController<FriendRepository> {
	constructor(
		repository: FriendRepository,
		logger: VLogger,
		private readonly notification: NotificationRepository
	) {
		super(repository, logger);
	}

	async sendFriendRequest(r: Request<{ id: string }>, w: Response<{ friendship_id: string }>) {
		this.log.log('sendFriendRequest');
		try {
			const {sender, recipient} = Validate.sender_recipient.parse({sender: r.user.id, recipient: r.params.id})

			const status = await this.repository.sendFriendRequest(sender, recipient);

			if (!status) {
				this.log.error({e: `Failed to send friend request`, m: `sender: ${sender}, recipient: ${recipient}`});
				return w.status(status_codes.BAD_GATEWAY).end();
			}

			w.status(status_codes.OK).json({friendship_id: status});
		} catch (error) {
			this.errorHandler(error, w);
		}
	}

	async listFriendRequestsOnly(r: Request, w: Response<T.Friend.RequestData[]>) {
		this.log.log('listFriendRequestsOnly');
		try {
			const id = Validate.uuid.parse(r.user.id);

			const list = await this.repository.listFriendRequestsOnly(id);
			if (!list) {
				this.log.error({e: `Failed to get friend request`, m: id});
				return w.status(status_codes.BAD_GATEWAY).end();
			}

			w.status(status_codes.OK).json(list);
		} catch (error) {
			this.errorHandler(error, w);
		}
	}

	async listFriendSentOnly(r: Request, w: Response<T.Friend.RequestData[]>) {
		this.log.log('listFriendSentOnly');
		try {
			const id = Validate.uuid.parse(r.user.id);

			const list = await this.repository.listFriendSentOnly(id);

			if (!list) {
				this.log.error({e: `Failed to get friend request`, m: id});
				return w.status(status_codes.BAD_GATEWAY).end();
			}

			w.status(status_codes.OK).json(list);
		} catch (error) {
			this.errorHandler(error, w);
		}
	}

	async listFriendRequests(r: Request, w: Response<T.Friend.RequestData[]>) {
		this.log.log('listFriendRequests');
		try {
			const id = Validate.uuid.parse(r.user.id);

			const friendRequests = await this.repository.listFriendRequests(id);

			if (!friendRequests) {
				this.log.error({e: `Failed to get friend request`, m: id});
				return w.status(status_codes.BAD_GATEWAY).end();
			}

			w.status(status_codes.OK).json(friendRequests);
		} catch (error) {
			this.errorHandler(error, w);
		}
	}

	async listFriendRecommendations(r: Request, w: Response<{
		id: string,
		first_name: string,
		picture: string,
		username: string
	}[]>) {
		this.log.log('listFriendRecommendations');
		try {
			const id = Validate.uuid.parse(r.user.id);

			const recommendations = await this.repository.listFriendRecommendations(id);

			if (!recommendations) {
				this.log.error({e: `Failed to get friend request`, m: id});
				return w.status(status_codes.BAD_GATEWAY).end();
			}

			w.status(status_codes.OK).json(recommendations);
		} catch (error) {
			this.errorHandler(error, w);
		}
	}

	async acceptFriendRequest(r: Request<{ id: string }>, w: Response<void>) {
		this.log.log('acceptFriendRequest');
		try {
			const {sender, recipient} = Validate.sender_recipient.parse({sender: r.user.id, recipient: r.params.id})

			const status = await this.repository.acceptFriendRequest(sender, recipient);

			if (!status) {
				this.log.error({e: `Failed to accept friend request`, m: `sender: ${sender}, recipient: ${recipient}`});
				return w.status(status_codes.BAD_GATEWAY).end();
			}

			w.status(status_codes.OK).end();
		} catch (error) {
			this.errorHandler(error, w);
		}
	}

	async deleteFriendRequest(r: Request<{ id: string }>, w: Response<{ friendship_id: boolean }>) {
		this.log.log('deleteFriendRequest');
		try {
			const {sender, recipient} = Validate.sender_recipient.parse({sender: r.user.id, recipient: r.params.id})

			const status = await this.repository.deleteFriendRequest(sender, recipient);

			if (!status) {
				this.log.error({e: `Failed to delete friend request`, m: `sender: ${sender}, recipient: ${recipient}`});
				return w.status(status_codes.BAD_GATEWAY).end();
			}

			w.status(status_codes.OK).json({friendship_id: status});
		} catch (error) {
			this.errorHandler(error, w);
		}
	}

	async declineFriendRequest(r: Request<{ id: string }>, w: Response<void>) {
		this.log.log('declineFriendRequest');
		try {
			const {sender, recipient} = Validate.sender_recipient.parse({sender: r.user.id, recipient: r.params.id})

			const status = await this.repository.declineFriendRequest(sender, recipient);

			if (!status) {
				this.log.error({e: `Failed to delete friend request`, m: `sender: ${sender}, recipient: ${recipient}`});
				return w.status(status_codes.BAD_GATEWAY).end();
			}

			w.status(status_codes.OK).end();
		} catch (error) {
			this.errorHandler(error, w);
		}
	}

	async getFriendsCountByUserId(r: Request<{ id: string }>, w: Response<{ count: number }>) {
		this.log.log('getFriendsCountByUserId');
		try {
			const id = Validate.uuid.parse(r.params.id);

			const count = await this.repository.getFriendsCountByUserId(id);
			if (!count) {
				this.log.error({e: `Failed to get friends count`, m: id});
				return w.status(status_codes.BAD_GATEWAY).end();
			}

			console.log(count)

			w.status(status_codes.OK).json({count});
		} catch (error) {
			this.errorHandler(error, w);
		}
	}

	async getFriendsByUserIdAndSender(r: Request<{ id: string }>, w: Response) {
		this.log.log('getFriendsByUserIdAndSender');
		try {
			const sender = Validate.uuid.parse(r.user.id);
			const recipient = Validate.uuid.parse(r.params.id);

			const friends = await this.repository.getFriendsByUserIdAndSender(sender, recipient);
			// @ts-ignore
			if (!friends) {
				this.log.error({e: `Failed to list friends`, m: `sender: ${sender}, recipient: ${recipient}`});
				return w.status(status_codes.BAD_GATEWAY).end();
			}

			console.log(friends);

			w.status(status_codes.OK).json(friends);
		} catch (error) {
			this.errorHandler(error, w);
		}
	}

	async listMutualFriendsByUsers(r: Request<{ id: string }>, w: Response<T.Friend.Mutual[]>) {
		this.log.log('listMutualFriendsByUsers');
		try {
			const sender = Validate.uuid.parse(r.user.id);
			const recipient = Validate.uuid.parse(r.params.id);

			const friends = await this.repository.listMutualFriendsByUsers(sender, recipient);
			if (!friends) {
				this.log.error({e: `Failed to list friends`, m: `sender: ${sender}, recipient: ${recipient}`});
				return w.status(status_codes.BAD_GATEWAY).end();
			}

			console.log(friends);

			w.status(status_codes.OK).json(friends);
		} catch (error) {
			this.errorHandler(error, w);
		}
	}

	async listFriendsByUserId(r: Request<{ id: string }>, w: Response<T.User.Schema[]>) {
		this.log.log('listFriendsByUserId');
		try {
			const id = Validate.uuid.parse(r.params.id);

			const friends = await this.repository.listFriendsByUserId(id);

			if (!friends) {
				this.log.error({e: `Failed to list friends`, m: id});
				return w.status(status_codes.BAD_GATEWAY).end();
			}

			w.status(status_codes.OK).json(friends);
		} catch (error) {
			this.errorHandler(error, w);
		}
	}

	async listFriendsByUsername(r: Request<{ username: string }>, w: Response<T.User.Schema[]>) {
		this.log.log('listFriendsByUsername');
		try {
			const username = Validate.name.parse(r.params.username);

			const friends = await this.repository.listFriendsByUsername(username);
			if (!friends) {
				this.log.error({e: `Failed to list friends`, m: username});
				return w.status(status_codes.BAD_GATEWAY).end();
			}

			w.status(status_codes.OK).json(friends);
		} catch (error) {
			this.errorHandler(error, w);
		}
	}

	async getBySenderAndRecipient(r: Request<{
		sender: string,
		recipient: string
	}>, w: Response<T.Friend.Friendship>) {
		this.log.log('getBySenderAndRecipient');
		try {
			const sender = Validate.uuid.parse(r.params.sender);
			const recipient = Validate.uuid.parse(r.params.recipient);

			const friendship = await this.repository.getBySenderAndRecipient(sender, recipient);

			if (!friendship) {
				this.log.error({e: `Failed to get friendship`, m: `sender: ${sender}, recipient: ${recipient}`});
				return w.status(status_codes.BAD_GATEWAY).end();
			}

			w.status(status_codes.OK).json(friendship);
		} catch (error) {
			this.errorHandler(error, w);
		}
	}

	async getById(r: Request<{ id: string }>, w: Response<T.Friend.Friendship>) {
		this.log.log('getById');
		try {
			const friendship_id = Validate.uuid.parse(r.params.id);

			const friendship = await this.repository.getById(friendship_id);

			if (!friendship) {
				this.log.error({e: `Failed to get friendship`, m: friendship_id});
				return w.status(status_codes.BAD_GATEWAY).end();
			}

			w.status(status_codes.OK).json(friendship);
		} catch (error) {
			this.errorHandler(error, w);
		}
	}

}