import {z} from 'zod';
import type {create_message_schema} from "../validators";

export type T_CreateMessage = z.infer<typeof create_message_schema>;

export interface I_Message {
	id: string,
	content: string,
	message_status: 'seen' | 'sent' | 'pending',
	updated_at: string,
	created_at: string,
	edited: boolean,
	sender_id: string,
	recipient_id: string,
	friendship_id: string,
}

export type T_MessageTypes =  'video-call-invite' | 'message'

export type I_MessageRequest = {
	type: T_MessageTypes,
	sender: string,
	recipient: string,
	content: string,
	date?: string,
}

export type T_VideoCallRequest = {
	type: T_MessageTypes,
	sender: string,
	recipient: string,
	room: string,
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