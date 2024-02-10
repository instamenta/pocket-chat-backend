import { Request, Response } from 'express';
import PublicationsRepository from '../repositories/publication';
import statusCodes from '@instamenta/http-status-codes';
import { controllerErrorHandler } from '../utilities';
import { create_publication_schema, update_publication_schema, uuid_schema } from "../validators";
import { I_Publication } from '../types/publication';

export default class PublicationController {
	constructor(private readonly repository: PublicationsRepository) {}

	public async listPublications(req: Request, res: Response) {
		try {
			const publications = await this.repository.listPublications();
			res.status(statusCodes.OK).json(publications);
		} catch (error) {
			controllerErrorHandler(error, res);
		}
	}

	public async getPublicationById(req: Request<{ id: string }>, res: Response) {
		try {
			const id = uuid_schema.parse(req.params.id);
			const publication = await this.repository.getPublicationById(id);
			if (!publication) {
				res.status(statusCodes.NOT_FOUND).json({ message: 'Publication not found' });
			} else {
				res.status(statusCodes.OK).json(publication);
			}
		} catch (error) {
			controllerErrorHandler(error, res);
		}
	}

	public async getPublicationsByUserId(req: Request<{ id: string }>, res: Response) {
		try {
			const id = uuid_schema.parse(req.params.id);
			const publications = await this.repository.getPublicationsByUserId(id);
			res.status(statusCodes.OK).json(publications);
		} catch (error) {
			controllerErrorHandler(error, res);
		}
	}

	public async getRecommendations(req: Request, res: Response) {
		try {
			const userId = uuid_schema.parse(req.user.id);
			const recommendations = await this.repository.getRecommendations(userId);
			res.status(statusCodes.OK).json(recommendations);
		} catch (error) {
			controllerErrorHandler(error, res);
		}
	}

	public async createPublication(req: Request, res: Response) {
		try {
			const data = create_publication_schema.parse({
				publisher_id: uuid_schema.parse(req.user.id),
				description: req.body.description,
				images: req.body.images,
				publication_status: req.body.publication_status,
			});
			const publicationId = await this.repository.createPublication(data);

			res.status(statusCodes.CREATED).json({ id: publicationId });
		} catch (error) {
			controllerErrorHandler(error, res);
		}
	}

	public async updatePublication(req: Request<{ id: string }>, res: Response) {
		try {
			const id = uuid_schema.parse(req.params.id);
			const publicationData = update_publication_schema.parse(req.body);
			const updatedPublicationId = await this.repository.updatePublication(id, publicationData);

			res.status(statusCodes.OK).json({ id: updatedPublicationId });
		} catch (error) {
			controllerErrorHandler(error, res);
		}
	}

	public async likePublication(req: Request<{ id: string }>, res: Response) {
		try {
			const publicationId = uuid_schema.parse(req.params.id);
			const userId = uuid_schema.parse(req.user.id);
			await this.repository.likePublication(publicationId, userId);
			res.status(statusCodes.OK).end();
		} catch (error) {
			controllerErrorHandler(error, res);
		}
	}
}
