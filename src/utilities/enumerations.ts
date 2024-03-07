export enum socket_events {
	MESSAGE = 'message',
	JOIN_LIVE = 'join_live',
	LIVE_MESSAGE = 'live_message',
	VIDEO_CALL_INVITE = 'video-call-invite',
	VOICE_CALL_INVITE = 'voice-call-invite',
}

export enum group_roles {
	OWNER = 'owner',
	MODERATOR = 'moderator',
	MEMBER = 'member'
}