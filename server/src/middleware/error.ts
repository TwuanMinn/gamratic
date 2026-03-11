import type { ErrorRequestHandler } from 'express';

interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

export const errorHandler: ErrorRequestHandler = (
  err: AppError,
  _req,
  res,
  _next
): void => {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'Internal server error' : err.message;

  // Log full error details server-side
  console.error(`[${new Date().toISOString()}] ${err.stack || err.message}`);

  // Return safe error to client (no internal details)
  res.status(statusCode).json({
    error: message,
    code: err.code || 'INTERNAL_ERROR',
  });
};

export class ApiError extends Error {
  statusCode: number;
  code: string;

  constructor(statusCode: number, message: string, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code || 'ERROR';
    this.name = 'ApiError';
  }

  static badRequest(message: string): ApiError {
    return new ApiError(400, message, 'BAD_REQUEST');
  }

  static unauthorized(message = 'Authentication required'): ApiError {
    return new ApiError(401, message, 'UNAUTHORIZED');
  }

  static forbidden(message = 'Access denied'): ApiError {
    return new ApiError(403, message, 'FORBIDDEN');
  }

  static notFound(message = 'Resource not found'): ApiError {
    return new ApiError(404, message, 'NOT_FOUND');
  }

  static conflict(message: string): ApiError {
    return new ApiError(409, message, 'CONFLICT');
  }

  static validation(message: string): ApiError {
    return new ApiError(422, message, 'VALIDATION_ERROR');
  }
}
