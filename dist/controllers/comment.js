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
exports.CommentController = void 0;
const http_status_codes_1 = __importDefault(require("@instamenta/http-status-codes"));
const zod_1 = require("zod");
const utilities_1 = require("../utilities");
const controller_base_1 = require("../base/controller.base");
const Validate = __importStar(require("../validators"));
class CommentController extends controller_base_1.BaseController {
    notificator;
    constructor(repository, logger, notificator) {
        super(repository, logger);
        this.notificator = notificator;
    }
    async listByPublication(request, response) {
        this.log.log("listByPublication");
        try {
            const publicationId = Validate.uuid.parse(request.params.publicationId);
            const userId = Validate.uuid.parse(request.user.id);
            const comments = await this.repository.listCommentsByPublication(publicationId, userId);
            response.status(http_status_codes_1.default.OK).json(comments);
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async create(request, response) {
        this.log.log("create");
        try {
            const publicationId = Validate.uuid.parse(request.params.publicationId);
            const userId = Validate.uuid.parse(request.user.id);
            const content = zod_1.z.string().min(1).parse(request.body.content);
            const comment = await this.repository.createComment(publicationId, userId, content);
            response.status(http_status_codes_1.default.CREATED).json(comment);
            await this.notificator
                .handleNotification({
                type: utilities_1.NotificationTypes.COMMENT,
                referenceId: publicationId,
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
    async delete(request, response) {
        this.log.log("delete");
        try {
            const commentId = Validate.uuid.parse(request.params.commentId);
            const userId = Validate.uuid.parse(request.user.id);
            await this.repository.deleteComment(commentId, userId);
            response.status(http_status_codes_1.default.NO_CONTENT).end();
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async like(request, response) {
        this.log.log("like");
        try {
            const commentId = Validate.uuid.parse(request.params.commentId);
            const userId = Validate.uuid.parse(request.user.id);
            await this.repository.likeComment(commentId, userId);
            await this.notificator
                .handleNotification({
                type: utilities_1.NotificationTypes.LIKE_COMMENT,
                referenceId: commentId,
                recipientId: "",
                senderId: userId,
                content: "",
                seen: false,
            })
                .catch((error) => {
                this.log.error({ e: error });
            });
            response.status(http_status_codes_1.default.OK).end();
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
                this.log.error({ e: `Not found`, m: commentId });
                return response.status(http_status_codes_1.default.NOT_FOUND).end();
            }
            response.status(http_status_codes_1.default.OK).json(comment);
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
}
exports.CommentController = CommentController;
