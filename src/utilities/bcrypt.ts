import bcrypt from 'bcrypt';
import {SECURITY} from './config';

export interface HashingHandler {
	hashPassword(password: string): Promise<string>;

	comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean>;
}

export class BCryptHashingHandler implements HashingHandler {
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
			.catch((error: unknown) => {
				console.error(error)
				return false;
			});
	}
}