import { Request, Response } from "express";
import { PublicationRepository } from "../repositories";
import { Notificator } from "../utilities/notificator";
import { BaseController } from "../base/controller.base";
import * as T from "../types";
import VLogger from "@instamenta/vlogger";
export declare class PublicationController extends BaseController<PublicationRepository> {
    private readonly notificator;
    constructor(repository: PublicationRepository, logger: VLogger, notificator: Notificator);
    listPublications(_request: Request, response: Response<T.Publication.PublicationStruct[]>): Promise<void>;
    getPublicationById(request: Request<{
        id: string;
    }>, response: Response<T.Publication.PublicationStruct>): Promise<void>;
    getPublicationsByUserId(request: Request<{
        id: string;
    }>, response: Response<T.Publication.PublicationStruct[]>): Promise<void>;
    getPublicationsCountByUserId(request: Request<{
        id: string;
    }>, response: Response<{
        count: number;
    }>): Promise<void>;
    getRecommendations(request: Request, response: Response<T.Publication.PublicationStruct[]>): Promise<void>;
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