import {z} from 'zod';
import type {create_message_schema} from "../validators";
import {socket_events} from "../utilities/enumerations";

export type T_CreateMessage = z.infer<typeof create_message_schema>;

export interface I_Message {
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
	message_status: 'seen' | 'sent' | 'pending',
}

export type I_MessageRequest = {
	date?: string,
	sender: string,
	content: string,
	recipient: string,
	images?: string[],
	files?: string[],
	type: socket_events,
}

export type I_JoinLiveRequest = {
	type: socket_events,
	liveId: string,
}

export type I_LeaveLiveRequest = {
	type: socket_events,
	liveId: string,
}

export type I_LiveMessageRequest = {
	sender: string,
	content: string,
	liveId: string,
	type: socket_events,
}

export type T_VideoCallRequest = {
	room: string,
	sender: string,
	recipient: string,
	type: socket_events,
}

export type T_MessageResponse = {
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

export type T_JoinLiveResponse = {
	type: socket_events,
	hostPeerId: string,
}

