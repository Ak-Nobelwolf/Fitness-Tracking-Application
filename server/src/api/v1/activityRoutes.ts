import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import type { z } from 'zod';

import { asyncHandler } from '../middleware/asyncHandler.js';
import { validateBody } from '../middleware/validate.js';
import { ApiError } from '../middleware/apiError.js';

import {
  activityCreateSchema,
  activityUpdateSchema,
  activityBulkUpsertSchema,
  activityBulkUpsertItemSchema,
} from '../../validation/apiSchemas.js';
import { activitySchema, validateActivity } from '../../validation/activitySchema.js';

import * as activitiesRepo from '../../repositories/activities.js';
import type { CreateActivityInput } from '../../repositories/activities.js';
import * as calorieService from '../../services/calorieService.js';

type ActivityCreateBody = z.infer<typeof activityCreateSchema>;
type ActivityUpdateBody = z.infer<typeof activityUpdateSchema>;
type ActivityBulkUpsertItemBody = z.infer<typeof activityBulkUpsertItemSchema>;

function computeDurationMinutes(startTime: string, endTime: string): number {
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  return Math.round((end - start) / 60000);
}

function assertTimeRange(startTime: string, endTime: string) {
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();

  if (Number.isNaN(start) || Number.isNaN(end) || start >= end) {
    throw new ApiError(400, 'Start time must be before end time', { code: 'INVALID_TIME_RANGE' });
  }
}

function normalizeNotes(notes: string | null | undefined): string | undefined {
  return notes ?? undefined;
}

export type ActivitiesRepo = Pick<
  typeof activitiesRepo,
  | 'createActivity'
  | 'getActivityById'
  | 'getActivitiesByOwnerId'
  | 'updateActivity'
  | 'deleteActivity'
  | 'bulkUpsertActivities'
>;

export type CalorieService = Pick<typeof calorieService, 'calculateCalories' | 'isCalorieOverrideSuspicious'>;

export interface ActivityRouterDeps {
  activities?: ActivitiesRepo;
  calories?: CalorieService;
}

