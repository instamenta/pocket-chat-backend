import "dotenv/config";
import ms from "ms";
export declare const env: {
    FOLDER: string;
    CERTIFICATE_AGE: string;
    CERTIFICATE_NAME: string;
    SERVER_KEY_PATH: string;
    SERVER_CERT_PATH: string;
    CLIENT_CERT_PATH: string;
    SERVER_HOST: string;
    SERVER_PORT: string;
    SERVER_BACKLOG: string;
    DATABASE_URL: string;
    REDIS_HOST: string;
    REDIS_PORT: string;
    SALT_ROUNDS: string;
    JWT_SECRET: string;
    JWT_TOKEN_NAME: string;
    JWT_EXPIRATION_TIME: string;
    SOCKET_PORT: string;
    PEER_PORT: string;
    MEDIA_SOCKET_PORT: string;
};
export declare const SECURITY: {
    FOLDER: string;
    AGE: string;
    NAME: string;
    SERVER_KEY_PATH: string;
    SERVER_CERT_PATH: string;
    CLIENT_CERT_PATH: string;
    SALT_ROUNDS: number;
    JWT_SECRET: string;
    JWT_TOKEN_NAME: string;
    JWT_EXPIRATION_TIME: ms.StringValue;
};
//# sourceMappingURL=config.d.ts.map