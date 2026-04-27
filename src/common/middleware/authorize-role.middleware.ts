import { Request, Response, NextFunction } from "express";
import {
  ForbiddenException,
  UnauthorizedException,
} from "../exceptions/http-exception";
import { UserRole } from "../../modules/users/enums/user-role.enum";

export function authorizeRoles(...allowedRoles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new UnauthorizedException("User is not authenticated");
      }

      if (!allowedRoles.includes(req.user.role as UserRole)) {
        throw new ForbiddenException(
          "You do not have permission to access this resource",
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
