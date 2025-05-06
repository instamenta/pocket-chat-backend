import { HashingHandler } from "../utilities/bcrypt";
import z from "zod";
import { BaseRepository } from "../base/repository.base";
import { Client } from "pg";
import * as Validate from "../validators";
import VLogger from "@instamenta/vlogger";
import { GetUserByUsernameStruct, UserSchemaStruct } from "../types/user";

export class UserRepository extends BaseRepository {
  public constructor(
    client: Client,
    logger: VLogger,
    private readonly hashingHandler: HashingHandler,
  ) {
    super(client, logger);
  }

  public async listUsers(skip = 0, limit = 0) {
    try {
      const data = await this.database.query<
        Omit<UserSchemaStruct, "updatedAt">
      >(
        `
                SELECT id,
                       username,
                       email,
                       password,
                       first_name,
                       last_name,
                       picture,
                       created_at,
                       last_active_at
                FROM users
                OFFSET $1 LIMIT $2
			`,
        [skip, limit],
      );
      return data.rows;
    } catch (error) {
      this.errorHandler(error, "listUsers");
    }
  }

  public async getByUsername(username: string) {
    try {
      const data = await this.database.query<GetUserByUsernameStruct>(
        `
                SELECT id, username, password, email, username
                FROM users u
                WHERE u.username = $1
                LIMIT 1;
			`,
        [username],
      );
      return data.rows.length ? data.rows[0] : null;
    } catch (error) {
      return this.errorHandler(error, "getByUsername");
    }
  }

  public async updateLastActiveAtById(id: string) {
    try {
      const data = await this.database.query<object>(
        `
                UPDATE users
                SET last_active_at = NOW()
                WHERE id = $1;
			`,
        [id],
      );
      return data.rowCount ?? null;
    } catch (error) {
      this.errorHandler(error, "updateLastActiveAtById");
    }
  }

  public async createUser({
    username,
    email,
    password,
    firstName,
    lastName,
  }: z.infer<typeof Validate.createUser>) {
    const hashedPassword = await this.hashingHandler.hashPassword(password);

    try {
      const data = await this.database.query<{ id: string }>(
        `
                INSERT INTO users ("username", "email", "password", "first_name", "last_name")
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id;`,
        [username, email, hashedPassword, firstName, lastName],
      );
      return data.rows[0].id;
    } catch (error) {
      return this.errorHandler(error, "createUser");
    }
  }

  public async getUserById(id: string) {
    try {
      const data = await this.database.query<UserSchemaStruct>(
        `
                SELECT *
                FROM users
                WHERE id = $1
			`,
        [id],
      );
      return data.rowCount ? data.rows[0] : null;
    } catch (error) {
      this.errorHandler(error, "getUserById");
    }
  }

  public async getUserByUsername(username: string) {
    try {
      const data = await this.database.query<UserSchemaStruct>(
        `
                SELECT *
                FROM users
                WHERE username = $1
			`,
        [username],
      );
      return data.rowCount ? data.rows[0] : null;
    } catch (error) {
      this.errorHandler(error, "getUserByUsername");
    }
  }

  public async updateProfilePicture(id: string, pictureUrl: string) {
    try {
      const data = await this.database.query<UserSchemaStruct>(
        `
                UPDATE "users"
                SET picture = $2
                WHERE id = $1
                RETURNING *
			`,
        [id, pictureUrl],
      );
      return data.rows.length ? data.rows[0] : null;
    } catch (error) {
      this.errorHandler(error, "updateProfilePicture");
    }
  }

  public async updateBio(id: string, bio: string) {
    try {
      const data = await this.database.query<UserSchemaStruct>(
        `
                UPDATE "users"
                SET bio = $2
                WHERE id = $1
                RETURNING *
			`,
        [id, bio],
      );
      return data.rows.length ? data.rows[0] : null;
    } catch (error) {
      this.errorHandler(error, "updateProfilePicture");
    }
  }

  public async updateProfilePublicInformation(
    id: string,
    {
      username,
      email,
      firstName,
      lastName,
    }: {
      username?: string;
      email?: string;
      firstName?: string;
      lastName?: string;
    },
  ) {
    const fields: string[] = [];
    const values: string[] = [id];

    if (username) {
      fields.push(`username = $${Number(fields.length + 2).toString()}`);
      values.push(username);
    }
    if (email) {
      fields.push(`email = $${Number(fields.length + 2).toString()}`);
      values.push(email);
    }
    if (firstName) {
      fields.push(`first_name = $${Number(fields.length + 2).toString()}`);
      values.push(firstName);
    }
    if (lastName) {
      fields.push(`last_name = $${Number(fields.length + 2).toString()}`);
      values.push(lastName);
    }

    try {
      const data = await this.database.query<UserSchemaStruct>(
        `
                UPDATE "users"
                SET ${fields.join(", ")}
                WHERE id = $1
                RETURNING *
			`,
        values,
      );
      return data.rows.length ? data.rows[0] : null;
    } catch (error) {
      return this.errorHandler(error, "updateProfilePublicInformation");
    }
  }
}
