import { Router } from 'express';
import type { z } from 'zod';

import { asyncHandler } from '../middleware/asyncHandler.js';
import { validateBody } from '../middleware/validate.js';
import { ApiError } from '../middleware/apiError.js';
import { ownerProfileUpsertSchema } from '../../validation/apiSchemas.js';

import * as ownersRepo from '../../repositories/owners.js';
import * as profilesRepo from '../../repositories/ownerProfiles.js';
import type { OwnerProfile } from '../../repositories/ownerProfiles.js';

export type OwnersRepo = Pick<typeof ownersRepo, 'getOwnerById' | 'createOwner'>;
export type OwnerProfilesRepo = Pick<
  typeof profilesRepo,
  'getProfileByOwnerId' | 'createProfile' | 'updateProfile' | 'deleteProfile'
>;

export interface OwnersProfileRouterDeps {
  owners?: OwnersRepo;
  profiles?: OwnerProfilesRepo;
}

export function createOwnersProfileRouter(deps: OwnersProfileRouterDeps = {}) {
  const owners = deps.owners ?? ownersRepo;
  const profiles = deps.profiles ?? profilesRepo;

  const router = Router();

  router.get(
    '/',
    asyncHandler(async (req, res) => {
      const ownerId = req.ownerId!;
      const profile = await profiles.getProfileByOwnerId(ownerId);

      if (!profile) {
        throw new ApiError(404, 'Profile not found', { code: 'PROFILE_NOT_FOUND' });
      }

      res.json({ profile });
    })
  );

  router.put(
    '/',
    validateBody(ownerProfileUpsertSchema),
    asyncHandler(async (req, res) => {
      const ownerId = req.ownerId!;

      const existingOwner = await owners.getOwnerById(ownerId);
      if (!existingOwner) {
        await owners.createOwner(ownerId);
      }

      const existingProfile = await profiles.getProfileByOwnerId(ownerId);
      const body = req.body as z.infer<typeof ownerProfileUpsertSchema>;

      const input: OwnerProfile = {
        ownerId,
        ...body,
        updatedAt: new Date(),
      };

      const profile = existingProfile
        ? await profiles.updateProfile(ownerId, input)
        : await profiles.createProfile(input);

      res.json({ profile });
    })
  );

  router.delete(
    '/',
    asyncHandler(async (req, res) => {
      const ownerId = req.ownerId!;
      const existingProfile = await profiles.getProfileByOwnerId(ownerId);

      if (!existingProfile) {
        throw new ApiError(404, 'Profile not found', { code: 'PROFILE_NOT_FOUND' });
      }

      await profiles.deleteProfile(ownerId);
      res.status(204).send();
    })
  );

  return router;
}
