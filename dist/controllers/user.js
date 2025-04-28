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
exports.UserController = void 0;
const http_status_codes_1 = __importDefault(require("@instamenta/http-status-codes"));
const JWT = __importStar(require("../utilities/jwt"));
const config_1 = require("../utilities/config");
const zod_1 = require("zod");
const controller_base_1 = require("../base/controller.base");
const Validate = __importStar(require("../validators"));
class UserController extends controller_base_1.BaseController {
    hashingHandler;
    constructor(repository, logger, hashingHandler) {
        super(repository, logger);
        this.hashingHandler = hashingHandler;
    }
    async listUsers(request, response) {
        try {
            const { skip, limit } = { skip: 0, limit: 10 };
            const userList = await this.repository.listUsers(skip, limit);
            response.status(http_status_codes_1.default.OK).json(userList);
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async signUp(request, response) {
        try {
            const userData = Validate.createUser.parse(request.body);
            const userId = await this.repository.createUser(userData);
            if (!userId) {
                this.log.error({ f: 'signUp', m: 'failed to create user', e: {} });
                return response.status(http_status_codes_1.default.I_AM_A_TEAPOT).end();
            }
            const token = JWT.signToken({
                username: userData.username,
                email: userData.email,
                picture: "https://openseauserdata.com/files/3d825b936774e0ae3c8247613c91d436.png",
                id: userId,
            });
            response
                .status(http_status_codes_1.default.OK)
                .cookie(config_1.SECURITY.JWT_TOKEN_NAME, token)
                .json({ token, id: userId });
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async signIn(request, response) {
        try {
            const { username, password } = Validate.loginUser.parse(request.body);
            const userData = await this.repository.getByUsername(username);
            if (!userData) {
                this.log.error({ f: 'signIn', m: 'failed to login user', e: {} });
                return response.status(http_status_codes_1.default.UNAUTHORIZED).end();
            }
            const isMatch = await this.hashingHandler.comparePasswords(password, userData.password);
            if (!isMatch) {
                this.log.error({ f: 'signIn', m: 'Invalid password', e: {} });
                return response.status(http_status_codes_1.default.UNAUTHORIZED).end();
            }
            const token = JWT.signToken({
                id: userData.id,
                email: userData.email,
                username,
                picture: userData.picture,
            });
            response
                .status(http_status_codes_1.default.OK)
                .cookie(config_1.SECURITY.JWT_TOKEN_NAME, token)
                .json({ token, id: userData.id });
            await this.repository
                .updateLastActiveAtById(userData.id)
                .catch((error) => {
                this.log.error({ e: error, f: 'signIn', m: 'failed to update last active at' });
            });
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async authUser(request, response) {
        try {
            const id = Validate.uuid.parse(request.user.id);
            const user = await this.repository.getUserById(id);
            if (!user) {
                this.log.error({ f: 'authUser', m: 'user not found', e: {} });
                return response.status(http_status_codes_1.default.NOT_FOUND).end();
            }
            response.status(http_status_codes_1.default.OK).json(user);
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async getUserById(request, response) {
        try {
            const id = Validate.uuid.parse(request.params.id);
            const user = await this.repository.getUserById(id);
            if (!user) {
                this.log.error({ f: 'getUserById', m: 'user not found', e: {} });
                return response.status(http_status_codes_1.default.NOT_FOUND).end();
            }
            response.status(http_status_codes_1.default.OK).json(user);
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async getUserByUsername(request, response) {
        try {
            const username = Validate.name.parse(request.params.username);
            const user = await this.repository.getUserByUsername(username);
            if (!user) {
                this.log.error({ f: 'getUserByUsername', m: 'user not found', e: {} });
                return response.status(http_status_codes_1.default.NOT_FOUND).end();
            }
            response.status(http_status_codes_1.default.OK).json(user);
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async updateBio(request, response) {
        try {
            const id = Validate.uuid.parse(request.user.id);
            const bio = zod_1.z.string().parse(request.body.bio);
            const userData = await this.repository.updateBio(id, bio);
            if (!userData) {
                this.log.error({ f: 'updateBio', m: 'failed to update bio', e: {} });
                return response.status(http_status_codes_1.default.NOT_FOUND).end();
            }
            const token = JWT.signToken({
                id: userData.id,
                email: userData.email,
                username: userData.username,
                picture: userData.picture,
            });
            response
                .status(http_status_codes_1.default.OK)
                .cookie(config_1.SECURITY.JWT_TOKEN_NAME, token)
                .json({ token, id, userData });
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async updateProfilePicture(request, response) {
        try {
            const id = Validate.uuid.parse(request.user.id);
            const pictureUrl = Validate.url.parse(request.body.picture_url);
            const userData = await this.repository.updateProfilePicture(id, pictureUrl);
            if (!userData) {
                this.log.error({ f: 'updateProfilePicture', m: 'failed to update picture', e: {} });
                return response.status(http_status_codes_1.default.NOT_FOUND).end();
            }
            const token = JWT.signToken({
                id: userData.id,
                email: userData.email,
                username: userData.username,
                picture: userData.picture,
            });
            response
                .status(http_status_codes_1.default.OK)
                .cookie(config_1.SECURITY.JWT_TOKEN_NAME, token)
                .json({ token, id, userData });
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async updateProfilePublicInformation(request, response) {
        try {
            const id = Validate.uuid.parse(request.user.id);
            const data = Validate.updateProfilePublicInformation.parse({
                firstName: request.body.firstName,
                lastName: request.body.lastName,
                username: request.body.username,
                email: request.body.email,
            });
            const userData = await this.repository.updateProfilePublicInformation(id, data);
            if (!userData) {
                this.log.error({ f: 'updateProfilePublicInformation', m: 'failed to update', e: {} });
                return response.status(http_status_codes_1.default.NOT_FOUND).end();
            }
            const token = JWT.signToken({
                id: userData.id,
                email: userData.email,
                username: userData.username,
                picture: userData.picture,
            });
            response
                .status(http_status_codes_1.default.OK)
                .cookie(config_1.SECURITY.JWT_TOKEN_NAME, token)
                .json({ token, id, userData });
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
}
exports.UserController = UserController;
