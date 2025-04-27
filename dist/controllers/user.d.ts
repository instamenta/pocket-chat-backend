import { Request, Response } from "express";
import { UserRepository } from "../repositories/user";
import { HashingHandler } from "../utilities/bcrypt";
import { z } from 'zod';
import { BaseController } from "../base/controller.base";
import { Validate } from "../validators";
import * as T from '../types';
import VLogger from "@instamenta/vlogger";
export declare class UserController extends BaseController<UserRepository> {
    private readonly hashingHandler;
    constructor(repository: UserRepository, logger: VLogger, hashingHandler: HashingHandler);
    listUsers(request: Request<object, object, object, {
        skip?: string;
        number?: string;
    }>, response: Response<Omit<T.User.Schema, "updated_at">[]>): Promise<void>;
    signUp(request: Request<object, z.infer<typeof Validate.create_user>>, response: Response<{
        token: string;
        id: string;
    }>): Promise<Response<{
        token: string;
        id: string;
    }, Record<string, any>> | undefined>;
    signIn(request: Request<{
        username: string;
        password: string;
    }>, response: Response<{
        token: string;
        id: string;
    }>): Promise<Response<{
        token: string;
        id: string;
    }, Record<string, any>> | undefined>;
    authUser(request: Request, response: Response<T.User.Schema>): Promise<Response<T.User.Schema, Record<string, any>> | undefined>;
    getUserById(request: Request<{
        id: string;
    }>, response: Response<T.User.Schema>): Promise<Response<T.User.Schema, Record<string, any>> | undefined>;
    getUserByUsername(request: Request<{
        username: string;
    }>, response: Response<T.User.Schema>): Promise<Response<T.User.Schema, Record<string, any>> | undefined>;
    updateBio(request: Request<object, object, {
        bio: string;
    }>, response: Response<{
        token: string;
        id: string;
        userData: T.User.Schema;
    }>): Promise<Response<{
        token: string;
        id: string;
        userData: T.User.Schema;
    }, Record<string, any>> | undefined>;
    updateProfilePicture(request: Request<object, object, {
        picture_url: string;
    }>, response: Response<{
        token: string;
        id: string;
        userData: T.User.Schema;
    }>): Promise<Response<{
        token: string;
        id: string;
        userData: T.User.Schema;
    }, Record<string, any>> | undefined>;
    updateProfilePublicInformation(request: Request<object, object, {
        firstName: string;
        lastName: string;
        username: string;
        email: string;
    }>, response: Response<{
        token: string;
        id: string;
        userData: T.User.Schema;
    }>): Promise<Response<{
        token: string;
        id: string;
        userData: T.User.Schema;
    }, Record<string, any>> | undefined>;
}
//# sourceMappingURL=user.d.ts.map