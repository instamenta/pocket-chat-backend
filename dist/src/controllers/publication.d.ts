import { Request, Response } from 'express';
import PublicationsRepository from '../repositories/publication';
import Notificator from "../utilities/notificator";
import BaseController from "../base/controller.base";
import * as T from '../types';
import VLogger from "@instamenta/vlogger";
export default class PublicationController extends BaseController<PublicationsRepository> {
    private readonly notificator;
    constructor(repository: PublicationsRepository, logger: VLogger, notificator: Notificator);
    listPublications(r: Request, w: Response<T.Publication.Publication[]>): Promise<void>;
    getPublicationById(r: Request<{
        id: string;
    }>, w: Response<T.Publication.Publication>): Promise<void>;
    getPublicationsByUserId(r: Request<{
        id: string;
    }>, w: Response<T.Publication.Publication[]>): Promise<void>;
    getPublicationsCountByUserId(r: Request<{
        id: string;
    }>, w: Response<{
        count: number;
    }>): Promise<void>;
    getRecommendations(r: Request, w: Response<T.Publication.Publication[]>): Promise<void>;
    createPublication(r: Request<{}, {
        id: string;
    }, {
        description: string;
        images: string;
        publication_status: string;
    }, {}>, w: Response<{
        id: string;
    }>): Promise<void>;
    updatePublication(r: Request<{
        id: string;
    }>, w: Response<{
        id: string;
    }>): Promise<void>;
    likePublication(r: Request<{
        id: string;
    }>, w: Response<void>): Promise<void>;
}
//# sourceMappingURL=publication.d.ts.map