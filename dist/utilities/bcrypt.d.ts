export interface I_HashingHandler {
    hashPassword(password: string): Promise<string>;
    comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean>;
}
export default class BCrypt implements I_HashingHandler {
    hashPassword(password: string): Promise<string>;
    comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean>;
}
//# sourceMappingURL=bcrypt.d.ts.map