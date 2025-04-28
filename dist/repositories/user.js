"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const repository_base_1 = require("../base/repository.base");
class UserRepository extends repository_base_1.BaseRepository {
    hashingHandler;
    constructor(client, logger, hashingHandler) {
        super(client, logger);
        this.hashingHandler = hashingHandler;
    }
    listUsers(skip = 0, limit = 0) {
        return this.database
            .query(`

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
			`, [skip, limit])
            .then((data) => data.rows)
            .catch((error) => this.errorHandler(error, "listUsers"));
    }
    getByUsername(username) {
        return this.database
            .query(`

                SELECT id, username, password, email, username
                FROM users u
                WHERE u.username = $1
                LIMIT 1;
			`, [username])
            .then((data) => (data.rows.length ? data.rows[0] : null))
            .catch((error) => this.errorHandler(error, "getByUsername"));
    }
    updateLastActiveAtById(id) {
        return this.database
            .query(`
                UPDATE users
                SET last_active_at = NOW()
                WHERE id = $1;
			`, [id])
            .then((data) => data.rowCount ?? null)
            .catch((error) => this.errorHandler(error, "updateLastActiveAtById"));
    }
    async createUser({ username, email, password, firstName, lastName, }) {
        const hashedPassword = await this.hashingHandler.hashPassword(password);
        return this.database
            .query(`
                INSERT INTO users ("username", "email", "password", "first_name", "last_name")
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id;`, [username, email, hashedPassword, firstName, lastName])
            .then((data) => data.rows[0].id)
            .catch((error) => this.errorHandler(error, "createUser"));
    }
    getUserById(id) {
        return this.database
            .query(`
                SELECT *
                FROM users
                WHERE id = $1
			`, [id])
            .then((data) => (data.rowCount ? data.rows[0] : null))
            .catch((error) => this.errorHandler(error, "getUserById"));
    }
    getUserByUsername(username) {
        return this.database
            .query(`
                SELECT *
                FROM users
                WHERE username = $1
			`, [username])
            .then((data) => (data.rowCount ? data.rows[0] : null))
            .catch((error) => this.errorHandler(error, "getUserByUsername"));
    }
    updateProfilePicture(id, pictureUrl) {
        return this.database
            .query(`
                UPDATE "users"
                SET picture = $2
                WHERE id = $1
                RETURNING *
			`, [id, pictureUrl])
            .then((data) => (data.rows.length ? data.rows[0] : null))
            .catch((error) => this.errorHandler(error, "updateProfilePicture"));
    }
    updateBio(id, bio) {
        return this.database
            .query(`
                UPDATE "users"
                SET bio = $2
                WHERE id = $1
                RETURNING *
			`, [id, bio])
            .then((data) => (data.rows.length ? data.rows[0] : null))
            .catch((error) => this.errorHandler(error, "updateProfilePicture"));
    }
    updateProfilePublicInformation(id, { username, email, firstName, lastName, }) {
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
            .query(`
                UPDATE "users"
                SET ${fields.join(", ")}
                WHERE id = $1
                RETURNING *
			`, values)
            .then((data) => (data.rows.length ? data.rows[0] : null))
            .catch((error) => this.errorHandler(error, "updateProfilePublicInformation"));
    }
}
exports.UserRepository = UserRepository;
