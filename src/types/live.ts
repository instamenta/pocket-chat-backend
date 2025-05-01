import { LiveStatesUnion } from "./unions";

export interface PopulatedLiveStruct {
  user_id: string;
  user_picture: string;
  username: string;
  first_name: string;
  last_name: string;
  state: LiveStatesUnion;
  created_at: string;
  id: string;
}

export interface PopulatedLiveMessageStruct {
  message_id: string;
  user_id: string;
  user_picture: string;
  username: string;
  first_name: string;
  last_name: string;
  content: string;
  live_id: string;
  created_at: string;
}
