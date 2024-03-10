import {socket_events} from "../utilities/enumerations";

export type E_LiveStates = 'active' | 'paused' | 'ended';

export type T_LivePopulated = {
	user_id: string,
	user_picture: string,
	username: string,
	first_name: string,
	last_name: string,
	state: E_LiveStates,
	created_at: string,
	id: string,
}

export type T_LiveMessagePopulated = {
	message_id: string,
	user_id: string,
	user_picture: string,
	username: string,
	first_name: string,
	last_name: string,
	content: string,
	live_id: string,
	created_at: string,
}

export type T_LiveMessageResponse = T_LiveMessagePopulated & { type: socket_events };
