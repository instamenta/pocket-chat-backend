import { PublicationStatus } from "../utilities/enumerations";

export interface PublicationStruct {
  id: string;
  created_at: string;
  updated_at: string;
  publication_status: PublicationStatus;
  images: string[];
  description: string;
  publisher_id: string;
  likes_count: number;
  comments_count: number;
  publisher: string;
  group_id?: string;
}

export interface RecommendationPublicationStruct {
  id: string;
  created_at: string;
  updated_at: string;
  publication_status: PublicationStatus;
  images: string[];
  description: string;
  publisher_id: string;
  likes_count: number;
  comments_count: number;
  publisher: string;
  username: string;
  picture: string;
  liked_by_user: boolean;
  first_name: string;
  last_name: string;
  group_id?: string;
}
