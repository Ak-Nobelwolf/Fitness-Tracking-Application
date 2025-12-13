# Database Connection & Health Check Test Guide

This document outlines the steps to test the Express API's database connectivity and health check endpoints.

## Prerequisites

1. **Oracle Database**: Ensure you have access to an Oracle database instance
2. **Environment Configuration**: Update `.env` file with valid Oracle credentials
3. **Database Schema**: Run `db/schema.sql` to create tables
4. **Seed Data**: (Optional) Run `db/seed.sql` to insert sample data

## Configuration

The `.env` file has been created from `.env.example`. Update the following values:

```env
# Oracle Database Configuration
ORACLE_USER=your_actual_username
ORACLE_PASSWORD=your_actual_password
ORACLE_CONNECT_STRING=your_host:port/service_name

# Example for Oracle Cloud or local instance:
# ORACLE_CONNECT_STRING=myhost.oraclecloud.com:1521/ORCLPDB1

# Pool Configuration (optional)
ORACLE_POOL_MIN=2
ORACLE_POOL_MAX=10
ORACLE_POOL_INCREMENT=1

# Server
PORT=3001

# Logging
LOG_LEVEL=debug
NODE_ENV=development
```

## Starting the Server

From the `/server` directory:

```bash
npm run dev
```

The server will start on port 3001 (or the PORT specified in .env).

Expected console output:
```
API listening on port 3001
Oracle pool initialized successfully
```

## Testing Endpoints

### 1. Health Check Endpoint

**Request:**
```bash
curl http://localhost:3001/health
```

**Expected Response (200 OK):**
```json
{
  "status": "ok",
  "oracle": true
}
```

If the Oracle connection fails, `oracle` will be `false`.

### 2. Activity Types (GET)

Retrieve activity types for an owner.

**Request:**
```bash
curl http://localhost:3001/api/v1/activity-types \
  -H "x-owner-id: 11111111-1111-1111-1111-111111111111"
```

**Expected Response (200 OK):**
```json
{
  "activityTypes": [
    {
      "ownerId": "11111111-1111-1111-1111-111111111111",
      "activityTypeId": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1",
      "name": "Walking (3 mph)",
      "met": 3.3,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
    // ... more activity types
  ]
}
```

### 3. Owner Profile (PUT - Create/Update)

Create or update an owner profile.

**Request:**
```bash
curl -X PUT http://localhost:3001/api/v1/owners/profile \
  -H "Content-Type: application/json" \
  -H "x-owner-id: 11111111-1111-1111-1111-111111111111" \
  -d '{
    "displayName": "Test User",
    "weightKg": 75,
    "heightCm": 175
  }'
```

**Expected Response (200 OK):**
```json
{
  "profile": {
    "ownerId": "11111111-1111-1111-1111-111111111111",
    "displayName": "Test User",
    "weightKg": 75,
    "heightCm": 175,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 4. Owner Profile (GET - Retrieve)

Retrieve an existing owner profile.

**Request:**
```bash
curl http://localhost:3001/api/v1/owners/profile \
  -H "x-owner-id: 11111111-1111-1111-1111-111111111111"
