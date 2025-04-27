"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiveController = void 0;
const http_status_codes_1 = __importDefault(require("@instamenta/http-status-codes"));
const controller_base_1 = require("../base/controller.base");
const validators_1 = require("../validators");
class LiveController extends controller_base_1.BaseController {
    async createLive(request, response) {
        try {
            const userId = validators_1.Validate.uuid.parse(request.user.id);
            const shortId = await this.repository.createLive(userId);
            if (!shortId) {
                console.error(`${this.constructor.name}.createLive(): Failed to create live`);
                return response.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).end();
            }
            response.status(http_status_codes_1.default.CREATED).json({ id: shortId });
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async listLives(request, response) {
        try {
            const userId = validators_1.Validate.uuid.parse(request.user.id);
            const lives = await this.repository.listLives(userId);
            response.status(http_status_codes_1.default.OK).json(lives);
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async listLiveMessages(request, response) {
        try {
            const liveId = validators_1.Validate.uuid.parse(request.params.liveId);
            const messages = await this.repository.listLiveMessages(liveId);
            response.status(http_status_codes_1.default.OK).json(messages);
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async updateLiveState(request, response) {
        try {
            const userId = validators_1.Validate.uuid.parse(request.user.id);
            if (!['active', 'paused', 'ended'].includes(request.params.state)) {
                console.error(`${this.constructor.name}.lives(): Invalid State`, request.params);
                return response.status(http_status_codes_1.default.BAD_REQUEST).end();
            }
            const lives = await this.repository.updateLiveState(userId, request.params.state);
            if (!lives) {
                console.error(`${this.constructor.name}.updateLiveState(): Failed to update live state`);
                return response.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).end();
            }
            response.status(http_status_codes_1.default.OK).end();
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
}
exports.LiveController = LiveController;
