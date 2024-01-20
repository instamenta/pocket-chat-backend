import UserRepository from "../repositories/user";
import {Request, Response} from "express";
import {create_user_schema, login_user_schema} from "../validators";
import status_codes from '@instamenta/http-status-codes'
import JWT from "../utilities/jwt";
import {SECURITY} from "../utilities/config";
import BCrypt from "../utilities/bcrypt";

export default class UserController {
	constructor(private readonly repository: UserRepository) {
	}

	public async createUser(r: Request, w: Response) {
		try {
			const userData = create_user_schema.parse(r.body);

			const {success, userId} = await this.repository.createUser(userData);

			if (!success) return w.status(status_codes.I_AM_A_TEAPOT).end();

			const token = JWT.signToken({
				username: userData.username,
				email: userData.email,
				id: userId
			});

			w.status(status_codes.OK).cookie(SECURITY.JWT_TOKEN_NAME, token).end();
		} catch (error) {
			console.log(error);
			w.status(status_codes.BAD_REQUEST).end();
		}
	}

	public async loginUser(r: Request, w: Response) {
		try {
			const {username, password} = login_user_schema.parse(r.body);

			const userData = await this.repository.getByUsername(username);

			if (!userData) return w.status(status_codes.UNAUTHORIZED).end();

			const isMatch = await BCrypt.comparePasswords(userData.password, password);

			if (isMatch) return w.status(status_codes.UNAUTHORIZED).end();

			const token = JWT.signToken({
				id: userData.id,
				username: userData.username,
				email: userData.email,
			});

			w.cookie(SECURITY.JWT_TOKEN_NAME, token);

			w.status(status_codes.OK).json(userData);
		} catch (error) {
			console.error('Login error:', error);
			w.status(status_codes.BAD_REQUEST).end();
		}
	}
}