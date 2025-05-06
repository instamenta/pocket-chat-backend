"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoryController = void 0;
const http_status_codes_1 = __importDefault(require("@instamenta/http-status-codes"));
const zod_1 = require("zod");
const utilities_1 = require("../utilities");
const controller_base_1 = require("../base/controller.base");
const Validate = __importStar(require("../validators"));
class StoryController extends controller_base_1.BaseController {
    notificator;
    constructor(repository, logger, notificator) {
        super(repository, logger);
        this.notificator = notificator;
    }
    async createStory(request, response) {
        try {
            const userId = Validate.uuid.parse(request.user.id);
            const imageUrl = zod_1.z.string().url().parse(request.body.imageUrl);
            const storyId = await this.repository.createStory({ userId, imageUrl });
            if (!storyId) {
                this.log.error({
                    m: `Failed to send message`,
                    f: "createStory",
                    e: {},
                });
                return response.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).end();
            }
            response.status(http_status_codes_1.default.CREATED).json({ id: storyId });
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async listStories(request, response) {
        try {
            const userId = Validate.uuid.parse(request.user.id);
            const stories = await this.repository.listStories(userId);
            response.status(http_status_codes_1.default.OK).json(stories);
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async listFeedStories(request, response) {
        try {
            const userId = Validate.uuid.parse(request.user.id);
            const stories = await this.repository.listFeedStories(userId);
            response.status(http_status_codes_1.default.OK).json(stories);
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async listFriendStoriesByUsername(request, response) {
        try {
            const userId = Validate.name.parse(request.params.username);
            const stories = await this.repository.listFriendStoriesByUsername(userId);
            response.status(http_status_codes_1.default.OK).json(stories);
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async likeStory(request, response) {
        try {
            const storyId = Validate.uuid.parse(request.params.id);
            const userId = Validate.uuid.parse(request.user.id);
            await this.repository.likeStory(storyId, userId);
            response.status(http_status_codes_1.default.OK).end();
            await this.notificator
                .handleNotification({
                type: utilities_1.NotificationTypes.LIKE_STORY,
                referenceId: "",
                recipientId: "",
                senderId: userId,
                content: "",
                seen: false,
            })
                .catch((error) => {
                this.log.error({ e: error, f: "likeStory" });
            });
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async listCommentsByStory(request, response) {
        try {
            const storyId = Validate.uuid.parse(request.params.storyId);
            const userId = Validate.uuid.parse(request.user.id);
            const comments = await this.repository.listCommentsByStoryId(storyId, userId);
            response.status(http_status_codes_1.default.OK).json(comments);
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async createStoryComment(request, response) {
        try {
            const storyId = Validate.uuid.parse(request.params.storyId);
            const userId = Validate.uuid.parse(request.user.id);
            const content = zod_1.z.string().min(1).parse(request.body.content);
            const comment = await this.repository.createStoryComment(storyId, userId, content);
            response.status(http_status_codes_1.default.CREATED).json(comment);
            await this.notificator
                .handleNotification({
                type: utilities_1.NotificationTypes.COMMENT_STORY,
                referenceId: storyId,
                recipientId: "",
                senderId: userId,
                content: content,
                seen: false,
            })
                .catch((error) => {
                this.log.error({ e: error, f: "createStoryComment" });
            });
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async deleteStoryComment(request, response) {
        try {
            const commentId = Validate.uuid.parse(request.params.commentId);
            const userId = Validate.uuid.parse(request.user.id);
            await this.repository.deleteStoryComment(commentId, userId);
            response.status(http_status_codes_1.default.NO_CONTENT).end();
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async likeStoryComment(request, response) {
        try {
            const commentId = Validate.uuid.parse(request.params.commentId);
            const userId = Validate.uuid.parse(request.user.id);
            await this.repository.likeStoryComment(commentId, userId);
            await this.notificator
                .handleNotification({
                type: utilities_1.NotificationTypes.LIKE_STORY_COMMENT,
                referenceId: commentId,
                recipientId: "",
                senderId: userId,
                content: "",
                seen: false,
            })
                .catch((error) => {
                this.log.error({ e: error, f: "likeStoryComment" });
            });
            response.status(http_status_codes_1.default.OK).end();
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
}
exports.StoryController = StoryController;
