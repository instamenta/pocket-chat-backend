import {Client} from "pg";
import Logger, {IVlog} from "@instamenta/vlogger";

export default class RepositoryBase {
	protected readonly database: Client;
	protected readonly log: IVlog;

	constructor(database: Client, logger: Logger) {
		this.database = database;
		this.log = logger.getVlogger(this.constructor.name);
	}

	protected errorHandler(error: unknown | Error, method: string): never {
		throw new Error(
			`${this.constructor.name}.${method}(): Error`,
			{cause: error}
		);
	}
}