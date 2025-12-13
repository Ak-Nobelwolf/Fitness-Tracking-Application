import { Router } from 'express';
import { requireOwnerId } from '../middleware/ownerId.js';

import { createOwnersProfileRouter, type OwnersProfileRouterDeps } from './ownersProfileRoutes.js';
import { createActivityTypeRouter, type ActivityTypeRouterDeps } from './activityTypeRoutes.js';
import { createActivityRouter, type ActivityRouterDeps } from './activityRoutes.js';
import { createDashboardRouter, type DashboardRouterDeps } from './dashboardRoutes.js';

export interface V1RouterDeps {
  ownersProfile?: OwnersProfileRouterDeps;
  activityTypes?: ActivityTypeRouterDeps;
  activities?: ActivityRouterDeps;
  dashboard?: DashboardRouterDeps;
}

export function createV1Router(deps: V1RouterDeps = {}) {
  const router = Router();

  router.use(requireOwnerId);

  router.use('/owners/profile', createOwnersProfileRouter(deps.ownersProfile));
  router.use('/activity-types', createActivityTypeRouter(deps.activityTypes));
  router.use('/activities', createActivityRouter(deps.activities));
  router.use('/dashboard', createDashboardRouter(deps.dashboard));

  return router;
}
