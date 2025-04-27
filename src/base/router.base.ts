import {Router} from "express";

export default abstract class BaseRouter<T> {
	public readonly router: Router = Router();

	constructor(controller: T) {
		this.initialize(controller);
	}

	protected abstract initialize(controller: T): void;
}