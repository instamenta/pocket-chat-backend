import { Client } from "pg";
import Redis from "ioredis";
import http from "node:http";
import VLogger from '@instamenta/vlogger';
export default function initialize_all(): Promise<{
    server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
    api: import("express-serve-static-core").Express;
    database: Client;
    cache: Redis;
    socket: import("ws").Server<typeof import("ws"), typeof http.IncomingMessage>;
    logger: VLogger;
}>;
//# sourceMappingURL=intialize.d.ts.map