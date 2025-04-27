"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = __importDefault(require("@instamenta/http-status-codes"));
const enumerations_1 = require("../utilities/enumerations");
const controller_base_1 = require("../base/controller.base");
const validators_1 = require("../validators");
class PublicationController extends controller_base_1.BaseController {
    notificator;
    constructor(repository, logger, notificator) {
        super(repository, logger);
        this.notificator = notificator;
    }
    async listPublications(request, response) {
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
            const id = validators_1.Validate.uuid.parse(request.params.id);
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
            const id = validators_1.Validate.uuid.parse(request.params.id);
            const publications = await this.repository.getPublicationsByUserId(id);
            response.status(http_status_codes_1.default.OK).json(publications);
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async getPublicationsCountByUserId(request, response) {
        try {
            const id = validators_1.Validate.uuid.parse(request.params.id);
            const count = await this.repository.getPublicationsCountByUserId(id);
            response.status(http_status_codes_1.default.OK).json({ count });
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async getRecommendations(request, response) {
        try {
            const userId = validators_1.Validate.uuid.parse(request.user.id);
            const recommendations = await this.repository.getRecommendations(userId);
            response.status(http_status_codes_1.default.OK).json(recommendations);
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async createPublication(request, response) {
        try {
            const data = validators_1.Validate.create_publication.parse({
                publisher_id: validators_1.Validate.uuid.parse(request.user.id),
                description: request.body.description,
                images: request.body.images,
                publication_status: request.body.publication_status,
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
            const id = validators_1.Validate.uuid.parse(request.params.id);
            const publicationData = validators_1.Validate.update_publication.parse(request.body);
            const updatedPublicationId = await this.repository.updatePublication(id, publicationData);
            response.status(http_status_codes_1.default.OK).json({ id: updatedPublicationId });
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async likePublication(request, response) {
        try {
            const publicationId = validators_1.Validate.uuid.parse(request.params.id);
            const userId = validators_1.Validate.uuid.parse(request.user.id);
            await this.repository.likePublication(publicationId, userId);
            w.status(http_status_codes_1.default.OK).end();
            await this.notificator.handleNotification({
                type: enumerations_1.notification_types.LIKE,
                reference_id: publicationId,
                recipient_id: '',
                sender_id: userId,
                content: '',
                seen: false,
            }).catch(console.error);
        }
        catch (error) {
            this.errorHandler(error, w);
        }
    }
}
exports.default = PublicationController;
