"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = __importDefault(require("@instamenta/http-status-codes"));
const enumerations_1 = require("../utilities/enumerations");
const controller_base_1 = __importDefault(require("../base/controller.base"));
const validators_1 = __importDefault(require("../validators"));
class PublicationController extends controller_base_1.default {
    notificator;
    constructor(repository, logger, notificator) {
        super(repository, logger);
        this.notificator = notificator;
    }
    async listPublications(r, w) {
        try {
            const publications = await this.repository.listPublications();
            w.status(http_status_codes_1.default.OK).json(publications);
        }
        catch (error) {
            this.errorHandler(error, w);
        }
    }
    async getPublicationById(r, w) {
        try {
            const id = validators_1.default.uuid.parse(r.params.id);
            const publication = await this.repository.getPublicationById(id);
            !publication
                ? w.status(http_status_codes_1.default.NOT_FOUND).end()
                : w.status(http_status_codes_1.default.OK).json(publication);
        }
        catch (error) {
            this.errorHandler(error, w);
        }
    }
    async getPublicationsByUserId(r, w) {
        try {
            const id = validators_1.default.uuid.parse(r.params.id);
            const publications = await this.repository.getPublicationsByUserId(id);
            w.status(http_status_codes_1.default.OK).json(publications);
        }
        catch (error) {
            this.errorHandler(error, w);
        }
    }
    async getPublicationsCountByUserId(r, w) {
        try {
            const id = validators_1.default.uuid.parse(r.params.id);
            const count = await this.repository.getPublicationsCountByUserId(id);
            w.status(http_status_codes_1.default.OK).json({ count });
        }
        catch (error) {
            this.errorHandler(error, w);
        }
    }
    async getRecommendations(r, w) {
        try {
            const userId = validators_1.default.uuid.parse(r.user.id);
            const recommendations = await this.repository.getRecommendations(userId);
            w.status(http_status_codes_1.default.OK).json(recommendations);
        }
        catch (error) {
            this.errorHandler(error, w);
        }
    }
    async createPublication(r, w) {
        try {
            const data = validators_1.default.create_publication.parse({
                publisher_id: validators_1.default.uuid.parse(r.user.id),
                description: r.body.description,
                images: r.body.images,
                publication_status: r.body.publication_status,
            });
            const publicationId = await this.repository.createPublication(data);
            w.status(http_status_codes_1.default.CREATED).json({ id: publicationId });
        }
        catch (error) {
            this.errorHandler(error, w);
        }
    }
    async updatePublication(r, w) {
        try {
            const id = validators_1.default.uuid.parse(r.params.id);
            const publicationData = validators_1.default.update_publication.parse(r.body);
            const updatedPublicationId = await this.repository.updatePublication(id, publicationData);
            w.status(http_status_codes_1.default.OK).json({ id: updatedPublicationId });
        }
        catch (error) {
            this.errorHandler(error, w);
        }
    }
    async likePublication(r, w) {
        try {
            const publicationId = validators_1.default.uuid.parse(r.params.id);
            const userId = validators_1.default.uuid.parse(r.user.id);
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
