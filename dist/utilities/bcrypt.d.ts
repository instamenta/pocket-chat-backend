export interface HashingHandler {
    hashPassword(password: string): Promise<string>;
    comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean>;
}
export declare class BCryptHashingHandler implements HashingHandler {
    hashPassword(password: string): Promise<string>;
    comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean>;
}
//# sourceMappingURL=bcrypt.d.ts.map