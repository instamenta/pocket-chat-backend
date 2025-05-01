import { Request, Response } from "express";
import statusCodes from "@instamenta/http-status-codes";
import { UserRepository } from "../repositories";
import * as JWT from "../utilities/jwt";
import { SECURITY } from "../utilities/config";
import { HashingHandler } from "../utilities/bcrypt";
import { z } from "zod";
import { BaseController } from "../base/controller.base";
import * as Validate from "../validators";
import * as T from "../types";
import VLogger from "@instamenta/vlogger";

export class UserController extends BaseController<UserRepository> {
  public constructor(
    repository: UserRepository,
    logger: VLogger,
    private readonly hashingHandler: HashingHandler,
  ) {
    super(repository, logger);
  }

  public async listUsers(
    request: Request<
      object,
      object,
      object,
      { skip?: string; number?: string }
    >,
    response: Response<Omit<T.User.UserSchemaStruct, "updated_at">[]>,
  ) {
    try {
      const { skip, limit } = { skip: 0, limit: 10 };

      const userList = await this.repository.listUsers(skip, limit);

      response.status(statusCodes.OK).json(userList);
    } catch (error) {
      this.errorHandler(error, response);
    }
  }

  public async signUp(
    request: Request<object, z.infer<typeof Validate.createUser>>,
    response: Response<{
      token: string;
      id: string;
    }>,
  ) {
    try {
      const userData = Validate.createUser.parse(request.body);

      const userId = await this.repository.createUser(userData);

      if (!userId) {
        this.log.error({ f: "signUp", m: "failed to create user", e: {} });
        return response.status(statusCodes.I_AM_A_TEAPOT).end();
      }

      const token = JWT.signToken({
        username: userData.username,
        email: userData.email,
        picture:
          "https://openseauserdata.com/files/3d825b936774e0ae3c8247613c91d436.png",
        id: userId,
      });

      response
        .status(statusCodes.OK)
        .cookie(SECURITY.JWT_TOKEN_NAME, token)
        .json({ token, id: userId });
    } catch (error) {
      this.errorHandler(error, response);
    }
  }

  public async signIn(
    request: Request<{ username: string; password: string }>,
    response: Response<{ token: string; id: string }>,
  ) {
    try {
      const { username, password } = Validate.loginUser.parse(request.body);

      const userData = await this.repository.getByUsername(username);

      if (!userData) {
        this.log.error({ f: "signIn", m: "failed to login user", e: {} });
        return response.status(statusCodes.UNAUTHORIZED).end();
      }

      const isMatch = await this.hashingHandler.comparePasswords(
        password,
        userData.password,
      );

      if (!isMatch) {
        this.log.error({ f: "signIn", m: "Invalid password", e: {} });
        return response.status(statusCodes.UNAUTHORIZED).end();
      }

      const token = JWT.signToken({
        id: userData.id,
        email: userData.email,
        username,
        picture: userData.picture,
      });

      response
        .status(statusCodes.OK)
        .cookie(SECURITY.JWT_TOKEN_NAME, token)
        .json({ token, id: userData.id });

      await this.repository
        .updateLastActiveAtById(userData.id)
        .catch((error: unknown) => {
          this.log.error({
            e: error,
            f: "signIn",
            m: "failed to update last active at",
          });
        });
    } catch (error) {
      this.errorHandler(error, response);
    }
  }

  public async authUser(request: Request, response: Response<T.User.UserSchemaStruct>) {
    try {
      const id = Validate.uuid.parse(request.user.id);

      const user = await this.repository.getUserById(id);

      if (!user) {
        this.log.error({ f: "authUser", m: "user not found", e: {} });
        return response.status(statusCodes.NOT_FOUND).end();
      }

      response.status(statusCodes.OK).json(user);
    } catch (error) {
      this.errorHandler(error, response);
    }
  }

