import {ZodError} from "zod";
import status_codes from "@instamenta/http-status-codes";
import {Response} from "express";

export default class ControllerBase<T> {
	protected readonly repository: T

	constructor(repository: T) {
		this.repository = repository;
	}

	errorHandler(error: ZodError | unknown, w: Response) {
		if (error instanceof ZodError) {
			console.error(error.errors.map((err) => ({
				path: err.path.join('.'),
				message: err.message,
			})));
			w.status(status_codes.BAD_REQUEST).end();
		} else {
			console.error(error);
			w.status(status_codes.INTERNAL_SERVER_ERROR).end()
		}
	}
}