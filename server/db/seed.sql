-- Seed data (sample owner + common activity types with MET values)
--
-- This file is safe to edit: replace OWNER_ID with the UUID for your user/tenant.

DEFINE OWNER_ID = '11111111-1111-1111-1111-111111111111';

INSERT INTO owners (owner_id, email)
VALUES ('&OWNER_ID', 'demo@example.com');

INSERT INTO owner_profiles (owner_id, display_name, weight_kg, height_cm)
VALUES ('&OWNER_ID', 'Demo User', 75, 175);

-- Activity types (MET values are approximate; see README for calculation details)
INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'Walking (3 mph)', 3.3);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'Jogging (5 mph)', 8.3);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'Running (7 mph)', 11.5);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', 'Cycling (moderate)', 7.5);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 'Swimming (moderate)', 6.0);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6', 'Rowing (moderate)', 7.0);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa7', 'Strength training', 6.0);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa8', 'Yoga', 2.5);

COMMIT;
