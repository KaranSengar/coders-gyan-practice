import type { Request, Response, NextFunction } from "express";
import { logger } from "../config/logger";
import type { HttpError } from "http-errors";

export const globalErrorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  const statusCode = err.status || 500;
  const message = err.message || err.statusCode || "Internal Server Error";

  // Log error with Winston
  logger.error(`${req.method} ${req.path} - ${message}`, {
    stack: err.stack?.split("\n")[1],
    statusCode,
    method: req.method,
    path: req.path,
  });
  // Send response
  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message,
  });
};
