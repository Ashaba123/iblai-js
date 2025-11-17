'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import { TimeTracker, TimeTrackerConfig } from '@iblai/web-utils';

export interface UseTimeTrackerConfig {
  intervalSeconds: number;
  onTimeUpdate: (url: string, timeSpent: number) => void;
  enabled?: boolean;
}

export interface UseTimeTrackerReturn {
  pause: () => void;
  resume: () => void;
  getCurrentUrl: () => string;
  getTimeSpentSinceLastReset: () => number;
}

export function useTimeTracker(config: UseTimeTrackerConfig): UseTimeTrackerReturn {
  const router = useRouter();
  const trackerRef = useRef<TimeTracker | null>(null);
  const enabledRef = useRef(config.enabled ?? true);

  const getCurrentUrl = useCallback(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname + window.location.search;
    }
    return '/';
  }, []);

  const onRouteChange = useCallback(
    (callback: () => void) => {
      const handleRouteChange = () => {
        callback();
      };

      router.events.on('routeChangeComplete', handleRouteChange);

      return () => {
        router.events.off('routeChangeComplete', handleRouteChange);
      };
    },
    [router.events],
  );

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
        onRouteChange,
      };

      trackerRef.current = new TimeTracker(trackerConfig);
    }

    return () => {
      if (trackerRef.current) {
        trackerRef.current.destroy();
        trackerRef.current = null;
      }
    };
  }, [config.intervalSeconds, config.onTimeUpdate, getCurrentUrl, onRouteChange]);

  useEffect(() => {
    if (config.enabled !== enabledRef.current) {
      if (config.enabled && !trackerRef.current) {
        const trackerConfig: TimeTrackerConfig = {
          intervalSeconds: config.intervalSeconds,
          onTimeUpdate: config.onTimeUpdate,
          getCurrentUrl,
          onRouteChange,
        };
        trackerRef.current = new TimeTracker(trackerConfig);
      } else if (!config.enabled && trackerRef.current) {
        trackerRef.current.destroy();
        trackerRef.current = null;
      }
      enabledRef.current = config.enabled ?? true;
    }
  }, [config.enabled, config.intervalSeconds, config.onTimeUpdate, getCurrentUrl, onRouteChange]);

  return {
    pause,
    resume,
    getCurrentUrl: getTrackerCurrentUrl,
    getTimeSpentSinceLastReset,
  };
}
