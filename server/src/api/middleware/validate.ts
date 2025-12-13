import type { RequestHandler } from 'express';
import type { ZodTypeAny } from 'zod';
import { ZodError } from 'zod';
import { ApiError } from './apiError.js';

export function validateBody(schema: ZodTypeAny): RequestHandler {
  return (req, _res, next) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return next(new ApiError(400, 'Invalid request body', { code: 'VALIDATION_ERROR', details: parsed.error.flatten() }));
    }
    req.body = parsed.data;
    next();
  };
}

export function validateQuery(schema: ZodTypeAny): RequestHandler {
  return (req, _res, next) => {
    const parsed = schema.safeParse(req.query);
    if (!parsed.success) {
      return next(new ApiError(400, 'Invalid query parameters', { code: 'VALIDATION_ERROR', details: parsed.error.flatten() }));
    }
    req.query = parsed.data;
    next();
  };
}

export function isZodError(err: unknown): err is ZodError {
  return err instanceof ZodError;
}
