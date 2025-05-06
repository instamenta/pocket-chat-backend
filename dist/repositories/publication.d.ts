import { BaseRepository } from "../base/repository.base";
import type { PublicationStruct, RecommendationPublicationStruct } from "../types/publication";
export declare class PublicationRepository extends BaseRepository {
    listPublications(): Promise<PublicationStruct[]>;
    getPublicationById(id: string): Promise<PublicationStruct | null>;
    getPublicationsByUserId(userId: string): Promise<RecommendationPublicationStruct[]>;
    getPublicationsCountByUserId(userId: string): Promise<number>;
    getRecommendations(userId: string): Promise<PublicationStruct[]>;
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