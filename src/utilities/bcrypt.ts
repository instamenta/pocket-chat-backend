import bcrypt from "bcrypt";
import { SECURITY } from "./config";
import VLogger, {IVlog} from "@instamenta/vlogger";

export interface HashingHandler {
  hashPassword(password: string): Promise<string>;

  comparePasswords(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}

export class BCryptHashingHandler implements HashingHandler {
  private readonly log: IVlog;

  constructor(logger: VLogger) {
    this.log = logger.getVlogger(this.constructor.name);
  }

  async hashPassword(password: string) {
    try {
      const salt = await bcrypt.genSalt(SECURITY.SALT_ROUNDS);

      return await bcrypt.hash(password, salt);
    } catch (error) {
      this.log.error({e: error, f: 'hashPassword'});
      throw error;
    }
  }

  async comparePasswords(plainPassword: string, hashedPassword: string) {
    return await bcrypt
      .compare(plainPassword, hashedPassword)
      .catch((error: unknown) => {
        this.log.error({e: error, f: 'comparePasswords'});
        return false;
      });
  }
}
