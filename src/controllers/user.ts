import UserRepository from "../repositories/user";
import {Request, Response} from "express";
import {create_user_schema, login_user_schema, send_friend_request_schema} from "../validators";
import status_codes from '@instamenta/http-status-codes'
import JWT from "../utilities/jwt";
import {SECURITY} from "../utilities/config";
import BCrypt from "../utilities/bcrypt";
import {controllerErrorHandler} from "../utilities";
import {z} from 'zod';

export default class UserController {
	constructor(private readonly repository: UserRepository) {
	}

	public async createUser(r: Request<z.infer<typeof create_user_schema>>, w: Response<void>) {
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
				id: userId
			});

			w.status(status_codes.OK).cookie(SECURITY.JWT_TOKEN_NAME, token).end();
		} catch (error) {
			controllerErrorHandler(error, w)
		}
	}

	public async loginUser(r: Request<{ username: string, password: string }>, w: Response<void>) {
		try {
			const {username, password} = login_user_schema.parse(r.body);

			const userData = await this.repository.getByUsername(username);

			if (!userData) {
				console.log(`${this.constructor.name}.loginUser(): failed to login user`);
				return w.status(status_codes.UNAUTHORIZED).end();
			}

			const isMatch = await BCrypt.comparePasswords(userData.password, password);

			if (isMatch) {
				console.log(`${this.constructor.name}.loginUser(): Invalid password`);
				return w.status(status_codes.UNAUTHORIZED).end();
			}

			const token = JWT.signToken({id: userData.id, email: userData.email, username});

			w.status(status_codes.OK).cookie(SECURITY.JWT_TOKEN_NAME, token).end();

			await this.repository.updateLastActiveAtById(userData.id)
				.catch(console.error);
		} catch (error) {
			controllerErrorHandler(error, w)
		}
	}

	public async sendFriendRequest(r: Request<{ id: string }>, w: Response<{ friendship_id: string }>) {
		try {
			const {sender, recipient} = send_friend_request_schema.parse({sender: r.user.id, recipient: r.params.id})

			const status = await this.repository.sendFriendRequest(sender, recipient);

			if (!status) {
				console.log(`${this.constructor.name}.sendFriendRequest(): Failed to send friend request`);
				return w.status(status_codes.BAD_GATEWAY).end();
			}

			w.status(status_codes.OK).json({friendship_id: status});
		} catch (error) {
			controllerErrorHandler(error, w);
		}
	}
}