import * as U from "./unions";
export interface Friendship {
    id: string;
    sender_id: string;
    created_at: string;
    recipient_id: string;
    friendship_status: U.FriendshipStatus;
}
export interface Mutual {
    user_id: string;
    first_name: string;
    last_name: string;
    username: string;
}
export interface RequestData {
    id: string;
    first_name: string;
    last_name: string;
    picture: string;
    username: string;
    request_date: string;
    request_type: 'sent' | 'received';
}
//# sourceMappingURL=friend.d.ts.map