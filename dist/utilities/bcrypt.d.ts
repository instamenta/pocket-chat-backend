import VLogger from "@instamenta/vlogger";
export interface HashingHandler {
    hashPassword(password: string): Promise<string>;
    comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean>;
}
export declare class BCryptHashingHandler implements HashingHandler {
    private readonly log;
    constructor(logger: VLogger);
    hashPassword(password: string): Promise<string>;
    comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean>;
}
//# sourceMappingURL=bcrypt.d.ts.map