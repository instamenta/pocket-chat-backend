import MessageRepository from "../repositories/message";
import {RawData, WebSocket, WebSocketServer} from "ws";
import FriendRepository from "../repositories/friend";
import UserRepository from "../repositories/user";
import {Server} from 'node:http'
import Redis from "ioredis";
import {notification_types, socket_events} from "../utilities/enumerations";
import LiveRepository from "../repositories/live";
import Notificator from "../utilities/notificator";
import BaseSocket from "../base/socket.base";
import Validate from "../validators";
import * as T from '../types';
import VLogger from "@instamenta/vlogger";

export default class SocketController extends BaseSocket {

	constructor(
		wss: WebSocketServer,
		server: Server,
		cache: Redis,
		logger: VLogger,
		userRepository: UserRepository,
		private readonly liveRepository: LiveRepository,
		private readonly friendRepository: FriendRepository,
		private readonly messageRepository: MessageRepository,
		private readonly notificator: Notificator,
	) {
		super(wss, server, cache, logger,userRepository)
	}

	async onData(bytes: RawData, host: WebSocket, user: T.User.Schema) {
		try {
			const request
				: T.Message.MessageRequest
				| T.Message.VideoCallRequest
				| T.Message.LiveMessageRequest
				| T.Message.JoinLiveRequest
				= JSON.parse(bytes.toString());

			console.log(`Websocket received message request with type:`, request.type);

			switch (request.type) {
				case socket_events.MESSAGE: {
					await this.onMessage(request as T.Message.MessageRequest, host, user);
					break;
				}
				case socket_events.JOIN_LIVE: {
					await this.onJoinLive(request as T.Message.JoinLiveRequest, host, user);
					break;
				}
				case socket_events.LEAVE_LIVE: {
					await this.onLeaveLive(request as T.Message.LeaveLiveRequest, host, user);
					break;
				}
				case socket_events.LIVE_MESSAGE: {
					await this.onLiveMessage(request as T.Message.LiveMessageRequest, host, user);
					break;
				}
				case socket_events.VIDEO_CALL_INVITE: {
					await this.onVideoCallInvite(request as T.Message.VideoCallRequest, host, user);
					break;
				}
				case socket_events.VOICE_CALL_INVITE: {
					await this.onVideoCallInvite(request as T.Message.VideoCallRequest, host, user)
					break
				}
				default:
					console.log(`Unimplemented type`, request);
			}
		} catch (error) {
			console.error(`Error handling message from senderId: ${user.id}`, error);
		}
	}

	private async onMessage(request: T.Message.MessageRequest, host: WebSocket, user: T.User.Schema) {
		const r = Validate.message.parse(request);

		if (!r.images?.length && !r.content.length && !r.files.length) return console.log('Empty');

		const friendship = await this.friendRepository.getBySenderAndRecipient(user.id, r.recipient);
		if (!friendship) {
			return console.error('No friendship found between users', {data: r, sender: user.id});
		}

		const messageId = await this.messageRepository.createMessage({
			sender: r.sender,
			recipient: r.recipient,
			content: r.content,
			friendship: friendship.id,
			images: r.images,
			files: r.files,
		});
		if (!messageId) {
			return console.error("Failed to save message to the database");
		}

		const response = Buffer.from(JSON.stringify({
			type: r.type,
			edited: false,
			created_at: r.date,
			updated_at: r.date,
			content: r.content,
			sender_id: r.sender,
			files: r.files,
			images: r.images,
			message_id: messageId,
			recipient_id: r.recipient,
			friendship_id: friendship.id,
		}));

		host.send(response);

		const notification = {
			type: notification_types.MESSAGE,
			recipient_id: r.recipient,
			reference_id: r.sender,
			sender_id: r.sender,
			content: r.content,
			seen: true,
		};

		const connection = this.connections.get(r.recipient);
		if (connection) {
			connection.send(response);

			console.log(`Found WebSocket connection for recipient ${r.recipient} and Send Message`)

			await this.notificator.handleNotification(notification);
		} else {
			notification.seen = false;

			console.error(`No WebSocket connection for recipient: ${r.recipient} and Pushed To Notifications`);

			await this.notificator.handleNotification(notification);
		}
	}

	private async onLiveMessage(request: T.Message.LiveMessageRequest, host: WebSocket, user: T.User.Schema) {
		const r = Validate.live_message.parse(request);

		const exists = await this.liveRepository.getLiveById(r.liveId);
		if (!exists) {
			return console.error('No friendship found between users', r);
		}

		const messageId = await this.liveRepository.createLiveMessage(r.liveId, r.sender, r.content);
		if (!messageId) {
			return console.error("Failed to save live message to the database");
		}

		const response = Buffer.from(JSON.stringify({
			live_id: r.liveId,
			user_id: r.sender,
			user_picture: user.picture,
			username: user.username,
			first_name: user.first_name,
			last_name: user.last_name,
			created_at: new Date().toISOString(),
			content: r.content,
			type: r.type,
			message_id: messageId,
		}));

		host.send(response);

		const liveConnections = this.liveRoomsConnections.get(r.liveId);
		if (!liveConnections) {
			return console.log(`WebSocket connection for live ${r.liveId} not found`);
		}

		liveConnections.forEach(c => c.connection.send(response));

		console.log(`Sent all messages to connections: ${liveConnections.length}`);
	}

	private async onLeaveLive(request: T.Message.LeaveLiveRequest, host: WebSocket, user: T.User.Schema) {
		const liveId = Validate.uuid.parse(request.liveId);

		const connection = this.connections.get(user.id);
		if (!connection) {
			return console.error(`No WebSocket connection for recipient: ${user}`);
		}

		let liveConnections = this.liveRoomsConnections.get(liveId) || [];
		liveConnections = liveConnections.filter((c) => c.userId !== user.id);

		this.liveRoomsConnections.set(liveId, liveConnections);

		console.log(`User ${user.id} joined live event ${liveId}`);
	}

	private async onVideoCallInvite(request: T.Message.VideoCallRequest, host: WebSocket, user: T.User.Schema) {
		const r = Validate.video_call_invitation_request.parse(request);

		const connection = this.connections.get(r.recipient);
		if (!connection) {
			return console.error(`No WebSocket connection for recipient: ${r.recipient}`);
		}

		const response = Buffer.from(JSON.stringify({
			type: r.type,
			room_id: r.room,
			sender_id: r.sender,
			recipient_id: r.recipient,
			date: new Date().toISOString(),
		}));

		connection.send(response);
	}

	private async onJoinLive(request: T.Message.JoinLiveRequest, host: WebSocket, user: T.User.Schema) {
		const liveId = Validate.uuid.parse(request.liveId);

		const live = await this.liveRepository.getLiveById(liveId);
		if (!live) {
			return console.error(`No Active host for live: ${liveId}`);
		}

		const response: T.Message.JoinLiveResponse = {
			type: socket_events.JOIN_LIVE,
			hostPeerId: live.user_id,
		};

		host.send(Buffer.from(JSON.stringify(response)));

		let liveConnections = this.liveRoomsConnections.get(liveId) || [];
		liveConnections.push({connection: host, userId: user.id});
		this.liveRoomsConnections.set(liveId, liveConnections);

		console.log(`User ${user.id} joined live event ${liveId} with host peer ID ${live.user_id}`);
	}
}
