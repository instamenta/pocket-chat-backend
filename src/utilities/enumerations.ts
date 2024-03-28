export enum socket_events {
	MESSAGE = 'message',
	JOIN_LIVE = 'join_live',
	LEAVE_LIVE = 'leave_live',
	LIVE_MESSAGE = 'live_message',
	VIDEO_CALL_INVITE = 'video-call-invite',
	VOICE_CALL_INVITE = 'voice-call-invite',
}

export enum group_roles {
	OWNER = 'owner',
	MODERATOR = 'moderator',
	MEMBER = 'member'
}

// TODO FRIEND INVITATION NOTIFICATION

export enum notification_types {
	CALL = 'call',
	LIKE = 'like',
	LIVE = 'live',
	MESSAGE = 'message',

	//* Publications
	COMMENT = 'comment',
	LIKE_COMMENT = 'like_comment',

	//* Short
	LIKE_SHORT = 'like_short',
	COMMENT_SHORT = 'comment_short',
	LIKE_SHORT_COMMENT = 'like_comment_short',

	//* Story
	LIKE_STORY = 'like_story',
	COMMENT_STORY = 'comment_story',
	LIKE_STORY_COMMENT = 'like_comment_story',
}