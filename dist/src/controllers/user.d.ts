import UserRepository from "../repositories/user";
import { Request, Response } from "express";
import { I_HashingHandler } from "../utilities/bcrypt";
import { z } from 'zod';
import BaseController from "../base/controller.base";
import { Validate } from "../validators";
import * as T from '../types';
import VLogger from "@instamenta/vlogger";
export default class UserController extends BaseController<UserRepository> {
    private readonly hashingHandler;
    constructor(repository: UserRepository, logger: VLogger, hashingHandler: I_HashingHandler);
    listUsers(r: Request<object, object, object, {
        skip?: string;
        number?: string;
    }>, w: Response<Omit<T.User.Schema, "updated_at">[]>): Promise<void>;
    signUp(r: Request<object, z.infer<typeof Validate.create_user>>, w: Response<{
        token: string;
        id: string;
    }>): Promise<Response<{
        token: string;
        id: string;
    }, Record<string, any>> | undefined>;
    signIn(r: Request<{
        username: string;
        password: string;
    }>, w: Response<{
        token: string;
        id: string;
    }>): Promise<Response<{
        token: string;
        id: string;
    }, Record<string, any>> | undefined>;
    authUser(r: Request, w: Response<T.User.Schema>): Promise<Response<T.User.Schema, Record<string, any>> | undefined>;
    getUserById(r: Request<{
        id: string;
    }>, w: Response<T.User.Schema>): Promise<Response<T.User.Schema, Record<string, any>> | undefined>;
    getUserByUsername(r: Request<{
        username: string;
    }>, w: Response<T.User.Schema>): Promise<Response<T.User.Schema, Record<string, any>> | undefined>;
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
    updateProfilePicture(r: Request<object, object, {
        picture_url: string;
    }>, w: Response<{
        token: string;
        id: string;
        userData: T.User.Schema;
    }>): Promise<Response<{
        token: string;
        id: string;
        userData: T.User.Schema;
    }, Record<string, any>> | undefined>;
    updateProfilePublicInformation(r: Request<object, object, {
        firstName: string;
        lastName: string;
        username: string;
        email: string;
    }>, w: Response<{
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