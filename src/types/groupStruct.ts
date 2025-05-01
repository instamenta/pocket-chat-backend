import { GroupRoles } from "../utilities/enumerations";

export interface GroupStruct {
  id: string;
  owner_id: string;
  name: string;
  description: string;
  created_at: string;
  members_count: number;
  image_url: string;
}

export interface MemberPopulated {
  user_id: string;
  username: string;
  first_name: string;
  last_name: string;
  picture: string;
  role: GroupRoles;
  member_since: string;
}
