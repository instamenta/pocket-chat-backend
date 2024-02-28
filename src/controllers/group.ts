import {Request, Response} from "express";
import {create_group_schema, create_publication_schema, uuid_schema} from "../validators";
import status_codes from '@instamenta/http-status-codes'
import statusCodes from '@instamenta/http-status-codes'
import {controllerErrorHandler} from "../utilities";
import GroupRepository from "../repositories/group";
import {I_Group, I_GroupMemberPopulated} from "../types/group";
import {I_Publication} from "../types/publication";

// TODO: Make post with percents based on all users engagement with post

export default class GroupController {
	constructor(private readonly repository: GroupRepository) {
	}

	public async createGroup(
		r: Request<{}, { id: string }, { name: string, description: string, imageUrl: string }>,
		w: Response<{ id: string }>
	) {
		try {
			const {userId, name, description, imageUrl} = create_group_schema.parse({
				userId: r.user.id,
				name: r.body.name,
				description: r.body.description,
				imageUrl: r.body.imageUrl,
			});

			const groupId = await this.repository.createGroup(userId, name, description, imageUrl);
			if (!groupId) {
				console.error(`${this.constructor.name}.createGroup(): Failed to create group`);
				return w.status(status_codes.INTERNAL_SERVER_ERROR).end();
			}

			w.status(status_codes.CREATED).json({id: groupId});
		} catch (error) {
			controllerErrorHandler(error, w);
		}
	}

	public async removeGroup(
		r: Request<{ groupId: string }>,
		w: Response
	) {
		try {
			const userId = uuid_schema.parse(r.user.id);
			const groupId = uuid_schema.parse(r.params.groupId);

			const success = await this.repository.removeGroup(userId, groupId);
			if (!success) {
				console.error(`${this.constructor.name}.removeGroup(): Failed to remove group`);
				return w.status(status_codes.INTERNAL_SERVER_ERROR).end();
			}

			w.status(status_codes.CREATED).end();
		} catch (error) {
			controllerErrorHandler(error, w);
		}
	}

	public async listGroups(r: Request, w: Response<I_Group[]>) {
		try {
			const userId = uuid_schema.parse(r.user.id);

			const groups = await this.repository.listGroups(userId);
			if (!groups) {
				console.error(`${this.constructor.name}.listGroups(): Failed to get groups`);
				return w.status(status_codes.INTERNAL_SERVER_ERROR).end();
			}

			w.status(status_codes.OK).json(groups);
		} catch (error) {
			controllerErrorHandler(error, w);
		}
	}

	public async listGroupsByUser(r: Request<{ userId: string }>, w: Response<I_Group[]>) {
		try {
			const userId = uuid_schema.parse(r.params.userId);

			const groups = await this.repository.listGroupsByUser(userId);
			if (!groups) {
				console.error(`${this.constructor.name}.listUsersGroups(): Failed to get groups`);
				return w.status(status_codes.INTERNAL_SERVER_ERROR).end();
			}

			w.status(status_codes.OK).json(groups);
		} catch (error) {
			controllerErrorHandler(error, w);
		}
	}

	public async getGroupById(r: Request<{ id: string }>, w: Response<I_Group>) {
		try {
			const groupId = uuid_schema.parse(r.params.id);

			const group = await this.repository.getGroupById(groupId);
			if (!group) {
				console.error(`${this.constructor.name}.getGroupById(): Error`);
				return w.status(status_codes.INTERNAL_SERVER_ERROR).end();
			}

			w.status(status_codes.OK).json(group);
		} catch (error) {
			controllerErrorHandler(error, w);
		}
	}

	public async joinGroup(r: Request<{ id: string }>, w: Response) {
		try {
			const groupId = uuid_schema.parse(r.params.id);
			const userId = uuid_schema.parse(r.user.id);

			const success = await this.repository.joinGroup(userId, groupId);
			if (!success) {
				console.error(`${this.constructor.name}.joinGroup(): Error`);
				return w.status(status_codes.INTERNAL_SERVER_ERROR).end();
			}

			w.status(status_codes.OK).end();
		} catch (error) {
			controllerErrorHandler(error, w);
		}
	}

