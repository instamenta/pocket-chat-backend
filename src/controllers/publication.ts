import {Request, Response} from 'express';
import PublicationsRepository from '../repositories/publication';
import statusCodes from '@instamenta/http-status-codes';
import {notification_types} from "../utilities/enumerations";
import Notificator from "../utilities/notificator";
import BaseController from "../base/controller.base";
import Validate from "../validators";
import * as T from '../types'
import VLogger from "@instamenta/vlogger";

export default class PublicationController extends BaseController<PublicationsRepository> {
	constructor(
		repository: PublicationsRepository,
		logger: VLogger,
		private readonly notificator: Notificator,
	) {
		super(repository, logger);
	}

	public async listPublications(r: Request, w: Response<T.Publication.Publication[]>) {
		try {
			const publications = await this.repository.listPublications();

			w.status(statusCodes.OK).json(publications);
		} catch (error) {
			this.errorHandler(error, w);
		}
	}

	public async getPublicationById(r: Request<{ id: string }>, w: Response<T.Publication.Publication>) {
		try {
			const id = Validate.uuid.parse(r.params.id);

			const publication = await this.repository.getPublicationById(id);

			!publication
				? w.status(statusCodes.NOT_FOUND).end()
				: w.status(statusCodes.OK).json(publication);
		} catch (error) {
			this.errorHandler(error, w);
		}
	}

	public async getPublicationsByUserId(r: Request<{ id: string }>, w: Response<T.Publication.Publication[]>) {
		try {
			const id = Validate.uuid.parse(r.params.id);

			const publications = await this.repository.getPublicationsByUserId(id);

			w.status(statusCodes.OK).json(publications);
		} catch (error) {
			this.errorHandler(error, w);
		}
	}

	public async getPublicationsCountByUserId(r: Request<{ id: string }>, w: Response<{ count: number }>) {
		try {
			const id = Validate.uuid.parse(r.params.id);

			const count = await this.repository.getPublicationsCountByUserId(id);

			w.status(statusCodes.OK).json({count});
		} catch (error) {
			this.errorHandler(error, w);
		}
	}

	public async getRecommendations(r: Request, w: Response<T.Publication.Publication[]>) {
		try {
			const userId = Validate.uuid.parse(r.user.id);

			const recommendations = await this.repository.getRecommendations(userId);

			w.status(statusCodes.OK).json(recommendations);
		} catch (error) {
			this.errorHandler(error, w);
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
			const data = Validate.create_publication.parse({
				publisher_id: Validate.uuid.parse(r.user.id),
				description: r.body.description,
				images: r.body.images,
				publication_status: r.body.publication_status,
			});

			const publicationId = await this.repository.createPublication(data);

			w.status(statusCodes.CREATED).json({id: publicationId});
		} catch (error) {
			this.errorHandler(error, w);
		}
	}

	public async updatePublication(r: Request<{ id: string }>, w: Response<{ id: string }>) {
		try {
			const id = Validate.uuid.parse(r.params.id);
			const publicationData = Validate.update_publication.parse(r.body);

			const updatedPublicationId = await this.repository.updatePublication(id, publicationData);

			w.status(statusCodes.OK).json({id: updatedPublicationId});
		} catch (error) {
			this.errorHandler(error, w);
		}
	}

	public async likePublication(r: Request<{ id: string }>, w: Response<void>) {
		try {
			const publicationId = Validate.uuid.parse(r.params.id);
			const userId = Validate.uuid.parse(r.user.id);

			await this.repository.likePublication(publicationId, userId);

			w.status(statusCodes.OK).end();

			await this.notificator.handleNotification({
				type: notification_types.LIKE,
				reference_id: publicationId,
				recipient_id: '',
				sender_id: userId,
				content: '',
				seen: false,
			}).catch(console.error);

		} catch (error) {
			this.errorHandler(error, w);
		}
	}
}
