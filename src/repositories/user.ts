import {PrismaClient} from "@prisma/client";
import BCrypt from "../utilities/bcrypt";
import z from 'zod';
import {v4 as uuid_generate_v4} from 'uuid';
import {create_user_schema} from "../validators";

type T_getByUsername = {
	id: string,
	username: string,
	password: string,
	email: string
}

export default class UserRepository {
	constructor(private readonly prisma: PrismaClient) {
	}

	public async getByUsername(username: string): Promise<T_getByUsername | null> {
		const data = await this.prisma.$queryRaw`
        SELECT id, username, password, email
        FROM "User" u
        WHERE u.username = ${username}
        LIMIT 1
		` as Array<T_getByUsername>;

		return data.length ? data[0] : null;
	}

	public async updateLastActiveAtById(id: string) {
		return this.prisma.$queryRaw`
        UPDATE "User"
        SET "lastActiveAt" = NOW()
        WHERE id = ${id}
		`;
	}

	public async createUser(
		{username, email, password, firstName, lastName}: z.infer<typeof create_user_schema>
	) {

		const hashedPassword = BCrypt.hashPassword(password)

		const userId = uuid_generate_v4()

		return await this.prisma.$queryRaw`
        INSERT INTO "User" ("id",
                            "username",
                            "email",
                            "password",
                            "firstName",
                            "lastName",
                            "createdAt",
                            "updatedAt",
                            "lastActiveAt")
        VALUES (${userId},
                ${username},
                ${email},
                ${hashedPassword},
                ${firstName},
                ${lastName},
                NOW(),
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