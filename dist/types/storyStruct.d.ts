import { StoryVisibilityUnion } from "./unions";
export interface StoryStruct {
    id: string;
    user_id: string;
    image_url: string;
    created_at: string;
    visibility: StoryVisibilityUnion;
    likes_count: number;
    comments_count: number;
}
export interface StoryFeedStruct {
    id: string;
    username: string;
    first_name: string;
    last_name: string;
    user_picture: string;
    image_url: string;
    comments_count: number;
    likes_count: number;
}
export type FullStoryStruct = StoryStruct | {
    user_picture: string;
    user_username: string;
};
//# sourceMappingURL=storyStruct.d.ts.map