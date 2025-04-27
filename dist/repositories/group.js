"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enumerations_1 = require("../utilities/enumerations");
const repository_base_1 = require("../base/repository.base");
const vanilla_utility_pack_1 = require("@instamenta/vanilla-utility-pack");
class GroupRepository extends repository_base_1.BaseRepository {
    async createGroup(userId, name, description, imageUrl) {
        return this.database.query(`

                INSERT INTO "groups" (owner_id, name, description, image_url)
                VALUES ($1, $2, $3, $4)
                RETURNING id
			`, [userId, name, description, imageUrl]).then((data) => data.rows[0].id)
            .catch((error) => this.errorHandler(error, 'createShort'));
    }
    async removeGroup(userId, groupId) {
        try {
            const getRoleQuery = `
          SELECT role
          FROM "group_members"
          WHERE group_id = $1
            AND user_id = $2;
			`;
            const userRole = await this.database.query(getRoleQuery, [groupId, userId]);
            if (!userRole.rows.length || userRole.rows[0].role !== enumerations_1.group_roles.OWNER) {
                throw new vanilla_utility_pack_1.UnauthorizedError(' Only the owner can remove group.');
            }
        }
        catch (error) {
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
        }
        catch (error) {
            this.errorHandler(error, 'removeGroup');
        }
    }
    async listGroups(userId) {
        const query = `
        SELECT g.id,
               g.owner_id,
               g.name,
               g.description,
               g.created_at,
               g.members_count,
               g.image_url
        FROM "groups" g
                 LEFT JOIN "group_members" gm ON g.id = gm.group_id AND gm.user_id = $1
        WHERE gm.user_id IS NULL
        ORDER BY g.members_count DESC;
		`;
        try {
            const result = await this.database.query(query, [userId]);
            return result.rows;
        }
        catch (error) {
            this.errorHandler(error, 'listGroups');
        }
    }
    async listGroupsByUser(userId) {
        const query = `
        SELECT g.*
        FROM "groups" g
                 JOIN "group_members" gm ON gm.group_id = g.id
        WHERE gm.user_id = $1
        ORDER BY g.members_count DESC
		`;
        try {
            const result = await this.database.query(query, [userId]);
            return result.rows;
        }
        catch (error) {
            this.errorHandler(error, 'listGroupsByUser');
        }
    }
    async joinGroup(userId, groupId) {
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
        }
        catch (error) {
            this.errorHandler(error, 'joinGroup');
        }
    }
    async leaveGroup(userId, groupId) {
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
                throw new vanilla_utility_pack_1.NotFoundError('User not found in group');
            }
            await this.database.query(updateQuery, [groupId]);
            return true;
        }
        catch (error) {
            this.errorHandler(error, 'leaveGroup');
        }
    }
    async changeRole(senderId, groupId, recipientId, newRole) {
        const getRoleQuery = `
        SELECT role
        FROM "group_members"
        WHERE group_id = $1
          AND user_id = $2;
		`;
        try {
            const senderRole = await this.database.query(getRoleQuery, [groupId, senderId]);
            if (!senderRole.rows.length || (senderRole.rows[0].role !== enumerations_1.group_roles.OWNER &&
                senderRole.rows[0].role !== enumerations_1.group_roles.MODERATOR))
                throw new Error('Unauthorized: Only the owner or moderators can change roles.');
            const updateRoleQuery = `
          UPDATE "group_members"
          SET role = $3
          WHERE group_id = $1
            AND user_id = $2;
			`;
            await this.database.query(updateRoleQuery, [groupId, recipientId, newRole]);
            return true;
        }
        catch (error) {
            this.errorHandler(error, 'changeRole');
        }
    }
    async removeMember(senderId, groupId, recipientId) {
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
            if (!senderRole.rows.length || (senderRole.rows[0].role !== enumerations_1.group_roles.OWNER &&
                senderRole.rows[0].role !== enumerations_1.group_roles.MODERATOR))
                throw new Error('Unauthorized: Only the owner or moderators can change roles.');
            if (!recipientRole.rows.length || (recipientRole.rows[0].role === enumerations_1.group_roles.OWNER))
                throw new Error('Unauthorized: Cant remove the owner.');
        }
        catch (error) {
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
        }
        catch (error) {
            this.errorHandler(error, 'removeMember');
        }
    }
    async getGroupById(groupId) {
        const query = `
        SELECT *
        FROM "groups" g
        WHERE g.id = $1;
		`;
        try {
            const result = await this.database.query(query, [groupId]);
            return result.rowCount ? result.rows[0] : null;
        }
        catch (error) {
            this.errorHandler(error, 'getGroupById');
        }
    }
    async getMembersByGroupId(groupId) {
        const query = `
        SELECT gm.user_id, u.username, u.first_name, u.last_name, u.picture, gm.role, gm.member_since
        FROM "group_members" gm
                 JOIN "users" u ON gm.user_id = u.id
        WHERE gm.group_id = $1;
		`;
        try {
            const result = await this.database.query(query, [groupId]);
            return result.rows;
        }
        catch (error) {
            this.errorHandler(error, 'getMembersByGroupId');
        }
    }
    async listPublications(groupId) {
        try {
            const query = `SELECT p.*,
                            u.username,
                            u.picture,
                            u.first_name,
                            u.last_name,
                            CASE
                                WHEN pl.user_id IS NOT NULL THEN TRUE
                                ELSE FALSE
                                END AS liked_by_user
                     FROM publications p
                              JOIN users u ON p.publisher_id = u.id
                              LEFT JOIN publication_likes pl ON p.id = pl.publication_id AND pl.user_id = $1
                     WHERE p.publication_status = 'published'
                       AND p.group_id = $1
                     ORDER BY p.created_at DESC`;
            const result = await this.database.query(query, [groupId]);
            return result.rows;
        }
        catch (error) {
            this.errorHandler(error, 'listPublications');
        }
    }
    async createPublication({ publisher_id, description, images, publication_status, groupId }) {
        try {
            const query = `
          INSERT INTO publications (publisher_id, description, images, publication_status, group_id)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING id`;
            const result = await this.database.query(query, [
                publisher_id,
                description,
                images,
                publication_status,
                groupId,
            ]);
            return result.rows[0].id;
        }
        catch (error) {
            this.errorHandler(error, 'createPublication');
        }
    }
}
exports.default = GroupRepository;
