// filepath: c:\Users\julio\Downloads\AtleticaHub-FrontEnd\AleticaHub\src\layers\infrastructure\middlewares\ErrorMiddleware.ts
// Error Handling Middleware - Comprehensive error handling for API

import { Request, Response, NextFunction } from 'express';

// Custom error classes
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  public field: string;

  constructor(message: string, field: string) {
    super(message, 400);
    this.field = field;
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized access') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden access') {
    super(message, 403);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409);
  }
}

// Error response interface
interface ErrorResponse {
  error: {
    message: string;
    status: number;
    code?: string;
    field?: string;
    timestamp: string;
    path: string;
    method: string;
  };
}

// Development error response (includes stack trace)
interface DevErrorResponse extends ErrorResponse {
  error: ErrorResponse['error'] & {
    stack?: string;
  };
}

// Create error response
const createErrorResponse = (
  err: Error,
  req: Request,
  statusCode: number = 500
): ErrorResponse | DevErrorResponse => {
  const baseResponse: ErrorResponse = {
    error: {
      message: err.message,
      status: statusCode,
      timestamp: new Date().toISOString(),
      path: req.path,
      method: req.method,
    },
  };

  // Add field for validation errors
  if (err instanceof ValidationError) {
    baseResponse.error.field = err.field;
  }

  // Add stack trace in development
  if (process.env.NODE_ENV === 'development') {
    (baseResponse as DevErrorResponse).error.stack = err.stack;
  }

  return baseResponse;
};

// Handle specific error types
const handleFirebaseError = (error: any): AppError => {
  if (error.code === 'auth/user-not-found') {
    return new NotFoundError('User');
  }
  if (error.code === 'auth/wrong-password') {
    return new UnauthorizedError('Invalid credentials');
  }
  if (error.code === 'auth/email-already-in-use') {
    return new ConflictError('Email already registered');
  }
  if (error.code === 'auth/weak-password') {
    return new ValidationError('Password is too weak', 'password');
  }
  if (error.code === 'auth/invalid-email') {
    return new ValidationError('Invalid email format', 'email');
  }
  if (error.code === 'permission-denied') {
    return new ForbiddenError('Permission denied');
  }
  if (error.code === 'not-found') {
    return new NotFoundError('Resource');
  }
  if (error.code === 'already-exists') {
    return new ConflictError('Resource already exists');
  }

  return new AppError(error.message || 'Firebase operation failed', 500);
};

const handleValidationError = (error: any): AppError => {
  const errors = Object.values(error.errors).map((err: any) => err.message);
  return new ValidationError(`Invalid input data: ${errors.join('. ')}`, 'validation');
};

const handleCastError = (error: any): AppError => {
  return new ValidationError(`Invalid ${error.path}: ${error.value}`, error.path);
};

const handleDuplicateFieldsError = (error: any): AppError => {
  const value = error.message.match(/(["'])(\\?.)*?\1/)[0];
  return new ConflictError(`Duplicate field value: ${value}`);
};

const handleJWTError = (): AppError => {
  return new UnauthorizedError('Invalid token. Please log in again!');
};

const handleJWTExpiredError = (): AppError => {
  return new UnauthorizedError('Your token has expired! Please log in again.');
};

// Send error response
const sendErrorResponse = (error: AppError, req: Request, res: Response): void => {
  const errorResponse = createErrorResponse(error, req, error.statusCode);
  
  // Log error for monitoring
  if (error.statusCode >= 500) {
    console.error('ERROR 💥', error);
  } else {
    console.warn('WARN ⚠️', error.message);
  }

  res.status(error.statusCode).json(errorResponse);
};

// Main error handling middleware
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let err = error;

  // Handle specific error types
  if (error.name === 'ValidationError') {
    err = handleValidationError(error);
  } else if (error.name === 'CastError') {
    err = handleCastError(error);
  } else if (error.name === 'MongoError' && (error as any).code === 11000) {
    err = handleDuplicateFieldsError(error);
  } else if (error.name === 'JsonWebTokenError') {
    err = handleJWTError();
  } else if (error.name === 'TokenExpiredError') {
    err = handleJWTExpiredError();
  } else if ((error as any).code && (error as any).code.startsWith('auth/')) {
    err = handleFirebaseError(error);
  } else if (!(error instanceof AppError)) {
    // Handle unknown errors
    err = new AppError('Something went wrong!', 500);
  }

  sendErrorResponse(err as AppError, req, res);
};

// 404 handler for undefined routes
export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error = new NotFoundError(`Route ${req.originalUrl}`);
  next(error);
};

// Async error wrapper
export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Error logging utility
export const logError = (error: Error, context?: string): void => {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] ${context ? `${context}: ` : ''}${error.message}`);
  
  if (process.env.NODE_ENV === 'development') {
    console.error(error.stack);
  }
};

// Success response utility
export const sendSuccess = (
  res: Response,
  data: any,
  message: string = 'Success',
  statusCode: number = 200
): void => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
};

// Paginated response utility
export const sendPaginatedResponse = (
  res: Response,
  data: any[],
  page: number,
  limit: number,
  total: number,
  message: string = 'Success'
): void => {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage,
      hasPrevPage,
    },
    timestamp: new Date().toISOString(),
  });
};
