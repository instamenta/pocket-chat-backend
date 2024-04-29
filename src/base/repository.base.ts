import {Client} from "pg";

export default class BaseRepository {
	constructor(protected readonly database: Client) {
	}

	protected errorHandler(error: unknown | Error, method: string): never {
		throw new Error(`${this.constructor.name}.${method}(): Error`, {cause: error});
	}
}