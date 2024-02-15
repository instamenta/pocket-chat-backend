export interface I_UserSchema {
	id: string;
	email: string;
	picture: string;
	username: string;
	password: string;
	bio: string;
	first_name: string;
	last_name: string;
	created_at: string; // Timestamp in ISO
	updated_at: string; // Timestamp in ISO
	last_active_at: string; // Timestamp in ISO
}
