import { Request, Response, NextFunction } from "express";
import { HttpException } from "../exceptions/http-exception";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof HttpException) {
    res.status(err.statusCode).json({
      statusCode: err.statusCode,
      message: err.message,
      ...(err.details ? { details: err.details } : {}),
    });
    return;
  }

  console.error("Unhandled error:", err);

  res.status(500).json({
    statusCode: 500,
    message: "Internal Server Error",
  });
}
