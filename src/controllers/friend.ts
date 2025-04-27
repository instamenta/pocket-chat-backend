import {Request, Response} from "express";
import status_codes from '@instamenta/http-status-codes'
import FriendRepository from "../repositories/friend";
import {BaseController} from "../base/controller.base";
import {Validate} from "../validators";
import * as T from '../types'

// TODO: Notifications for Friend Related Events

export default class FriendController extends BaseController<FriendRepository> {

	async sendFriendRequest(request: Request<{ id: string }>, response: Response<{ friendship_id: string }>) {
		this.log.log('sendFriendRequest');
		try {
			const {sender, recipient} = Validate.sender_recipient.parse({sender: request.user.id, recipient: request.params.id})

			const status = await this.repository.sendFriendRequest(sender, recipient);

			if (!status) {
				this.log.error({e: `Failed to send friend request`, m: `sender: ${sender}, recipient: ${recipient}`});
				return response.status(status_codes.BAD_GATEWAY).end();
			}

			response.status(status_codes.OK).json({friendship_id: status});
		} catch (error) {
			this.errorHandler(error, response);
		}
	}

	async listFriendRequestsOnly(request: Request, response: Response<T.Friend.RequestData[]>) {
		this.log.log('listFriendRequestsOnly');
		try {
			const id = Validate.uuid.parse(request.user.id);

			const list = await this.repository.listFriendRequestsOnly(id);

			response.status(status_codes.OK).json(list);
		} catch (error) {
			this.errorHandler(error, response);
		}
	}

	async listFriendSentOnly(request: Request, response: Response<T.Friend.RequestData[]>) {
		this.log.log('listFriendSentOnly');
		try {
			const id = Validate.uuid.parse(request.user.id);

			const list = await this.repository.listFriendSentOnly(id);

			response.status(status_codes.OK).json(list);
		} catch (error) {
			this.errorHandler(error, response);
		}
	}

	async listFriendRequests(request: Request, response: Response<T.Friend.RequestData[]>) {
		this.log.log('listFriendRequests');
		try {
			const id = Validate.uuid.parse(request.user.id);

			const friendRequests = await this.repository.listFriendRequests(id);

			response.status(status_codes.OK).json(friendRequests);
		} catch (error) {
			this.errorHandler(error, response);
		}
	}

	async listFriendRecommendations(request: Request, response: Response<{
		id: string,
		first_name: string,
		picture: string,
		username: string
	}[]>) {
		this.log.log('listFriendRecommendations');
		try {
			const id = Validate.uuid.parse(request.user.id);

			const recommendations = await this.repository.listFriendRecommendations(id);

			response.status(status_codes.OK).json(recommendations);
		} catch (error) {
			this.errorHandler(error, response);
		}
	}

	async acceptFriendRequest(request: Request<{ id: string }>, response: Response<void>) {
		this.log.log('acceptFriendRequest');
		try {
			const {sender, recipient} = Validate.sender_recipient.parse({sender: request.user.id, recipient: request.params.id})

			const status = await this.repository.acceptFriendRequest(sender, recipient);

			if (!status) {
				this.log.error({e: `Failed to accept friend request`, m: `sender: ${sender}, recipient: ${recipient}`});
				return response.status(status_codes.BAD_GATEWAY).end();
			}

			response.status(status_codes.OK).end();
		} catch (error) {
			this.errorHandler(error, response);
		}
	}

	async deleteFriendRequest(request: Request<{ id: string }>, response: Response<{ friendship_id: boolean }>) {
		this.log.log('deleteFriendRequest');
		try {
			const {sender, recipient} = Validate.sender_recipient.parse({sender: request.user.id, recipient: request.params.id})

			const status = await this.repository.deleteFriendRequest(sender, recipient);

			if (!status) {
				this.log.error({e: `Failed to delete friend request`, m: `sender: ${sender}, recipient: ${recipient}`});
				return response.status(status_codes.BAD_GATEWAY).end();
			}

			response.status(status_codes.OK).json({friendship_id: status});
		} catch (error) {
			this.errorHandler(error, response);
		}
	}

	async declineFriendRequest(request: Request<{ id: string }>, response: Response<void>) {
		this.log.log('declineFriendRequest');
		try {
			const {sender, recipient} = Validate.sender_recipient.parse({sender: request.user.id, recipient: request.params.id})

			const status = await this.repository.declineFriendRequest(sender, recipient);

			if (!status) {
				this.log.error({e: `Failed to delete friend request`, m: `sender: ${sender}, recipient: ${recipient}`});
				return response.status(status_codes.BAD_GATEWAY).end();
			}

			response.status(status_codes.OK).end();
		} catch (error) {
			this.errorHandler(error, response);
		}
	}

	async getFriendsCountByUserId(request: Request<{ id: string }>, response: Response<{ count: number }>) {
		this.log.log('getFriendsCountByUserId');
		try {
			const id = Validate.uuid.parse(request.params.id);

			const count = await this.repository.getFriendsCountByUserId(id);
			if (!count) {
				this.log.error({e: `Failed to get friends count`, m: id});
				return response.status(status_codes.BAD_GATEWAY).end();
			}

			console.log(count)

			response.status(status_codes.OK).json({count});
		} catch (error) {
			this.errorHandler(error, response);
		}
	}

	async listMutualFriendsByUsers(request: Request<{ id: string }>, response: Response<T.Friend.Mutual[]>) {
		this.log.log('listMutualFriendsByUsers');
		try {
			const sender = Validate.uuid.parse(request.user.id);
			const recipient = Validate.uuid.parse(request.params.id);

			const friends = await this.repository.listMutualFriendsByUsers(sender, recipient);

			response.status(status_codes.OK).json(friends);
		} catch (error) {
			this.errorHandler(error, response);
		}
	}

	async listFriendsByUserId(request: Request<{ id: string }>, response: Response<T.User.Schema[]>) {
		this.log.log('listFriendsByUserId');
		try {
			const id = Validate.uuid.parse(request.params.id);

			const friends = await this.repository.listFriendsByUserId(id);

			response.status(status_codes.OK).json(friends);
		} catch (error) {
			this.errorHandler(error, response);
		}
	}

	async listFriendsByUsername(request: Request<{ username: string }>, response: Response<T.User.Schema[]>) {
		this.log.log('listFriendsByUsername');
		try {
			const username = Validate.name.parse(request.params.username);

			const friends = await this.repository.listFriendsByUsername(username);

			response.status(status_codes.OK).json(friends);
		} catch (error) {
			this.errorHandler(error, response);
		}
	}

	async getBySenderAndRecipient(request: Request<{
		sender: string,
		recipient: string
	}>, response: Response<T.Friend.Friendship>) {
		this.log.log('getBySenderAndRecipient');
		try {
			const sender = Validate.uuid.parse(request.params.sender);
			const recipient = Validate.uuid.parse(request.params.recipient);

			const friendship = await this.repository.getBySenderAndRecipient(sender, recipient);

			response.status(status_codes.OK).json(friendship);
		} catch (error) {
			this.errorHandler(error, response);
		}
	}

	async getById(request: Request<{ id: string }>, response: Response<T.Friend.Friendship>) {
		this.log.log('getById');
		try {
			const friendship_id = Validate.uuid.parse(request.params.id);

			const friendship = await this.repository.getById(friendship_id);

			response.status(status_codes.OK).json(friendship);
		} catch (error) {
			this.errorHandler(error, response);
		}
	}

}