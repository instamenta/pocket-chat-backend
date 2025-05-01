import { BaseRepository } from "../base/repository.base";
import * as T from "../types";
export declare class PublicationRepository extends BaseRepository {
    listPublications(): Promise<T.Publication.PublicationStruct[]>;
    getPublicationById(id: string): Promise<T.Publication.PublicationStruct | null>;
    getPublicationsByUserId(userId: string): Promise<T.Publication.RecommendationPublicationStruct[]>;
    getPublicationsCountByUserId(userId: string): Promise<number>;
    getRecommendations(userId: string): Promise<T.Publication.PublicationStruct[]>;
    createPublication({ publisherId, description, images, publicationStatus, }: {
        publisherId: string;
        description: string;
        images: string[];
        publicationStatus: string;
    }): Promise<string>;
    updatePublication(id: string, publicationData: {
        content?: string;
        images?: string[];
        publication_status?: string;
    }): Promise<string>;
    likePublication(publicationId: string, userId: string): Promise<void>;
}
//# sourceMappingURL=publication.d.ts.map