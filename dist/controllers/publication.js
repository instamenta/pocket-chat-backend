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
exports.PublicationController = void 0;
const http_status_codes_1 = __importDefault(require("@instamenta/http-status-codes"));
const utilities_1 = require("../utilities");
const controller_base_1 = require("../base/controller.base");
const Validate = __importStar(require("../validators"));
class PublicationController extends controller_base_1.BaseController {
    notificator;
    constructor(repository, logger, notificator) {
        super(repository, logger);
        this.notificator = notificator;
    }
    async listPublications(_request, response) {
        try {
            const publications = await this.repository.listPublications();
            response.status(http_status_codes_1.default.OK).json(publications);
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async getPublicationById(request, response) {
        try {
            const id = Validate.uuid.parse(request.params.id);
            const publication = await this.repository.getPublicationById(id);
            if (publication) {
                response.status(http_status_codes_1.default.OK).json(publication);
            }
            else {
                response.status(http_status_codes_1.default.NOT_FOUND).end();
            }
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async getPublicationsByUserId(request, response) {
        try {
            const id = Validate.uuid.parse(request.params.id);
            const publications = await this.repository.getPublicationsByUserId(id);
            response.status(http_status_codes_1.default.OK).json(publications);
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async getPublicationsCountByUserId(request, response) {
        try {
            const id = Validate.uuid.parse(request.params.id);
            const count = await this.repository.getPublicationsCountByUserId(id);
            response.status(http_status_codes_1.default.OK).json({ count });
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async getRecommendations(request, response) {
        try {
            const userId = Validate.uuid.parse(request.user.id);
            const recommendations = await this.repository.getRecommendations(userId);
            response.status(http_status_codes_1.default.OK).json(recommendations);
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async createPublication(request, response) {
        try {
            const data = Validate.createPublication.parse({
                publisherId: Validate.uuid.parse(request.user.id),
                description: request.body.description,
                images: request.body.images,
                publicationStatus: request.body.publication_status,
            });
            const publicationId = await this.repository.createPublication(data);
            response.status(http_status_codes_1.default.CREATED).json({ id: publicationId });
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async updatePublication(request, response) {
        try {
            const id = Validate.uuid.parse(request.params.id);
            const publicationData = Validate.updatePublication.parse(request.body);
            const updatedPublicationId = await this.repository.updatePublication(id, publicationData);
            response.status(http_status_codes_1.default.OK).json({ id: updatedPublicationId });
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async likePublication(request, response) {
        try {
            const publicationId = Validate.uuid.parse(request.params.id);
            const userId = Validate.uuid.parse(request.user.id);
            await this.repository.likePublication(publicationId, userId);
            response.status(http_status_codes_1.default.OK).end();
            await this.notificator
                .handleNotification({
                type: utilities_1.NotificationTypes.LIKE,
                referenceId: publicationId,
                recipientId: "",
                senderId: userId,
                content: "",
                seen: false,
            })
                .catch((error) => {
                this.log.error({ e: error, f: "likePublication" });
            });
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
}
exports.PublicationController = PublicationController;
