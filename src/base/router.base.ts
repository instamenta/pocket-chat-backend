import {NotImplementedError} from '@instamenta/vanilla-utility-pack';
import {Router} from "express";

export default class BaseRouter<T> {
	protected router: Router = Router();

	constructor(controller: T) {
		this.initialize(controller);
	}

	protected initialize(c: T): void {
		throw new NotImplementedError(`Implement "${this.constructor.name}.initialize()"`);
	}

	public getRouter(): Router {
		return this.router;
	}
}