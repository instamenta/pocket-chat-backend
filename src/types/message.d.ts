import {z} from 'zod';
import {socket_events} from "../utilities/enumerations";
import Validate from "../validators";
import {MessageStatus} from "./unions";

export type Create = z.infer<typeof Validate.create_message>;

export type Message = {
	id: string,
	edited: boolean,
	content: string,
	sender_id: string,
	created_at: string,
	updated_at: string,
	recipient_id: string,
	friendship_id: string,
	images?: string[],
	files?: string[],
	message_status: MessageStatus,
}

export type MessageRequest = {
	date?: string,
	sender: string,
	content: string,
	recipient: string,
	images?: string[],
	files?: string[],
	type: socket_events,
}

export type JoinLiveRequest = {
	type: socket_events,
	liveId: string,
}

export type LeaveLiveRequest = {
	type: socket_events,
	liveId: string,
}

export type LiveMessageRequest = {
	sender: string,
	content: string,
	liveId: string,
	type: socket_events,
}

export type VideoCallRequest = {
	room: string,
	sender: string,
	recipient: string,
	type: socket_events,
}

export type MessageResponse = {
	type: string,
	date: string,
	sender: string,
	content: string,
	recipient: string,
	messageId: string,
	friendship: string,
	images?: string[],
	files?: string[],
}

export type JoinLiveResponse = {
	type: socket_events,
	hostPeerId: string,
}

export type Conversations = {
	created_at: string
	first_name: string
	last_message: string
	last_name: string
	message_id: string
	user_id: string
	username: string
	picture: string
}
