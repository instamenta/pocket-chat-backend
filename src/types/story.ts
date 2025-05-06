import { StoryVisibilityUnion } from "./union";

export interface StoryStruct {
  id: string;
  userId: string;
  imageUrl: string;
  createdAt: string;
  visibility: StoryVisibilityUnion;
  likesCount: number;
  commentsCount: number;
}

export interface StoryFeedStruct {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  userPicture: string;
  imageUrl: string;

  commentsCount: number;
  likesCount: number;
}

export type FullStoryStruct =
  | StoryStruct
  | {
      userPicture: string;
      userUsername: string;
    };
