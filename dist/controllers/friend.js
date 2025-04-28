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
exports.FriendController = void 0;
const http_status_codes_1 = __importDefault(require("@instamenta/http-status-codes"));
const controller_base_1 = require("../base/controller.base");
const Validate = __importStar(require("../validators"));
class FriendController extends controller_base_1.BaseController {
    async sendFriendRequest(request, response) {
        this.log.log('sendFriendRequest');
        try {
            const { sender, recipient } = Validate.sender_recipient.parse({ sender: request.user.id, recipient: request.params.id });
            const status = await this.repository.sendFriendRequest(sender, recipient);
            if (!status) {
                this.log.error({ e: `Failed to send friend request`, m: `sender: ${sender}, recipient: ${recipient}` });
                return response.status(http_status_codes_1.default.BAD_GATEWAY).end();
            }
            response.status(http_status_codes_1.default.OK).json({ friendship_id: status });
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async listFriendRequestsOnly(request, response) {
        this.log.log('listFriendRequestsOnly');
        try {
            const id = Validate.uuid.parse(request.user.id);
            const list = await this.repository.listFriendRequestsOnly(id);
            response.status(http_status_codes_1.default.OK).json(list);
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async listFriendSentOnly(request, response) {
        this.log.log('listFriendSentOnly');
        try {
            const id = Validate.uuid.parse(request.user.id);
            const list = await this.repository.listFriendSentOnly(id);
            response.status(http_status_codes_1.default.OK).json(list);
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async listFriendRequests(request, response) {
        this.log.log('listFriendRequests');
        try {
            const id = Validate.uuid.parse(request.user.id);
            const friendRequests = await this.repository.listFriendRequests(id);
            response.status(http_status_codes_1.default.OK).json(friendRequests);
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async listFriendRecommendations(request, response) {
        this.log.log('listFriendRecommendations');
        try {
            const id = Validate.uuid.parse(request.user.id);
            const recommendations = await this.repository.listFriendRecommendations(id);
            response.status(http_status_codes_1.default.OK).json(recommendations);
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async acceptFriendRequest(request, response) {
        this.log.log('acceptFriendRequest');
        try {
            const { sender, recipient } = Validate.sender_recipient.parse({ sender: request.user.id, recipient: request.params.id });
            const status = await this.repository.acceptFriendRequest(sender, recipient);
            if (!status) {
                this.log.error({ e: `Failed to accept friend request`, m: `sender: ${sender}, recipient: ${recipient}` });
                return response.status(http_status_codes_1.default.BAD_GATEWAY).end();
            }
            response.status(http_status_codes_1.default.OK).end();
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async deleteFriendRequest(request, response) {
        this.log.log('deleteFriendRequest');
        try {
            const { sender, recipient } = Validate.sender_recipient.parse({ sender: request.user.id, recipient: request.params.id });
            const status = await this.repository.deleteFriendRequest(sender, recipient);
            if (!status) {
                this.log.error({ e: `Failed to delete friend request`, m: `sender: ${sender}, recipient: ${recipient}` });
                return response.status(http_status_codes_1.default.BAD_GATEWAY).end();
            }
            response.status(http_status_codes_1.default.OK).json({ friendship_id: status });
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async declineFriendRequest(request, response) {
        this.log.log('declineFriendRequest');
        try {
            const { sender, recipient } = Validate.sender_recipient.parse({ sender: request.user.id, recipient: request.params.id });
            const status = await this.repository.declineFriendRequest(sender, recipient);
            if (!status) {
                this.log.error({ e: `Failed to delete friend request`, m: `sender: ${sender}, recipient: ${recipient}` });
                return response.status(http_status_codes_1.default.BAD_GATEWAY).end();
            }
            response.status(http_status_codes_1.default.OK).end();
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async getFriendsCountByUserId(request, response) {
        this.log.log('getFriendsCountByUserId');
        try {
            const id = Validate.uuid.parse(request.params.id);
            const count = await this.repository.getFriendsCountByUserId(id);
            if (!count) {
                this.log.error({ e: `Failed to get friends count`, m: id });
                return response.status(http_status_codes_1.default.BAD_GATEWAY).end();
            }
            console.log(count);
            response.status(http_status_codes_1.default.OK).json({ count });
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async listMutualFriendsByUsers(request, response) {
        this.log.log('listMutualFriendsByUsers');
        try {
            const sender = Validate.uuid.parse(request.user.id);
            const recipient = Validate.uuid.parse(request.params.id);
            const friends = await this.repository.listMutualFriendsByUsers(sender, recipient);
            response.status(http_status_codes_1.default.OK).json(friends);
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async listFriendsByUserId(request, response) {
        this.log.log('listFriendsByUserId');
        try {
            const id = Validate.uuid.parse(request.params.id);
            const friends = await this.repository.listFriendsByUserId(id);
            response.status(http_status_codes_1.default.OK).json(friends);
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async listFriendsByUsername(request, response) {
        this.log.log('listFriendsByUsername');
        try {
            const username = Validate.name.parse(request.params.username);
            const friends = await this.repository.listFriendsByUsername(username);
            response.status(http_status_codes_1.default.OK).json(friends);
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async getBySenderAndRecipient(request, response) {
        this.log.log('getBySenderAndRecipient');
        try {
            const sender = Validate.uuid.parse(request.params.sender);
            const recipient = Validate.uuid.parse(request.params.recipient);
            const friendship = await this.repository.getBySenderAndRecipient(sender, recipient);
            response.status(http_status_codes_1.default.OK).json(friendship);
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async getById(request, response) {
        this.log.log('getById');
        try {
            const friendship_id = Validate.uuid.parse(request.params.id);
            const friendship = await this.repository.getById(friendship_id);
            response.status(http_status_codes_1.default.OK).json(friendship);
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
}
exports.FriendController = FriendController;
