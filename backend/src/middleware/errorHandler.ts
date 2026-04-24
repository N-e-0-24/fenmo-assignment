import { Request, Response, NextFunction } from 'express';

/**
 * Custom application error with HTTP status code.
 */
export class AppError extends Error {
  public readonly statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Global error handler middleware.
 * - Known AppErrors return their status code and message.
 * - Unknown errors return 500 with a generic message.
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  console.error('[Unhandled Error]', err);
  res.status(500).json({ error: 'Internal server error' });
}
