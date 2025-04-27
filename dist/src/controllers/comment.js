"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = __importDefault(require("@instamenta/http-status-codes"));
const zod_1 = require("zod");
const enumerations_1 = require("../utilities/enumerations");
const controller_base_1 = __importDefault(require("../base/controller.base"));
const validators_1 = __importDefault(require("../validators"));
class CommentController extends controller_base_1.default {
    notificator;
    constructor(repository, logger, notificator) {
        super(repository, logger);
        this.notificator = notificator;
    }
    async listByPublication(r, w) {
        this.log.log('listByPublication');
        try {
            const publicationId = validators_1.default.uuid.parse(r.params.publicationId);
            const userId = validators_1.default.uuid.parse(r.user.id);
            const comments = await this.repository.listCommentsByPublication(publicationId, userId);
            w.status(http_status_codes_1.default.OK).json(comments);
        }
        catch (error) {
            this.errorHandler(error, w);
        }
    }
    async create(r, w) {
        this.log.log('create');
        try {
            const publicationId = validators_1.default.uuid.parse(r.params.publicationId);
            const userId = validators_1.default.uuid.parse(r.user.id);
            const content = zod_1.z.string().min(1).parse(r.body.content);
            const comment = await this.repository.createComment(publicationId, userId, content);
            w.status(http_status_codes_1.default.CREATED).json(comment);
            await this.notificator.handleNotification({
                type: enumerations_1.notification_types.COMMENT,
                reference_id: publicationId,
                recipient_id: '',
                sender_id: userId,
                content: content,
                seen: false,
            })
                .catch(e => this.log.error({ e }));
        }
        catch (error) {
            this.errorHandler(error, w);
        }
    }
    async delete(r, w) {
        this.log.log('delete');
        try {
            const commentId = validators_1.default.uuid.parse(r.params.commentId);
            const userId = validators_1.default.uuid.parse(r.user.id);
            await this.repository.deleteComment(commentId, userId);
            w.status(http_status_codes_1.default.NO_CONTENT).end();
        }
        catch (error) {
            this.errorHandler(error, w);
        }
    }
    async like(r, w) {
        this.log.log('like');
        try {
            const commentId = validators_1.default.uuid.parse(r.params.commentId);
            const userId = validators_1.default.uuid.parse(r.user.id);
            await this.repository.likeComment(commentId, userId);
            await this.notificator.handleNotification({
                type: enumerations_1.notification_types.LIKE_COMMENT,
                reference_id: commentId,
                recipient_id: '',
                sender_id: userId,
                content: '',
                seen: false,
            })
                .catch(e => this.log.error({ e }));
            w.status(http_status_codes_1.default.OK).end();
        }
        catch (error) {
            this.errorHandler(error, w);
        }
    }
    async getCommentById(r, w) {
        this.log.log('getCommentById');
        try {
            const commentId = validators_1.default.uuid.parse(r.params.commentId);
            const comment = await this.repository.getCommentById(commentId);
            if (!comment) {
                this.log.error({ e: `Not found`, m: commentId });
                return w.status(http_status_codes_1.default.NOT_FOUND).end();
            }
            w.status(http_status_codes_1.default.OK).json(comment);
        }
        catch (error) {
            this.errorHandler(error, w);
        }
    }
}
exports.default = CommentController;
