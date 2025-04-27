"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = __importDefault(require("@instamenta/http-status-codes"));
const controller_base_1 = __importDefault(require("../base/controller.base"));
const validators_1 = __importDefault(require("../validators"));
class LiveController extends controller_base_1.default {
    async createLive(r, w) {
        try {
            const userId = validators_1.default.uuid.parse(r.user.id);
            const shortId = await this.repository.createLive(userId);
            if (!shortId) {
                console.error(`${this.constructor.name}.createLive(): Failed to create live`);
                return w.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).end();
            }
            w.status(http_status_codes_1.default.CREATED).json({ id: shortId });
        }
        catch (error) {
            this.errorHandler(error, w);
        }
    }
    async listLives(r, w) {
        try {
            const userId = validators_1.default.uuid.parse(r.user.id);
            const lives = await this.repository.listLives(userId);
            if (!lives) {
                console.error(`${this.constructor.name}.listLives(): Failed to list lives`);
                return w.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).end();
            }
            w.status(http_status_codes_1.default.OK).json(lives);
        }
        catch (error) {
            this.errorHandler(error, w);
        }
    }
    async listLiveMessages(r, w) {
        try {
            const liveId = validators_1.default.uuid.parse(r.params.liveId);
            const messages = await this.repository.listLiveMessages(liveId);
            if (!messages) {
                console.error(`${this.constructor.name}.listLiveMessages(): Failed to list live messages`);
                return w.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).end();
            }
            w.status(http_status_codes_1.default.OK).json(messages);
        }
        catch (error) {
            this.errorHandler(error, w);
        }
    }
    async updateLiveState(r, w) {
        try {
            const userId = validators_1.default.uuid.parse(r.user.id);
            if (!['active', 'paused', 'ended'].includes(r.params.state)) {
                console.error(`${this.constructor.name}.lives(): Invalid State`, r.params);
                return w.status(http_status_codes_1.default.BAD_REQUEST).end();
            }
            const lives = await this.repository.updateLiveState(userId, r.params.state);
            if (!lives) {
                console.error(`${this.constructor.name}.updateLiveState(): Failed to update live state`);
                return w.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).end();
            }
            w.status(http_status_codes_1.default.OK).end();
        }
        catch (error) {
            this.errorHandler(error, w);
        }
    }
}
exports.default = LiveController;
