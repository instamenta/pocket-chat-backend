import { BaseRepository } from "../base/repository.base";
import { PopulatedLiveMessageStruct, PopulatedLiveStruct } from "../types/live";
import { LiveStatesUnion } from "../types/union";

export class LiveRepository extends BaseRepository {
  public async createLive(userId: string): Promise<string> {
    try {
      const data = await this.database.query<{ id: string }>(
        `
                INSERT INTO "lives" (user_id)
                VALUES ($1)
                RETURNING id
			`,
        [userId],
      );
      return data.rows[0].id;
    } catch (error) {
      this.errorHandler(error, "createLive");
    }
  }

  public async listLives(userId: string) {
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
      const result = await this.database.query<PopulatedLiveStruct>(query, [
        userId,
      ]);
      return result.rows;
    } catch (error) {
      this.errorHandler(error, "listLives");
    }
  }

  public async getLiveById(liveId: string) {
    const query = `SELECT id, state, user_id
                   FROM "lives"
                   WHERE state = 'active'
                     AND id = $1`;
    try {
      const result = await this.database.query<
        Pick<PopulatedLiveStruct, "id" | "state" | "userId">
      >(query, [liveId]);
      return result.rows.length ? result.rows[0] : null;
    } catch (error) {
      this.errorHandler(error, "getLiveById");
    }
  }

  public async updateLiveState(
    userId: string,
    state: LiveStatesUnion,
  ): Promise<boolean> {
    const query = `
        UPDATE "lives"
        SET state = $1
        WHERE user_id = $2
		`;
    try {
      const result = await this.database.query<object>(query, [state, userId]);
      return !!result.rowCount;
    } catch (error) {
      this.errorHandler(error, "updateLiveState");
    }
  }

  public async createLiveMessage(
    liveId: string,
    userId: string,
    content: string,
  ): Promise<string> {
    try {
      const data = await this.database.query<{ id: string }>(
        `
                INSERT INTO "lives_messages" (live_id, sender_id, content)
                VALUES ($1, $2, $3)
                RETURNING id
			`,
        [liveId, userId, content],
      );
      return data.rows[0].id;
    } catch (error) {
      this.errorHandler(error, "createLiveMessage");
    }
  }

  public async listLiveMessages(liveId: string) {
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
      const result =
        await this.database.query<PopulatedLiveMessageStruct>(
          query,
          [liveId],
        );
      return result.rows;
    } catch (error) {
      this.errorHandler(error, "listLiveMessages");
    }
  }
}
