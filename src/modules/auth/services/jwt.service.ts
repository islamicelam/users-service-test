import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../../../config/env.config';
import { UnauthorizedException } from '../../../common/exceptions/http-exception';

export interface JwtPayload {
  userId: string;
  role: string;
}

export class JwtService {
  sign(payload: JwtPayload): string {
    const options: SignOptions = {
      expiresIn: env.jwt.expiresIn as SignOptions['expiresIn'],
    };
    return jwt.sign(payload, env.jwt.secret, options);
  }

  verify(token: string): JwtPayload {
    try {
      const decoded = jwt.verify(token, env.jwt.secret);

      if (typeof decoded === 'string') {
        throw new UnauthorizedException('Invalid token format');
      }

      return decoded as JwtPayload;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}