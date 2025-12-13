import type { RequestHandler } from 'express';
import { ownerIdSchema } from '../../validation/apiSchemas.js';
import { ApiError } from './apiError.js';

function firstQueryParam(value: unknown): string | undefined {
  if (typeof value === 'string') return value;
  if (Array.isArray(value) && typeof value[0] === 'string') return value[0];
  return undefined;
}

export const requireOwnerId: RequestHandler = (req, _res, next) => {
  const ownerIdCandidate =
    req.header('x-owner-id') ||
    firstQueryParam(req.query.owner_id) ||
    firstQueryParam(req.query.ownerId);

  const parsed = ownerIdSchema.safeParse(ownerIdCandidate);
  if (!parsed.success) {
    return next(
      new ApiError(400, 'Missing or invalid owner id. Provide x-owner-id header or owner_id query param.', {
        code: 'OWNER_ID_REQUIRED',
        details: parsed.error.flatten(),
      })
    );
  }

  req.ownerId = parsed.data;
  next();
};
