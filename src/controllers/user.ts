import UserRepository from "../repositories/user";
import {Request, Response} from "express";
import {
	create_user_schema,
	login_user_schema,
	name_schema,
	update_profile_public_information_schema,
	url_schema,
	uuid_schema
} from "../validators";
import status_codes from '@instamenta/http-status-codes'
import JWT from "../utilities/jwt";
import {SECURITY} from "../utilities/config";
import BCrypt from "../utilities/bcrypt";
import {z} from 'zod';
import {I_UserSchema} from "../types/user";
import ControllerBase from "../base/controller.base";

export default class UserController extends ControllerBase<UserRepository> {

	async listUsers(
		r: Request<{}, {}, {}, { skip?: string, number?: string }>,
		w: Response<Omit<I_UserSchema, "updated_at">[]>
	) {
		try {
			const {skip, limit} = {skip: 0, limit: 10};

			const userList = await this.repository.listUsers(skip, limit);

			if (!userList) {
				console.error(`${this.constructor.name}.listUsers(): Failed to get user list`);
				return w.status(status_codes.INTERNAL_SERVER_ERROR).end();
			}

			w.status(status_codes.OK).json(userList);
		} catch (error) {
			this.errorHandler(error, w)
		}
	}

	async signUp(r: Request<{}, z.infer<typeof create_user_schema>>, w: Response<{ token: string, id: string }>) {
		try {
			const userData = create_user_schema.parse(r.body);

			const userId = await this.repository.createUser(userData);

			if (!userId) {
				console.error(`${this.constructor.name}.createUser(): failed to create User`);
				return w.status(status_codes.I_AM_A_TEAPOT).end();
			}

			const token = JWT.signToken({
				username: userData.username,
				email: userData.email,
				picture: 'https://openseauserdata.com/files/3d825b936774e0ae3c8247613c91d436.png',
				id: userId
			});

			w.status(status_codes.OK).cookie(SECURITY.JWT_TOKEN_NAME, token).json({token, id: userId});
		} catch (error) {
			this.errorHandler(error, w)
		}
	}

	async signIn(r: Request<{ username: string, password: string }>, w: Response<{ token: string, id: string }>) {
		try {
			const {username, password} = login_user_schema.parse(r.body);

			const userData = await this.repository.getByUsername(username);

			if (!userData) {
				console.log(`${this.constructor.name}.loginUser(): failed to login user`);
				return w.status(status_codes.UNAUTHORIZED).end();
			}

			const isMatch = await BCrypt.comparePasswords(password, userData.password);

			if (!isMatch) {
				console.log(`${this.constructor.name}.loginUser(): Invalid password`);
				return w.status(status_codes.UNAUTHORIZED).end();
			}

			const token = JWT.signToken({id: userData.id, email: userData.email, username, picture: userData.picture});

			w.status(status_codes.OK).cookie(SECURITY.JWT_TOKEN_NAME, token).json({token, id: userData.id});

			await this.repository.updateLastActiveAtById(userData.id).catch(console.error);
		} catch (error) {
			this.errorHandler(error, w)
		}
	}

	async authUser(r: Request, w: Response<I_UserSchema>) {
		try {
			const id = uuid_schema.parse(r.user.id);

			const user = await this.repository.getUserById(id);

			if (!user) {
				console.log(`${this.constructor.name}.authUser(): User not found`);
				return w.status(status_codes.NOT_FOUND).end();
			}

			w.status(status_codes.OK).json(user);
		} catch (error) {
			this.errorHandler(error, w);
		}
	}

	async getUserById(r: Request<{ id: string }>, w: Response<I_UserSchema>) {
		try {
			const id = uuid_schema.parse(r.params.id);

			const user = await this.repository.getUserById(id);

			if (!user) {
				console.log(`${this.constructor.name}.getUserById(): User not found`);
				return w.status(status_codes.NOT_FOUND).end();
			}

			w.status(status_codes.OK).json(user);
		} catch (error) {
			this.errorHandler(error, w);
		}
	}

	async getUserByUsername(r: Request<{ username: string }>, w: Response<I_UserSchema>) {
		try {
			const username = name_schema.parse(r.params.username);

			const user = await this.repository.getUserByUsername(username);

			if (!user) {
				console.log(`${this.constructor.name}.getUserByUsername(): User not found`);
				return w.status(status_codes.NOT_FOUND).end();
			}

			w.status(status_codes.OK).json(user);
		} catch (error) {
			this.errorHandler(error, w);
		}
	}

	async updateBio(
		r: Request<{}, { bio: string }>,
		w: Response<{
			token: string,
			id: string,
			userData: I_UserSchema,
		}>
	) {
		try {
			const id = uuid_schema.parse(r.user.id);
			const bio = z.string().parse(r.body.bio);

			const userData = await this.repository.updateBio(id, bio);

			if (!userData) {
				console.log(`${this.constructor.name}.updateBio(): Failed to update`);
				return w.status(status_codes.NOT_FOUND).end();
			}

			const token = JWT.signToken({
				id: userData.id,
				email: userData.email,
				username: userData.username,
				picture: userData.picture
			});

			w.status(status_codes.OK).cookie(SECURITY.JWT_TOKEN_NAME, token).json({token, id, userData});
		} catch (error) {
			this.errorHandler(error, w);
		}
	}

	async updateProfilePicture(
		r: Request<{}, { picture_url: string }>,
		w: Response<{
			token: string,
			id: string,
			userData: I_UserSchema,
		}>
	) {
		try {
			const id = uuid_schema.parse(r.user.id);
			const picture_url = url_schema.parse(r.body.picture_url);

			const userData = await this.repository.updateProfilePicture(id, picture_url);

			if (!userData) {
				console.log(`${this.constructor.name}.updateProfilePicture(): Failed to update`);
				return w.status(status_codes.NOT_FOUND).end();
			}

			const token = JWT.signToken({
				id: userData.id,
				email: userData.email,
				username: userData.username,
				picture: userData.picture
			});

			w.status(status_codes.OK).cookie(SECURITY.JWT_TOKEN_NAME, token).json({token, id, userData});
		} catch (error) {
			this.errorHandler(error, w);
		}
	}

	async updateProfilePublicInformation(
		r: Request,
		w: Response<{
			token: string,
			id: string,
			userData: I_UserSchema,
		}>
	) {
		try {
			const id = uuid_schema.parse(r.user.id);
			const data = update_profile_public_information_schema.parse({
				firstName: r.body.firstName,
				lastName: r.body.lastName,
				username: r.body.username,
				email: r.body.email,
			});

			const userData = await this.repository.updateProfilePublicInformation(id, data);

			if (!userData) {
				console.log(`${this.constructor.name}.updateProfilePublicInformation(): Failed to update`, r.body);
				return w.status(status_codes.NOT_FOUND).end();
			}

			const token = JWT.signToken({
				id: userData.id,
				email: userData.email,
				username: userData.username,
				picture: userData.picture,
			});

			w.status(status_codes.OK).cookie(SECURITY.JWT_TOKEN_NAME, token).json({token, id, userData});
		} catch (error) {
			this.errorHandler(error, w);
		}
	}

}