```

**Expected Response (200 OK):**
```json
{
  "profile": {
    "ownerId": "11111111-1111-1111-1111-111111111111",
    "displayName": "Test User",
    "weightKg": 75,
    "heightCm": 175,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 5. Create Activity (POST)

Create a new activity with automatic calorie calculation.

**Request:**
```bash
curl -X POST http://localhost:3001/api/v1/activities \
  -H "Content-Type: application/json" \
  -H "x-owner-id: 11111111-1111-1111-1111-111111111111" \
  -d '{
    "activityTypeId": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2",
    "startTime": "2024-01-15T10:00:00Z",
    "endTime": "2024-01-15T11:00:00Z",
    "durationMinutes": 60,
    "notes": "Morning jog"
  }'
```

**Expected Response (201 Created):**
```json
{
  "activity": {
    "id": "generated-uuid",
    "ownerId": "11111111-1111-1111-1111-111111111111",
    "activityTypeId": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2",
    "startTime": "2024-01-15T10:00:00.000Z",
    "endTime": "2024-01-15T11:00:00.000Z",
    "durationMinutes": 60,
    "caloriesBurned": 622.5,
    "notes": "Morning jog",
    "createdAt": "2024-01-15T10:05:00.000Z",
    "updatedAt": "2024-01-15T10:05:00.000Z"
  },
  "calculation": {
    "calculatedCalories": 622.5,
    "actualCalories": 622.5,
    "isOverridden": false,
    "met": 8.3,
    "weight": 75,
    "durationHours": 1
  }
}
```

Note: Calories are calculated using: MET (8.3) × weight (75 kg) × duration (1 hour) = 622.5 kcal

### 6. Dashboard Daily Stats (GET)

Get daily activity summary.

**Request:**
```bash
curl http://localhost:3001/api/v1/dashboard/daily \
  -H "x-owner-id: 11111111-1111-1111-1111-111111111111"
```

**Expected Response (200 OK):**
```json
{
  "date": "2024-01-15",
  "activityCount": 1,
  "totalDuration": 60,
  "totalCalories": 622.5
}
```

### 7. Dashboard (GET - Full Dashboard)

Get comprehensive dashboard data (daily, weekly, monthly stats).

**Request:**
```bash
curl http://localhost:3001/api/v1/dashboard \
  -H "x-owner-id: 11111111-1111-1111-1111-111111111111"
```

**Expected Response (200 OK):**
```json
{
  "daily": {
    "date": "2024-01-15",
    "activityCount": 1,
    "totalDuration": 60,
    "totalCalories": 622.5
  },
  "weekly": {
    "weekStart": "2024-01-15",
    "weekEnd": "2024-01-21",
    "activityCount": 1,
    "totalDuration": 60,
    "totalCalories": 622.5
  },
  "monthly": {
    "monthStart": "2024-01-01",
    "monthEnd": "2024-01-31",
    "activityCount": 1,
    "totalDuration": 60,
    "totalCalories": 622.5
  },
  "breakdown": [
    {
      "activityTypeId": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2",
      "activityTypeName": "Jogging (5 mph)",
      "count": 1,
      "totalDuration": 60,
      "totalCalories": 622.5
    }
  ]
}
```

## Error Scenarios

### Missing Owner ID Header

**Request:**
```bash
curl http://localhost:3001/api/v1/activity-types
```

**Expected Response (400 Bad Request):**
```json
{
  "error": {
    "message": "Missing or invalid owner id. Provide x-owner-id header or owner_id query param.",
    "code": "OWNER_ID_REQUIRED"
  }
}
```

### Invalid Owner ID Format

**Request:**
```bash
curl http://localhost:3001/api/v1/activity-types \
  -H "x-owner-id: invalid-uuid"
```

**Expected Response (400 Bad Request):**
```json
{
  "error": {
    "message": "Missing or invalid owner id. Provide x-owner-id header or owner_id query param.",
    "code": "OWNER_ID_REQUIRED",
    "details": {
      "fieldErrors": {
        "_errors": ["Invalid owner ID"]
      }
    }
  }
}
```

### Profile Not Found

**Request:**
```bash
curl http://localhost:3001/api/v1/owners/profile \
  -H "x-owner-id: 99999999-9999-9999-9999-999999999999"
```

**Expected Response (404 Not Found):**
```json
{
  "error": {
    "message": "Profile not found",
    "code": "PROFILE_NOT_FOUND"
  }
}
```

## Performance Verification

All database queries should execute within reasonable time (< 1 second).

To verify performance, check the server logs for query execution times. The logger will output debug information including:
- Connection pool stats
- Query execution times
- Calorie calculation details

Example log output:
```
[INFO] API listening on port 3001
[DEBUG] Oracle pool initialized
[DEBUG] Fetching activity types for owner: 11111111-1111-1111-1111-111111111111
[DEBUG] Query executed in 45ms
[DEBUG] Calories calculated: { met: 8.3, weight: 75, durationHours: 1, calculatedCalories: 622.5 }
```

## Troubleshooting

### Connection Errors

If you see Oracle connection errors:
1. Verify Oracle database is running
2. Check credentials in `.env` file
3. Ensure network connectivity to Oracle host
4. Verify Oracle user has necessary privileges
5. Check Oracle service name/SID is correct

### Schema Errors

If you see table/column errors:
1. Ensure `db/schema.sql` has been executed
2. Verify connected user owns the tables
3. Check for any schema migration issues

### Missing Data

If endpoints return empty arrays:
1. Run `db/seed.sql` to insert sample data
2. Use the owner_id from seed.sql: `11111111-1111-1111-1111-111111111111`
3. Create test data via POST endpoints

## Success Criteria

✅ Health check returns `{ "status": "ok", "oracle": true }`
✅ Activity types are retrieved successfully
✅ Owner profile can be created and retrieved
✅ Activities are created with correct calorie calculations
✅ Dashboard endpoints return aggregated data
✅ All API responses match documented schemas
✅ No connection or timeout errors
✅ Database queries execute in < 1 second
