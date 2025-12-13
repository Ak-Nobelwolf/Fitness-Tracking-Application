-- Oracle schema for activity tracking
--
-- Tables:
--   owners
--   owner_profiles
--   activity_types
--   activities
--
-- Notes:
-- * All tables are multi-tenant and include OWNER_ID as the leading key (CHAR(36) UUID).
-- * UPDATED_AT is maintained via triggers (Oracle has no ON UPDATE default).

-- =========================
-- Core tables
-- =========================

CREATE TABLE owners (
  owner_id   CHAR(36) NOT NULL,
  email      VARCHAR2(320),
  created_at TIMESTAMP(6) WITH TIME ZONE DEFAULT SYSTIMESTAMP NOT NULL,
  updated_at TIMESTAMP(6) WITH TIME ZONE DEFAULT SYSTIMESTAMP NOT NULL,
  CONSTRAINT pk_owners PRIMARY KEY (owner_id),
  CONSTRAINT uq_owners_email UNIQUE (email)
);

CREATE TABLE owner_profiles (
  owner_id     CHAR(36) NOT NULL,
  display_name VARCHAR2(120),
  weight_kg    NUMBER(6, 2),
  height_cm    NUMBER(6, 2),
  created_at   TIMESTAMP(6) WITH TIME ZONE DEFAULT SYSTIMESTAMP NOT NULL,
  updated_at   TIMESTAMP(6) WITH TIME ZONE DEFAULT SYSTIMESTAMP NOT NULL,
  CONSTRAINT pk_owner_profiles PRIMARY KEY (owner_id),
  CONSTRAINT fk_owner_profiles_owner FOREIGN KEY (owner_id)
    REFERENCES owners (owner_id)
    ON DELETE CASCADE,
  CONSTRAINT ck_owner_profiles_weight CHECK (weight_kg IS NULL OR (weight_kg > 0 AND weight_kg <= 1000)),
  CONSTRAINT ck_owner_profiles_height CHECK (height_cm IS NULL OR (height_cm > 0 AND height_cm <= 300))
);

CREATE TABLE activity_types (
  owner_id         CHAR(36) NOT NULL,
  activity_type_id CHAR(36) NOT NULL,
  name             VARCHAR2(120) NOT NULL,
  met              NUMBER(5, 2) NOT NULL,
  created_at       TIMESTAMP(6) WITH TIME ZONE DEFAULT SYSTIMESTAMP NOT NULL,
  updated_at       TIMESTAMP(6) WITH TIME ZONE DEFAULT SYSTIMESTAMP NOT NULL,
  CONSTRAINT pk_activity_types PRIMARY KEY (owner_id, activity_type_id),
  CONSTRAINT fk_activity_types_owner FOREIGN KEY (owner_id)
    REFERENCES owners (owner_id)
    ON DELETE CASCADE,
  CONSTRAINT uq_activity_types_owner_name UNIQUE (owner_id, name),
  CONSTRAINT ck_activity_types_met CHECK (met > 0 AND met <= 30)
);

CREATE TABLE activities (
  owner_id          CHAR(36) NOT NULL,
  activity_id       CHAR(36) NOT NULL,
  activity_type_id  CHAR(36) NOT NULL,
  activity_date     DATE NOT NULL,
  started_at        TIMESTAMP(6) WITH TIME ZONE,
  ended_at          TIMESTAMP(6) WITH TIME ZONE,
  duration_minutes  NUMBER(10, 2) NOT NULL,
  duration_source   VARCHAR2(20) DEFAULT 'MANUAL' NOT NULL,
  calories          NUMBER(10, 2) NOT NULL,
  calorie_source    VARCHAR2(20) DEFAULT 'AUTO' NOT NULL,
  calories_override NUMBER(10, 2),
  notes             VARCHAR2(1000),
  created_at        TIMESTAMP(6) WITH TIME ZONE DEFAULT SYSTIMESTAMP NOT NULL,
  updated_at        TIMESTAMP(6) WITH TIME ZONE DEFAULT SYSTIMESTAMP NOT NULL,
  CONSTRAINT pk_activities PRIMARY KEY (owner_id, activity_id),
  CONSTRAINT fk_activities_owner FOREIGN KEY (owner_id)
    REFERENCES owners (owner_id)
    ON DELETE CASCADE,
  CONSTRAINT fk_activities_type FOREIGN KEY (owner_id, activity_type_id)
    REFERENCES activity_types (owner_id, activity_type_id)
    ON DELETE CASCADE,
  CONSTRAINT ck_activities_duration CHECK (duration_minutes > 0),
  CONSTRAINT ck_activities_duration_source CHECK (duration_source IN ('MANUAL', 'CALCULATED')),
  CONSTRAINT ck_activities_calorie_source CHECK (calorie_source IN ('AUTO', 'OVERRIDE')),
  CONSTRAINT ck_activities_calories CHECK (calories >= 0 AND calories <= 20000),
  CONSTRAINT ck_activities_calories_override CHECK (calories_override IS NULL OR (calories_override >= 0 AND calories_override <= 20000)),
  CONSTRAINT ck_activities_calorie_override_logic CHECK (
    (calorie_source = 'AUTO' AND calories_override IS NULL)
    OR (calorie_source = 'OVERRIDE' AND calories_override IS NOT NULL)
  )
);

