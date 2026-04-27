import { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { BadRequestException } from "../exceptions/http-exception";

type ClassConstructor<T> = new (...args: unknown[]) => T; // creates instance via new

export function validateDto<T extends object>(DtoClass: ClassConstructor<T>) {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dtoInstance = plainToInstance(DtoClass, req.body);

      const errors: ValidationError[] = await validate(dtoInstance, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });

      if (errors.length > 0) {
        const formattedErrors = errors.map((error) => ({
          field: error.property,
          messages: error.constraints ? Object.values(error.constraints) : [],
        }));

        throw new BadRequestException("Validation failed", formattedErrors);
      }

      req.body = dtoInstance;
      next();
    } catch (error) {
      next(error);
    }
  };
}
