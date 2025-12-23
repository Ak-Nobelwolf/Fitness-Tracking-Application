-- Seed data (sample owner + common activity types with MET values)
--
-- This file is safe to edit: replace OWNER_ID with the UUID for your user/tenant.

DEFINE OWNER_ID = '11111111-1111-1111-1111-111111111111';

INSERT INTO owners (owner_id, email)
VALUES ('&OWNER_ID', 'demo@example.com');

INSERT INTO owner_profiles (owner_id, display_name, weight_kg, height_cm)
VALUES ('&OWNER_ID', 'Demo User', 75, 175);

-- Activity types (MET values are approximate; see README for calculation details)

-- Walking & Running
INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'Walking (2 mph)', 2.8);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'Walking (3 mph)', 3.3);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'Walking (4 mph)', 5.0);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', 'Jogging (5 mph)', 8.3);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 'Running (6 mph)', 9.8);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6', 'Running (7 mph)', 11.5);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa7', 'Running (8 mph)', 13.5);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa8', 'Sprinting (10 mph)', 16.0);

-- Cycling
INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa9', 'Cycling (leisure)', 4.0);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa10', 'Cycling (moderate)', 7.5);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa11', 'Cycling (vigorous)', 10.0);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa12', 'Mountain biking', 12.0);

-- Swimming
INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa13', 'Swimming (leisure)', 6.0);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa14', 'Swimming (moderate)', 8.0);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa15', 'Swimming (vigorous)', 10.0);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa16', 'Swimming (butterfly)', 13.8);

-- Water Sports
INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa17', 'Rowing (moderate)', 7.0);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa18', 'Rowing (vigorous)', 8.5);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa19', 'Kayaking', 5.0);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa20', 'Canoeing', 4.0);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa21', 'Surfing', 3.0);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa22', 'Water skiing', 6.0);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa23', 'Wakeboarding', 5.5);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa24', 'Wind surfing', 5.0);

-- Ball Sports
INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa25', 'Basketball (game)', 8.0);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa26', 'Basketball (shooting)', 4.5);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa27', 'Soccer (game)', 7.0);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa28', 'Tennis (singles)', 8.0);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa29', 'Tennis (doubles)', 5.0);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa30', 'Badminton', 5.5);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa31', 'Table tennis', 4.0);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa32', 'Ping pong', 3.5);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa33', 'Volleyball (beach)', 8.0);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa34', 'Volleyball (indoor)', 6.0);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa35', 'Baseball', 5.0);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa36', 'Softball', 5.0);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa37', 'Cricket (batting)', 4.0);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa38', 'Cricket (bowling)', 6.5);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa39', 'Cricket (fielding)', 5.0);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa40', 'Golf (walking)', 4.3);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa41', 'Golf (cart)', 3.5);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa42', 'Football (tackle)', 8.0);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa43', 'Rugby', 8.0);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa44', 'Hockey (field)', 7.5);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa45', 'Ice hockey', 8.0);

-- Racket Sports
INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa46', 'Squash', 12.0);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa47', 'Racquetball', 8.5);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa48', 'Handball', 12.0);

-- Precision Sports
INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa49', 'Snooker', 2.5);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa50', 'Billiards', 2.5);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa51', 'Pool', 2.5);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa52', 'Bowling', 3.8);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa53', 'Darts', 2.5);

-- Outdoor Activities
INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa54', 'Hiking', 6.0);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa55', 'Rock climbing', 8.0);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa56', 'Mountaineering', 10.0);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa57', 'Cross-country skiing', 9.0);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa58', 'Downhill skiing', 6.0);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa59', 'Snowboarding', 5.3);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa60', 'Ice skating', 7.0);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa61', 'Sledding', 5.3);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa62', 'Snowshoeing', 6.0);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa63', 'Backpacking', 7.0);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa64', 'Camping', 4.0);

-- Dance & Aerobics
INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa65', 'Aerobic dancing', 7.3);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa66', 'Step aerobics', 9.5);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa67', 'Hip hop dancing', 5.5);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa68', 'Ballet', 5.0);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa69', 'Contemporary dance', 5.0);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa70', 'Belly dancing', 3.0);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa71', 'Zumba', 7.5);

-- Martial Arts
INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa72', 'Boxing (sparring)', 12.8);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa73', 'Boxing (bag work)', 5.5);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa74', 'Karate', 8.0);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa75', 'Judo', 8.5);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa76', 'Taekwondo', 8.5);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa77', 'Muay Thai', 10.0);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa78', 'Tai Chi', 3.0);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa79', 'Wrestling', 6.0);

-- Gym & Fitness
INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa80', 'Strength training', 6.0);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa81', 'Calisthenics', 6.0);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa82', 'Circuit training', 8.0);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa83', 'Elliptical trainer', 5.0);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa84', 'Stair climber', 8.8);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa85', 'Stationary cycling', 7.0);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa86', 'Rowing machine', 7.0);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa87', 'Treadmill running', 9.8);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa88', 'Treadmill walking', 4.5);

-- Yoga & Meditation
INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa89', 'Yoga (Hatha)', 2.5);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa90', 'Yoga (Power)', 4.0);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa91', 'Yoga (Bikram)', 5.0);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa92', 'Pilates', 3.0);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa93', 'Meditation', 1.3);

-- Sports & Recreation
INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa94', 'Frisbee', 3.0);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa95', 'Archery', 3.5);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa96', 'Fencing', 6.0);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa97', 'Gymnastics', 6.0);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa98', 'Cheerleading', 6.0);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa99', 'Skateboarding', 5.0);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa100', 'Rollerblading', 7.5);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa101', 'Skating (roller)', 7.3);

-- Walking & Climbing
INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa102', 'Stair climbing', 8.8);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa103', 'Ladder climbing', 8.0);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa104', 'Rope jumping', 11.8);

-- Swimming variations
INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa105', 'Water aerobics', 5.5);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa106', 'Synchronized swimming', 8.0);

INSERT INTO activity_types (owner_id, activity_type_id, name, met)
VALUES ('&OWNER_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa107', 'Water walking', 4.5);

COMMIT;
