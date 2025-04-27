import {Client} from "pg";
import VLogger, {IVlog} from "@instamenta/vlogger";

export abstract class BaseRepository {
	protected readonly log: IVlog;

	constructor(
		protected readonly database: Client,
		logger: VLogger
	) {
		this.log = logger.getVlogger(this.constructor.name);
	}

	protected errorHandler(error: unknown, method: string): never {
		throw new Error(`${this.constructor.name}.${method}(): Error`, {cause: error});
	}
}