import { Request, Response } from "express";
import { UserRepository } from "../repositories";
import { HashingHandler } from "../utilities/bcrypt";
import { z } from "zod";
import { BaseController } from "../base/controller.base";
import * as Validate from "../validators";
import VLogger from "@instamenta/vlogger";
import { UserSchemaStruct } from "../types/user";
export declare class UserController extends BaseController<UserRepository> {
    private readonly hashingHandler;
    constructor(repository: UserRepository, logger: VLogger, hashingHandler: HashingHandler);
    listUsers(request: Request<object, object, object, {
        skip?: string;
        number?: string;
    }>, response: Response<Omit<UserSchemaStruct, "updatedAt">[]>): Promise<void>;
    signUp(request: Request<object, z.infer<typeof Validate.createUser>>, response: Response<{
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
    authUser(request: Request, response: Response<UserSchemaStruct>): Promise<Response<UserSchemaStruct, Record<string, any>> | undefined>;
    getUserById(request: Request<{
        id: string;
    }>, response: Response<UserSchemaStruct>): Promise<Response<UserSchemaStruct, Record<string, any>> | undefined>;
    getUserByUsername(request: Request<{
        username: string;
    }>, response: Response<UserSchemaStruct>): Promise<Response<UserSchemaStruct, Record<string, any>> | undefined>;
    updateBio(request: Request<object, object, {
        bio: string;
    }>, response: Response<{
        token: string;
        id: string;
        userData: UserSchemaStruct;
    }>): Promise<Response<{
        token: string;
        id: string;
        userData: UserSchemaStruct;
    }, Record<string, any>> | undefined>;
    updateProfilePicture(request: Request<object, object, {
        picture_url: string;
    }>, response: Response<{
        token: string;
        id: string;
        userData: UserSchemaStruct;
    }>): Promise<Response<{
        token: string;
        id: string;
        userData: UserSchemaStruct;
    }, Record<string, any>> | undefined>;
    updateProfilePublicInformation(request: Request<object, object, {
        firstName: string;
        lastName: string;
        username: string;
        email: string;
    }>, response: Response<{
        token: string;
        id: string;
        userData: UserSchemaStruct;
    }>): Promise<Response<{
        token: string;
        id: string;
        userData: UserSchemaStruct;
    }, Record<string, any>> | undefined>;
}
//# sourceMappingURL=user.d.ts.map