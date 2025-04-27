import UserRepository from "../repositories/user";
import { Request, Response } from "express";
import { I_HashingHandler } from "../utilities/bcrypt";
import { z } from 'zod';
import BaseController from "../base/controller.base";
import Validate from "../validators";
import * as T from '../types';
import VLogger from "@instamenta/vlogger";
export default class UserController extends BaseController<UserRepository> {
    private readonly hashingHandler;
    constructor(repository: UserRepository, logger: VLogger, hashingHandler: I_HashingHandler);
    listUsers(r: Request<{}, {}, {}, {
        skip?: string;
        number?: string;
    }>, w: Response<Omit<T.User.Schema, "updated_at">[]>): Promise<Response<Omit<T.User.Schema, "updated_at">[], Record<string, any>> | undefined>;
    signUp(r: Request<{}, z.infer<typeof Validate.create_user>>, w: Response<{
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
    updateBio(r: Request<{}, {
        bio: string;
    }>, w: Response<{
        token: string;
        id: string;
        userData: T.User.Schema;
    }>): Promise<Response<{
        token: string;
        id: string;
        userData: T.User.Schema;
    }, Record<string, any>> | undefined>;
    updateProfilePicture(r: Request<{}, {
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
    updateProfilePublicInformation(r: Request, w: Response<{
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