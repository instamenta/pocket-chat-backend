"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = __importDefault(require("@instamenta/http-status-codes"));
const http_status_codes_2 = __importDefault(require("@instamenta/http-status-codes"));
const zod_1 = require("zod");
const enumerations_1 = require("../utilities/enumerations");
const controller_base_1 = __importDefault(require("../base/controller.base"));
const validators_1 = require("../validators");
class ShortController extends controller_base_1.default {
    notificator;
    constructor(repository, logger, notificator) {
        super(repository, logger);
        this.notificator = notificator;
    }
    async createShort(r, w) {
        this.log.log('createShort');
        try {
            const { userId, videoUrl, description } = validators_1.Validate.create_story.parse({
                userId: r.user.id,
                videoUrl: r.body.videoUrl,
                description: r.body.description
            });
            const shortId = await this.repository.createShort(userId, videoUrl, description);
            if (!shortId) {
                this.log.error({ e: `Failed to send message` });
                return w.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).end();
            }
            w.status(http_status_codes_1.default.CREATED).json({ id: shortId });
        }
        catch (error) {
            this.errorHandler(error, w);
        }
    }
    async listShorts(r, w) {
        this.log.log('listShorts');
        try {
            const userId = validators_1.Validate.uuid.parse(r.user.id);
            const shorts = await this.repository.listShorts(userId);
            if (!shorts) {
                this.log.error({ e: `Failed to get stories`, m: userId });
                return w.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).end();
            }
            w.status(http_status_codes_1.default.OK).json(shorts);
        }
        catch (error) {
            this.errorHandler(error, w);
        }
    }
    async listShortsByUsername(r, w) {
        this.log.log('listShortsByUsername');
        try {
            const userId = validators_1.Validate.uuid.parse(r.params.id);
            const stories = await this.repository.listShortsById(userId);
            if (!stories) {
                this.log.error({ e: 'Failed to get stories', m: userId });
                return w.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).end();
            }
            w.status(http_status_codes_1.default.OK).json(stories);
        }
        catch (error) {
            this.errorHandler(error, w);
        }
    }
    async getShortById(r, w) {
        this.log.log('getShortById');
        try {
            const shortId = validators_1.Validate.uuid.parse(r.params.shortId);
            const short = await this.repository.getShortById(shortId);
            if (!short) {
                this.log.error({ e: `Not found`, m: shortId });
                return w.status(http_status_codes_2.default.NOT_FOUND).end();
            }
            w.status(http_status_codes_2.default.OK).json(short);
        }
        catch (error) {
            this.errorHandler(error, w);
        }
    }
    async likeShort(r, w) {
        this.log.log('likeShort');
        try {
            const shortId = validators_1.Validate.uuid.parse(r.params.id);
            const userId = validators_1.Validate.uuid.parse(r.user.id);
            const isLiked = await this.repository.likeShort(shortId, userId);
            w.status(http_status_codes_2.default.OK).end();
            if (!isLiked) {
                this.log.info({ m: 'Unliking short' });
                return;
            }
            else {
                this.log.info({ m: 'Liking short' });
            }
            await this.notificator.handleNotification({
                type: enumerations_1.notification_types.LIKE_SHORT,
                reference_id: shortId,
                recipient_id: '',
                sender_id: userId,
                content: '',
                seen: false,
            })
                .catch(e => { this.log.error({ e }); });
        }
        catch (error) {
            this.errorHandler(error, w);
        }
    }
    async listCommentsByShort(r, w) {
        this.log.log('listCommentsByShort');
        try {
            const shortId = validators_1.Validate.uuid.parse(r.params.shortId);
            const userId = validators_1.Validate.uuid.parse(r.user.id);
            const comments = await this.repository.listCommentsByShortId(shortId, userId);
            w.status(http_status_codes_2.default.OK).json(comments);
        }
        catch (error) {
            this.errorHandler(error, w);
        }
    }
    async createShortComment(r, w) {
        this.log.log('createShortComment');
        try {
            const shortId = validators_1.Validate.uuid.parse(r.params.shortId);
            const userId = validators_1.Validate.uuid.parse(r.user.id);
            const content = zod_1.z.string().min(1).parse(r.body.content);
            const comment = await this.repository.createShortComment(shortId, userId, content);
            w.status(http_status_codes_2.default.CREATED).json(comment);
            await this.notificator.handleNotification({
                type: enumerations_1.notification_types.COMMENT_SHORT,
                reference_id: shortId,
                recipient_id: '',
                sender_id: userId,
                content: content,
                seen: false,
            })
                .catch(e => { this.log.error({ e }); });
        }
        catch (error) {
            this.errorHandler(error, w);
        }
    }
    async deleteShortComment(r, w) {
        this.log.log('deleteShortComment');
        try {
            const commentId = validators_1.Validate.uuid.parse(r.params.commentId);
            const userId = validators_1.Validate.uuid.parse(r.user.id);
            await this.repository.deleteShortComment(commentId, userId);
            w.status(http_status_codes_2.default.NO_CONTENT).end();
        }
        catch (error) {
            this.errorHandler(error, w);
        }
    }
    async likeShortComment(r, w) {
        this.log.log('likeShortComment');
        try {
            const commentId = validators_1.Validate.uuid.parse(r.params.commentId);
            const userId = validators_1.Validate.uuid.parse(r.user.id);
            await this.repository.likeShortComment(commentId, userId);
            w.status(http_status_codes_2.default.OK).end();
            await this.notificator.handleNotification({
                type: enumerations_1.notification_types.LIKE_SHORT_COMMENT,
                reference_id: commentId,
                recipient_id: '',
                sender_id: userId,
                content: '',
                seen: false,
            })
                .catch((e) => { this.log.error({ e }); });
        }
        catch (error) {
            this.errorHandler(error, w);
        }
    }
    async getCommentById(r, w) {
        this.log.log('getCommentById');
        try {
            const commentId = validators_1.Validate.uuid.parse(r.params.commentId);
            const comment = await this.repository.getCommentById(commentId);
            if (!comment) {
                this.log.error({ m: `Not found ${commentId}`, e: '' });
                return w.status(http_status_codes_2.default.NOT_FOUND).end();
            }
            w.status(http_status_codes_2.default.OK).json(comment);
        }
        catch (error) {
            this.errorHandler(error, w);
        }
    }
}
exports.default = ShortController;
