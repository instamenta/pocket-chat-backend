import {QueryResult} from 'pg';
import BaseRepository from "../base/repository.base";
import * as T from '../types';

export default class PublicationsRepository extends BaseRepository {

	async listPublications() {
		try {
			const query = 'SELECT * FROM publications ORDER BY created_at DESC';
			const result: QueryResult<T.Publication.Publication> = await this.database.query(query);
			return result.rows;
		} catch (error) {
			this.errorHandler(error, 'listPublications');
		}
	}

	async getPublicationById(id: string) {
		try {
			const query = 'SELECT * FROM publications WHERE id = $1';
			const result: QueryResult<T.Publication.Publication> = await this.database.query(query, [id]);
			return result.rowCount ? result.rows[0] : null;
		} catch (error) {
			this.errorHandler(error, 'getPublicationById');
		}
	}

	async getPublicationsByUserId(userId: string) {
		try {
			const query = `SELECT p.*,
                            u.username,
                            u.picture,
                            u.first_name,
                            u.last_name,
                            CASE
                                WHEN pl.user_id IS NOT NULL THEN TRUE
                                ELSE FALSE
                                END AS liked_by_user,
                            CASE
                                WHEN f.friendship_status IS NOT NULL THEN TRUE
                                ELSE FALSE
                                END AS is_friend_with_user
                     FROM publications p
                              JOIN friendships f ON p.publisher_id = f.sender_id OR p.publisher_id = f.recipient_id
                              JOIN users u ON p.publisher_id = u.id
                              LEFT JOIN publication_likes pl ON p.id = pl.publication_id AND pl.user_id = $1
                     WHERE publisher_id = $1
                     ORDER BY created_at DESC`;
			const result = await this.database.query<T.Publication.Recommendation>(query, [userId]);
			return result.rows;
		} catch (error) {
			this.errorHandler(error, 'getPublicationsByUserId');
		}
	}

	async getPublicationsCountByUserId(userId: string) {
		try {
			const query = `SELECT id
                     FROM publications
                     WHERE publisher_id = $1`;
			const result = await this.database.query(query, [userId]);
			return result.rowCount ?? 0;
		} catch (error) {
			this.errorHandler(error, 'getPublicationsCountByUserId');
		}
	}

	async getRecommendations(userId: string): Promise<T.Publication.Publication[]> {
		try {
			const query = `
          SELECT p.*,
                 u.username,
                 u.picture,
                 u.first_name,
                 u.last_name,
                 CASE
                     WHEN pl.user_id IS NOT NULL THEN TRUE
                     ELSE FALSE
                     END AS liked_by_user,
                 CASE
                     WHEN f.friendship_status IS NOT NULL THEN TRUE
                     ELSE FALSE
                     END AS is_friend_with_user
          FROM publications p
                   JOIN friendships f ON p.publisher_id = f.sender_id OR p.publisher_id = f.recipient_id
                   JOIN users u ON p.publisher_id = u.id
                   LEFT JOIN publication_likes pl ON p.id = pl.publication_id AND pl.user_id = $1
          WHERE f.friendship_status = 'accepted'
            AND (f.sender_id = $1 OR f.recipient_id = $1)
            AND p.publication_status = 'published'
          ORDER BY p.created_at
          LIMIT 20`;
			const result: QueryResult<T.Publication.Publication & {
				liked_by_user: boolean
			}> = await this.database.query(query, [userId]);
			const recommendations = result.rows;

			if (recommendations.length < 20) {
				const remainingLimit = 20 - recommendations.length;
				const additionalQuery = `
            SELECT p.*,
                   u.username,
                   u.picture,
                   u.first_name,
                   u.last_name,
                   CASE
                       WHEN pl.user_id IS NOT NULL THEN TRUE
                       ELSE FALSE
                       END AS liked_by_user,
                   CASE
                       WHEN f.friendship_status IS NOT NULL THEN TRUE
                       ELSE FALSE
                       END AS is_friend_with_user
            FROM publications p
                     JOIN users u ON p.publisher_id = u.id
                     LEFT JOIN publication_likes pl ON p.id = pl.publication_id AND pl.user_id = $1
                     JOIN friendships f ON p.publisher_id = f.sender_id OR p.publisher_id = f.recipient_id
            WHERE p.publication_status = 'published' AND f.sender_id = $1
               OR f.recipient_id = $1
            ORDER BY p.created_at
            LIMIT $2`;
				const additionalResult: QueryResult<T.Publication.Publication & {
					liked_by_user: boolean
				}> = await this.database.query(additionalQuery, [userId, remainingLimit]);
				const additionalPublications = additionalResult.rows;
				recommendations.push(...additionalPublications);
			}

			return recommendations;
		} catch (error) {
			this.errorHandler(error, 'getRecommendations');
		}
	}

	async createPublication({
		                        publisher_id,
		                        description,
		                        images,
		                        publication_status,
	                        }: {
		publisher_id: string;
		description: string;
		images: string[];
		publication_status: string;
	}): Promise<string> {
		try {
			const query = `
          INSERT INTO publications (publisher_id, description, images, publication_status)
          VALUES ($1, $2, $3, $4)
          RETURNING id`;
			const result: QueryResult<{ id: string }> = await this.database.query(query, [
				publisher_id,
				description,
				images,
				publication_status,
			]);
			return result.rows[0].id;
		} catch (error) {
			this.errorHandler(error, 'createPublication');
		}
	}

	async updatePublication(id: string, publicationData: {
		content?: string;
		images?: string[];
		publication_status?: string;
	}): Promise<string> {
		try {
			const fields = Object.keys(publicationData)
				.map((key, idx) => `${key} = $${idx + 2}`)
				.join(', ');
			const values = Object.values(publicationData);

			const query = `
          UPDATE publications
          SET ${fields}
          WHERE id = $1
          RETURNING id`;
			const result = await this.database.query<{ id: string }>(query, [id, ...values]);
			return result.rows[0].id;
		} catch (error) {
			this.errorHandler(error, 'updatePublication');
		}
	}

	async likePublication(publicationId: string, userId: string): Promise<void> {
		try {
			await this.database.query('BEGIN');

			const likeExistsQuery = 'SELECT id FROM publication_likes WHERE publication_id = $1 AND user_id = $2';
			const likeExistsResult = await this.database.query(likeExistsQuery, [publicationId, userId]);

			if (likeExistsResult.rows.length > 0) {
				const removeLikeQuery = 'DELETE FROM publication_likes WHERE publication_id = $1 AND user_id = $2';
				const decrementLikeCountQuery = 'UPDATE publications SET likes_count = likes_count - 1 WHERE id = $1';

				await Promise.all([
					await this.database.query(removeLikeQuery, [publicationId, userId]),
					await this.database.query(decrementLikeCountQuery, [publicationId]),
				]);
			} else {
				const addLikeQuery = 'INSERT INTO publication_likes (publication_id, user_id) VALUES ($1, $2)';
				const incrementLikeCountQuery = 'UPDATE publications SET likes_count = likes_count + 1 WHERE id = $1';

				await Promise.all([
					await this.database.query(addLikeQuery, [publicationId, userId]),
					await this.database.query(incrementLikeCountQuery, [publicationId]),
				])
			}

			await this.database.query('COMMIT');
		} catch (error) {
			await this.database.query('ROLLBACK');
			throw error;
		}
	}


}
