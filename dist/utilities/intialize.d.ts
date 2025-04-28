import { Client } from "pg";
import Redis from "ioredis";
import VLogger from "@instamenta/vlogger";
export declare function initializeAll(): Promise<{
    api: import("express-serve-static-core").Express;
    database: Client;
    cache: Redis;
    logger: VLogger;
}>;
//# sourceMappingURL=intialize.d.ts.map