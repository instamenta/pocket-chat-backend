"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = __importDefault(require("@instamenta/http-status-codes"));
const jwt_1 = __importDefault(require("../utilities/jwt"));
const config_1 = require("../utilities/config");
const zod_1 = require("zod");
const controller_base_1 = __importDefault(require("../base/controller.base"));
const validators_1 = require("../validators");
class UserController extends controller_base_1.default {
    hashingHandler;
    constructor(repository, logger, hashingHandler) {
        super(repository, logger);
        this.hashingHandler = hashingHandler;
    }
    async listUsers(r, w) {
        try {
            const { skip, limit } = { skip: 0, limit: 10 };
            const userList = await this.repository.listUsers(skip, limit);
            w.status(http_status_codes_1.default.OK).json(userList);
        }
        catch (error) {
            this.errorHandler(error, w);
        }
    }
    async signUp(r, w) {
        try {
            const userData = validators_1.Validate.create_user.parse(r.body);
            const userId = await this.repository.createUser(userData);
            if (!userId) {
                console.error(`${this.constructor.name}.createUser(): failed to create User`);
                return w.status(http_status_codes_1.default.I_AM_A_TEAPOT).end();
            }
            const token = jwt_1.default.signToken({
                username: userData.username,
                email: userData.email,
                picture: 'https://openseauserdata.com/files/3d825b936774e0ae3c8247613c91d436.png',
                id: userId
            });
            w.status(http_status_codes_1.default.OK).cookie(config_1.SECURITY.JWT_TOKEN_NAME, token).json({ token, id: userId });
        }
        catch (error) {
            this.errorHandler(error, w);
        }
    }
    async signIn(r, w) {
        try {
            const { username, password } = validators_1.Validate.login_user.parse(r.body);
            const userData = await this.repository.getByUsername(username);
            if (!userData) {
                console.log(`${this.constructor.name}.loginUser(): failed to login user`);
                return w.status(http_status_codes_1.default.UNAUTHORIZED).end();
            }
            const isMatch = await this.hashingHandler.comparePasswords(password, userData.password);
            if (!isMatch) {
                console.log(`${this.constructor.name}.loginUser(): Invalid password`);
                return w.status(http_status_codes_1.default.UNAUTHORIZED).end();
            }
            const token = jwt_1.default.signToken({ id: userData.id, email: userData.email, username, picture: userData.picture });
            w.status(http_status_codes_1.default.OK).cookie(config_1.SECURITY.JWT_TOKEN_NAME, token).json({ token, id: userData.id });
            await this.repository.updateLastActiveAtById(userData.id).catch(console.error);
        }
        catch (error) {
            this.errorHandler(error, w);
        }
    }
    async authUser(r, w) {
        try {
            const id = validators_1.Validate.uuid.parse(r.user.id);
            const user = await this.repository.getUserById(id);
            if (!user) {
                console.log(`${this.constructor.name}.authUser(): User not found`);
                return w.status(http_status_codes_1.default.NOT_FOUND).end();
            }
            w.status(http_status_codes_1.default.OK).json(user);
        }
        catch (error) {
            this.errorHandler(error, w);
        }
    }
    async getUserById(r, w) {
        try {
            const id = validators_1.Validate.uuid.parse(r.params.id);
            const user = await this.repository.getUserById(id);
            if (!user) {
                console.log(`${this.constructor.name}.getUserById(): User not found`);
                return w.status(http_status_codes_1.default.NOT_FOUND).end();
            }
            w.status(http_status_codes_1.default.OK).json(user);
        }
        catch (error) {
            this.errorHandler(error, w);
        }
    }
    async getUserByUsername(r, w) {
        try {
            const username = validators_1.Validate.name.parse(r.params.username);
            const user = await this.repository.getUserByUsername(username);
            if (!user) {
                console.log(`${this.constructor.name}.getUserByUsername(): User not found`);
                return w.status(http_status_codes_1.default.NOT_FOUND).end();
            }
            w.status(http_status_codes_1.default.OK).json(user);
        }
        catch (error) {
            this.errorHandler(error, w);
        }
    }
    async updateBio(request, response) {
        try {
            const id = validators_1.Validate.uuid.parse(request.user.id);
            const bio = zod_1.z.string().parse(request.body.bio);
            const userData = await this.repository.updateBio(id, bio);
            if (!userData) {
                console.log(`${this.constructor.name}.updateBio(): Failed to update`);
                return response.status(http_status_codes_1.default.NOT_FOUND).end();
            }
            const token = jwt_1.default.signToken({
                id: userData.id,
                email: userData.email,
                username: userData.username,
                picture: userData.picture
            });
            response.status(http_status_codes_1.default.OK).cookie(config_1.SECURITY.JWT_TOKEN_NAME, token).json({ token, id, userData });
        }
        catch (error) {
            this.errorHandler(error, response);
        }
    }
    async updateProfilePicture(r, w) {
        try {
            const id = validators_1.Validate.uuid.parse(r.user.id);
            const picture_url = validators_1.Validate.url.parse(r.body.picture_url);
            const userData = await this.repository.updateProfilePicture(id, picture_url);
            if (!userData) {
                console.log(`${this.constructor.name}.updateProfilePicture(): Failed to update`);
                return w.status(http_status_codes_1.default.NOT_FOUND).end();
            }
            const token = jwt_1.default.signToken({
                id: userData.id,
                email: userData.email,
                username: userData.username,
                picture: userData.picture
            });
            w.status(http_status_codes_1.default.OK).cookie(config_1.SECURITY.JWT_TOKEN_NAME, token).json({ token, id, userData });
        }
        catch (error) {
            this.errorHandler(error, w);
        }
    }
    async updateProfilePublicInformation(r, w) {
        try {
            const id = validators_1.Validate.uuid.parse(r.user.id);
            const data = validators_1.Validate.update_profile_public_information.parse({
                firstName: r.body.firstName,
                lastName: r.body.lastName,
                username: r.body.username,
                email: r.body.email,
            });
            const userData = await this.repository.updateProfilePublicInformation(id, data);
            if (!userData) {
                console.log(`${this.constructor.name}.updateProfilePublicInformation(): Failed to update`, r.body);
                return w.status(http_status_codes_1.default.NOT_FOUND).end();
            }
            const token = jwt_1.default.signToken({
                id: userData.id,
                email: userData.email,
                username: userData.username,
                picture: userData.picture,
            });
            w.status(http_status_codes_1.default.OK).cookie(config_1.SECURITY.JWT_TOKEN_NAME, token).json({ token, id, userData });
        }
        catch (error) {
            this.errorHandler(error, w);
        }
    }
}
exports.default = UserController;
