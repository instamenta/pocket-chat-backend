import UserRepository from "../repositories/user";
import {Request, Response} from "express";
import {
	accept_friend_request_schema,
	create_user_schema,
	delete_friend_request_schema,
	login_user_schema,
	name_schema,
	send_friend_request_schema,
	uuid_schema
} from "../validators";
import status_codes from '@instamenta/http-status-codes'
import JWT from "../utilities/jwt";
import {SECURITY} from "../utilities/config";
import BCrypt from "../utilities/bcrypt";
import {controllerErrorHandler} from "../utilities";
import {z} from 'zod';
import {I_UserSchema} from "../types/user";

export default class UserController {
	constructor(private readonly repository: UserRepository) {
	}

	public async listUsers(
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
			controllerErrorHandler(error, w)
		}
	}

	public async signUp(r: Request<z.infer<typeof create_user_schema>>, w: Response<void>) {
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

	public async signIn(r: Request<{ username: string, password: string }>, w: Response<{ token: string }>) {
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

			const token = JWT.signToken({id: userData.id, email: userData.email, username});

			console.log(token);

			w.status(status_codes.OK).cookie(SECURITY.JWT_TOKEN_NAME, token).json({token});

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

	public async listFriendRequests(r: Request, w: Response) {
		try {
			const id = uuid_schema.parse(r.user.id);

			const friendRequests = await this.repository.listFriendRequests(id);
			if (!friendRequests) {
				console.log(`${this.constructor.name}.listFriendRequests(): Failed to get friend request`);
				return w.status(status_codes.BAD_GATEWAY).end();
			}

			w.status(status_codes.OK).json(friendRequests);
		} catch (error) {
			controllerErrorHandler(error, w);
		}
	}

	public async listFriendRecommendations(r: Request, w: Response) {
		try {
			const id = uuid_schema.parse(r.user.id);

			const recommendations = await this.repository.listFriendRecommendations(id);
			if (!recommendations) {
				console.log(`${this.constructor.name}.listFriendRecommendations(): Failed to get friend request`);
				return w.status(status_codes.BAD_GATEWAY).end();
			}

			w.status(status_codes.OK).json(recommendations);
		} catch (error) {
			controllerErrorHandler(error, w);
		}
	}

	public async acceptFriendRequest(r: Request<{ id: string }>, w: Response) {
		try {
			const {sender, recipient} = accept_friend_request_schema.parse({sender: r.user.id, recipient: r.params.id})

			const status = await this.repository.acceptFriendRequest(sender, recipient);
			if (!status) {
				console.log(`${this.constructor.name}.deleteFriendRequest(): Failed to delete friend request`);
				return w.status(status_codes.BAD_GATEWAY).end();
			}

			w.status(status_codes.OK).json({friendship_id: status});
		} catch (error) {
			controllerErrorHandler(error, w);
		}
	}

	public async deleteFriendRequest(r: Request<{ id: string }>, w: Response) {
		try {
			const {sender, recipient} = delete_friend_request_schema.parse({sender: r.user.id, recipient: r.params.id})

			const status = await this.repository.deleteFriendRequest(sender, recipient);

			if (!status) {
				console.log(`${this.constructor.name}.deleteFriendRequest(): Failed to delete friend request`);
				return w.status(status_codes.BAD_GATEWAY).end();
			}

			w.status(status_codes.OK).json({friendship_id: status});
		} catch (error) {
			controllerErrorHandler(error, w);
		}
	}

	public async getUserById(r: Request<{ id: string }>, w: Response<I_UserSchema>) {
		try {
			const id = uuid_schema.parse(r.params.id);

			const user = await this.repository.getUserById(id);
			if (!user) {
				console.log(`${this.constructor.name}.getUserById(): User not found`);
				return w.status(status_codes.NOT_FOUND).end();
			}

			w.status(status_codes.OK).json(user);
		} catch (error) {
			controllerErrorHandler(error, w);
		}
	}

	public async getUserByUsername(r: Request<{ username: string }>, w: Response<I_UserSchema>) {
		try {
			const username = name_schema.parse(r.params.username);

			const user = await this.repository.getUserByUsername(username);
			if (!user) {
				console.log(`${this.constructor.name}.getUserByUsername(): User not found`);
				return w.status(status_codes.NOT_FOUND).end();
			}

			w.status(status_codes.OK).json(user);
		} catch (error) {
			controllerErrorHandler(error, w);
		}
	}

}