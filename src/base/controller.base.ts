import { ZodError } from "zod";
import { Response } from "express";
import statusCodes from "@instamenta/http-status-codes";
import VLogger, { IVlog } from "@instamenta/vlogger";

export abstract class BaseController<T> {
  protected readonly log: IVlog;

  constructor(
    protected readonly repository: T,
    logger: VLogger,
  ) {
    this.log = logger.getVlogger(this.constructor.name);
  }

  protected errorHandler(error: unknown, response: Response) {
    if (error instanceof ZodError) {
      const formattedError = error.errors.map((issue) => {
        return {
          path: issue.path.join("."),
          message: issue.message,
        };
      });

      this.log.error({e: formattedError, f: 'errorHandler' });
      response.status(statusCodes.BAD_REQUEST).end();
    } else {
      this.log.error({e: error, f: 'errorHandler'});
      response.status(statusCodes.INTERNAL_SERVER_ERROR).end();
    }
  }
}
