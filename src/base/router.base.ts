import {Router} from 'express';
import {NotImplementedError} from '@instamenta/vanilla-utility-pack'

export default class RouterBase<T> {
	protected router: Router = Router();

	constructor(controller: T) {
		this.initializeRoutes(controller);
	}

	initializeRoutes(c: T) {
		throw new NotImplementedError(`${this.constructor.name}.initializeRoutes(): Is not implemented`);
	}

	getRouter(): Router {
		return this.router;
	}
}