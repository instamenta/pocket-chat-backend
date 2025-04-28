import { BaseRepository } from "../base/repository.base";
import * as T from "../types";
export declare class GroupRepository extends BaseRepository {
    createGroup(userId: string, name: string, description: string, imageUrl: string): Promise<string>;
    removeGroup(userId: string, groupId: string): Promise<boolean>;
    listGroups(userId: string): Promise<T.Group.Group[]>;
    listGroupsByUser(userId: string): Promise<T.Group.Group[]>;
    joinGroup(userId: string, groupId: string): Promise<boolean>;
    leaveGroup(userId: string, groupId: string): Promise<boolean>;
    changeRole(senderId: string, groupId: string, recipientId: string, newRole: "moderator" | "member"): Promise<boolean>;
    removeMember(senderId: string, groupId: string, recipientId: string): Promise<boolean>;
    getGroupById(groupId: string): Promise<T.Group.Group | null>;
    getMembersByGroupId(groupId: string): Promise<T.Group.MemberPopulated[]>;
    listPublications(groupId: string): Promise<T.Publication.Recommendation[]>;
    createPublication({ publisherId, description, images, publicationStatus, groupId, }: {
        publisherId: string;
        description: string;
        images: string[];
        publicationStatus: string;
        groupId: string;
    }): Promise<string>;
}
//# sourceMappingURL=group.d.ts.map