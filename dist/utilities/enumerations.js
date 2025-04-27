"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notification_types = exports.group_roles = exports.publication_status = exports.socket_events = void 0;
var socket_events;
(function (socket_events) {
    socket_events["MESSAGE"] = "message";
    socket_events["JOIN_LIVE"] = "join_live";
    socket_events["LEAVE_LIVE"] = "leave_live";
    socket_events["LIVE_MESSAGE"] = "live_message";
    socket_events["VIDEO_CALL_INVITE"] = "video-call-invite";
    socket_events["VOICE_CALL_INVITE"] = "voice-call-invite";
})(socket_events || (exports.socket_events = socket_events = {}));
var publication_status;
(function (publication_status) {
    publication_status["Draft"] = "draft";
    publication_status["Published"] = "published";
})(publication_status || (exports.publication_status = publication_status = {}));
var group_roles;
(function (group_roles) {
    group_roles["OWNER"] = "owner";
    group_roles["MODERATOR"] = "moderator";
    group_roles["MEMBER"] = "member";
})(group_roles || (exports.group_roles = group_roles = {}));
var notification_types;
(function (notification_types) {
    notification_types["CALL"] = "call";
    notification_types["LIKE"] = "like";
    notification_types["LIVE"] = "live";
    notification_types["MESSAGE"] = "message";
    notification_types["COMMENT"] = "comment";
    notification_types["LIKE_COMMENT"] = "like_comment";
    notification_types["LIKE_SHORT"] = "like_short";
    notification_types["COMMENT_SHORT"] = "comment_short";
    notification_types["LIKE_SHORT_COMMENT"] = "like_comment_short";
    notification_types["LIKE_STORY"] = "like_story";
    notification_types["COMMENT_STORY"] = "comment_story";
    notification_types["LIKE_STORY_COMMENT"] = "like_comment_story";
})(notification_types || (exports.notification_types = notification_types = {}));
