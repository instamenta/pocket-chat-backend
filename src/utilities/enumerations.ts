export enum PublicationStatus {
  Draft = "draft",
  Published = "published",
}

export enum GroupRoles {
  OWNER = "owner",
  MODERATOR = "moderator",
  MEMBER = "member",
}

export enum NotificationTypes {
  CALL = "call",
  LIKE = "like",
  LIVE = "live",
  MESSAGE = "message",

  //* Publications
  COMMENT = "comment",
  LIKE_COMMENT = "like_comment",

  //* Short
  LIKE_SHORT = "like_short",
  COMMENT_SHORT = "comment_short",
  LIKE_SHORT_COMMENT = "like_comment_short",

  //* Story
  LIKE_STORY = "like_story",
  COMMENT_STORY = "comment_story",
  LIKE_STORY_COMMENT = "like_comment_story",
}
