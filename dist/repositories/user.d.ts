import { HashingHandler } from "../utilities/bcrypt";
import z from "zod";
import { BaseRepository } from "../base/repository.base";
import { Client } from "pg";
import * as Validate from "../validators";
import VLogger from "@instamenta/vlogger";
import { GetUserByUsernameStruct, UserSchemaStruct } from "../types/user";
export declare class UserRepository extends BaseRepository {
    private readonly hashingHandler;
    constructor(client: Client, logger: VLogger, hashingHandler: HashingHandler);
    listUsers(skip?: number, limit?: number): Promise<Omit<UserSchemaStruct, "updatedAt">[]>;
    getByUsername(username: string): Promise<GetUserByUsernameStruct | null>;
    updateLastActiveAtById(id: string): Promise<number | null>;
    createUser({ username, email, password, firstName, lastName, }: z.infer<typeof Validate.createUser>): Promise<string>;
    getUserById(id: string): Promise<UserSchemaStruct | null>;
    getUserByUsername(username: string): Promise<UserSchemaStruct | null>;
    updateProfilePicture(id: string, pictureUrl: string): Promise<UserSchemaStruct | null>;
    updateBio(id: string, bio: string): Promise<UserSchemaStruct | null>;
    updateProfilePublicInformation(id: string, { username, email, firstName, lastName, }: {
        username?: string;
        email?: string;
        firstName?: string;
        lastName?: string;
    }): Promise<UserSchemaStruct | null>;
}
//# sourceMappingURL=user.d.ts.map