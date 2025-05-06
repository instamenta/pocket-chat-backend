import { BaseRepository } from "../base/repository.base";
import { GroupStruct, MemberPopulated } from "../types/group";
import { PublicationStruct, RecommendationPublicationStruct } from "../types/publication";
export declare class GroupRepository extends BaseRepository {
    createGroup(userId: string, name: string, description: string, imageUrl: string): Promise<string>;
    removeGroup(userId: string, groupId: string): Promise<boolean>;
    listGroups(userId: string): Promise<GroupStruct[]>;
    listGroupsByUser(userId: string): Promise<GroupStruct[]>;
    joinGroup(userId: string, groupId: string): Promise<boolean>;
    leaveGroup(userId: string, groupId: string): Promise<boolean>;
    changeRole(senderId: string, groupId: string, recipientId: string, newRole: "moderator" | "member"): Promise<boolean>;
    removeMember(senderId: string, groupId: string, recipientId: string): Promise<boolean>;
    getGroupById(groupId: string): Promise<GroupStruct | null>;
    getMembersByGroupId(groupId: string): Promise<MemberPopulated[]>;
    listPublications(groupId: string): Promise<RecommendationPublicationStruct[]>;
    createPublication({ publisherId, description, images, publicationStatus, groupId, }: Pick<PublicationStruct, "publisherId" | "description" | "images" | "publicationStatus" | "groupId">): Promise<string>;
}
//# sourceMappingURL=group.d.ts.map