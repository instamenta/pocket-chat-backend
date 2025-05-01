import { FriendshipStatusUnion } from "./unions";

export interface FriendshipStruct {
  id: string;
  senderId: string;
  createdAt: string;
  recipientId: string;
  friendshipStatus: FriendshipStatusUnion;
}

export interface MutualFriendshipStruct {
  userId: string;
  firstName: string;
  lastName: string;
  username: string;
}

export interface FriendshipRequestStruct {
  id: string;
  firstName: string;
  lastName: string;
  picture: string;
  username: string;
  requestDate: string;
  requestType: "sent" | "received";
}
