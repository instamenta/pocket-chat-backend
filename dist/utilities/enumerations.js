"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationTypes = exports.GroupRoles = exports.PublicationStatus = exports.SocketEvents = void 0;
var SocketEvents;
(function (SocketEvents) {
    SocketEvents["MESSAGE"] = "message";
    SocketEvents["JOIN_LIVE"] = "join_live";
    SocketEvents["LEAVE_LIVE"] = "leave_live";
    SocketEvents["LIVE_MESSAGE"] = "live_message";
    SocketEvents["VIDEO_CALL_INVITE"] = "video-call-invite";
    SocketEvents["VOICE_CALL_INVITE"] = "voice-call-invite";
})(SocketEvents || (exports.SocketEvents = SocketEvents = {}));
var PublicationStatus;
(function (PublicationStatus) {
    PublicationStatus["Draft"] = "draft";
    PublicationStatus["Published"] = "published";
})(PublicationStatus || (exports.PublicationStatus = PublicationStatus = {}));
var GroupRoles;
(function (GroupRoles) {
    GroupRoles["OWNER"] = "owner";
    GroupRoles["MODERATOR"] = "moderator";
    GroupRoles["MEMBER"] = "member";
})(GroupRoles || (exports.GroupRoles = GroupRoles = {}));
var NotificationTypes;
(function (NotificationTypes) {
    NotificationTypes["CALL"] = "call";
    NotificationTypes["LIKE"] = "like";
    NotificationTypes["LIVE"] = "live";
    NotificationTypes["MESSAGE"] = "message";
    NotificationTypes["COMMENT"] = "comment";
    NotificationTypes["LIKE_COMMENT"] = "like_comment";
    NotificationTypes["LIKE_SHORT"] = "like_short";
    NotificationTypes["COMMENT_SHORT"] = "comment_short";
    NotificationTypes["LIKE_SHORT_COMMENT"] = "like_comment_short";
    NotificationTypes["LIKE_STORY"] = "like_story";
    NotificationTypes["COMMENT_STORY"] = "comment_story";
    NotificationTypes["LIKE_STORY_COMMENT"] = "like_comment_story";
})(NotificationTypes || (exports.NotificationTypes = NotificationTypes = {}));
