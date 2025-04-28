import {Request, Response} from "express";
import statusCodes from '@instamenta/http-status-codes'
import {UserRepository} from "../repositories";
import * as JWT from "../utilities/jwt";
import {SECURITY} from "../utilities/config";
import {HashingHandler} from "../utilities/bcrypt";
import {z} from 'zod';
import {BaseController} from "../base/controller.base";
import * as Validate from "../validators";
import * as T from '../types'
import VLogger from "@instamenta/vlogger";

export class UserController extends BaseController<UserRepository> {

	constructor(
		repository: UserRepository,
		logger: VLogger,
		private readonly hashingHandler: HashingHandler
	) {
		super(repository, logger);
	}

	public async listUsers(
		request: Request<object, object, object, { skip?: string, number?: string }>,
		response: Response<Omit<T.User.Schema, "updated_at">[]>
	) {
		try {
			const {skip, limit} = {skip: 0, limit: 10};

			const userList = await this.repository.listUsers(skip, limit);

			response.status(statusCodes.OK).json(userList);
		} catch (error) {
			this.errorHandler(error, response)
		}
	}

	public async signUp(request: Request<object, z.infer<typeof Validate.create_user>>, response: Response<{
		token: string,
		id: string
	}>) {
		try {
			const userData = Validate.create_user.parse(request.body);

			const userId = await this.repository.createUser(userData);

			if (!userId) {
				console.error(`${this.constructor.name}.createUser(): failed to create User`);
				return response.status(statusCodes.I_AM_A_TEAPOT).end();
			}

			const token = JWT.signToken({
				username: userData.username,
				email: userData.email,
				picture: 'https://openseauserdata.com/files/3d825b936774e0ae3c8247613c91d436.png',
				id: userId
			});

			response.status(statusCodes.OK).cookie(SECURITY.JWT_TOKEN_NAME, token).json({token, id: userId});
		} catch (error) {
			this.errorHandler(error, response)
		}
	}

	public async signIn(request: Request<{ username: string, password: string }>, response: Response<{ token: string, id: string }>) {
		try {
			const {username, password} = Validate.login_user.parse(request.body);

			const userData = await this.repository.getByUsername(username);

			if (!userData) {
				console.log(`${this.constructor.name}.loginUser(): failed to login user`);
				return response.status(statusCodes.UNAUTHORIZED).end();
			}

			const isMatch = await this.hashingHandler.comparePasswords(
				password,
				userData.password
			);

			if (!isMatch) {
				console.log(`${this.constructor.name}.loginUser(): Invalid password`);
				return response.status(statusCodes.UNAUTHORIZED).end();
			}

			const token = JWT.signToken({id: userData.id, email: userData.email, username, picture: userData.picture});

			response.status(statusCodes.OK).cookie(SECURITY.JWT_TOKEN_NAME, token).json({token, id: userData.id});

			await this.repository.updateLastActiveAtById(userData.id).catch(console.error);
		} catch (error) {
			this.errorHandler(error, response)
		}
	}

	public async authUser(request: Request, response: Response<T.User.Schema>) {
		try {
			const id = Validate.uuid.parse(request.user.id);

			const user = await this.repository.getUserById(id);

			if (!user) {
				console.log(`${this.constructor.name}.authUser(): User not found`);
				return response.status(statusCodes.NOT_FOUND).end();
			}

			response.status(statusCodes.OK).json(user);
		} catch (error) {
			this.errorHandler(error, response);
		}
	}

	public async getUserById(request: Request<{ id: string }>, response: Response<T.User.Schema>) {
		try {
			const id = Validate.uuid.parse(request.params.id);

			const user = await this.repository.getUserById(id);

			if (!user) {
				console.log(`${this.constructor.name}.getUserById(): User not found`);
				return response.status(statusCodes.NOT_FOUND).end();
			}

			response.status(statusCodes.OK).json(user);
		} catch (error) {
			this.errorHandler(error, response);
		}
	}

	public async getUserByUsername(request: Request<{ username: string }>, response: Response<T.User.Schema>) {
		try {
			const username = Validate.name.parse(request.params.username);

			const user = await this.repository.getUserByUsername(username);

			if (!user) {
				console.log(`${this.constructor.name}.getUserByUsername(): User not found`);
				return response.status(statusCodes.NOT_FOUND).end();
			}

			response.status(statusCodes.OK).json(user);
		} catch (error) {
			this.errorHandler(error, response);
		}
	}

	public async updateBio(
		request: Request<object, object, { bio: string }>,
		response: Response<{
			token: string,
			id: string,
			userData: T.User.Schema,
		}>
	) {
		try {
			const id = Validate.uuid.parse(request.user.id);
			const bio = z.string().parse(request.body.bio);

			const userData = await this.repository.updateBio(id, bio);

			if (!userData) {
				console.log(`${this.constructor.name}.updateBio(): Failed to update`);
				return response.status(statusCodes.NOT_FOUND).end();
			}

			const token = JWT.signToken({
				id: userData.id,
				email: userData.email,
				username: userData.username,
				picture: userData.picture
			});

			response.status(statusCodes.OK).cookie(SECURITY.JWT_TOKEN_NAME, token).json({token, id, userData});
		} catch (error) {
			this.errorHandler(error, response);
		}
	}

	public async updateProfilePicture(
		request: Request<object, object, { picture_url: string }>,
		response: Response<{
			token: string,
			id: string,
			userData: T.User.Schema,
		}>
	) {
		try {
			const id = Validate.uuid.parse(request.user.id);
			const picture_url = Validate.url.parse(request.body.picture_url);

			const userData = await this.repository.updateProfilePicture(id, picture_url);

			if (!userData) {
				console.log(`${this.constructor.name}.updateProfilePicture(): Failed to update`);
				return response.status(statusCodes.NOT_FOUND).end();
			}

			const token = JWT.signToken({
				id: userData.id,
				email: userData.email,
				username: userData.username,
				picture: userData.picture
			});

			response.status(statusCodes.OK).cookie(SECURITY.JWT_TOKEN_NAME, token).json({token, id, userData});
		} catch (error) {
			this.errorHandler(error, response);
		}
	}

	public async updateProfilePublicInformation(
		request: Request<object, object, {firstName: string; lastName: string; username: string; email: string}>,
		response: Response<{
			token: string,
			id: string,
			userData: T.User.Schema,
		}>
	) {
		try {
			const id = Validate.uuid.parse(request.user.id);
			const data = Validate.update_profile_public_information.parse({
				firstName: request.body.firstName,
				lastName: request.body.lastName,
				username: request.body.username,
				email: request.body.email,
			});

			const userData = await this.repository.updateProfilePublicInformation(id, data);

			if (!userData) {
				console.log(`${this.constructor.name}.updateProfilePublicInformation(): Failed to update`, request.body);
				return response.status(statusCodes.NOT_FOUND).end();
			}

			const token = JWT.signToken({
				id: userData.id,
				email: userData.email,
				username: userData.username,
				picture: userData.picture,
			});

			response.status(statusCodes.OK).cookie(SECURITY.JWT_TOKEN_NAME, token).json({token, id, userData});
		} catch (error) {
			this.errorHandler(error, response);
		}
	}

}