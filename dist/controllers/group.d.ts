import { GroupRepository } from "../repositories";
import { BaseController } from "../base/controller.base";
import type { Request, Response } from "express";
import type { GroupStruct, MemberPopulated } from "../types/group";
import type { PublicationStruct } from "../types/publication";
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
    listGroups(request: Request, response: Response<GroupStruct[]>): Promise<void>;
    listGroupsByUser(request: Request<{
        userId: string;
    }>, response: Response<GroupStruct[]>): Promise<void>;
    getGroupById(request: Request<{
        id: string;
    }>, response: Response<GroupStruct>): Promise<Response<GroupStruct, Record<string, any>> | undefined>;
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
    }>, response: Response<MemberPopulated[]>): Promise<void>;
    createPublication(request: Request<object, {
        id: string;
    }, Pick<PublicationStruct, "publisherId" | "description" | "images" | "publicationStatus" | "groupId">>, response: Response<{
        id: string;
    }>): Promise<void>;
    listPublications(request: Request<{
        groupId: string;
    }>, response: Response<PublicationStruct[]>): Promise<void>;
}
//# sourceMappingURL=group.d.ts.map