import { I_HashingHandler } from "../utilities/bcrypt";
import z from 'zod';
import BaseRepository from "../base/repository.base";
import { Client } from "pg";
import * as T from '../types';
import Validate from "../validators";
import VLogger from "@instamenta/vlogger";
export default class UserRepository extends BaseRepository {
    private readonly hashingHandler;
    constructor(client: Client, logger: VLogger, hashingHandler: I_HashingHandler);
    listUsers(skip?: number, limit?: number): Promise<Omit<T.User.Schema, "updated_at">[]>;
    getByUsername(username: string): Promise<T.User.GetByUsername | null>;
    updateLastActiveAtById(id: string): Promise<number | null>;
    createUser({ username, email, password, firstName, lastName }: z.infer<typeof Validate.create_user>): Promise<string>;
    getUserById(id: string): Promise<T.User.Schema | null>;
    getUserByUsername(username: string): Promise<T.User.Schema | null>;
    updateProfilePicture(id: string, pictureUrl: string): Promise<T.User.Schema | null>;
    updateBio(id: string, bio: string): Promise<T.User.Schema | null>;
    updateProfilePublicInformation(id: string, { username, email, firstName, lastName }: {
        username?: string;
        email?: string;
        firstName?: string;
        lastName?: string;
    }): Promise<T.User.Schema | null>;
}
//# sourceMappingURL=user.d.ts.map