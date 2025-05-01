import { HashingHandler } from "../utilities/bcrypt";
import z from "zod";
import { BaseRepository } from "../base/repository.base";
import { Client } from "pg";
import * as T from "../types";
import * as Validate from "../validators";
import VLogger from "@instamenta/vlogger";
export declare class UserRepository extends BaseRepository {
    private readonly hashingHandler;
    constructor(client: Client, logger: VLogger, hashingHandler: HashingHandler);
    listUsers(skip?: number, limit?: number): Promise<Omit<T.User.UserSchemaStruct, "updated_at">[]>;
    getByUsername(username: string): Promise<T.User.GetUserByUsernameStruct | null>;
    updateLastActiveAtById(id: string): Promise<number | null>;
    createUser({ username, email, password, firstName, lastName, }: z.infer<typeof Validate.createUser>): Promise<string>;
    getUserById(id: string): Promise<T.User.UserSchemaStruct | null>;
    getUserByUsername(username: string): Promise<T.User.UserSchemaStruct | null>;
    updateProfilePicture(id: string, pictureUrl: string): Promise<T.User.UserSchemaStruct | null>;
    updateBio(id: string, bio: string): Promise<T.User.UserSchemaStruct | null>;
    updateProfilePublicInformation(id: string, { username, email, firstName, lastName, }: {
        username?: string;
        email?: string;
        firstName?: string;
        lastName?: string;
    }): Promise<T.User.UserSchemaStruct | null>;
}
//# sourceMappingURL=user.d.ts.map