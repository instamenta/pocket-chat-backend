import {z} from 'zod';
import type {create_message_schema} from "../validators";

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
	message_status: 'seen' | 'sent' | 'pending',
}

export type I_MessageRequest = {
	date?: string,
	sender: string,
	content: string,
	recipient: string,
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
}