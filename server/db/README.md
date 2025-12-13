# Oracle DB scripts

This directory contains Oracle SQL scripts for the activity tracking data model.

- `schema.sql` – creates tables, constraints, indexes, and helper rollup views
- `seed.sql` – inserts a demo owner and sample `activity_types` (with MET values)

## Entity overview

All tables are **multi-tenant** and include `owner_id CHAR(36)` as the leading key.

- `owners` – one row per owner/tenant (primary key `owner_id`)
- `owner_profiles` – optional 1:1 profile information (FK to `owners`, **ON DELETE CASCADE**)
- `activity_types` – per-owner catalog of activity definitions (PK `(owner_id, activity_type_id)`)
- `activities` – per-owner activity log (PK `(owner_id, activity_id)`, FK to `activity_types`, **ON DELETE CASCADE**)

### Manual vs. automatic calories

`activities` supports both calculated and manually-entered calories:

- `calories` – the system-calculated value (required)
- `calories_override` – optional manual override
- `calorie_source` – either:
  - `AUTO` (uses `calories`)
  - `OVERRIDE` (uses `calories_override`)

The helper view `v_activities_effective` exposes `calories_effective = NVL(calories_override, calories)` for reporting.

### Manual vs. calculated duration

`activities.duration_source` tracks how `duration_minutes` was produced:

- `MANUAL` – duration entered directly
- `CALCULATED` – duration derived from timestamps or an external device

A `CHECK` constraint enforces `duration_minutes > 0`.

## MET support (MET × weight × duration)

The schema supports the common estimation formula:

```
calories_kcal ≈ MET × weight_kg × duration_hours
```

Fields involved:

- `activity_types.met` – MET value for the activity type
- `owner_profiles.weight_kg` – owner weight (kg)
- `activities.duration_minutes` – duration of the activity

Example query to estimate calories (if you want to compute `activities.calories` during insert/update):

```sql
SELECT
  a.owner_id,
  a.activity_id,
  t.met,
  p.weight_kg,
  a.duration_minutes,
  (t.met * p.weight_kg * (a.duration_minutes / 60)) AS calories_estimate
FROM activities a
JOIN activity_types t
  ON t.owner_id = a.owner_id
 AND t.activity_type_id = a.activity_type_id
JOIN owner_profiles p
  ON p.owner_id = a.owner_id;
```

## Rollups

`schema.sql` creates helper views for aggregation-heavy queries:

- `v_activity_daily_rollup` (grouped by `TRUNC(activity_date)`)
- `v_activity_weekly_rollup` (grouped by ISO week start: `TRUNC(activity_date, 'IW')`)
- `v_activity_monthly_rollup` (grouped by month start: `TRUNC(activity_date, 'MM')`)

## Running on Oracle Cloud

You can run these scripts using Oracle SQLcl, SQL*Plus, or Oracle Database Tools in OCI.

1. Connect as the schema owner (the user that will own the tables).
2. Run the schema script:

   ```sql
   @schema.sql
   ```

3. (Optional) Run seeds (edit `OWNER_ID` in `seed.sql` first):

   ```sql
   @seed.sql
   ```

### Notes

- These scripts assume the connected user has privileges to `CREATE TABLE`, `CREATE VIEW`, `CREATE TRIGGER`, and `CREATE INDEX`.
- Run `schema.sql` on an empty schema (or drop existing objects first).
