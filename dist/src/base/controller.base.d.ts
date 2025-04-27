import { ZodError } from "zod";
import { Response } from "express";
import VLogger, { IVlog } from "@instamenta/vlogger";
export default class BaseController<T> {
    protected readonly repository: T;
    protected readonly log: IVlog;
    constructor(repository: T, logger: VLogger);
    protected errorHandler(error: ZodError | unknown, response: Response): void;
}
//# sourceMappingURL=controller.base.d.ts.map