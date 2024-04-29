import bcrypt from 'bcrypt';
import {SECURITY} from './config';

export interface I_HashingHandler {
	hashPassword(password: string): Promise<string>;

	comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean>;
}

export default class BCrypt implements I_HashingHandler {
	async hashPassword(password: string) {
		try {
			const salt = await bcrypt.genSalt(SECURITY.SALT_ROUNDS);

			return await bcrypt.hash(password, salt)
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	async comparePasswords(plainPassword: string, hashedPassword: string) {
		return await bcrypt.compare(plainPassword, hashedPassword)
			.catch((error) => {
				console.error(error)
				return false;
			});
	}
}