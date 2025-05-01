import { FriendshipStatusUnion } from "./unions";
export interface FriendshipStruct {
    id: string;
    sender_id: string;
    created_at: string;
    recipient_id: string;
    friendship_status: FriendshipStatusUnion;
}
export interface MutualFriendshipStruct {
    user_id: string;
    first_name: string;
    last_name: string;
    username: string;
}
export interface FriendshipRequestStruct {
    id: string;
    first_name: string;
    last_name: string;
    picture: string;
    username: string;
    request_date: string;
    request_type: "sent" | "received";
}
//# sourceMappingURL=friend.d.ts.map