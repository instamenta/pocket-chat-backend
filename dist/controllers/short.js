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
exports.ShortController = void 0;
const http_status_codes_1 = __importDefault(require("@instamenta/http-status-codes"));
const zod_1 = require("zod");
const enumerations_1 = require("../utilities/enumerations");
const controller_base_1 = require("../base/controller.base");
const Validate = __importStar(require("../validators"));
class ShortController extends controller_base_1.BaseController {
    notificator;
    constructor(repository, logger, notificator) {
        super(repository, logger);
        this.notificator = notificator;
    }
    async createShort(request, response) {
        this.log.log("createShort");
        try {
            const { userId, videoUrl, description } = Validate.createStory.parse({
                userId: request.user.id,
                videoUrl: request.body.videoUrl,
                description: request.body.description,
            });
            const shortId = await this.repository.createShort(userId, videoUrl, description);
            if (!shortId) {
                this.log.error({ e: `Failed to send message` });
                return response.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).end();
            }
            response.status(http_status_codes_1.default.CREATED).json({ id: shortId });
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async listShorts(request, response) {
        this.log.log("listShorts");
        try {
            const userId = Validate.uuid.parse(request.user.id);
            const shorts = await this.repository.listShorts(userId);
            response.status(http_status_codes_1.default.OK).json(shorts);
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async listShortsByUsername(request, response) {
        this.log.log("listShortsByUsername");
        try {
            const userId = Validate.uuid.parse(request.params.id);
            const stories = await this.repository.listShortsById(userId);
            response.status(http_status_codes_1.default.OK).json(stories);
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async getShortById(request, response) {
        this.log.log("getShortById");
        try {
            const shortId = Validate.uuid.parse(request.params.shortId);
            const short = await this.repository.getShortById(shortId);
            if (!short) {
                this.log.error({ e: `Not found`, m: shortId });
                return response.status(http_status_codes_1.default.NOT_FOUND).end();
            }
            response.status(http_status_codes_1.default.OK).json(short);
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async likeShort(request, response) {
        this.log.log("likeShort");
        try {
            const shortId = Validate.uuid.parse(request.params.id);
            const userId = Validate.uuid.parse(request.user.id);
            const isLiked = await this.repository.likeShort(shortId, userId);
            response.status(http_status_codes_1.default.OK).end();
            if (!isLiked) {
                this.log.info({ m: "Unliking short" });
                return;
            }
            else {
                this.log.info({ m: "Liking short" });
            }
            await this.notificator
                .handleNotification({
                type: enumerations_1.NotificationTypes.LIKE_SHORT,
                referenceId: shortId,
                recipientId: "",
                senderId: userId,
                content: "",
                seen: false,
            })
                .catch((error) => {
                this.log.error({ e: error });
            });
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async listCommentsByShort(request, response) {
        this.log.log("listCommentsByShort");
        try {
            const shortId = Validate.uuid.parse(request.params.shortId);
            const userId = Validate.uuid.parse(request.user.id);
            const comments = await this.repository.listCommentsByShortId(shortId, userId);
            response.status(http_status_codes_1.default.OK).json(comments);
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async createShortComment(request, response) {
        this.log.log("createShortComment");
        try {
            const shortId = Validate.uuid.parse(request.params.shortId);
            const userId = Validate.uuid.parse(request.user.id);
            const content = zod_1.z.string().min(1).parse(request.body.content);
            const comment = await this.repository.createShortComment(shortId, userId, content);
            response.status(http_status_codes_1.default.CREATED).json(comment);
            await this.notificator
                .handleNotification({
                type: enumerations_1.NotificationTypes.COMMENT_SHORT,
                referenceId: shortId,
                recipientId: "",
                senderId: userId,
                content: content,
                seen: false,
            })
                .catch((error) => {
                this.log.error({ e: error });
            });
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async deleteShortComment(request, response) {
        this.log.log("deleteShortComment");
        try {
            const commentId = Validate.uuid.parse(request.params.commentId);
            const userId = Validate.uuid.parse(request.user.id);
            await this.repository.deleteShortComment(commentId, userId);
            response.status(http_status_codes_1.default.NO_CONTENT).end();
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async likeShortComment(request, response) {
        this.log.log("likeShortComment");
        try {
            const commentId = Validate.uuid.parse(request.params.commentId);
            const userId = Validate.uuid.parse(request.user.id);
            await this.repository.likeShortComment(commentId, userId);
            response.status(http_status_codes_1.default.OK).end();
            await this.notificator
                .handleNotification({
                type: enumerations_1.NotificationTypes.LIKE_SHORT_COMMENT,
                referenceId: commentId,
                recipientId: "",
                senderId: userId,
                content: "",
                seen: false,
            })
                .catch((error) => {
                this.log.error({ e: error });
            });
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async getCommentById(request, response) {
        this.log.log("getCommentById");
        try {
            const commentId = Validate.uuid.parse(request.params.commentId);
            const comment = await this.repository.getCommentById(commentId);
            if (!comment) {
                this.log.error({ m: `Not found ${commentId}`, e: "" });
                return response.status(http_status_codes_1.default.NOT_FOUND).end();
            }
            response.status(http_status_codes_1.default.OK).json(comment);
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
}
exports.ShortController = ShortController;
