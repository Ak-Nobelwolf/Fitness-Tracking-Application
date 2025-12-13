import { describe, it, expect } from 'vitest';
import {
  validateActivity,
  parseActivity,
  activitySchema,
  ValidationFlags,
  ActivityValidationConfig,
} from '../validation/activitySchema.js';

describe('activitySchema', () => {
  const validActivity = {
    activityTypeId: '550e8400-e29b-41d4-a716-446655440000',
    ownerId: '550e8400-e29b-41d4-a716-446655440001',
    startTime: '2024-01-01T10:00:00Z',
    endTime: '2024-01-01T11:00:00Z',
    durationMinutes: 60,
    caloriesBurned: 500,
  };

  describe('validateActivity', () => {
    it('should validate correct activity', () => {
      const result = validateActivity(validActivity);

      expect(result.data).toEqual(validActivity);
      expect(result.flags).toEqual({});
    });

    it('should flag duration <= 0', () => {
      const invalidActivity = { ...validActivity, durationMinutes: 0 };
      const result = validateActivity(invalidActivity);

      expect(result.flags.duration).toBeDefined();
      expect(result.flags.duration).toContain('greater than 0');
    });

    it('should flag negative duration', () => {
      const invalidActivity = { ...validActivity, durationMinutes: -30 };
      const result = validateActivity(invalidActivity);

      expect(result.flags.duration).toBeDefined();
    });

    it('should flag when start time >= end time', () => {
      const invalidActivity = {
        ...validActivity,
        startTime: '2024-01-01T12:00:00Z',
        endTime: '2024-01-01T11:00:00Z',
      };
      const result = validateActivity(invalidActivity);

      expect(result.flags.timeRange).toBeDefined();
      expect(result.flags.timeRange).toContain('Start time must be before end time');
    });

    it('should flag when start time equals end time', () => {
      const invalidActivity = {
        ...validActivity,
        startTime: '2024-01-01T11:00:00Z',
        endTime: '2024-01-01T11:00:00Z',
      };
      const result = validateActivity(invalidActivity);

      expect(result.flags.timeRange).toBeDefined();
    });

    it('should flag calories outside default bounds', () => {
      const invalidActivity = {
        ...validActivity,
        caloriesBurned: 15000, // Above default max of 10000
      };
      const result = validateActivity(invalidActivity);

      expect(result.flags.calories).toBeDefined();
      expect(result.flags.calories).toContain('10000');
    });

    it('should flag negative calories', () => {
      const invalidActivity = {
        ...validActivity,
        caloriesBurned: -100,
      };
      const result = validateActivity(invalidActivity);

      expect(result.flags.calories).toBeDefined();
    });

    it('should respect custom calorie bounds', () => {
      const config: ActivityValidationConfig = {
        minCalories: 50,
        maxCalories: 1000,
      };

      const validActivityWithConfig = {
        ...validActivity,
        caloriesBurned: 500,
      };
      let result = validateActivity(validActivityWithConfig, config);
      expect(result.flags.calories).toBeUndefined();

      const lowCalories = { ...validActivity, caloriesBurned: 30 };
      result = validateActivity(lowCalories, config);
      expect(result.flags.calories).toBeDefined();
      expect(result.flags.calories).toContain('50');

      const highCalories = { ...validActivity, caloriesBurned: 2000 };
      result = validateActivity(highCalories, config);
      expect(result.flags.calories).toBeDefined();
      expect(result.flags.calories).toContain('1000');
    });

    it('should handle Date objects as well as strings', () => {
      const activityWithDates = {
        ...validActivity,
        startTime: new Date('2024-01-01T10:00:00Z'),
        endTime: new Date('2024-01-01T11:00:00Z'),
      };
      const result = validateActivity(activityWithDates);

      expect(result.flags).toEqual({});
    });

    it('should support multiple validation flags at once', () => {
      const invalidActivity = {
        ...validActivity,
        durationMinutes: -10,
        startTime: '2024-01-01T12:00:00Z',
        endTime: '2024-01-01T11:00:00Z',
        caloriesBurned: 50000,
      };
      const result = validateActivity(invalidActivity);

      expect(result.flags.duration).toBeDefined();
      expect(result.flags.timeRange).toBeDefined();
      expect(result.flags.calories).toBeDefined();
    });
  });

  describe('parseActivity', () => {
    it('should parse valid activity', () => {
      const parsed = parseActivity(validActivity);

      expect(parsed.activityTypeId).toBe(validActivity.activityTypeId);
      expect(parsed.ownerId).toBe(validActivity.ownerId);
      expect(parsed.durationMinutes).toBe(validActivity.durationMinutes);
    });

    it('should throw on invalid UUID format', () => {
      const invalidActivity = {
        ...validActivity,
        activityTypeId: 'not-a-uuid',
      };

      expect(() => parseActivity(invalidActivity)).toThrow();
    });

    it('should throw on negative duration', () => {
      const invalidActivity = {
        ...validActivity,
        durationMinutes: -60,
      };

      expect(() => parseActivity(invalidActivity)).toThrow();
    });

    it('should throw on negative calories', () => {
      const invalidActivity = {
        ...validActivity,
        caloriesBurned: -100,
      };

      expect(() => parseActivity(invalidActivity)).toThrow();
    });

    it('should allow optional notes field', () => {
      const activityWithNotes = {
        ...validActivity,
        notes: 'Great workout!',
      };

      const parsed = parseActivity(activityWithNotes);
      expect(parsed.notes).toBe('Great workout!');
    });
  });
});
