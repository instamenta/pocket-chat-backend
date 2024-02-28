import {Client} from "pg";
import {group_roles} from "../utilities/enumerations";
import {I_Group, I_GroupMemberPopulated} from "../types/group";
import {I_Publication} from "../types/publication";

export default class GroupRepository {
	constructor(private readonly database: Client) {
	}

	private errorHandler(error: unknown | Error, method: string): never {
		throw new Error(`${this.constructor.name}.${method}(): Error`, {cause: error});
	}

	async createGroup(userId: string, name: string, description: string, imageUrl: string): Promise<string> {
		return this.database.query<{ id: string }>(`

                INSERT INTO "groups" (owner_id, name, description, image_url)
                VALUES ($1, $2, $3, $4)
                RETURNING id
			`,
			[userId, name, description, imageUrl]
		).then((data) => data.rows[0].id)

			.catch(e => this.errorHandler(e, 'createShort'));
	}

	async removeGroup(userId: string, groupId: string) {
		try {
			const getRoleQuery = `
          SELECT role
          FROM "group_members"
          WHERE group_id = $1
            AND user_id = $2;
			`;
			const userRole = await this.database.query(getRoleQuery, [groupId, userId]);
			if (!userRole.rows.length || userRole.rows[0].role !== group_roles.OWNER) {
				throw new Error('Unauthorized: Only the owner can remove group.');
			}
		} catch (error) {
			this.errorHandler(error, 'removeGroup');
		}

		const deleteGroupQuery = `
        DELETE
        FROM "groups"
        WHERE id = $1;`;
		const deleteGroupMembersReferenceQuery = `
        DELETE
        FROM "group_members"
        WHERE group_id = $1;`;
		const deleteGroupPosts = `
        DELETE
        FROM "publications"
        WHERE group_id = $1;`;
		try {
			await Promise.all([
				this.database.query(deleteGroupQuery, [groupId]),
				this.database.query(deleteGroupPosts, [groupId]),
				this.database.query(deleteGroupMembersReferenceQuery, [groupId]),
			]);

			return true;
		} catch (error) {
			this.errorHandler(error, 'removeGroup');
		}
	}


	async listGroups(userId: string) {
		const query = `
        SELECT g.id,
               g.owner_id,
               g.name,
               g.description,
               g.created_at,
               g.members_count,
               g.image_url
        FROM groups g
                 LEFT JOIN group_members gm ON g.id = gm.group_id AND gm.user_id = $1
        WHERE gm.user_id IS NULL
        ORDER BY g.members_count DESC;
		`;
		try {
			const result = await this.database.query<I_Group>(query, [userId]);
			return result.rows;
		} catch (error) {
			this.errorHandler(error, 'listGroups');
		}
	}

	async listGroupsByUser(userId: string) {
		const query = `
        SELECT g.*
        FROM "groups" g
                 JOIN "group_members" gm ON gm.group_id = g.id
        WHERE gm.user_id = $1
        ORDER BY g.members_count DESC
		`;
		try {
			const result = await this.database.query<I_Group>(query, [userId]);
			return result.rows;
		} catch (error) {
			this.errorHandler(error, 'listGroupsByUser');
		}
	}

	async joinGroup(userId: string, groupId: string) {
		const insertQuery = `
        INSERT INTO "group_members" (group_id, user_id)
        VALUES ($1, $2)
        RETURNING id;
		`;
		const updateQuery = `
        UPDATE "groups"
        SET members_count = members_count + 1
        WHERE id = $1;
		`;
		try {
			await this.database.query(insertQuery, [groupId, userId]);
			await this.database.query(updateQuery, [groupId]);
			return true;
		} catch (error) {
			this.errorHandler(error, 'joinGroup');
		}
	}

	async leaveGroup(userId: string, groupId: string) {
		const deleteQuery = `
        DELETE
        FROM "group_members"
        WHERE group_id = $1
          AND user_id = $2;
		`;
		const updateQuery = `
        UPDATE "groups"
        SET members_count = members_count - 1
        WHERE id = $1;
		`;
		try {
			const deleteResult = await this.database.query(deleteQuery, [groupId, userId]);
			if (!deleteResult.rowCount) {
				throw new Error('User not found in group');
			}

			await this.database.query(updateQuery, [groupId]);
			return true;
		} catch (error) {
			this.errorHandler(error, 'leaveGroup');
		}
	}

