import { PublicationStatus } from "../utilities/enumerations";
export interface PublicationStruct {
    id: string;
    createdAt: string;
    updatedAt: string;
    publicationStatus: PublicationStatus;
    images: string[];
    description: string;
    publisherId: string;
    likesCount: number;
    commentsCount: number;
    publisher: string;
    groupId?: string;
}
export interface RecommendationPublicationStruct {
    id: string;
    createdAt: string;
    updatedAt: string;
    publicationStatus: PublicationStatus;
    images: string[];
    description: string;
    publisherId: string;
    likesCount: number;
    commentsCount: number;
    publisher: string;
    username: string;
    picture: string;
    likedByUser: boolean;
    firstName: string;
    lastName: string;
    groupId?: string;
}
//# sourceMappingURL=publications.d.ts.map