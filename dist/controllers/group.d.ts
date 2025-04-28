import { Request, Response } from "express";
import { GroupRepository } from "../repositories/group";
import { BaseController } from "../base/controller.base";
import * as T from "../types";
export declare class GroupController extends BaseController<GroupRepository> {
    createGroup(request: Request<object, {
        id: string;
    }, {
        name: string;
        description: string;
        imageUrl: string;
    }>, response: Response<{
        id: string;
    }>): Promise<Response<{
        id: string;
    }, Record<string, any>> | undefined>;
    removeGroup(request: Request<{
        groupId: string;
    }>, response: Response): Promise<Response<any, Record<string, any>> | undefined>;
    listGroups(request: Request, response: Response<T.Group.Group[]>): Promise<void>;
    listGroupsByUser(request: Request<{
        userId: string;
    }>, response: Response<T.Group.Group[]>): Promise<void>;
    getGroupById(request: Request<{
        id: string;
    }>, response: Response<T.Group.Group>): Promise<Response<T.Group.Group, Record<string, any>> | undefined>;
    joinGroup(request: Request<{
        id: string;
    }>, response: Response): Promise<Response<any, Record<string, any>> | undefined>;
    leaveGroup(request: Request<{
        id: string;
    }>, response: Response): Promise<Response<any, Record<string, any>> | undefined>;
    changeRole(request: Request<{
        groupId: string;
        recipientId: string;
    }, object, {
        newRole: string;
    }>, response: Response): Promise<Response<any, Record<string, any>> | undefined>;
    removeMember(request: Request<{
        groupId: string;
        recipientId: string;
    }>, response: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getMembersByGroupId(request: Request<{
        id: string;
    }>, response: Response<T.Group.MemberPopulated[]>): Promise<void>;
    createPublication(request: Request<object, {
        id: string;
    }, {
        description: string;
        images: string;
        publication_status: string;
        groupId: string;
    }>, response: Response<{
        id: string;
    }>): Promise<void>;
    listPublications(request: Request<{
        groupId: string;
    }>, response: Response<T.Publication.Publication[]>): Promise<void>;
}
//# sourceMappingURL=group.d.ts.map