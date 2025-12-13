import { describe, it, expect, beforeEach, vi } from 'vitest';
import { calculateCalories, isCalorieOverrideSuspicious } from '../services/calorieService.js';
import * as activityTypesRepo from '../repositories/activityTypes.js';
import * as ownerProfilesRepo from '../repositories/ownerProfiles.js';

// Mock the repositories
vi.mock('../repositories/activityTypes.js');
vi.mock('../repositories/ownerProfiles.js');
vi.mock('../logger.js');

describe('calorieService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('calculateCalories', () => {
    it('should calculate calories using MET × weight × duration formula', async () => {
      const mockActivityType = {
        id: 'running-123',
        name: 'Running',
        met: 8.0,
        createdAt: new Date(),
      };

      const mockProfile = {
        ownerId: 'owner-123',
        weight: 70,
        updatedAt: new Date(),
      };

      vi.mocked(activityTypesRepo.getActivityTypeById).mockResolvedValue(mockActivityType);
      vi.mocked(ownerProfilesRepo.getProfileByOwnerId).mockResolvedValue(mockProfile);

      // 8.0 MET × 70 kg × 1 hour (60 minutes) = 560 calories
      const result = await calculateCalories('owner-123', 'running-123', 60);

      expect(result.calculatedCalories).toBe(560);
      expect(result.actualCalories).toBe(560);
      expect(result.isOverridden).toBe(false);
      expect(result.met).toBe(8.0);
      expect(result.weight).toBe(70);
      expect(result.durationHours).toBe(1);
    });

    it('should handle decimal durations correctly', async () => {
      const mockActivityType = {
        id: 'walking-123',
        name: 'Walking',
        met: 3.5,
        createdAt: new Date(),
      };

      const mockProfile = {
        ownerId: 'owner-123',
        weight: 75,
        updatedAt: new Date(),
      };

      vi.mocked(activityTypesRepo.getActivityTypeById).mockResolvedValue(mockActivityType);
      vi.mocked(ownerProfilesRepo.getProfileByOwnerId).mockResolvedValue(mockProfile);

      // 3.5 MET × 75 kg × 0.5 hours (30 minutes) = 131.25 calories
      const result = await calculateCalories('owner-123', 'walking-123', 30);

      expect(result.calculatedCalories).toBe(131.25);
      expect(result.actualCalories).toBe(131.25);
      expect(result.isOverridden).toBe(false);
    });

    it('should use override calories when provided', async () => {
      const mockActivityType = {
        id: 'cycling-123',
        name: 'Cycling',
        met: 7.5,
        createdAt: new Date(),
      };

      const mockProfile = {
        ownerId: 'owner-123',
        weight: 80,
        updatedAt: new Date(),
      };

      vi.mocked(activityTypesRepo.getActivityTypeById).mockResolvedValue(mockActivityType);
      vi.mocked(ownerProfilesRepo.getProfileByOwnerId).mockResolvedValue(mockProfile);

      // Calculated: 7.5 × 80 × 1 = 600
      // Override: 700
      const result = await calculateCalories('owner-123', 'cycling-123', 60, 700);

      expect(result.calculatedCalories).toBe(600);
      expect(result.actualCalories).toBe(700);
      expect(result.isOverridden).toBe(true);
    });

    it('should throw error when activity type not found', async () => {
      vi.mocked(activityTypesRepo.getActivityTypeById).mockResolvedValue(null);
      vi.mocked(ownerProfilesRepo.getProfileByOwnerId).mockResolvedValue(null);

      await expect(
        calculateCalories('owner-123', 'invalid-123', 60)
      ).rejects.toThrow('Activity type not found');
    });

    it('should throw error when owner profile not found', async () => {
      const mockActivityType = {
        id: 'running-123',
        name: 'Running',
        met: 8.0,
        createdAt: new Date(),
      };

      vi.mocked(activityTypesRepo.getActivityTypeById).mockResolvedValue(mockActivityType);
      vi.mocked(ownerProfilesRepo.getProfileByOwnerId).mockResolvedValue(null);

      await expect(
        calculateCalories('owner-123', 'running-123', 60)
      ).rejects.toThrow('Owner profile not found');
    });
  });

  describe('isCalorieOverrideSuspicious', () => {
    it('should return false when override is within 10% of calculated', () => {
      // Calculated: 600, Override: 620 (3.3% difference)
      expect(isCalorieOverrideSuspicious(600, 620)).toBe(false);
    });

    it('should return true when override is more than 10% different', () => {
      // Calculated: 600, Override: 700 (16.7% difference)
      expect(isCalorieOverrideSuspicious(600, 700)).toBe(true);
    });

    it('should return true when override is significantly lower', () => {
      // Calculated: 600, Override: 480 (20% difference)
      expect(isCalorieOverrideSuspicious(600, 480)).toBe(true);
    });

    it('should handle edge case when calculated is 0', () => {
      expect(isCalorieOverrideSuspicious(0, 100)).toBe(true);
      expect(isCalorieOverrideSuspicious(0, 0)).toBe(false);
    });

    it('should accept custom threshold', () => {
      // Calculated: 600, Override: 650 (8.3% difference)
      // With 5% threshold, should be suspicious
      // With 10% threshold, should be fine
      expect(isCalorieOverrideSuspicious(600, 650, 0.05)).toBe(true);
      expect(isCalorieOverrideSuspicious(600, 650, 0.1)).toBe(false);
    });
  });
});
