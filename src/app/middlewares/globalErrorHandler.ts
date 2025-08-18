/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { TErrorSourses } from '../interface/error';
import handleZodError from '../errors/handleZodError';
import handleValidationError from '../errors/handleValidationError';
import handleCastError from '../errors/handleCastError';
import handleDuplicateError from '../errors/handleDuplicateError';
import AppError from '../errors/appError';
import UnauthrizedError from '../errors/unauthorizedError';
import config from '../config/config';

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  let statusCode = 500;
  let message = 'Errors!!!';
  let errorMessage = 'Something went wrong!';

  let errorDetails = null; // Initialize as null directly

  if (error instanceof ZodError) {
    statusCode = 400;
    const ZodMessage = handleZodError(error);
    message = ZodMessage.message;
    errorMessage = ZodMessage.errorMessage;
    errorDetails = error;
  } else if (error?.name === 'ValidationError') {
    const validationError = handleValidationError(error);
    statusCode = 400;
    message = validationError?.message;
    errorMessage = validationError?.errorMessage;
    errorDetails = error;
  } else if (error.name === 'CastError') {
    const CastError = handleCastError(error);
    statusCode = 400;
    message = CastError?.message;
    errorMessage = CastError?.errorMessage;
    errorDetails = error;
  } else if (error.code === 11000) {
    const errorData = handleDuplicateError(error);
    statusCode = errorData?.statusCode;
    message = errorData?.message;
    errorMessage = errorData.errorSources;
    errorDetails = error;
  } else if (error instanceof AppError) {
    statusCode = error?.statusCode;
    message = 'Error';
    errorMessage = error?.message;
    errorDetails = error;
  } else if (error instanceof UnauthrizedError) {
    message = 'Unauthorized Access';
    errorMessage = error?.message;
    errorDetails = null;
  } else if (error.name === 'JsonWebTokenError') {
    message = 'Unauthorized Access';
    errorMessage =
      'You do not have the necessary permissions to access this resource.';
    errorDetails = null;
  } else if (error instanceof Error) {
    message = error?.name;
    errorMessage = error?.message;
    errorDetails = error;
  }

  // Ensure we don't return a response directly, but send it to the client
  res.status(statusCode).json({
    success: false,
    message,
    errorMessage,
    errorDetails,
    stack: config.NODE_ENV === 'development' ? error?.stack : null,
  });

  // Don't return anything (no explicit return)
};

export default globalErrorHandler;
