import { z } from 'zod';

export const ownerIdSchema = z.string().uuid('Invalid owner ID');

export const ownerProfileUpsertSchema = z.object({
  weight: z.number().positive('Weight must be greater than 0'),
  height: z.number().positive('Height must be greater than 0').optional(),
  age: z.number().int('Age must be an integer').positive('Age must be greater than 0').optional(),
  gender: z.string().max(20).optional(),
});

export const activityTypeCreateSchema = z.object({
  id: z.string().uuid('Invalid activity type ID').optional(),
  name: z.string().min(1).max(100),
  met: z.number().positive('MET must be greater than 0'),
  description: z.string().max(255).optional(),
});

export const activityTypeUpdateSchema = activityTypeCreateSchema
  .omit({ id: true })
  .partial()
  .refine((val) => Object.keys(val).length > 0, { message: 'At least one field must be provided' });

export const activityCreateSchema = z.object({
  id: z.string().uuid('Invalid activity ID').optional(),
  activityTypeId: z.string().uuid('Invalid activity type ID'),
  startTime: z.string().datetime('Invalid startTime (expected ISO datetime)'),
  endTime: z.string().datetime('Invalid endTime (expected ISO datetime)'),
  durationMinutes: z.number().positive('Duration must be greater than 0').optional(),
  caloriesOverride: z.number().nonnegative('Calories override cannot be negative').nullable().optional(),
  notes: z.string().max(255).nullable().optional(),
});

export const activityUpdateSchema = z
  .object({
    activityTypeId: z.string().uuid('Invalid activity type ID').optional(),
    startTime: z.string().datetime('Invalid startTime (expected ISO datetime)').optional(),
    endTime: z.string().datetime('Invalid endTime (expected ISO datetime)').optional(),
    durationMinutes: z.number().positive('Duration must be greater than 0').optional(),
    caloriesOverride: z.number().nonnegative('Calories override cannot be negative').nullable().optional(),
    notes: z.string().max(255).nullable().optional(),
  })
  .refine((val) => Object.keys(val).length > 0, { message: 'At least one field must be provided' });

export const activityBulkUpsertItemSchema = activityCreateSchema.extend({
  clientTempId: z.string().max(128).optional(),
});

export const activityBulkUpsertSchema = z
  .union([
    z.array(activityBulkUpsertItemSchema),
    z.object({ activities: z.array(activityBulkUpsertItemSchema) }),
  ])
  .transform((val) => (Array.isArray(val) ? val : val.activities));

export const dashboardDateQuerySchema = z.object({
  date: z
    .string()
    .optional()
    .refine((v) => v === undefined || !Number.isNaN(Date.parse(v)), {
      message: 'Invalid date (expected ISO date or datetime)',
    }),
});

export const dashboardBreakdownQuerySchema = z.object({
  from: z
    .string()
    .optional()
    .refine((v) => v === undefined || !Number.isNaN(Date.parse(v)), {
      message: 'Invalid from (expected ISO date or datetime)',
    }),
  to: z
    .string()
    .optional()
    .refine((v) => v === undefined || !Number.isNaN(Date.parse(v)), {
      message: 'Invalid to (expected ISO date or datetime)',
    }),
});
