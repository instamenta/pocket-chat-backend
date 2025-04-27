import { group_roles } from "../utilities/enumerations";
export interface Group {
    id: string;
    owner_id: string;
    name: string;
    description: string;
    created_at: string;
    members_count: number;
    image_url: string;
}
export interface Member {
    id: string;
    group_id: string;
    user_id: string;
    member_since: string;
    role: group_roles;
}
export interface MemberPopulated {
    user_id: string;
    username: string;
    first_name: string;
    last_name: string;
    picture: string;
    role: group_roles;
    member_since: string;
}
//# sourceMappingURL=group.d.ts.map