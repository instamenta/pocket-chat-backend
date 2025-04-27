"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = __importDefault(require("@instamenta/http-status-codes"));
const http_status_codes_2 = __importDefault(require("@instamenta/http-status-codes"));
const zod_1 = require("zod");
const enumerations_1 = require("../utilities/enumerations");
const controller_base_1 = require("../base/controller.base");
const validators_1 = require("../validators");
class StoryController extends controller_base_1.BaseController {
    notificator;
    constructor(repository, logger, notificator) {
        super(repository, logger);
        this.notificator = notificator;
    }
    async createStory(request, response) {
        try {
            const userId = validators_1.Validate.uuid.parse(request.user.id);
            const imageUrl = zod_1.z.string().url().parse(request.body.imageUrl);
            const storyId = await this.repository.createStory({ userId, imageUrl });
            if (!storyId) {
                console.error(`${this.constructor.name}.createStory(): Failed to send message`);
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
            const userId = validators_1.Validate.uuid.parse(request.user.id);
            const stories = await this.repository.listStories(userId);
            response.status(http_status_codes_1.default.OK).json(stories);
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async listFeedStories(request, response) {
        try {
            const userId = validators_1.Validate.uuid.parse(request.user.id);
            const stories = await this.repository.listFeedStories(userId);
            response.status(http_status_codes_1.default.OK).json(stories);
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async listFriendStoriesByUsername(request, response) {
        try {
            const userId = validators_1.Validate.name.parse(request.params.username);
            const stories = await this.repository.listFriendStoriesByUsername(userId);
            response.status(http_status_codes_1.default.OK).json(stories);
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async likeStory(request, response) {
        try {
            const storyId = validators_1.Validate.uuid.parse(request.params.id);
            const userId = validators_1.Validate.uuid.parse(request.user.id);
            await this.repository.likeStory(storyId, userId);
            response.status(http_status_codes_2.default.OK).end();
            await this.notificator.handleNotification({
                type: enumerations_1.notification_types.LIKE_STORY,
                reference_id: '',
                recipient_id: '',
                sender_id: userId,
                content: '',
                seen: false,
            }).catch(console.error);
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async listCommentsByStory(request, response) {
        try {
            const storyId = validators_1.Validate.uuid.parse(request.params.storyId);
            const userId = validators_1.Validate.uuid.parse(request.user.id);
            const comments = await this.repository.listCommentsByStoryId(storyId, userId);
            response.status(http_status_codes_2.default.OK).json(comments);
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async createStoryComment(request, response) {
        try {
            const storyId = validators_1.Validate.uuid.parse(request.params.storyId);
            const userId = validators_1.Validate.uuid.parse(request.user.id);
            const content = zod_1.z.string().min(1).parse(request.body.content);
            const comment = await this.repository.createStoryComment(storyId, userId, content);
            response.status(http_status_codes_2.default.CREATED).json(comment);
            await this.notificator.handleNotification({
                type: enumerations_1.notification_types.COMMENT_STORY,
                reference_id: storyId,
                recipient_id: '',
                sender_id: userId,
                content: content,
                seen: false,
            }).catch(console.error);
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async deleteStoryComment(request, response) {
        try {
            const commentId = validators_1.Validate.uuid.parse(request.params.commentId);
            const userId = validators_1.Validate.uuid.parse(request.user.id);
            await this.repository.deleteStoryComment(commentId, userId);
            response.status(http_status_codes_2.default.NO_CONTENT).end();
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async likeStoryComment(request, response) {
        try {
            const commentId = validators_1.Validate.uuid.parse(request.params.commentId);
            const userId = validators_1.Validate.uuid.parse(request.user.id);
            await this.repository.likeStoryComment(commentId, userId);
            await this.notificator.handleNotification({
                type: enumerations_1.notification_types.LIKE_STORY_COMMENT,
                reference_id: commentId,
                recipient_id: '',
                sender_id: userId,
                content: '',
                seen: false,
            }).catch(console.error);
            response.status(http_status_codes_2.default.OK).end();
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
}
exports.default = StoryController;
