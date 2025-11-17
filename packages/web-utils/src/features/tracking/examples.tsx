import React from "react";
import { useTimeTracker } from "./use-time-tracker";
import { useTimeTrackerNative } from "./use-time-tracker-native";

// Example 1: Basic usage in a Next.js/React component
export function NextJsExample() {
  const { pause, resume, getCurrentUrl, getTimeSpentSinceLastReset } =
    useTimeTracker({
      intervalSeconds: 30, // Send update every 30 seconds
      onTimeUpdate: (url: string, timeSpent: number) => {
        console.log(`User spent ${timeSpent}ms on ${url}`);

        // Here you would typically call your API to track time
        // Example using the existing timeTracking mutation:
        // timeTracking({
        //   timestamp: new Date().toISOString(),
        //   url,
        //   org: 'your-org',
        //   count: Math.floor(timeSpent / 1000), // Convert to seconds
        //   session_uuid: 'session-id',
        //   mentor_uuid: 'mentor-id'
        // });
      },
      enabled: true, // Can be controlled to enable/disable tracking
    });

  return (
    <div>
      <h1>Time Tracking Example</h1>
      <button onClick={pause}>Pause Tracking</button>
      <button onClick={resume}>Resume Tracking</button>
      <p>Current URL: {getCurrentUrl()}</p>
      <p>Time spent since last reset: {getTimeSpentSinceLastReset()}ms</p>
    </div>
  );
}

// Example 2: React Native usage with React Navigation
export function ReactNativeExample() {
  // This assumes you're using React Navigation v6
  const getCurrentRoute = () => {
    // You would get this from your navigation ref
    // Example: navigationRef.getCurrentRoute()?.name || 'Unknown'
    return "HomeScreen"; // Placeholder
  };

  const onRouteChange = (callback: () => void) => {
    // This would typically listen to navigation state changes
    // Example with React Navigation:
    // const unsubscribe = navigationRef.addListener('state', callback);
    // return unsubscribe;

    // For this example, return a no-op cleanup function
    return () => {};
  };

  const { pause, resume } = useTimeTrackerNative({
    intervalSeconds: 60, // Send update every minute
    getCurrentRoute,
    onRouteChange,
    onTimeUpdate: (route: string, timeSpent: number) => {
      console.log(`User spent ${timeSpent}ms on ${route}`);
      // Send to your analytics API
    },
    enabled: true,
  });

  return <>{/* Your React Native JSX */}</>;
}

// Example 3: Integration with existing timeTracking API
export function ApiIntegrationExample() {
  const { getCurrentUrl } = useTimeTracker({
    intervalSeconds: 30,
    onTimeUpdate: async (url: string, timeSpent: number) => {
      try {
        // Assuming you have access to the timeTracking mutation from your API slice
        // You would import and use it like this:

        const timeTrackingData = {
          timestamp: new Date().toISOString(),
          url: url,
          org: "your-organization", // This should come from your app context
          count: Math.floor(timeSpent / 1000), // Convert milliseconds to seconds
          // Optional fields based on your context:
          // course_id: currentCourseId,
          // block_id: currentBlockId,
          // session_uuid: currentSessionId,
          // mentor_uuid: currentMentorId,
        };

        console.log("Sending time tracking data:", timeTrackingData);

        // If using RTK Query:
        // await timeTracking(timeTrackingData).unwrap();

        // If using regular fetch:
        // await fetch('/api/time-tracking', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(timeTrackingData),
        // });
      } catch (error) {
        console.error("Failed to send time tracking data:", error);
      }
    },
  });

  return <div>API Integration Example Component</div>;
}

// Example 4: Conditional tracking based on user preferences
export function ConditionalTrackingExample() {
  const [trackingEnabled, setTrackingEnabled] = React.useState(false);

  const { pause, resume } = useTimeTracker({
    intervalSeconds: 45,
    onTimeUpdate: (url: string, timeSpent: number) => {
      // Only track if user has consented
      if (trackingEnabled) {
        console.log(`Tracking: ${timeSpent}ms on ${url}`);
        // Send to API...
      }
    },
    enabled: trackingEnabled, // Hook will automatically start/stop based on this
  });

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={trackingEnabled}
          onChange={(e) => setTrackingEnabled(e.target.checked)}
        />
        Enable time tracking
      </label>

      <button onClick={pause} disabled={!trackingEnabled}>
        Pause
      </button>
      <button onClick={resume} disabled={!trackingEnabled}>
        Resume
      </button>
    </div>
  );
}
