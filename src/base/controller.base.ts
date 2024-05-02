import {ZodError} from "zod";
import {Response} from "express";
import status_codes from "@instamenta/http-status-codes";
import VLogger, {IVlog} from "@instamenta/vlogger";

export default class BaseController<T> {
	protected readonly log: IVlog;

	constructor(
		protected readonly repository: T,
		logger: VLogger
	) {
		this.log = logger.getVlogger(this.constructor.name);
	}

	protected errorHandler(error: ZodError | unknown, response: Response) {
		if (error instanceof ZodError) {
			const formattedError = error.errors.map((issue) => {
				return {
					path: issue.path.join('.'),
					message: issue.message,
				};
			});

			console.error(formattedError);
			response.status(status_codes.BAD_REQUEST).end();
		} else {
			console.error(error);
			response.status(status_codes.INTERNAL_SERVER_ERROR).end()
		}
	}
}