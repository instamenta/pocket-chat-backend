export interface I_UserSchema {
	id: string;
	username: string;
	email: string;
	password: string;
	first_name: string;
	last_name: string;
	picture: string;
	created_at: string; // Timestamp in ISO
	updated_at: string; // Timestamp in ISO
	last_active_at: string; // Timestamp in ISO
}
