import {Request, Response} from 'express';
import PublicationsRepository from '../repositories/publication';
import statusCodes from '@instamenta/http-status-codes';
import {controllerErrorHandler} from '../utilities';
import {create_publication_schema, update_publication_schema, uuid_schema} from "../validators";
import {I_Publication} from "../types/publication";
import NotificationRepository from "../repositories/notification";

export default class PublicationController {
	constructor(
		private readonly repository: PublicationsRepository,
		private readonly notification: NotificationRepository
	) {
	}

	public async listPublications(r: Request, w: Response<I_Publication[]>) {
		try {
			const publications = await this.repository.listPublications();

			w.status(statusCodes.OK).json(publications);
		} catch (error) {
			controllerErrorHandler(error, w);
		}
	}

	public async getPublicationById(r: Request<{ id: string }>, w: Response<I_Publication>) {
		try {
			const id = uuid_schema.parse(r.params.id);

			const publication = await this.repository.getPublicationById(id);

			!publication
				? w.status(statusCodes.NOT_FOUND).end()
				: w.status(statusCodes.OK).json(publication);
		} catch (error) {
			controllerErrorHandler(error, w);
		}
	}

	public async getPublicationsByUserId(r: Request<{ id: string }>, w: Response<I_Publication[]>) {
		console.log()
		try {
			const id = uuid_schema.parse(r.params.id);

			const publications = await this.repository.getPublicationsByUserId(id);

			w.status(statusCodes.OK).json(publications);
		} catch (error) {
			controllerErrorHandler(error, w);
		}
	}

	public async getRecommendations(r: Request, w: Response<I_Publication[]>) {
		try {
			const userId = uuid_schema.parse(r.user.id);

			const recommendations = await this.repository.getRecommendations(userId);

			w.status(statusCodes.OK).json(recommendations);
		} catch (error) {
			controllerErrorHandler(error, w);
		}
	}

	public async createPublication(
		r: Request<{}, { id: string }, {
			description: string,
			images: string,
			publication_status: string
		}, {}>,
		w: Response<{ id: string }>) {
		try {
			const data = create_publication_schema.parse({
				publisher_id: uuid_schema.parse(r.user.id),
				description: r.body.description,
				images: r.body.images,
				publication_status: r.body.publication_status,
			});

			const publicationId = await this.repository.createPublication(data);

			w.status(statusCodes.CREATED).json({id: publicationId});
		} catch (error) {
			controllerErrorHandler(error, w);
		}
	}

	public async updatePublication(r: Request<{ id: string }>, w: Response<{ id: string }>) {
		try {
			const id = uuid_schema.parse(r.params.id);
			const publicationData = update_publication_schema.parse(r.body);

			const updatedPublicationId = await this.repository.updatePublication(id, publicationData);

			w.status(statusCodes.OK).json({id: updatedPublicationId});
		} catch (error) {
			controllerErrorHandler(error, w);
		}
	}

	public async likePublication(r: Request<{ id: string }>, w: Response<void>) {
		try {
			const publicationId = uuid_schema.parse(r.params.id);
			const userId = uuid_schema.parse(r.user.id);

			await this.repository.likePublication(publicationId, userId);

			w.status(statusCodes.OK).end();
		} catch (error) {
			controllerErrorHandler(error, w);
		}
	}
}
