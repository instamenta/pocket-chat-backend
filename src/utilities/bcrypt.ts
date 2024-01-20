import bcrypt from 'bcrypt';
import {SECURITY} from './config';

export default class BCrypt {
	public static async hashPassword(password: string) {
		try {
			const salt = await bcrypt.genSalt(SECURITY.SALT_ROUNDS);
			return await bcrypt.hash(password, salt)
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	public static async comparePasswords(plainPassword: string, hashedPassword: string) {
		return await bcrypt.compare(plainPassword, hashedPassword)
			.catch((error) => {
				console.error(error)
				return false;
			});
	}
}