  public async getUserById(
    request: Request<{ id: string }>,
    response: Response<T.User.UserSchemaStruct>,
  ) {
    try {
      const id = Validate.uuid.parse(request.params.id);

      const user = await this.repository.getUserById(id);

      if (!user) {
        this.log.error({ f: "getUserById", m: "user not found", e: {} });
        return response.status(statusCodes.NOT_FOUND).end();
      }

      response.status(statusCodes.OK).json(user);
    } catch (error) {
      this.errorHandler(error, response);
    }
  }

  public async getUserByUsername(
    request: Request<{ username: string }>,
    response: Response<T.User.UserSchemaStruct>,
  ) {
    try {
      const username = Validate.name.parse(request.params.username);

      const user = await this.repository.getUserByUsername(username);

      if (!user) {
        this.log.error({ f: "getUserByUsername", m: "user not found", e: {} });
        return response.status(statusCodes.NOT_FOUND).end();
      }

      response.status(statusCodes.OK).json(user);
    } catch (error) {
      this.errorHandler(error, response);
    }
  }

  public async updateBio(
    request: Request<object, object, { bio: string }>,
    response: Response<{
      token: string;
      id: string;
      userData: T.User.UserSchemaStruct;
    }>,
  ) {
    try {
      const id = Validate.uuid.parse(request.user.id);
      const bio = z.string().parse(request.body.bio);

      const userData = await this.repository.updateBio(id, bio);

      if (!userData) {
        this.log.error({ f: "updateBio", m: "failed to update bio", e: {} });
        return response.status(statusCodes.NOT_FOUND).end();
      }

      const token = JWT.signToken({
        id: userData.id,
        email: userData.email,
        username: userData.username,
        picture: userData.picture,
      });

      response
        .status(statusCodes.OK)
        .cookie(SECURITY.JWT_TOKEN_NAME, token)
        .json({ token, id, userData });
    } catch (error) {
      this.errorHandler(error, response);
    }
  }

  public async updateProfilePicture(
    request: Request<object, object, { picture_url: string }>,
    response: Response<{
      token: string;
      id: string;
      userData: T.User.UserSchemaStruct;
    }>,
  ) {
    try {
      const id = Validate.uuid.parse(request.user.id);
      const pictureUrl = Validate.url.parse(request.body.picture_url);

      const userData = await this.repository.updateProfilePicture(
        id,
        pictureUrl,
      );

      if (!userData) {
        this.log.error({
          f: "updateProfilePicture",
          m: "failed to update picture",
          e: {},
        });
        return response.status(statusCodes.NOT_FOUND).end();
      }

      const token = JWT.signToken({
        id: userData.id,
        email: userData.email,
        username: userData.username,
        picture: userData.picture,
      });

      response
        .status(statusCodes.OK)
        .cookie(SECURITY.JWT_TOKEN_NAME, token)
        .json({ token, id, userData });
    } catch (error) {
      this.errorHandler(error, response);
    }
  }

  public async updateProfilePublicInformation(
    request: Request<
      object,
      object,
      { firstName: string; lastName: string; username: string; email: string }
    >,
    response: Response<{
      token: string;
      id: string;
      userData: T.User.UserSchemaStruct;
    }>,
  ) {
    try {
      const id = Validate.uuid.parse(request.user.id);
      const data = Validate.updateProfilePublicInformation.parse({
        firstName: request.body.firstName,
        lastName: request.body.lastName,
        username: request.body.username,
        email: request.body.email,
      });

      const userData = await this.repository.updateProfilePublicInformation(
        id,
        data,
      );

      if (!userData) {
        this.log.error({
          f: "updateProfilePublicInformation",
          m: "failed to update",
          e: {},
        });
        return response.status(statusCodes.NOT_FOUND).end();
      }

      const token = JWT.signToken({
        id: userData.id,
        email: userData.email,
        username: userData.username,
        picture: userData.picture,
      });

      response
        .status(statusCodes.OK)
        .cookie(SECURITY.JWT_TOKEN_NAME, token)
        .json({ token, id, userData });
    } catch (error) {
      this.errorHandler(error, response);
    }
  }
}
