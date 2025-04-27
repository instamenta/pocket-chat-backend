"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = __importDefault(require("@instamenta/http-status-codes"));
const http_status_codes_2 = __importDefault(require("@instamenta/http-status-codes"));
const controller_base_1 = require("../base/controller.base");
const validators_1 = require("../validators");
class GroupController extends controller_base_1.BaseController {
    async createGroup(request, response) {
        try {
            const { userId, name, description, imageUrl } = validators_1.Validate.create_group.parse({
                userId: request.user.id,
                name: request.body.name,
                description: request.body.description,
                imageUrl: request.body.imageUrl,
            });
            const groupId = await this.repository.createGroup(userId, name, description, imageUrl);
            if (!groupId) {
                console.error(`${this.constructor.name}.createGroup(): Failed to create group`);
                return response.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).end();
            }
            response.status(http_status_codes_1.default.CREATED).json({ id: groupId });
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async removeGroup(request, response) {
        try {
            const userId = validators_1.Validate.uuid.parse(request.user.id);
            const groupId = validators_1.Validate.uuid.parse(request.params.groupId);
            const success = await this.repository.removeGroup(userId, groupId);
            if (!success) {
                console.error(`${this.constructor.name}.removeGroup(): Failed to remove group`);
                return response.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).end();
            }
            response.status(http_status_codes_1.default.CREATED).end();
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async listGroups(request, response) {
        try {
            const userId = validators_1.Validate.uuid.parse(request.user.id);
            const groups = await this.repository.listGroups(userId);
            response.status(http_status_codes_1.default.OK).json(groups);
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async listGroupsByUser(request, response) {
        try {
            const userId = validators_1.Validate.uuid.parse(request.params.userId);
            const groups = await this.repository.listGroupsByUser(userId);
            response.status(http_status_codes_1.default.OK).json(groups);
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async getGroupById(request, response) {
        try {
            const groupId = validators_1.Validate.uuid.parse(request.params.id);
            const group = await this.repository.getGroupById(groupId);
            if (!group) {
                console.error(`${this.constructor.name}.getGroupById(): Error`);
                return response.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).end();
            }
            response.status(http_status_codes_1.default.OK).json(group);
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async joinGroup(request, response) {
        try {
            const groupId = validators_1.Validate.uuid.parse(request.params.id);
            const userId = validators_1.Validate.uuid.parse(request.user.id);
            const success = await this.repository.joinGroup(userId, groupId);
            if (!success) {
                console.error(`${this.constructor.name}.joinGroup(): Error`);
                return response.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).end();
            }
            response.status(http_status_codes_1.default.OK).end();
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async leaveGroup(request, response) {
        try {
            const groupId = validators_1.Validate.uuid.parse(request.params.id);
            const userId = validators_1.Validate.uuid.parse(request.user.id);
            const success = await this.repository.leaveGroup(userId, groupId);
            if (!success) {
                console.error(`${this.constructor.name}.leaveGroup(): Error`);
                return w.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).end();
            }
            w.status(http_status_codes_1.default.OK).end();
        }
        catch (error) {
            this.errorHandler(error, w);
        }
    }
    async changeRole(request, w) {
        try {
            const groupId = validators_1.Validate.uuid.parse(r.params.groupId);
            const senderId = validators_1.Validate.uuid.parse(r.user.id);
            const recipientId = validators_1.Validate.uuid.parse(r.params.recipientId);
            if (r.body.newRole !== 'member' && r.body.newRole !== 'moderator') {
                throw new Error('Invalid Role');
            }
            const success = await this.repository.changeRole(groupId, senderId, recipientId, r.body.newRole);
            if (!success) {
                console.error(`${this.constructor.name}.changeRole(): Error`);
                return w.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).end();
            }
            w.status(http_status_codes_1.default.OK).end();
        }
        catch (error) {
            this.errorHandler(error, w);
        }
    }
    async removeMember(r, w) {
        try {
            const groupId = validators_1.Validate.uuid.parse(r.params.groupId);
            const senderId = validators_1.Validate.uuid.parse(r.user.id);
            const recipientId = validators_1.Validate.uuid.parse(r.params.recipientId);
            const success = await this.repository.removeMember(groupId, senderId, recipientId);
            if (!success) {
                console.error(`${this.constructor.name}.removeMember(): Error`);
                return w.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).end();
            }
            w.status(http_status_codes_1.default.OK).end();
        }
        catch (error) {
            this.errorHandler(error, w);
        }
    }
    async getMembersByGroupId(r, w) {
        try {
            const groupId = validators_1.Validate.uuid.parse(r.params.id);
            const members = await this.repository.getMembersByGroupId(groupId);
            w.status(http_status_codes_1.default.OK).json(members);
        }
        catch (error) {
            this.errorHandler(error, w);
        }
    }
    async createPublication(r, w) {
        try {
            const data = validators_1.Validate.create_publication.parse({
                publisher_id: validators_1.Validate.uuid.parse(r.user.id),
                description: r.body.description,
                images: r.body.images,
                publication_status: r.body.publication_status,
            });
            const groupId = validators_1.Validate.uuid.parse(r.body.groupId);
            const publicationId = await this.repository.createPublication({ ...data, groupId });
            w.status(http_status_codes_2.default.CREATED).json({ id: publicationId });
        }
        catch (error) {
            this.errorHandler(error, w);
        }
    }
    async listPublications(r, w) {
        try {
            const groupId = validators_1.Validate.uuid.parse(r.params.groupId);
            const publications = await this.repository.listPublications(groupId);
            w.status(http_status_codes_2.default.OK).json(publications);
        }
        catch (error) {
            this.errorHandler(error, w);
        }
    }
}
exports.default = GroupController;
