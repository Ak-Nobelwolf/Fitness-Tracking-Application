# Express API (v1)

All endpoints are served by the `server` workspace Express app.

- Base URL (dev): `http://localhost:3001`
- Versioned API base path: `/api/v1`

## Authentication / Owner identity

The API is currently single-tenant per request and requires an **owner id** on (almost) every v1 route.

Provide the owner id as either:

- Header: `x-owner-id: <uuid>` (**recommended**)
- Query param: `?owner_id=<uuid>` (or `?ownerId=<uuid>`)

If the owner id is missing or invalid, the API returns `400`.

## Common response shapes

### Error

```json
{
  "error": {
    "message": "...",
    "code": "...",
    "details": {}
  }
}
```

### Oracle error mapping

Oracle errors are mapped into friendly HTTP responses:

- `ORA-00001` → `409 Duplicate record`
- `ORA-02291` → `409 Related record not found (foreign key constraint)`
- `ORA-02292` → `409 Cannot delete record because it has related data`
- `ORA-01400` → `400 Missing required field`

## Health

### `GET /health`

Checks that the server is up and (if the pool is initialized) the Oracle connection is healthy.

Response `200`:

```json
{
  "status": "ok",
  "oracle": true
}
```

## Owner Profile

All routes in this section require `x-owner-id` (or `owner_id`).

### `GET /api/v1/owners/profile`

Fetch the owner profile.

Response `200`:

