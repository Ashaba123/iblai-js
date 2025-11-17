# Next.js Time Tracking Hook

The `useNextTimeTracking` hook provides automatic time tracking for Next.js applications by sending time spent data to the backend API.

## Features

- ✅ **Automatic tracking**: Tracks time spent on each route/page
- ✅ **Route-aware**: Automatically detects route changes using Next.js router
- ✅ **Configurable intervals**: Send updates every X seconds and reset timer
- ✅ **Context-aware**: Automatically extracts tenant key from localStorage and mentor ID from URL
- ✅ **Session support**: Optional session UUID tracking with dynamic getter support
- ✅ **API integration**: Uses existing `useTimeTrackingMutation` from data-layer

## Usage

### Basic Usage

```tsx
import { useNextTimeTracking } from '@iblai/web-containers';

function MyComponent() {
  useNextTimeTracking({
    intervalSeconds: 30, // Send updates every 30 seconds
    enabled: true,
  });

  return <div>Your component</div>;
}
```

### With Provider Component

The easiest way to add time tracking to your app is using the provider:

```tsx
import { NextTimeTrackingProvider } from '@iblai/web-containers';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <NextTimeTrackingProvider 
      intervalSeconds={30}
      enabled={true}
      getSessionUuid={() => getCurrentSessionId()}
    >
      {children}
    </NextTimeTrackingProvider>
  );
}
```

## Configuration

### Hook Options

- `intervalSeconds?: number` - How often to send updates (default: 30)
- `enabled?: boolean` - Whether tracking is enabled (default: true)  
- `sessionUuid?: string` - Static session UUID
- `getSessionUuid?: () => string | undefined` - Function to get session UUID dynamically

### Data Sent to API

The hook sends the following data to the `timeTracking` mutation:

```typescript
{
  timestamp: string,           // ISO timestamp when data is sent
  url: string,                // Current page URL/path
  org: string,                // Tenant key from localStorage('tenant')
  count: number,              // Time spent in seconds
  mentor_uuid?: string,       // Extracted from URL params (/platform/[tenant]/[mentorId])
  session_uuid?: string,      // From sessionUuid or getSessionUuid()
}
```

## Integration in Mentor App

The mentor app integration automatically:

1. **Gets tenant key** from `localStorage.getItem('tenant')`
2. **Extracts mentor UUID** from URL parameters at `/platform/[tenantKey]/[mentorId]`
3. **Tracks session UUID** via `getSessionUuid` function (currently looks in localStorage)
4. **Sends data every 30 seconds** and on route changes
5. **Resets timer** after each send

### Location

Integrated in: `apps/mentor/app/platform/[tenantKey]/[mentorId]/layout.tsx`

```tsx
<NextTimeTrackingProvider 
  intervalSeconds={30} 
  enabled={true}
  getSessionUuid={() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('currentSessionUuid') || undefined;
    }
    return undefined;
  }}
>
  {/* App content */}
</NextTimeTrackingProvider>
```

## API Integration

Uses the existing `timeTracking` mutation from `@iblai/data-layer`:

```typescript
// From packages/data-layer/src/features/analytics/api-slice.ts
timeTracking: builder.mutation<TimeTrackingResponse, TimeTrackingRequest>({
  query: (args: TimeTrackingRequest) => ({
    url: NON_AI_ANALYTICS_ENDPOINTS.TIME_UPDATE.path(args.org),
    method: 'POST',
    service: NON_AI_ANALYTICS_ENDPOINTS.TIME_UPDATE.service,
    body: args,
  }),
}),
```

## Behavior Details

### Timer Logic

1. **On page load**: Starts timer for current route
2. **Every X seconds**: Sends time spent, resets timer  
3. **On route change**: Sends time spent on previous route, starts timer for new route
4. **On unmount**: Sends final time spent, cleans up

### Error Handling

- API failures are logged but don't disrupt user experience
- Missing tenant key shows warning but doesn't crash
- Client-side only execution (checks for `window` object)

### Performance

- Minimal overhead: Only tracks time and sends periodic requests
- No UI blocking: API calls are asynchronous
- Memory efficient: Automatic cleanup on unmount

## Future Enhancements

1. **Session UUID Integration**: Currently uses localStorage fallback, can be enhanced when session management is identified
2. **Skills App Support**: Same implementation can be used in skills app
3. **Advanced Filtering**: Add support for excluding certain routes
4. **Offline Support**: Queue requests when offline and send when online

## Troubleshooting

### Common Issues

1. **"Missing tenant key"** warning:
   - Ensure `localStorage.setItem('tenant', 'your-tenant')` is set
   - Check that user is properly authenticated

2. **No mentor_uuid in requests**:
   - Verify URL follows pattern `/platform/[tenantKey]/[mentorId]`
   - Check that route parameters are available

3. **Session UUID not sent**:
   - Implement proper `getSessionUuid` function
   - Ensure session is stored in accessible location