-- =========================
-- Indexes (aggregation-heavy queries)
-- =========================

CREATE INDEX idx_activities_owner_date ON activities (owner_id, activity_date);
CREATE INDEX idx_activities_owner_type_date ON activities (owner_id, activity_type_id, activity_date);
CREATE INDEX idx_activity_types_owner_created_at ON activity_types (owner_id, created_at);

-- =========================
-- UPDATED_AT triggers
-- =========================

CREATE OR REPLACE TRIGGER trg_owners_set_updated_at
BEFORE UPDATE ON owners
FOR EACH ROW
BEGIN
  :NEW.updated_at := SYSTIMESTAMP;
END;
/

CREATE OR REPLACE TRIGGER trg_owner_profiles_set_updated_at
BEFORE UPDATE ON owner_profiles
FOR EACH ROW
BEGIN
  :NEW.updated_at := SYSTIMESTAMP;
END;
/

CREATE OR REPLACE TRIGGER trg_activity_types_set_updated_at
BEFORE UPDATE ON activity_types
FOR EACH ROW
BEGIN
  :NEW.updated_at := SYSTIMESTAMP;
END;
/

CREATE OR REPLACE TRIGGER trg_activities_set_updated_at
BEFORE UPDATE ON activities
FOR EACH ROW
BEGIN
  :NEW.updated_at := SYSTIMESTAMP;
END;
/

-- =========================
-- Helper views for rollups
-- =========================

CREATE OR REPLACE VIEW v_activities_effective AS
SELECT
  a.owner_id,
  a.activity_id,
  a.activity_type_id,
  a.activity_date,
  a.started_at,
  a.ended_at,
  a.duration_minutes,
  a.duration_source,
  a.calories,
  a.calorie_source,
  a.calories_override,
  NVL(a.calories_override, a.calories) AS calories_effective,
  a.notes,
  a.created_at,
  a.updated_at
FROM activities a;

CREATE OR REPLACE VIEW v_activity_daily_rollup AS
SELECT
  owner_id,
  TRUNC(activity_date) AS day_date,
  COUNT(*) AS activity_count,
  SUM(duration_minutes) AS total_duration_minutes,
  SUM(calories_effective) AS total_calories
FROM v_activities_effective
GROUP BY owner_id, TRUNC(activity_date);

CREATE OR REPLACE VIEW v_activity_weekly_rollup AS
SELECT
  owner_id,
  TRUNC(activity_date, 'IW') AS week_start_date,
  COUNT(*) AS activity_count,
  SUM(duration_minutes) AS total_duration_minutes,
  SUM(calories_effective) AS total_calories
FROM v_activities_effective
GROUP BY owner_id, TRUNC(activity_date, 'IW');

CREATE OR REPLACE VIEW v_activity_monthly_rollup AS
SELECT
  owner_id,
  TRUNC(activity_date, 'MM') AS month_start_date,
  COUNT(*) AS activity_count,
  SUM(duration_minutes) AS total_duration_minutes,
  SUM(calories_effective) AS total_calories
FROM v_activities_effective
GROUP BY owner_id, TRUNC(activity_date, 'MM');