```json
{
  "profile": {
    "ownerId": "uuid",
    "weight": 70,
    "height": 175,
    "age": 30,
    "gender": "M",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

Response `404` if no profile exists.

### `PUT /api/v1/owners/profile`

Create or update the profile (upsert).

Body:

```json
{
  "weight": 70,
  "height": 175,
  "age": 30,
  "gender": "M"
}
```

Response `200`:

```json
{ "profile": { "ownerId": "uuid", "weight": 70, "updatedAt": "..." } }
```

### `DELETE /api/v1/owners/profile`

Deletes the profile.

Response `204`.

## Activity Types

All routes in this section require `x-owner-id` (or `owner_id`).

### `GET /api/v1/activity-types`

List all activity types.

Response `200`:

```json
{ "activityTypes": [ { "id": "uuid", "name": "Running", "met": 8, "description": "...", "createdAt": "..." } ] }
```

### `GET /api/v1/activity-types/:id`

Fetch an activity type.

Response `200`:

```json
{ "activityType": { "id": "uuid", "name": "Running", "met": 8, "createdAt": "..." } }
```

### `POST /api/v1/activity-types`

Create an activity type.

Body:

```json
{
  "id": "uuid (optional)",
  "name": "Running",
  "met": 8.0,
  "description": "optional"
}
```

If `id` is omitted, the server generates one.

Response `201`:

```json
{ "activityType": { "id": "uuid", "name": "Running", "met": 8, "createdAt": "..." } }
```

### `PUT /api/v1/activity-types/:id`

Update an activity type.

Body (any subset):

```json
{ "name": "New name", "met": 7.5, "description": "..." }
```

Response `200`.

### `DELETE /api/v1/activity-types/:id`

Deletes an activity type.

Response `204`.

## Activities

All routes in this section require `x-owner-id` (or `owner_id`).

### Notes on calculations

- If `durationMinutes` is omitted, the server will compute it from `startTime` and `endTime`.
- Calories are calculated server-side using:
  - activity type MET value
  - owner profile weight
  - duration
- You can provide an optional `caloriesOverride` to store a manual value.
  - The API stores the calculated calories as `caloriesBurned` and the manual value in `caloriesOverride`.

### `GET /api/v1/activities`

List all activities for the owner.

Response `200`:

```json
{ "activities": [ { "id": "uuid", "ownerId": "uuid", "activityTypeId": "uuid", "startTime": "...", "endTime": "...", "durationMinutes": 60, "caloriesBurned": 560, "caloriesOverride": 600, "notes": "..." } ] }
```

### `GET /api/v1/activities/:id`

Fetch a single activity (must belong to the owner).

Response `200`:

```json
{ "activity": { "id": "uuid", "ownerId": "uuid", "activityTypeId": "uuid", "startTime": "...", "endTime": "..." } }
```

Response `404` if not found (or belongs to a different owner).

### `POST /api/v1/activities`

Create an activity.

Body:

```json
{
  "id": "uuid (optional)",
  "activityTypeId": "uuid",
  "startTime": "2025-01-01T10:00:00.000Z",
  "endTime": "2025-01-01T11:00:00.000Z",
  "durationMinutes": 60,
  "caloriesOverride": 600,
  "notes": "optional"
}
```

Response `201`:

```json
{
  "activity": { "id": "uuid", "ownerId": "uuid", "activityTypeId": "uuid", "durationMinutes": 60, "caloriesBurned": 560, "caloriesOverride": 600 },
  "validationFlags": {},
  "calorieCalculation": {
    "calculatedCalories": 560,
    "actualCalories": 600,
    "isOverridden": true,
    "met": 8,
    "weight": 70,
    "durationHours": 1,
    "isSuspiciousOverride": false
  }
}
```

### `PUT /api/v1/activities/:id`

Update an activity (must belong to the owner).

Body (any subset):

```json
{
  "startTime": "2025-01-01T10:00:00.000Z",
  "endTime": "2025-01-01T11:30:00.000Z",
  "durationMinutes": 90,
  "caloriesOverride": null,
  "notes": null
}
```

Notes:

- Sending `caloriesOverride: null` clears the override.
- Sending `notes: null` clears the notes.
- If you update `startTime` and/or `endTime` without providing `durationMinutes`, the server will re-calculate duration.

Response `200`:

```json
{ "activity": { "id": "uuid", "durationMinutes": 90, "caloriesBurned": 840 }, "validationFlags": {}, "calorieCalculation": { "calculatedCalories": 840, "actualCalories": 840, "isOverridden": false } }
```

### `DELETE /api/v1/activities/:id`

Delete an activity (must belong to the owner).

Response `204`.

### Offline sync ingestion

### `POST /api/v1/activities/bulk-upsert`

Upsert a batch of activities for offline sync.

- Accepts either a raw array or an object with `activities`.
- Each item may include a `clientTempId` so the client can map temporary IDs to server IDs.

Body (array form):

```json
[
  {
    "clientTempId": "tmp-1",
    "id": "uuid (optional)",
    "activityTypeId": "uuid",
    "startTime": "2025-01-01T10:00:00.000Z",
    "endTime": "2025-01-01T11:00:00.000Z",
    "durationMinutes": 60,
    "caloriesOverride": 600,
    "notes": "..."
  }
]
```

Body (object form):

```json
{ "activities": [ { "clientTempId": "tmp-1", "activityTypeId": "uuid", "startTime": "...", "endTime": "..." } ] }
```

Response `200`:

```json
{
  "results": [
    { "id": "server-uuid", "clientTempId": "tmp-1", "action": "created" }
  ]
}
```

## Dashboard

All routes in this section require `x-owner-id` (or `owner_id`).

### `GET /api/v1/dashboard`

Returns daily/weekly/monthly summaries for a given date (defaults to today), plus an activity-type breakdown for the month.

Query params:

- `date` (optional): ISO date or datetime

Response `200`:

```json
{
  "daily": { "date": "...", "totalCalories": 0, "totalDuration": 0, "activitiesCount": 0 },
  "weekly": { "weekStart": "...", "weekEnd": "...", "totalCalories": 0, "daily": [] },
  "monthly": { "monthStart": "...", "monthEnd": "...", "totalCalories": 0, "weekly": [] },
  "breakdown": [
    { "activityTypeId": "uuid", "activityTypeName": "Running", "totalCalories": 1234, "totalDuration": 180, "activitiesCount": 3 }
  ]
}
```

### `GET /api/v1/dashboard/daily`

Same as the `daily` portion of the main dashboard.

### `GET /api/v1/dashboard/weekly`

Same as the `weekly` portion of the main dashboard.

### `GET /api/v1/dashboard/monthly`

Same as the `monthly` portion of the main dashboard.

### `GET /api/v1/dashboard/breakdown`

Activity-type breakdown for charting.

Query params:

- `from` (optional): ISO date/datetime (default: start of current month)
- `to` (optional): ISO date/datetime (default: end of current month)

Response `200`:

```json
{ "breakdown": [ { "activityTypeId": "uuid", "activityTypeName": "Running", "totalCalories": 1234 } ] }
```
