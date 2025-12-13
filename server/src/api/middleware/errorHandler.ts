import type { ErrorRequestHandler } from 'express';
import { logger } from '../../logger.js';
import { ApiError, isApiError } from './apiError.js';
import { isZodError } from './validate.js';

type OracleErrorLike = {
  errorNum?: number;
  message?: string;
};

function isOracleError(err: unknown): err is OracleErrorLike {
  return typeof err === 'object' && err !== null && 'errorNum' in err;
}

function mapOracleError(err: OracleErrorLike): ApiError {
  const errorNum = err.errorNum;

  switch (errorNum) {
    case 1:
      return new ApiError(409, 'Duplicate record', { code: 'DB_DUPLICATE' });
    case 2291:
      return new ApiError(409, 'Related record not found (foreign key constraint)', { code: 'DB_FK_NOT_FOUND' });
    case 2292:
      return new ApiError(409, 'Cannot delete record because it has related data', { code: 'DB_CHILD_RECORDS' });
    case 1400:
      return new ApiError(400, 'Missing required field', { code: 'DB_NOT_NULL' });
    default:
      return new ApiError(500, 'Database error', { code: 'DB_ERROR', details: { errorNum } });
  }
}

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  let apiError: ApiError;

  if (isApiError(err)) {
    apiError = err;
  } else if (isZodError(err)) {
    apiError = new ApiError(400, 'Validation error', { code: 'VALIDATION_ERROR', details: err.flatten() });
  } else if (isOracleError(err)) {
    apiError = mapOracleError(err);
  } else {
    apiError = new ApiError(500, 'Internal server error');
  }

  const status = apiError.status;
  if (status >= 500) {
    logger.error({ err }, 'Unhandled error');
  } else {
    logger.warn({ err }, 'Request error');
  }

  res.status(status).json({
    error: {
      message: apiError.message,
      code: apiError.code,
      details: apiError.details,
    },
  });
};
