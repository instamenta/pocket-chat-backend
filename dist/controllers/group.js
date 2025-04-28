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
exports.GroupController = void 0;
const http_status_codes_1 = __importDefault(require("@instamenta/http-status-codes"));
const controller_base_1 = require("../base/controller.base");
const Validate = __importStar(require("../validators"));
class GroupController extends controller_base_1.BaseController {
    async createGroup(request, response) {
        try {
            const { userId, name, description, imageUrl } = Validate.createGroup.parse({
                userId: request.user.id,
                name: request.body.name,
                description: request.body.description,
                imageUrl: request.body.imageUrl,
            });
            const groupId = await this.repository.createGroup(userId, name, description, imageUrl);
            if (!groupId) {
                this.log.error({
                    e: {},
                    f: "createGroup",
                    m: "failed to create group",
                });
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
            const userId = Validate.uuid.parse(request.user.id);
            const groupId = Validate.uuid.parse(request.params.groupId);
            const success = await this.repository.removeGroup(userId, groupId);
            if (!success) {
                this.log.error({
                    e: {},
                    f: "removeGroup",
                    m: "failed to remove group",
                });
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
            const userId = Validate.uuid.parse(request.user.id);
            const groups = await this.repository.listGroups(userId);
            response.status(http_status_codes_1.default.OK).json(groups);
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async listGroupsByUser(request, response) {
        try {
            const userId = Validate.uuid.parse(request.params.userId);
            const groups = await this.repository.listGroupsByUser(userId);
            response.status(http_status_codes_1.default.OK).json(groups);
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async getGroupById(request, response) {
        try {
            const groupId = Validate.uuid.parse(request.params.id);
            const group = await this.repository.getGroupById(groupId);
            if (!group) {
                this.log.error({ e: {}, f: "getGroupById", m: "failed to get group" });
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
            const groupId = Validate.uuid.parse(request.params.id);
            const userId = Validate.uuid.parse(request.user.id);
            const success = await this.repository.joinGroup(userId, groupId);
            if (!success) {
                this.log.error({ e: {}, f: "joinGroup", m: "failed to join group" });
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
            const groupId = Validate.uuid.parse(request.params.id);
            const userId = Validate.uuid.parse(request.user.id);
            const success = await this.repository.leaveGroup(userId, groupId);
            if (!success) {
                this.log.error({ e: {}, f: "leaveGroup", m: "failed to leave group" });
                return response.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).end();
            }
            response.status(http_status_codes_1.default.OK).end();
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async changeRole(request, response) {
        try {
            const groupId = Validate.uuid.parse(request.params.groupId);
            const senderId = Validate.uuid.parse(request.user.id);
            const recipientId = Validate.uuid.parse(request.params.recipientId);
            if (request.body.newRole !== "member" &&
                request.body.newRole !== "moderator") {
                throw new Error("Invalid Role");
            }
            const success = await this.repository.changeRole(groupId, senderId, recipientId, request.body.newRole);
            if (!success) {
                this.log.error({ e: {}, f: "changeRole", m: "failed to change role" });
                return response.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).end();
            }
            response.status(http_status_codes_1.default.OK).end();
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async removeMember(request, response) {
        try {
            const groupId = Validate.uuid.parse(request.params.groupId);
            const senderId = Validate.uuid.parse(request.user.id);
            const recipientId = Validate.uuid.parse(request.params.recipientId);
            const success = await this.repository.removeMember(groupId, senderId, recipientId);
            if (!success) {
                this.log.error({
                    e: {},
                    f: "removeMember",
                    m: "failed to remove member",
                });
                return response.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).end();
            }
            response.status(http_status_codes_1.default.OK).end();
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async getMembersByGroupId(request, response) {
        try {
            const groupId = Validate.uuid.parse(request.params.id);
            const members = await this.repository.getMembersByGroupId(groupId);
            response.status(http_status_codes_1.default.OK).json(members);
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
            const groupId = Validate.uuid.parse(request.body.groupId);
            const publicationId = await this.repository.createPublication({
                ...data,
                groupId,
            });
            response.status(http_status_codes_1.default.CREATED).json({ id: publicationId });
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async listPublications(request, response) {
        try {
            const groupId = Validate.uuid.parse(request.params.groupId);
            const publications = await this.repository.listPublications(groupId);
            response.status(http_status_codes_1.default.OK).json(publications);
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
}
exports.GroupController = GroupController;
