# Server - Data Layer

This is the backend data layer of the fitness tracking application, providing strongly-typed access to Oracle database operations.

## Features

- **Oracle Database Integration**: Connection pool management with health checks
- **Repository Pattern**: Strongly typed CRUD operations for:
  - Owners (users)
  - Owner Profiles (weight, height, age, gender)
  - Activity Types (with MET values)
  - Activities (with calorie tracking)
- **Services**:
  - `calorieService`: Calculates calories using MET × weight × duration formula with override support
  - `aggregationService`: Provides daily, weekly, and monthly stats
- **Validation**: Zod-based schemas with soft warning flags for:
  - Duration validation (> 0)
  - Time range validation (start < end)
  - Calorie bounds validation
- **Owner ID Helper**: Generates and persists UUIDs for owner tracking
- **Comprehensive Tests**: Unit tests for calorie calculator and validation logic

## Setup

### Installation

```bash
npm install
```

### Configuration

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Update the environment variables with your Oracle database credentials.

## Usage

### Initialize Database Connection

```typescript
import { initializePool, healthCheck } from './index.js';

await initializePool({
  user: process.env.ORACLE_USER,
  password: process.env.ORACLE_PASSWORD,
  connectString: process.env.ORACLE_CONNECT_STRING,
});

// Verify connection
const isHealthy = await healthCheck();
```

### Working with Repositories

```typescript
import {
  createActivity,
  getActivitiesByOwnerId,
  updateActivity,
  deleteActivity,
} from './index.js';

// Create an activity
const activity = await createActivity({
  id: crypto.randomUUID(),
  ownerId: 'owner-uuid',
  activityTypeId: 'running-uuid',
  startTime: new Date('2024-01-01T10:00:00Z'),
  endTime: new Date('2024-01-01T11:00:00Z'),
  durationMinutes: 60,
  caloriesBurned: 500,
});

// Fetch activities
const activities = await getActivitiesByOwnerId('owner-uuid');

// Update an activity
const updated = await updateActivity(activity.id, {
  caloriesOverride: 600,
});

// Delete an activity
await deleteActivity(activity.id);
```

### Calculating Calories

```typescript
import { calculateCalories } from './index.js';

const result = await calculateCalories(
  'owner-uuid',
  'activity-type-uuid',
  60, // duration in minutes
  600 // optional override
);

console.log(result);
// {
//   calculatedCalories: 560,
//   actualCalories: 600,
//   isOverridden: true,
//   met: 8.0,
//   weight: 70,
//   durationHours: 1
// }
```

### Aggregating Stats

```typescript
import {
  getDailyStats,
  getWeeklyStats,
  getMonthlyStats,
} from './index.js';

// Get stats for today
const dailyStats = await getDailyStats('owner-uuid');

// Get stats for current week
const weeklyStats = await getWeeklyStats('owner-uuid');

// Get stats for current month
const monthlyStats = await getMonthlyStats('owner-uuid');
```

### Validating Activities

```typescript
import { validateActivity } from './index.js';

const result = validateActivity({
  activityTypeId: '550e8400-e29b-41d4-a716-446655440000',
  ownerId: '550e8400-e29b-41d4-a716-446655440001',
  startTime: '2024-01-01T10:00:00Z',
  endTime: '2024-01-01T11:00:00Z',
  durationMinutes: 60,
  caloriesBurned: 500,
});

if (result.flags.duration) {
  console.warn('Duration warning:', result.flags.duration);
}
if (result.flags.timeRange) {
  console.warn('Time range warning:', result.flags.timeRange);
}
if (result.flags.calories) {
  console.warn('Calories warning:', result.flags.calories);
}
```

## Testing

Run all tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm test -- --watch
```

Generate coverage report:

```bash
npm run test:coverage
```

## Build

Compile TypeScript to JavaScript:

```bash
npm run build
```

The compiled files will be in the `dist/` directory.

## Development

Start the development server:

```bash
npm run dev
```

## Directory Structure

```
server/
├── src/
│   ├── config/
│   │   └── oracle.ts           # Oracle connection pool initialization
│   ├── repositories/
│   │   ├── owners.ts           # Owner CRUD operations
│   │   ├── ownerProfiles.ts    # Profile CRUD operations
│   │   ├── activityTypes.ts    # Activity type CRUD operations
│   │   └── activities.ts       # Activity CRUD operations
│   ├── services/
│   │   ├── calorieService.ts   # Calorie calculation logic
│   │   └── aggregationService.ts # Stats aggregation
│   ├── validation/
│   │   └── activitySchema.ts   # Zod schemas and validation
│   ├── helpers/
│   │   └── ownerId.ts          # Owner ID generation/persistence
│   ├── tests/
│   │   ├── calorieService.test.ts
│   │   └── activitySchema.test.ts
│   ├── logger.ts               # Logging configuration
│   └── index.ts                # Public API exports
├── package.json
├── tsconfig.server.json
└── vitest.config.ts
```

## Database Schema Requirements

The following tables should exist in the Oracle database:

```sql
CREATE TABLE owners (
  id VARCHAR2(36) PRIMARY KEY,
  created_at TIMESTAMP DEFAULT SYSDATE NOT NULL
);

CREATE TABLE owner_profiles (
  owner_id VARCHAR2(36) PRIMARY KEY,
  weight NUMBER(5,2) NOT NULL,
  height NUMBER(5,2),
  age NUMBER(3),
  gender VARCHAR2(1),
  updated_at TIMESTAMP DEFAULT SYSDATE NOT NULL,
  FOREIGN KEY (owner_id) REFERENCES owners(id)
);

CREATE TABLE activity_types (
  id VARCHAR2(36) PRIMARY KEY,
  name VARCHAR2(100) NOT NULL,
  met NUMBER(4,2) NOT NULL,
  description VARCHAR2(255),
  created_at TIMESTAMP DEFAULT SYSDATE NOT NULL
);

CREATE TABLE activities (
  id VARCHAR2(36) PRIMARY KEY,
  owner_id VARCHAR2(36) NOT NULL,
  activity_type_id VARCHAR2(36) NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  duration_minutes NUMBER(4) NOT NULL,
  calories_burned NUMBER(7,2) NOT NULL,
  calories_override NUMBER(7,2),
  notes VARCHAR2(255),
  created_at TIMESTAMP DEFAULT SYSDATE NOT NULL,
  updated_at TIMESTAMP DEFAULT SYSDATE NOT NULL,
  FOREIGN KEY (owner_id) REFERENCES owners(id),
  FOREIGN KEY (activity_type_id) REFERENCES activity_types(id)
);

CREATE INDEX idx_activities_owner_start ON activities(owner_id, start_time);
CREATE INDEX idx_activities_start_date ON activities(TRUNC(start_time));
```
