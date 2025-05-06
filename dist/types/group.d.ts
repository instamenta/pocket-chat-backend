import { GroupRoles } from "../utilities/enumerations";
export interface GroupStruct {
    id: string;
    ownerId: string;
    name: string;
    description: string;
    createdAt: string;
    membersCount: number;
    imageUrl: string;
}
export interface MemberPopulated {
    userId: string;
    username: string;
    firstName: string;
    lastName: string;
    picture: string;
    role: GroupRoles;
    memberSince: string;
}
//# sourceMappingURL=group.d.ts.map