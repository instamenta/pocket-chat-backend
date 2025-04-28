import { Request, Response } from "express";
import { PublicationRepository } from "../repositories";
import statusCodes from "@instamenta/http-status-codes";
import { NotificationTypes } from "../utilities/enumerations";
import { Notificator } from "../utilities/notificator";
import { BaseController } from "../base/controller.base";
import * as Validate from "../validators";
import * as T from "../types";
import VLogger from "@instamenta/vlogger";

export class PublicationController extends BaseController<PublicationRepository> {
  constructor(
    repository: PublicationRepository,
    logger: VLogger,
    private readonly notificator: Notificator,
  ) {
    super(repository, logger);
  }

  public async listPublications(
    _request: Request,
    response: Response<T.Publication.Publication[]>,
  ) {
    try {
      const publications = await this.repository.listPublications();

      response.status(statusCodes.OK).json(publications);
    } catch (error) {
      this.errorHandler(error, response);
    }
  }

  public async getPublicationById(
    request: Request<{ id: string }>,
    response: Response<T.Publication.Publication>,
  ) {
    try {
      const id = Validate.uuid.parse(request.params.id);

      const publication = await this.repository.getPublicationById(id);

      if (publication) {
        response.status(statusCodes.OK).json(publication);
      } else {
        response.status(statusCodes.NOT_FOUND).end();
      }
    } catch (error) {
      this.errorHandler(error, response);
    }
  }

  public async getPublicationsByUserId(
    request: Request<{ id: string }>,
    response: Response<T.Publication.Publication[]>,
  ) {
    try {
      const id = Validate.uuid.parse(request.params.id);

      const publications = await this.repository.getPublicationsByUserId(id);

      response.status(statusCodes.OK).json(publications);
    } catch (error) {
      this.errorHandler(error, response);
    }
  }

  public async getPublicationsCountByUserId(
    request: Request<{ id: string }>,
    response: Response<{ count: number }>,
  ) {
    try {
      const id = Validate.uuid.parse(request.params.id);

      const count = await this.repository.getPublicationsCountByUserId(id);

      response.status(statusCodes.OK).json({ count });
    } catch (error) {
      this.errorHandler(error, response);
    }
  }

  public async getRecommendations(
    request: Request,
    response: Response<T.Publication.Publication[]>,
  ) {
    try {
      const userId = Validate.uuid.parse(request.user.id);

      const recommendations = await this.repository.getRecommendations(userId);

      response.status(statusCodes.OK).json(recommendations);
    } catch (error) {
      this.errorHandler(error, response);
    }
  }

  public async createPublication(
    request: Request<
      object,
      { id: string },
      {
        description: string;
        images: string;
        publication_status: string;
      }
    >,
    response: Response<{ id: string }>,
  ) {
    try {
      const data = Validate.createPublication.parse({
        publisherId: Validate.uuid.parse(request.user.id),
        description: request.body.description,
        images: request.body.images,
        publicationStatus: request.body.publication_status,
      });

      const publicationId = await this.repository.createPublication(data);

      response.status(statusCodes.CREATED).json({ id: publicationId });
    } catch (error) {
      this.errorHandler(error, response);
    }
  }

  public async updatePublication(
    request: Request<{ id: string }>,
    response: Response<{ id: string }>,
  ) {
    try {
      const id = Validate.uuid.parse(request.params.id);
      const publicationData = Validate.updatePublication.parse(request.body);

      const updatedPublicationId = await this.repository.updatePublication(
        id,
        publicationData,
      );

      response.status(statusCodes.OK).json({ id: updatedPublicationId });
    } catch (error) {
      this.errorHandler(error, response);
    }
  }

  public async likePublication(
    request: Request<{ id: string }>,
    response: Response<void>,
  ) {
    try {
      const publicationId = Validate.uuid.parse(request.params.id);
      const userId = Validate.uuid.parse(request.user.id);

      await this.repository.likePublication(publicationId, userId);

      response.status(statusCodes.OK).end();

      await this.notificator
        .handleNotification({
          type: NotificationTypes.LIKE,
          referenceId: publicationId,
          recipientId: "",
          senderId: userId,
          content: "",
          seen: false,
        })
        .catch((error: unknown) => {
          this.log.error({ e: error, f: 'likePublication'});
        });
    } catch (error) {
      this.errorHandler(error, response);
    }
  }
}
