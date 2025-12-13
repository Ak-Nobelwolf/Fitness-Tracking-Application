import { Router } from 'express';
import { startOfDay, endOfDay, startOfMonth, endOfMonth } from 'date-fns';
import type { z } from 'zod';

import { asyncHandler } from '../middleware/asyncHandler.js';
import { validateQuery } from '../middleware/validate.js';

import { dashboardDateQuerySchema, dashboardBreakdownQuerySchema } from '../../validation/apiSchemas.js';

import * as aggregationService from '../../services/aggregationService.js';

export type AggregationService = Pick<
  typeof aggregationService,
  'getDailyStats' | 'getWeeklyStats' | 'getMonthlyStats' | 'getActivityTypeBreakdown'
>;

export interface DashboardRouterDeps {
  aggregation?: AggregationService;
}

type DashboardDateQuery = z.infer<typeof dashboardDateQuerySchema>;
type DashboardBreakdownQuery = z.infer<typeof dashboardBreakdownQuerySchema>;

function parseQueryDate(raw?: string): Date {
  if (!raw) return new Date();
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) {
    return new Date();
  }
  return d;
}

export function createDashboardRouter(deps: DashboardRouterDeps = {}) {
  const aggregation = deps.aggregation ?? aggregationService;

  const router = Router();

  router.get(
    '/',
    validateQuery(dashboardDateQuerySchema),
    asyncHandler(async (req, res) => {
      const ownerId = req.ownerId!;
      const { date } = req.query as DashboardDateQuery;
      const parsedDate = parseQueryDate(date);

      const [daily, weekly, monthly] = await Promise.all([
        aggregation.getDailyStats(ownerId, parsedDate),
        aggregation.getWeeklyStats(ownerId, parsedDate),
        aggregation.getMonthlyStats(ownerId, parsedDate),
      ]);

      const breakdown = await aggregation.getActivityTypeBreakdown(ownerId, monthly.monthStart, monthly.monthEnd);

      res.json({ daily, weekly, monthly, breakdown });
    })
  );

  router.get(
    '/daily',
    validateQuery(dashboardDateQuerySchema),
    asyncHandler(async (req, res) => {
      const ownerId = req.ownerId!;
      const { date } = req.query as DashboardDateQuery;
      const daily = await aggregation.getDailyStats(ownerId, parseQueryDate(date));
      res.json({ daily });
    })
  );

  router.get(
    '/weekly',
    validateQuery(dashboardDateQuerySchema),
    asyncHandler(async (req, res) => {
      const ownerId = req.ownerId!;
      const { date } = req.query as DashboardDateQuery;
      const weekly = await aggregation.getWeeklyStats(ownerId, parseQueryDate(date));
      res.json({ weekly });
    })
  );

  router.get(
    '/monthly',
    validateQuery(dashboardDateQuerySchema),
    asyncHandler(async (req, res) => {
      const ownerId = req.ownerId!;
      const { date } = req.query as DashboardDateQuery;
      const monthly = await aggregation.getMonthlyStats(ownerId, parseQueryDate(date));
      res.json({ monthly });
    })
  );

  router.get(
    '/breakdown',
    validateQuery(dashboardBreakdownQuerySchema),
    asyncHandler(async (req, res) => {
      const ownerId = req.ownerId!;
      const { from, to } = req.query as DashboardBreakdownQuery;

      const fromDate = from ? new Date(from) : startOfMonth(new Date());
      const toDate = to ? new Date(to) : endOfMonth(new Date());

      const breakdown = await aggregation.getActivityTypeBreakdown(ownerId, startOfDay(fromDate), endOfDay(toDate));
      res.json({ breakdown });
    })
  );

  return router;
}