	public async leaveGroup(r: Request<{ id: string }>, w: Response) {
		try {
			const groupId = uuid_schema.parse(r.params.id);
			const userId = uuid_schema.parse(r.user.id);

			const success = await this.repository.leaveGroup(userId, groupId);
			if (!success) {
				console.error(`${this.constructor.name}.leaveGroup(): Error`);
				return w.status(status_codes.INTERNAL_SERVER_ERROR).end();
			}

			w.status(status_codes.OK).end();
		} catch (error) {
			controllerErrorHandler(error, w);
		}
	}

	public async changeRole(r: Request<{ groupId: string, recipientId: string }, { newRole: string }>, w: Response) {
		try {
			const groupId = uuid_schema.parse(r.params.groupId);
			const senderId = uuid_schema.parse(r.user.id);
			const recipientId = uuid_schema.parse(r.params.recipientId);

			if (r.body.newRole !== 'member' || r.body.newRole !== 'moderator') {
				throw new Error('Invalid Role');
			}

			const success = await this.repository.changeRole(groupId, senderId, recipientId, r.body.newRole);
			if (!success) {
				console.error(`${this.constructor.name}.changeRole(): Error`);
				return w.status(status_codes.INTERNAL_SERVER_ERROR).end();
			}

			w.status(status_codes.OK).end();
		} catch (error) {
			controllerErrorHandler(error, w);
		}
	}

	public async removeMember(r: Request<{ groupId: string, recipientId: string }>, w: Response) {
		try {
			const groupId = uuid_schema.parse(r.params.groupId);
			const senderId = uuid_schema.parse(r.user.id);
			const recipientId = uuid_schema.parse(r.params.recipientId);

			const success = await this.repository.removeMember(groupId, senderId, recipientId);
			if (!success) {
				console.error(`${this.constructor.name}.removeMember(): Error`);
				return w.status(status_codes.INTERNAL_SERVER_ERROR).end();
			}

			w.status(status_codes.OK).end();
		} catch (error) {
			controllerErrorHandler(error, w);
		}
	}


	public async getMembersByGroupId(r: Request<{ id: string }>, w: Response<I_GroupMemberPopulated[]>) {
		try {
			const groupId = uuid_schema.parse(r.params.id);

			const members = await this.repository.getMembersByGroupId(groupId);
			if (!members) {
				console.error(`${this.constructor.name}.changeRole(): Error`);
				return w.status(status_codes.INTERNAL_SERVER_ERROR).end();
			}

			w.status(status_codes.OK).json(members);
		} catch (error) {
			controllerErrorHandler(error, w);
		}
	}

	public async createPublication(
		r: Request<{}, { id: string }, {
			description: string,
			images: string,
			publication_status: string,
			groupId: string,
		}>,
		w: Response<{ id: string }>) {
		try {
			const data = create_publication_schema.parse({
				publisher_id: uuid_schema.parse(r.user.id),
				description: r.body.description,
				images: r.body.images,
				publication_status: r.body.publication_status,
			});
			const groupId = uuid_schema.parse(r.body.groupId);

			const publicationId = await this.repository.createPublication({...data, groupId});

			w.status(statusCodes.CREATED).json({id: publicationId});
		} catch (error) {
			controllerErrorHandler(error, w);
		}
	}

	public async listPublications(r: Request<{ groupId: string }>, w: Response<I_Publication[]>) {
		try {
			const groupId = uuid_schema.parse(r.params.groupId);

			const publications = await this.repository.listPublications(groupId);
			w.status(statusCodes.OK).json(publications);
		} catch (error) {
			controllerErrorHandler(error, w);
		}
	}

}
