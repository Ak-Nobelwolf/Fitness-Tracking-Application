import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import type { z } from 'zod';

import { asyncHandler } from '../middleware/asyncHandler.js';
import { validateBody } from '../middleware/validate.js';
import { ApiError } from '../middleware/apiError.js';
import { activityTypeCreateSchema, activityTypeUpdateSchema } from '../../validation/apiSchemas.js';

import * as activityTypesRepo from '../../repositories/activityTypes.js';
import type { ActivityType } from '../../repositories/activityTypes.js';

export type ActivityTypesRepo = Pick<
  typeof activityTypesRepo,
  'getAllActivityTypes' | 'getActivityTypeById' | 'createActivityType' | 'updateActivityType' | 'deleteActivityType'
>;

export interface ActivityTypeRouterDeps {
  activityTypes?: ActivityTypesRepo;
}

export function createActivityTypeRouter(deps: ActivityTypeRouterDeps = {}) {
  const activityTypes = deps.activityTypes ?? activityTypesRepo;

  const router = Router();

  router.get(
    '/',
    asyncHandler(async (_req, res) => {
      const types = await activityTypes.getAllActivityTypes();
      res.json({ activityTypes: types });
    })
  );

  router.get(
    '/:id',
    asyncHandler(async (req, res) => {
      const type = await activityTypes.getActivityTypeById(req.params.id);
      if (!type) {
        throw new ApiError(404, 'Activity type not found', { code: 'ACTIVITY_TYPE_NOT_FOUND' });
      }
      res.json({ activityType: type });
    })
  );

  router.post(
    '/',
    validateBody(activityTypeCreateSchema),
    asyncHandler(async (req, res) => {
      const body = req.body as z.infer<typeof activityTypeCreateSchema>;
      const id = body.id ?? randomUUID();

      const created = await activityTypes.createActivityType({
        id,
        name: body.name,
        met: body.met,
        description: body.description,
        createdAt: new Date(),
      });

      res.status(201).json({ activityType: created });
    })
  );

  router.put(
    '/:id',
    validateBody(activityTypeUpdateSchema),
    asyncHandler(async (req, res) => {
      const updates = Object.fromEntries(
        Object.entries(req.body as Record<string, unknown>).filter(([, v]) => v !== undefined)
      );

      const updated = await activityTypes.updateActivityType(req.params.id, updates as Partial<ActivityType>);
      res.json({ activityType: updated });
    })
  );

  router.delete(
    '/:id',
    asyncHandler(async (req, res) => {
      const existing = await activityTypes.getActivityTypeById(req.params.id);
      if (!existing) {
        throw new ApiError(404, 'Activity type not found', { code: 'ACTIVITY_TYPE_NOT_FOUND' });
      }

      await activityTypes.deleteActivityType(req.params.id);
      res.status(204).send();
    })
  );

  return router;
}
