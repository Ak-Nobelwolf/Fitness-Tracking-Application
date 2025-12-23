# Activity Dropdown Fix

## Issue
The activities dropdown was missing values because the automatic seeding function only included 81 activities instead of the complete set of 107 activities.

## Root Cause
The application uses automatic activity type seeding when a user first accesses their activity types. This seeding happens in `/home/engine/project/server/src/repositories/activityTypes.ts` in the `seedDefaultActivityTypes()` function.

While a comprehensive seed.sql file existed with 107 activities, the programmatic seeding function only had 81 activities. The seed.sql file is a reference file only - the actual seeding happens through the TypeScript function.

## Solution
Updated the `seedDefaultActivityTypes()` function in `/home/engine/project/server/src/repositories/activityTypes.ts` to include all 107 activities from the seed.sql file.

## Activities Added (26 new activities)
The following activities were added to bring the total from 81 to 107:

### Water Sports (2 additional)
- Rowing (vigorous) - 8.5 MET
- Canoeing - 4.0 MET

### Ball Sports (11 additional)
- Basketball (shooting) - 4.5 MET  
- Table tennis - 4.0 MET
- Ping pong - 3.5 MET
- Volleyball (beach) - 8.0 MET
- Volleyball (indoor) - 6.0 MET
- Softball - 5.0 MET
- Cricket (batting) - 4.0 MET
- Cricket (bowling) - 6.5 MET
- Cricket (fielding) - 5.0 MET
- Golf (cart) - 3.5 MET
- Hockey (field) - 7.5 MET

### Precision Sports (2 additional)
- Snooker - 2.5 MET
- Pool - 2.5 MET

### Outdoor Activities (5 additional)
- Mountaineering - 10.0 MET
- Sledding - 5.3 MET
- Snowshoeing - 6.0 MET
- Backpacking - 7.0 MET
- Camping - 4.0 MET

### Dance & Aerobics (2 additional)
- Contemporary dance - 5.0 MET
- Belly dancing - 3.0 MET

### Martial Arts (1 additional)
- Boxing (bag work) - 5.5 MET (separate from Boxing (sparring))

### Gym & Fitness (1 additional)
- Calisthenics - 6.0 MET

### Sports & Recreation (2 additional)
- Skating (roller) - 7.3 MET
- (Gymnastics changed from 4.0 to 6.0 MET for consistency)

## Complete Activity List (107 Total)
### Categories:
- Walking & Running: 8 activities
- Cycling: 4 activities
- Swimming: 4 activities
- Water Sports: 8 activities
- Ball Sports: 21 activities
- Racket Sports: 3 activities
- Precision Sports: 5 activities
- Outdoor Activities: 11 activities
- Dance & Aerobics: 7 activities
- Martial Arts: 8 activities
- Gym & Fitness: 9 activities
- Yoga & Meditation: 5 activities
- Sports & Recreation: 8 activities
- Walking & Climbing: 3 activities
- Swimming variations: 3 activities

## Testing
- Backend build: ✓ Successful
- Frontend build: ✓ Successful
- Unit tests: ✓ All 25 tests passing

## How It Works
When a new user accesses the application:
1. Frontend requests activity types via `/api/v1/activity-types`
2. Backend checks if activity types exist for that user's ownerId
3. If none exist, `seedDefaultActivityTypes()` is automatically called
4. All 107 activities are inserted into the database for that user
5. Frontend dropdown is populated with all activities

## Files Modified
- `/home/engine/project/server/src/repositories/activityTypes.ts` - Added 26 activities to the seeding function

## Verification
To verify the fix:
```bash
# Count activities in the seeding function
cd /home/engine/project/server/src/repositories
grep -c "{ name:" activityTypes.ts
# Should output: 107
```

All activities now include accurate MET (Metabolic Equivalent of Task) values for proper calorie calculations.
