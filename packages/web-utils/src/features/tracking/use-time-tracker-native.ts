"use client";

import { useEffect, useRef, useCallback } from "react";
import { TimeTracker, TimeTrackerConfig } from "./time-tracker";

export interface UseTimeTrackerNativeConfig {
  intervalSeconds: number;
  onTimeUpdate: (url: string, timeSpent: number) => void;
  getCurrentRoute: () => string;
  onRouteChange?: (callback: () => void) => () => void;
  enabled?: boolean;
}

export interface UseTimeTrackerNativeReturn {
  pause: () => void;
  resume: () => void;
  getCurrentUrl: () => string;
  getTimeSpentSinceLastReset: () => number;
}

export function useTimeTrackerNative(
  config: UseTimeTrackerNativeConfig,
): UseTimeTrackerNativeReturn {
  const trackerRef = useRef<TimeTracker | null>(null);
  const enabledRef = useRef(config.enabled ?? true);

  const getCurrentUrl = useCallback(() => {
    return config.getCurrentRoute();
  }, [config]);

  const pause = useCallback(() => {
    if (trackerRef.current) {
      trackerRef.current.pause();
    }
  }, []);

  const resume = useCallback(() => {
    if (trackerRef.current) {
      trackerRef.current.resume();
    }
  }, []);

  const getTimeSpentSinceLastReset = useCallback(() => {
    if (trackerRef.current) {
      return trackerRef.current.getTimeSpentSinceLastReset();
    }
    return 0;
  }, []);

  const getTrackerCurrentUrl = useCallback(() => {
    if (trackerRef.current) {
      return trackerRef.current.getCurrentUrl();
    }
    return getCurrentUrl();
  }, [getCurrentUrl]);

  useEffect(() => {
    enabledRef.current = config.enabled ?? true;

    if (enabledRef.current) {
      const trackerConfig: TimeTrackerConfig = {
        intervalSeconds: config.intervalSeconds,
        onTimeUpdate: config.onTimeUpdate,
        getCurrentUrl,
        onRouteChange: config.onRouteChange,
      };

      trackerRef.current = new TimeTracker(trackerConfig);
    }

    return () => {
      if (trackerRef.current) {
        trackerRef.current.destroy();
        trackerRef.current = null;
      }
    };
  }, [
    config.intervalSeconds,
    config.onTimeUpdate,
    config.onRouteChange,
    getCurrentUrl,
  ]);

  useEffect(() => {
    if (config.enabled !== enabledRef.current) {
      if (config.enabled && !trackerRef.current) {
        const trackerConfig: TimeTrackerConfig = {
          intervalSeconds: config.intervalSeconds,
          onTimeUpdate: config.onTimeUpdate,
          getCurrentUrl,
          onRouteChange: config.onRouteChange,
        };
        trackerRef.current = new TimeTracker(trackerConfig);
      } else if (!config.enabled && trackerRef.current) {
        trackerRef.current.destroy();
        trackerRef.current = null;
      }
      enabledRef.current = config.enabled ?? true;
    }
  }, [
    config.enabled,
    config.intervalSeconds,
    config.onTimeUpdate,
    config.onRouteChange,
    getCurrentUrl,
  ]);

  return {
    pause,
    resume,
    getCurrentUrl: getTrackerCurrentUrl,
    getTimeSpentSinceLastReset,
  };
}
