import { Request, Response } from 'express';
import { PublicationRepository } from '../repositories/publication';
import { Notificator } from "../utilities/notificator";
import { BaseController } from "../base/controller.base";
import * as T from '../types';
import VLogger from "@instamenta/vlogger";
export declare class PublicationController extends BaseController<PublicationRepository> {
    private readonly notificator;
    constructor(repository: PublicationRepository, logger: VLogger, notificator: Notificator);
    listPublications(request: Request, response: Response<T.Publication.Publication[]>): Promise<void>;
    getPublicationById(request: Request<{
        id: string;
    }>, response: Response<T.Publication.Publication>): Promise<void>;
    getPublicationsByUserId(request: Request<{
        id: string;
    }>, response: Response<T.Publication.Publication[]>): Promise<void>;
    getPublicationsCountByUserId(request: Request<{
        id: string;
    }>, response: Response<{
        count: number;
    }>): Promise<void>;
    getRecommendations(request: Request, response: Response<T.Publication.Publication[]>): Promise<void>;
    createPublication(request: Request<object, {
        id: string;
    }, {
        description: string;
        images: string;
        publication_status: string;
    }>, response: Response<{
        id: string;
    }>): Promise<void>;
    updatePublication(request: Request<{
        id: string;
    }>, response: Response<{
        id: string;
    }>): Promise<void>;
    likePublication(request: Request<{
        id: string;
    }>, response: Response<void>): Promise<void>;
}
//# sourceMappingURL=publication.d.ts.map