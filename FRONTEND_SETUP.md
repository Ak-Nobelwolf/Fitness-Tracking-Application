# Frontend Foundation Setup

This document summarizes the frontend restructuring completed for the FitTrack fitness tracking application.

## Directory Structure

```
/home/engine/project/
├── app/
│   ├── (main)/
│   │   ├── layout.tsx           # Main layout with header/footer/navigation
│   │   ├── dashboard/
│   │   │   └── page.tsx         # Dashboard page
│   │   ├── activities/
│   │   │   └── page.tsx         # Activities page
│   │   └── profile/
│   │       └── page.tsx         # Profile page
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Home page (redirects to dashboard)
│   └── globals.css              # Global styles with design tokens
├── lib/
│   ├── apiClient.ts             # API client with retry logic and offline detection
│   ├── offlineQueue.ts          # IndexedDB-backed offline queue
│   ├── registerServiceWorker.ts # Service worker registration
│   ├── types.ts                 # TypeScript type definitions
│   └── utils.ts                 # Utility functions (cn, formatters)
├── hooks/
│   ├── useOwnerId.ts            # Owner ID management hook
│   └── useSyncQueue.ts          # Offline queue sync hook
├── providers/
│   └── AppProviders.tsx         # React Query + context providers
├── public/
│   ├── manifest.json            # PWA manifest
│   └── sw.js                    # Service worker for offline caching
├── tailwind.config.ts           # Tailwind 4 configuration
└── .env.local.example           # Environment variable template
```

## Dependencies Installed

- `@tanstack/react-query` - Data fetching and caching
- `react-hook-form` - Form management
- `zod` - Schema validation
- `axios` - HTTP client
- `idb` - IndexedDB wrapper
- `clsx` - Conditional className utility
- `workbox-window` - Service worker utilities

## Key Features Implemented

### 1. API Client (`lib/apiClient.ts`)
- Reads `NEXT_PUBLIC_API_BASE_URL` from environment
- Automatically injects `x-owner-id` header
- Retries transient failures (408, 429, 5xx) up to 3 times
- Respects offline mode via `navigator.onLine`
- Exponential backoff on retries

### 2. Owner ID Management (`hooks/useOwnerId.ts`)
- Generates UUID on first load
- Persists to `localStorage` under `fitness-tracker-owner-id`
- Posts to `/api/v1/owners/profile` when online
- Exposes via `OwnerIdContext` in `AppProviders`
- Provides `clearOwnerId()` for data reset

### 3. Offline Queue (`lib/offlineQueue.ts`)
- IndexedDB-backed queue for unsent requests
- Stores method, URL, data, timestamp, and retry count
- CRUD operations: add, get, remove, update, clear
- Indexed by timestamp for ordered processing

### 4. Sync Queue Hook (`hooks/useSyncQueue.ts`)
- Syncs queue on reconnect (window `online` event)
- Processes requests in timestamp order
- Max 3 retry attempts per request
- Exposes sync status, queue count, and errors
- Methods: `syncQueue()`, `addToQueue()`, `clearQueue()`

### 5. App Providers (`providers/AppProviders.tsx`)
- React Query client with 5-min stale time
- Owner ID context for app-wide access
- Sync queue context for offline support
- Service worker registration on mount

### 6. Tailwind 4 Configuration
- Mobile-first responsive design
- Design tokens in `globals.css`:
  - Colors: primary (blue), secondary (purple), success, warning, error
  - Spacing, border radius, fonts
- Dark mode support via `prefers-color-scheme`
- Custom utility classes: `text-balance`, `scrollbar-hide`

### 7. Page Structure
- **Dashboard**: Overview with owner ID, sync status, pending queue, online status
- **Activities**: Activity list/creation (scaffold for future features)
- **Profile**: User info form, offline status, data reset
- **Main Layout**: Responsive header/footer with navigation

### 8. PWA Support
- `manifest.json` for app installation
- Service worker (`sw.js`) for offline caching
- Caches static assets and API responses
- Auto-registration in `AppProviders`

## Environment Variables

Create `.env.local` with:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

## Usage

### Development
```bash
npm run dev
```
Starts Next.js dev server on http://localhost:3000

### Build
```bash
npm run build
```
Compiles TypeScript and builds production bundle

### Production
```bash
npm start
```
Serves production build

## Testing Acceptance Criteria

✅ Running `npm run dev` serves the new layout  
✅ Tailwind classes are available and working  
✅ Environment variables drive API calls  
✅ Owner IDs persist across reloads (localStorage)  
✅ Offline queue helpers ready (IndexedDB)  
✅ React Query providers configured  
✅ Service worker registration working  
✅ Mobile-first responsive design  
✅ Multi-page app structure with routing  

## Next Steps

- Implement activity form with `react-hook-form` and `zod` validation
- Add activity list with React Query data fetching
- Implement profile update functionality
- Add dashboard charts/graphs for activity trends
- Enhance offline queue with conflict resolution
- Add unit tests for hooks and utilities
