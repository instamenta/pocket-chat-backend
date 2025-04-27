"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = __importDefault(require("@instamenta/http-status-codes"));
const controller_base_1 = __importDefault(require("../base/controller.base"));
const validators_1 = __importDefault(require("../validators"));
// TODO: Notifications for Friend Related Events
class FriendController extends controller_base_1.default {
    notification;
    constructor(repository, logger, notification) {
        super(repository, logger);
        this.notification = notification;
    }
    async sendFriendRequest(r, w) {
        this.log.log('sendFriendRequest');
        try {
            const { sender, recipient } = validators_1.default.sender_recipient.parse({ sender: r.user.id, recipient: r.params.id });
            const status = await this.repository.sendFriendRequest(sender, recipient);
            if (!status) {
                this.log.error({ e: `Failed to send friend request`, m: `sender: ${sender}, recipient: ${recipient}` });
                return w.status(http_status_codes_1.default.BAD_GATEWAY).end();
            }
            w.status(http_status_codes_1.default.OK).json({ friendship_id: status });
        }
        catch (error) {
            this.errorHandler(error, w);
        }
    }
    async listFriendRequestsOnly(r, w) {
        this.log.log('listFriendRequestsOnly');
        try {
            const id = validators_1.default.uuid.parse(r.user.id);
            const list = await this.repository.listFriendRequestsOnly(id);
            if (!list) {
                this.log.error({ e: `Failed to get friend request`, m: id });
                return w.status(http_status_codes_1.default.BAD_GATEWAY).end();
            }
            w.status(http_status_codes_1.default.OK).json(list);
        }
        catch (error) {
            this.errorHandler(error, w);
        }
    }
    async listFriendSentOnly(r, w) {
        this.log.log('listFriendSentOnly');
        try {
            const id = validators_1.default.uuid.parse(r.user.id);
            const list = await this.repository.listFriendSentOnly(id);
            if (!list) {
                this.log.error({ e: `Failed to get friend request`, m: id });
                return w.status(http_status_codes_1.default.BAD_GATEWAY).end();
            }
            w.status(http_status_codes_1.default.OK).json(list);
        }
        catch (error) {
            this.errorHandler(error, w);
        }
    }
    async listFriendRequests(r, w) {
        this.log.log('listFriendRequests');
        try {
            const id = validators_1.default.uuid.parse(r.user.id);
            const friendRequests = await this.repository.listFriendRequests(id);
            if (!friendRequests) {
                this.log.error({ e: `Failed to get friend request`, m: id });
                return w.status(http_status_codes_1.default.BAD_GATEWAY).end();
            }
            w.status(http_status_codes_1.default.OK).json(friendRequests);
        }
        catch (error) {
            this.errorHandler(error, w);
        }
    }
    async listFriendRecommendations(r, w) {
        this.log.log('listFriendRecommendations');
        try {
            const id = validators_1.default.uuid.parse(r.user.id);
            const recommendations = await this.repository.listFriendRecommendations(id);
            if (!recommendations) {
                this.log.error({ e: `Failed to get friend request`, m: id });
                return w.status(http_status_codes_1.default.BAD_GATEWAY).end();
            }
            w.status(http_status_codes_1.default.OK).json(recommendations);
        }
        catch (error) {
            this.errorHandler(error, w);
        }
    }
    async acceptFriendRequest(r, w) {
        this.log.log('acceptFriendRequest');
        try {
            const { sender, recipient } = validators_1.default.sender_recipient.parse({ sender: r.user.id, recipient: r.params.id });
            const status = await this.repository.acceptFriendRequest(sender, recipient);
            if (!status) {
                this.log.error({ e: `Failed to accept friend request`, m: `sender: ${sender}, recipient: ${recipient}` });
                return w.status(http_status_codes_1.default.BAD_GATEWAY).end();
            }
            w.status(http_status_codes_1.default.OK).end();
        }
        catch (error) {
            this.errorHandler(error, w);
        }
    }
    async deleteFriendRequest(r, w) {
        this.log.log('deleteFriendRequest');
        try {
            const { sender, recipient } = validators_1.default.sender_recipient.parse({ sender: r.user.id, recipient: r.params.id });
            const status = await this.repository.deleteFriendRequest(sender, recipient);
            if (!status) {
                this.log.error({ e: `Failed to delete friend request`, m: `sender: ${sender}, recipient: ${recipient}` });
                return w.status(http_status_codes_1.default.BAD_GATEWAY).end();
            }
            w.status(http_status_codes_1.default.OK).json({ friendship_id: status });
        }
        catch (error) {
            this.errorHandler(error, w);
        }
    }
    async declineFriendRequest(r, w) {
        this.log.log('declineFriendRequest');
        try {
            const { sender, recipient } = validators_1.default.sender_recipient.parse({ sender: r.user.id, recipient: r.params.id });
            const status = await this.repository.declineFriendRequest(sender, recipient);
            if (!status) {
                this.log.error({ e: `Failed to delete friend request`, m: `sender: ${sender}, recipient: ${recipient}` });
                return w.status(http_status_codes_1.default.BAD_GATEWAY).end();
            }
            w.status(http_status_codes_1.default.OK).end();
        }
        catch (error) {
            this.errorHandler(error, w);
        }
    }
    async getFriendsCountByUserId(r, w) {
        this.log.log('getFriendsCountByUserId');
        try {
            const id = validators_1.default.uuid.parse(r.params.id);
            const count = await this.repository.getFriendsCountByUserId(id);
            if (!count) {
                this.log.error({ e: `Failed to get friends count`, m: id });
                return w.status(http_status_codes_1.default.BAD_GATEWAY).end();
            }
            console.log(count);
            w.status(http_status_codes_1.default.OK).json({ count });
        }
        catch (error) {
            this.errorHandler(error, w);
        }
    }
    async getFriendsByUserIdAndSender(r, w) {
        this.log.log('getFriendsByUserIdAndSender');
        try {
            const sender = validators_1.default.uuid.parse(r.user.id);
            const recipient = validators_1.default.uuid.parse(r.params.id);
            const friends = await this.repository.getFriendsByUserIdAndSender(sender, recipient);
            // @ts-ignore
            if (!friends) {
                this.log.error({ e: `Failed to list friends`, m: `sender: ${sender}, recipient: ${recipient}` });
                return w.status(http_status_codes_1.default.BAD_GATEWAY).end();
            }
            console.log(friends);
            w.status(http_status_codes_1.default.OK).json(friends);
        }
        catch (error) {
            this.errorHandler(error, w);
        }
    }
    async listMutualFriendsByUsers(r, w) {
        this.log.log('listMutualFriendsByUsers');
        try {
            const sender = validators_1.default.uuid.parse(r.user.id);
            const recipient = validators_1.default.uuid.parse(r.params.id);
            const friends = await this.repository.listMutualFriendsByUsers(sender, recipient);
            if (!friends) {
                this.log.error({ e: `Failed to list friends`, m: `sender: ${sender}, recipient: ${recipient}` });
                return w.status(http_status_codes_1.default.BAD_GATEWAY).end();
            }
            console.log(friends);
            w.status(http_status_codes_1.default.OK).json(friends);
        }
        catch (error) {
            this.errorHandler(error, w);
        }
    }
    async listFriendsByUserId(r, w) {
        this.log.log('listFriendsByUserId');
        try {
            const id = validators_1.default.uuid.parse(r.params.id);
            const friends = await this.repository.listFriendsByUserId(id);
            if (!friends) {
                this.log.error({ e: `Failed to list friends`, m: id });
                return w.status(http_status_codes_1.default.BAD_GATEWAY).end();
            }
            w.status(http_status_codes_1.default.OK).json(friends);
        }
        catch (error) {
            this.errorHandler(error, w);
        }
    }
    async listFriendsByUsername(r, w) {
        this.log.log('listFriendsByUsername');
        try {
            const username = validators_1.default.name.parse(r.params.username);
            const friends = await this.repository.listFriendsByUsername(username);
            if (!friends) {
                this.log.error({ e: `Failed to list friends`, m: username });
                return w.status(http_status_codes_1.default.BAD_GATEWAY).end();
            }
            w.status(http_status_codes_1.default.OK).json(friends);
        }
        catch (error) {
            this.errorHandler(error, w);
        }
    }
    async getBySenderAndRecipient(r, w) {
        this.log.log('getBySenderAndRecipient');
        try {
            const sender = validators_1.default.uuid.parse(r.params.sender);
            const recipient = validators_1.default.uuid.parse(r.params.recipient);
            const friendship = await this.repository.getBySenderAndRecipient(sender, recipient);
            if (!friendship) {
                this.log.error({ e: `Failed to get friendship`, m: `sender: ${sender}, recipient: ${recipient}` });
                return w.status(http_status_codes_1.default.BAD_GATEWAY).end();
            }
            w.status(http_status_codes_1.default.OK).json(friendship);
        }
        catch (error) {
            this.errorHandler(error, w);
        }
    }
    async getById(r, w) {
        this.log.log('getById');
        try {
            const friendship_id = validators_1.default.uuid.parse(r.params.id);
            const friendship = await this.repository.getById(friendship_id);
            if (!friendship) {
                this.log.error({ e: `Failed to get friendship`, m: friendship_id });
                return w.status(http_status_codes_1.default.BAD_GATEWAY).end();
            }
            w.status(http_status_codes_1.default.OK).json(friendship);
        }
        catch (error) {
            this.errorHandler(error, w);
        }
    }
}
exports.default = FriendController;
