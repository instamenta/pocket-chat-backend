import {notification_types} from "../utilities/enumerations";
import * as T from "./index";

export type Notification = {
	id: string
	type: notification_types
	seen: boolean
	content: string
	sender_id: string
	created_at: string
	recipient_id: string
	reference_id?: string
}

export type Populated = {
	id: string
	type: string
	boolean: string
	content: string
	sender_id: string
	created_at: string
	recipient_id: string
	picture: string
	first_name: string
	seen: boolean
	last_name: string
	reference_id: string
}

export type Data = Omit<T.Notification.Notification, 'created_at' | 'id'>;
