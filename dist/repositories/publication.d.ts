import { BaseRepository } from "../base/repository.base";
import * as T from "../types";
export declare class PublicationRepository extends BaseRepository {
    listPublications(): Promise<T.Publication.Publication[]>;
    getPublicationById(id: string): Promise<T.Publication.Publication | null>;
    getPublicationsByUserId(userId: string): Promise<T.Publication.Recommendation[]>;
    getPublicationsCountByUserId(userId: string): Promise<number>;
    getRecommendations(userId: string): Promise<T.Publication.Publication[]>;
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