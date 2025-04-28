import { HashingHandler } from "../utilities/bcrypt";
import z from "zod";
import { BaseRepository } from "../base/repository.base";
import { Client } from "pg";
import * as T from "../types";
import * as Validate from "../validators";
import VLogger from "@instamenta/vlogger";

export class UserRepository extends BaseRepository {
  public constructor(
    client: Client,
    logger: VLogger,
    private readonly hashingHandler: HashingHandler,
  ) {
    super(client, logger);
  }

  public listUsers(
    skip = 0,
    limit = 0,
  ): Promise<Omit<T.User.Schema, "updated_at">[]> {
    return this.database
      .query<Omit<T.User.Schema, "updated_at">>(
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
      )
      .then((data) => data.rows)

      .catch((error: unknown) => this.errorHandler(error, "listUsers"));
  }

  public getByUsername(username: string): Promise<T.User.GetByUsername | null> {
    return this.database
      .query<T.User.GetByUsername>(
        `

                SELECT id, username, password, email, username
                FROM users u
                WHERE u.username = $1
                LIMIT 1;
			`,
        [username],
      )
      .then((data) => (data.rows.length ? data.rows[0] : null))

      .catch((error: unknown) => this.errorHandler(error, "getByUsername"));
  }

  public updateLastActiveAtById(id: string) {
    return this.database
      .query(
        `
                UPDATE users
                SET last_active_at = NOW()
                WHERE id = $1;
			`,
        [id],
      )
      .then((data) => data.rowCount ?? null)

      .catch((error: unknown) =>
        this.errorHandler(error, "updateLastActiveAtById"),
      );
  }

  public async createUser({
    username,
    email,
    password,
    firstName,
    lastName,
  }: z.infer<typeof Validate.createUser>) {
    const hashedPassword = await this.hashingHandler.hashPassword(password);

    return this.database
      .query<{ id: string }>(
        `
                INSERT INTO users ("username", "email", "password", "first_name", "last_name")
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id;`,
        [username, email, hashedPassword, firstName, lastName],
      )
      .then((data) => data.rows[0].id)

      .catch((error: unknown) => this.errorHandler(error, "createUser"));
  }

  public getUserById(id: string) {
    return this.database
      .query<T.User.Schema>(
        `
                SELECT *
                FROM users
                WHERE id = $1
			`,
        [id],
      )
      .then((data) => (data.rowCount ? data.rows[0] : null))

      .catch((error: unknown) => this.errorHandler(error, "getUserById"));
  }

  public getUserByUsername(username: string) {
    return this.database
      .query<T.User.Schema>(
        `
                SELECT *
                FROM users
                WHERE username = $1
			`,
        [username],
      )
      .then((data) => (data.rowCount ? data.rows[0] : null))

      .catch((error: unknown) => this.errorHandler(error, "getUserByUsername"));
  }

  public updateProfilePicture(id: string, pictureUrl: string) {
    return this.database
      .query<T.User.Schema>(
        `
                UPDATE "users"
                SET picture = $2
                WHERE id = $1
                RETURNING *
			`,
        [id, pictureUrl],
      )
      .then((data) => (data.rows.length ? data.rows[0] : null))

      .catch((error: unknown) =>
        this.errorHandler(error, "updateProfilePicture"),
      );
  }

  public updateBio(id: string, bio: string) {
    return this.database
      .query<T.User.Schema>(
        `
                UPDATE "users"
                SET bio = $2
                WHERE id = $1
                RETURNING *
			`,
        [id, bio],
      )
      .then((data) => (data.rows.length ? data.rows[0] : null))
      .catch((error: unknown) =>
        this.errorHandler(error, "updateProfilePicture"),
      );
  }

  public updateProfilePublicInformation(
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
    const fields = [];
    const values = [id];

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

    return this.database
      .query<T.User.Schema>(
        `
                UPDATE "users"
                SET ${fields.join(", ")}
                WHERE id = $1
                RETURNING *
			`,
        values,
      )
      .then((data) => (data.rows.length ? data.rows[0] : null))

      .catch((error: unknown) =>
        this.errorHandler(error, "updateProfilePublicInformation"),
      );
  }
}