export function createActivityRouter(deps: ActivityRouterDeps = {}) {
  const activities = deps.activities ?? activitiesRepo;
  const calories = deps.calories ?? calorieService;

  const router = Router();

  router.get(
    '/',
    asyncHandler(async (req, res) => {
      const ownerId = req.ownerId!;
      const rows = await activities.getActivitiesByOwnerId(ownerId);
      res.json({ activities: rows });
    })
  );

  router.get(
    '/:id',
    asyncHandler(async (req, res) => {
      const ownerId = req.ownerId!;
      const activity = await activities.getActivityById(req.params.id);

      if (!activity || activity.ownerId !== ownerId) {
        throw new ApiError(404, 'Activity not found', { code: 'ACTIVITY_NOT_FOUND' });
      }

      res.json({ activity });
    })
  );

  router.post(
    '/',
    validateBody(activityCreateSchema),
    asyncHandler(async (req, res) => {
      const ownerId = req.ownerId!;
      const body = req.body as ActivityCreateBody;

      const id = body.id ?? randomUUID();

      assertTimeRange(body.startTime, body.endTime);
      const durationMinutes = body.durationMinutes ?? computeDurationMinutes(body.startTime, body.endTime);

      if (durationMinutes <= 0) {
        throw new ApiError(400, 'Duration must be greater than 0', { code: 'INVALID_DURATION' });
      }

      const override = body.caloriesOverride ?? undefined;
      const calc = await calories.calculateCalories(ownerId, body.activityTypeId, durationMinutes, override);

      const activityInput = {
        activityTypeId: body.activityTypeId,
        ownerId,
        startTime: body.startTime,
        endTime: body.endTime,
        durationMinutes,
        caloriesBurned: calc.calculatedCalories,
        notes: normalizeNotes(body.notes),
      };

      activitySchema.parse(activityInput);
      const validation = validateActivity(activityInput);

      const created = await activities.createActivity({
        id,
        ownerId,
        activityTypeId: body.activityTypeId,
        startTime: body.startTime,
        endTime: body.endTime,
        durationMinutes,
        caloriesBurned: calc.calculatedCalories,
        caloriesOverride: override,
        notes: normalizeNotes(body.notes),
      });

      res.status(201).json({
        activity: created,
        validationFlags: validation.flags,
        calorieCalculation: {
          ...calc,
          isSuspiciousOverride:
            override !== undefined ? calories.isCalorieOverrideSuspicious(calc.calculatedCalories, override) : false,
        },
      });
    })
  );

  router.put(
    '/:id',
    validateBody(activityUpdateSchema),
    asyncHandler(async (req, res) => {
      const ownerId = req.ownerId!;
      const existing = await activities.getActivityById(req.params.id);

      if (!existing || existing.ownerId !== ownerId) {
        throw new ApiError(404, 'Activity not found', { code: 'ACTIVITY_NOT_FOUND' });
      }

      const body = req.body as ActivityUpdateBody;

      const mergedStartTime = body.startTime ?? existing.startTime.toISOString();
      const mergedEndTime = body.endTime ?? existing.endTime.toISOString();

      assertTimeRange(mergedStartTime, mergedEndTime);

      const durationMinutes =
        body.durationMinutes ??
        (body.startTime || body.endTime ? computeDurationMinutes(mergedStartTime, mergedEndTime) : existing.durationMinutes);

      if (durationMinutes <= 0) {
        throw new ApiError(400, 'Duration must be greater than 0', { code: 'INVALID_DURATION' });
      }

      const activityTypeId = body.activityTypeId ?? existing.activityTypeId;

      const overrideProvided = Object.prototype.hasOwnProperty.call(body, 'caloriesOverride');
      const notesProvided = Object.prototype.hasOwnProperty.call(body, 'notes');

      const mergedOverride = overrideProvided ? (body.caloriesOverride ?? null) : existing.caloriesOverride;

      const calc = await calories.calculateCalories(
        ownerId,
        activityTypeId,
        durationMinutes,
        typeof mergedOverride === 'number' ? mergedOverride : undefined
      );

      const fullForValidation = {
        activityTypeId,
        ownerId,
        startTime: mergedStartTime,
        endTime: mergedEndTime,
        durationMinutes,
        caloriesBurned: calc.calculatedCalories,
        notes: notesProvided ? normalizeNotes(body.notes) : existing.notes,
      };

      activitySchema.parse(fullForValidation);
      const validation = validateActivity(fullForValidation);

      const repoUpdates: Partial<CreateActivityInput> = {
        activityTypeId,
        startTime: mergedStartTime,
        endTime: mergedEndTime,
        durationMinutes,
        caloriesBurned: calc.calculatedCalories,
      };

      if (overrideProvided) {
        repoUpdates.caloriesOverride = body.caloriesOverride ?? null;
      }
      if (notesProvided) {
        repoUpdates.notes = body.notes ?? null;
      }

      const updated = await activities.updateActivity(req.params.id, repoUpdates);

      res.json({
        activity: updated,
        validationFlags: validation.flags,
        calorieCalculation: {
          ...calc,
          isSuspiciousOverride:
            typeof mergedOverride === 'number'
              ? calories.isCalorieOverrideSuspicious(calc.calculatedCalories, mergedOverride)
              : false,
        },
      });
    })
  );

  router.delete(
    '/:id',
    asyncHandler(async (req, res) => {
      const ownerId = req.ownerId!;
      const existing = await activities.getActivityById(req.params.id);

      if (!existing || existing.ownerId !== ownerId) {
        throw new ApiError(404, 'Activity not found', { code: 'ACTIVITY_NOT_FOUND' });
      }

      await activities.deleteActivity(req.params.id);
      res.status(204).send();
    })
  );

  router.post(
    '/bulk-upsert',
    validateBody(activityBulkUpsertSchema),
    asyncHandler(async (req, res) => {
      const ownerId = req.ownerId!;
      const items = req.body as ActivityBulkUpsertItemBody[];

      const prepared = await Promise.all(
        items.map(async (item) => {
          const id = item.id ?? randomUUID();

          assertTimeRange(item.startTime, item.endTime);
          const durationMinutes = item.durationMinutes ?? computeDurationMinutes(item.startTime, item.endTime);

          if (durationMinutes <= 0) {
            throw new ApiError(400, 'Duration must be greater than 0', { code: 'INVALID_DURATION' });
          }

          const override = item.caloriesOverride ?? undefined;
          const calc = await calories.calculateCalories(ownerId, item.activityTypeId, durationMinutes, override);

          const fullForValidation = {
            activityTypeId: item.activityTypeId,
            ownerId,
            startTime: item.startTime,
            endTime: item.endTime,
            durationMinutes,
            caloriesBurned: calc.calculatedCalories,
            notes: normalizeNotes(item.notes),
          };

          activitySchema.parse(fullForValidation);

          return {
            id,
            clientTempId: item.clientTempId,
            ownerId,
            activityTypeId: item.activityTypeId,
            startTime: item.startTime,
            endTime: item.endTime,
            durationMinutes,
            caloriesBurned: calc.calculatedCalories,
            caloriesOverride: override,
            notes: normalizeNotes(item.notes),
          };
        })
      );

      const results = await activities.bulkUpsertActivities(
        prepared.map(({ clientTempId, ...dbItem }) => dbItem)
      );

      const resultById = new Map(results.map((r) => [r.id, r.action]));

      res.json({
        results: prepared.map((p) => ({
          id: p.id,
          clientTempId: p.clientTempId,
          action: resultById.get(p.id),
        })),
      });
    })
  );

  return router;
}
