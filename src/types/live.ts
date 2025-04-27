import {socket_events} from "../utilities/enumerations";
import * as U from './unions';

export type Populated = {
	user_id: string,
	user_picture: string,
	username: string,
	first_name: string,
	last_name: string,
	state: U.LiveStates,
	created_at: string,
	id: string,
}

export type MessagePopulated = {
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

export type MessageResponse = MessagePopulated & { type: socket_events };