	async changeRole(senderId: string, groupId: string, recipientId: string, newRole: 'moderator' | 'member') {
		const getRoleQuery = `
        SELECT role
        FROM "group_members"
        WHERE group_id = $1
          AND user_id = $2;
		`;
		try {
			const senderRole = await this.database.query(getRoleQuery, [groupId, senderId]);
			if (!senderRole.rows.length || (
				senderRole.rows[0].role !== group_roles.OWNER &&
				senderRole.rows[0].role !== group_roles.MODERATOR
			)) throw new Error('Unauthorized: Only the owner or moderators can change roles.');

			const updateRoleQuery = `
          UPDATE "group_members"
          SET role = $3
          WHERE group_id = $1
            AND user_id = $2;
			`;

			await this.database.query(updateRoleQuery, [groupId, recipientId, newRole]);
			return true;
		} catch (error) {
			this.errorHandler(error, 'changeRole');
		}
	}

	async removeMember(senderId: string, groupId: string, recipientId: string) {
		const getSenderRoleQuery = `
        SELECT role
        FROM "group_members"
        WHERE group_id = $1
          AND user_id = $2;`;

		const getRecipientRoleQuery = `
        UPDATE "group_members"
        SET role = $3
        WHERE group_id = $1
          AND user_id = $2;`;
		try {
			const [senderRole, recipientRole] = await Promise.all([
				this.database.query(getSenderRoleQuery, [groupId, senderId]),
				this.database.query(getRecipientRoleQuery, [groupId, senderId]),
			]);

			if (!senderRole.rows.length || (
				senderRole.rows[0].role !== group_roles.OWNER &&
				senderRole.rows[0].role !== group_roles.MODERATOR
			)) throw new Error('Unauthorized: Only the owner or moderators can change roles.');

			if (!recipientRole.rows.length || (
				recipientRole.rows[0].role === group_roles.OWNER
			)) throw new Error('Unauthorized: Cant remove the owner.');
		} catch (error) {
			this.errorHandler(error, 'removeMember');
		}

		const deleteGroupMemberQuery = `
        DELETE
        FROM "group_members"
        WHERE group_id = $1
          AND user_id = $2;`;

		const updateGroupQuery = `
        UPDATE "groups"
        SET members_count = members_count - 1
        WHERE id = $1;
		`;
		try {
			await Promise.any([
				this.database.query(deleteGroupMemberQuery, [groupId, recipientId]),
				this.database.query(updateGroupQuery, [groupId]),
			]);

			return true;
		} catch (error) {
			this.errorHandler(error, 'removeMember');
		}
	}

	async getGroupById(groupId: string) {
		const query = `
        SELECT g.id, g.name, g.description, g.created_at, g.members_count, g.owner_id
        FROM "groups" g
        WHERE g.id = $1;
		`;
		try {
			const result = await this.database.query<I_Group>(query, [groupId]);
			return result.rowCount ? result.rows[0] : null;
		} catch (error) {
			this.errorHandler(error, 'getGroupById');
		}
	}

	public async getMembersByGroupId(groupId: string) {
		const query = `
        SELECT gm.user_id, u.username, u.first_name, u.last_name, u.picture, gm.role, gm.member_since
        FROM "group_members" gm
                 JOIN "users" u ON gm.user_id = u.id
        WHERE gm.group_id = $1;
		`;
		try {
			const result = await this.database.query<I_GroupMemberPopulated>(query, [groupId]);
			return result.rows;
		} catch (error) {
			this.errorHandler(error, 'getMembersByGroupId');
		}
	}

	async listPublications(groupId: string): Promise<I_Publication[]> {
		try {
			const query = `SELECT *
                     FROM publications
                     WHERE group_id = $1
                     ORDER BY created_at DESC`;
			const result = await this.database.query<I_Publication>(query, [groupId]);
			return result.rows;
		} catch (error) {
			this.errorHandler(error, 'listPublications');
		}
	}

	async createPublication({
		                        publisher_id,
		                        description,
		                        images,
		                        publication_status,
		                        groupId
	                        }: {
		publisher_id: string;
		description: string;
		images: string[];
		publication_status: string;
		groupId: string;
	}): Promise<string> {
		try {
			const query = `
          INSERT INTO publications (publisher_id, description, images, publication_status, group_id)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING id`;
			const result = await this.database.query<{ id: string }>(query, [
				publisher_id,
				description,
				images,
				publication_status,
				groupId,
			]);
			return result.rows[0].id;
		} catch (error) {
			this.errorHandler(error, 'createPublication');
		}
	}

}
