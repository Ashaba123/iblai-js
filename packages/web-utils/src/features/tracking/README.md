# Time Tracking Utility

A universal time tracking system that works across React, Next.js, and React Native applications. This utility automatically tracks time spent on different routes/screens and provides callbacks for sending analytics data.

## Features

- ✅ **Universal**: Works with React, Next.js, and React Native
- ✅ **Route-aware**: Automatically tracks route changes and resets timers
- ✅ **Configurable intervals**: Send updates every X seconds
- ✅ **Pause/Resume**: Manual control over tracking
- ✅ **Memory efficient**: Automatic cleanup on unmount
- ✅ **TypeScript**: Full type safety

## Core Concepts

1. **Time Tracking**: Keeps track of time spent on each URL/route
2. **Route Changes**: Automatically detects route changes and sends time spent on previous route
3. **Interval Updates**: Sends periodic updates every X seconds and resets the timer
4. **Callback System**: Executes a callback function with time tracking data

## Installation

The utility is already part of the `@iblai/web-utils` package in this monorepo.

```typescript
import { useTimeTracker, useTimeTrackerNative } from '@iblai/web-utils/features/tracking';
```

## Usage

### React/Next.js Hook

```typescript
import { useTimeTracker } from '@iblai/web-utils/features/tracking';

function MyComponent() {
  const { pause, resume, getCurrentUrl, getTimeSpentSinceLastReset } = useTimeTracker({
    intervalSeconds: 30, // Send update every 30 seconds
    onTimeUpdate: (url: string, timeSpent: number) => {
      console.log(`User spent ${timeSpent}ms on ${url}`);
      
      // Send to your API
      sendTimeTrackingData({
        url,
        timeSpent: Math.floor(timeSpent / 1000), // Convert to seconds
        timestamp: new Date().toISOString(),
      });
    },
    enabled: true, // Optional: control tracking state
  });

  return (
    <div>
      <button onClick={pause}>Pause Tracking</button>
      <button onClick={resume}>Resume Tracking</button>
      <p>Current URL: {getCurrentUrl()}</p>
      <p>Time since reset: {getTimeSpentSinceLastReset()}ms</p>
    </div>
  );
}
```

### React Native Hook

```typescript
import { useTimeTrackerNative } from '@iblai/web-utils/features/tracking';
import { useNavigation } from '@react-navigation/native';

function MyScreen() {
  const navigation = useNavigation();

  const { pause, resume } = useTimeTrackerNative({
    intervalSeconds: 60,
    getCurrentRoute: () => {
      // Get current route from React Navigation
      return navigation.getCurrentRoute()?.name || 'Unknown';
    },
    onRouteChange: (callback) => {
      // Listen to navigation state changes
      const unsubscribe = navigation.addListener('state', callback);
      return unsubscribe;
    },
    onTimeUpdate: (route: string, timeSpent: number) => {
      console.log(`User spent ${timeSpent}ms on ${route}`);
      // Send to analytics
    },
    enabled: true,
  });

  return (
    <View>
      {/* Your React Native components */}
    </View>
  );
}
```

### Integration with Existing API

```typescript
import { useTimeTracker } from '@iblai/web-utils/features/tracking';
import { useTimeTrackingMutation } from '@iblai/data-layer/features/analytics';

function ComponentWithAPI() {
  const [timeTracking] = useTimeTrackingMutation();

  const { } = useTimeTracker({
    intervalSeconds: 30,
    onTimeUpdate: async (url: string, timeSpent: number) => {
      try {
        await timeTracking({
          timestamp: new Date().toISOString(),
          url: url,
          org: 'your-organization',
          count: Math.floor(timeSpent / 1000), // Convert to seconds
          // Add other optional fields as needed:
          // course_id: currentCourseId,
          // block_id: currentBlockId,
          // session_uuid: currentSessionId,
          // mentor_uuid: currentMentorId,
        }).unwrap();
      } catch (error) {
        console.error('Failed to send time tracking data:', error);
      }
    },
  });

  return <div>Component with API integration</div>;
}
```

## API Reference

### `useTimeTracker(config)`

Hook for React/Next.js applications.

#### Config Options

- `intervalSeconds: number` - How often to send updates and reset timer (in seconds)
- `onTimeUpdate: (url: string, timeSpent: number) => void` - Callback executed when sending updates
- `enabled?: boolean` - Whether tracking is enabled (default: true)

#### Return Values

- `pause: () => void` - Pause tracking and send current time spent
- `resume: () => void` - Resume tracking
- `getCurrentUrl: () => string` - Get the current URL being tracked
- `getTimeSpentSinceLastReset: () => number` - Get milliseconds since last reset

### `useTimeTrackerNative(config)`

Hook for React Native applications.

#### Config Options

- `intervalSeconds: number` - How often to send updates and reset timer
- `onTimeUpdate: (route: string, timeSpent: number) => void` - Callback for updates
- `getCurrentRoute: () => string` - Function to get current route/screen name
- `onRouteChange?: (callback: () => void) => (() => void)` - Optional route change listener
- `enabled?: boolean` - Whether tracking is enabled

#### Return Values

Same as `useTimeTracker`.

### `TimeTracker` Class

Low-level class that can be used directly without React hooks.

```typescript
import { TimeTracker } from '@iblai/web-utils/features/tracking';

const tracker = new TimeTracker({
  intervalSeconds: 30,
  onTimeUpdate: (url, timeSpent) => console.log(url, timeSpent),
  getCurrentUrl: () => window.location.pathname,
  onRouteChange: (callback) => {
    // Set up route change listener
    window.addEventListener('popstate', callback);
    return () => window.removeEventListener('popstate', callback);
  },
});

// Don't forget to cleanup
tracker.destroy();
```

## Behavior Details

### Timer Reset Logic

1. **On Route Change**: Sends time spent on previous route, switches to new route, resets timer
2. **On Interval**: Sends time spent on current route, resets timer
3. **On Pause**: Sends time spent, stops tracking
4. **On Destroy/Unmount**: Sends final time spent, cleans up all resources

### Time Calculation

- Time is calculated in milliseconds using `Date.now()`
- `timeSpent` parameter in callbacks represents milliseconds on that route
- Convert to seconds with `Math.floor(timeSpent / 1000)` if needed

### Error Handling

The hooks are designed to be resilient:
- If `getCurrentUrl`/`getCurrentRoute` throws, tracking continues with last known URL
- If `onTimeUpdate` throws, it won't crash the tracking system
- Automatic cleanup prevents memory leaks

## Examples

See `examples.tsx` for comprehensive usage examples including:
- Basic Next.js integration
- React Native with navigation
- API integration with existing endpoints
- Conditional tracking based on user preferences

## Testing

Run the tests with:

```bash
npm test time-tracker
```

The test suite covers:
- Initialization and cleanup
- Timer intervals and resets
- Route change detection
- Pause/resume functionality
- Error scenarios