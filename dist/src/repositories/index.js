"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const notification_1 = __importDefault(require("./notification"));
const publication_1 = __importDefault(require("./publication"));
const comment_1 = __importDefault(require("./comment"));
const message_1 = __importDefault(require("./message"));
const friend_1 = __importDefault(require("./friend"));
const story_1 = __importDefault(require("./story"));
const short_1 = __importDefault(require("./short"));
const group_1 = __importDefault(require("./group"));
const live_1 = __importDefault(require("./live"));
const user_1 = __importDefault(require("./user"));
exports.default = {
    Notification: notification_1.default,
    Publication: publication_1.default,
    Comment: comment_1.default,
    Message: message_1.default,
    Friend: friend_1.default,
    Story: story_1.default,
    Short: short_1.default,
    Group: group_1.default,
    User: user_1.default,
    Live: live_1.default,
};
