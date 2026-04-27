import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "../../modules/auth/services/jwt.service";
import { UnauthorizedException } from "../exceptions/http-exception";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

import { jwtService } from "../../composition";

export function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException("Authorization header is missing");
    }

    if (!authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedException(
        "Invalid authorization format. Expected: Bearer <token>",
      );
    }

    const token = authHeader.substring(7);

    if (!token) {
      throw new UnauthorizedException("Token is missing");
    }

    const payload = jwtService.verify(token);
    req.user = payload;

    next();
  } catch (error) {
    next(error);
  }
}
