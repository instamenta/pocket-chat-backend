import {PrismaClient} from "@prisma/client";
import BCrypt from "../utilities/bcrypt";
import z from 'zod';
import {v4 as uuid_generate_v4} from 'uuid';
import {create_user_schema} from "../validators";

export default class UserRepository {
	constructor(private readonly prisma: PrismaClient) {
	}

	public async getByUsername(username: string): Promise<{
		id: string,
		username: string,
		password: string,
		email: string
	} | null> {
		return this.prisma.$queryRaw`
        SELECT id, username, password, email
        FROM "User" u
        WHERE u.username = ${username}
        LIMIT 1
		`;
	}

	public async createUser(
		{username, email, password, firstName, lastName}: z.infer<typeof create_user_schema>
	) {

		const hashedPassword = BCrypt.hashPassword(password)

		const userId = uuid_generate_v4()

		return await this.prisma.$executeRaw`
        INSERT INTO "User" ("id",
                            "username",
                            "email",
                            "password",
                            "firstName",
                            "lastName",
                            "createdAt",
                            "updatedAt")
        VALUES (${userId},
                ${username},
                ${email},
                ${hashedPassword},
                ${firstName},
                ${lastName},
                NOW(),
                NOW())`
			.then((data): any => {
				console.log(data)
				return {success: true, userId};
			})
			.catch((error): any => {
				console.error(error);
				return {success: false, userId};
			});
	}
}