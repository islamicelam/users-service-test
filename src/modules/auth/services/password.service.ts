import bcrypt from "bcrypt";
import { env } from "../../../config/env.config";

export class PasswordService {
  async hash(plainPassword: string): Promise<string> {
    return bcrypt.hash(plainPassword, env.bcrypt.saltRounds);
  }

  async compare(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
