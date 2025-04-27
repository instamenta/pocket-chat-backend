import { Client } from "pg";
import VLogger, { IVlog } from "@instamenta/vlogger";
export declare abstract class BaseRepository {
    protected readonly database: Client;
    protected readonly log: IVlog;
    constructor(database: Client, logger: VLogger);
    protected errorHandler(error: unknown, method: string): never;
}
//# sourceMappingURL=repository.base.d.ts.map