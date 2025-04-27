import { Request, Response } from "express";
import GroupRepository from "../repositories/group";
import BaseController from "../base/controller.base";
import * as T from '../types';
export default class GroupController extends BaseController<GroupRepository> {
    createGroup(r: Request<object, {
        id: string;
    }, {
        name: string;
        description: string;
        imageUrl: string;
    }>, w: Response<{
        id: string;
    }>): Promise<Response<{
        id: string;
    }, Record<string, any>> | undefined>;
    removeGroup(r: Request<{
        groupId: string;
    }>, w: Response): Promise<Response<any, Record<string, any>> | undefined>;
    listGroups(r: Request, w: Response<T.Group.Group[]>): Promise<void>;
    listGroupsByUser(r: Request<{
        userId: string;
    }>, w: Response<T.Group.Group[]>): Promise<void>;
    getGroupById(r: Request<{
        id: string;
    }>, w: Response<T.Group.Group>): Promise<Response<T.Group.Group, Record<string, any>> | undefined>;
    joinGroup(r: Request<{
        id: string;
    }>, w: Response): Promise<Response<any, Record<string, any>> | undefined>;
    leaveGroup(r: Request<{
        id: string;
    }>, w: Response): Promise<Response<any, Record<string, any>> | undefined>;
    changeRole(r: Request<{
        groupId: string;
        recipientId: string;
    }, object, {
        newRole: string;
    }>, w: Response): Promise<Response<any, Record<string, any>> | undefined>;
    removeMember(r: Request<{
        groupId: string;
        recipientId: string;
    }>, w: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getMembersByGroupId(r: Request<{
        id: string;
    }>, w: Response<T.Group.MemberPopulated[]>): Promise<void>;
    createPublication(r: Request<object, {
        id: string;
    }, {
        description: string;
        images: string;
        publication_status: string;
        groupId: string;
    }>, w: Response<{
        id: string;
    }>): Promise<void>;
    listPublications(r: Request<{
        groupId: string;
    }>, w: Response<T.Publication.Publication[]>): Promise<void>;
}
//# sourceMappingURL=group.d.ts.map