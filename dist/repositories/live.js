"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiveRepository = void 0;
const repository_base_1 = require("../base/repository.base");
class LiveRepository extends repository_base_1.BaseRepository {
    async createLive(userId) {
        try {
            const data = await this.database.query(`
                INSERT INTO "lives" (user_id)
                VALUES ($1)
                RETURNING id
			`, [userId]);
            return data.rows[0].id;
        }
        catch (error) {
            this.errorHandler(error, "createLive");
        }
    }
    async listLives(userId) {
        const query = `SELECT u.id      AS user_id,
                          u.picture as user_picture,
                          u.username,
                          u.first_name,
                          u.last_name,
                          l.state,
                          l.created_at,
                          l.id
                   FROM "lives" l
                            JOIN users u ON u.id = l.user_id
                   WHERE l.state = 'active'
                     AND u.id != $1
                   ORDER BY l.created_at DESC
		`;
        try {
            const result = await this.database.query(query, [
                userId,
            ]);
            return result.rows;
        }
        catch (error) {
            this.errorHandler(error, "listLives");
        }
    }
    async getLiveById(liveId) {
        const query = `SELECT id, state, user_id
                   FROM "lives"
                   WHERE state = 'active'
                     AND id = $1`;
        try {
            const result = await this.database.query(query, [liveId]);
            return result.rows.length ? result.rows[0] : null;
        }
        catch (error) {
            this.errorHandler(error, "getLiveById");
        }
    }
    async updateLiveState(userId, state) {
        const query = `
        UPDATE "lives"
        SET state = $1
        WHERE user_id = $2
		`;
        try {
            const result = await this.database.query(query, [state, userId]);
            return !!result.rowCount;
        }
        catch (error) {
            this.errorHandler(error, "updateLiveState");
        }
    }
    async createLiveMessage(liveId, userId, content) {
        try {
            const data = await this.database.query(`
                INSERT INTO "lives_messages" (live_id, sender_id, content)
                VALUES ($1, $2, $3)
                RETURNING id
			`, [liveId, userId, content]);
            return data.rows[0].id;
        }
        catch (error) {
            this.errorHandler(error, "createLiveMessage");
        }
    }
    async listLiveMessages(liveId) {
        const query = `SELECT u.id      AS user_id,
                          u.picture as user_picture,
                          u.username,
                          u.first_name,
                          u.last_name,
                          lm.content,
                          lm.created_at,
                          lm.id     as message_id,
                          lm.live_id
                   FROM "lives_messages" lm
                            JOIN users u ON u.id = lm.sender_id
                   WHERE lm.live_id = $1
                   ORDER BY lm.created_at DESC
		`;
        try {
            const result = await this.database.query(query, [liveId]);
            return result.rows;
        }
        catch (error) {
            this.errorHandler(error, "listLiveMessages");
        }
    }
}
exports.LiveRepository = LiveRepository;
