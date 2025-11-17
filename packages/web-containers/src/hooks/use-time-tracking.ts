'use client';

import { useCallback, useEffect, useState, useRef } from 'react';
import { TimeTracker, LOCAL_STORAGE_KEYS } from '@iblai/web-utils';
import { useTimeTrackingMutation, StorageService } from '@iblai/data-layer';

interface TimeTrackingConfig {
  intervalSeconds?: number;
  enabled?: boolean;
  sessionUuid?: string;
  getSessionUuid?: () => string | undefined;
  getTenantKey?: () => string;
  getMentorId?: () => string | undefined;
  getCurrentUrl?: () => string;
  onRouteChange?: (callback: () => void) => () => void;
  storageService?: StorageService;
}

export function useTimeTracking(config: TimeTrackingConfig = {}) {
  const [timeTracking] = useTimeTrackingMutation();
  const [tenantKey, setTenantKey] = useState<string>('');
  const [mentorId, setMentorId] = useState<string | undefined>();

  // Get tenant key and mentor ID on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tenant = config.getTenantKey
        ? config.getTenantKey()
        : localStorage.getItem('tenant') || '';
      const mentor = config.getMentorId ? config.getMentorId() : undefined;

      setTenantKey(tenant);
      setMentorId(mentor);
    }
  }, [config.getTenantKey, config.getMentorId]);

  const handleTimeUpdate = useCallback(
    async (url: string, timeSpent: number) => {
      // Check if user is logged in before making time tracking API call
      if (config.storageService) {
        try {
          const userData = await config.storageService.getItem(LOCAL_STORAGE_KEYS.USER_DATA);
          if (!userData) {
            console.warn('User not logged in, skipping time tracking');
            return;
          }
        } catch (error) {
          console.warn('Failed to check user login status, skipping time tracking:', error);
          return;
        }
      }

      if (!tenantKey) {
        console.warn('Missing tenant key for time tracking');
        return;
      }

      try {
        // Get session UUID dynamically if getter is provided
        const currentSessionUuid = config.getSessionUuid
          ? config.getSessionUuid()
          : config.sessionUuid;

        const timeTrackingData = {
          timestamp: new Date().toISOString(),
          url: url,
          org: tenantKey,
          count: Math.floor(timeSpent / 1000), // Convert milliseconds to seconds
          ...(mentorId && { mentor_uuid: mentorId }),
          ...(currentSessionUuid && { session_uuid: currentSessionUuid }),
        };
        if (config.storageService?.getItem(LOCAL_STORAGE_KEYS.USER_DATA)) {
          await timeTracking(timeTrackingData).unwrap();
        } else {
          await timeTracking(timeTrackingData).unwrap();
        }

        console.log(`Time tracking sent: ${Math.floor(timeSpent / 1000)}s on ${url}`, {
          tenantKey,
          ...(mentorId && { mentorId }),
          ...(currentSessionUuid && { sessionUuid: currentSessionUuid }),
        });
      } catch {
        // console.error('Failed to send time tracking data:', error);
        // Don't throw the error to prevent disrupting the user experience
      }
    },
    [
      tenantKey,
      mentorId,
      config.getSessionUuid,
      config.sessionUuid,
      config.storageService,
      timeTracking,
    ],
  );

  const trackerRef = useRef<TimeTracker | null>(null);

  // Default getCurrentUrl function
  const defaultGetCurrentUrl = useCallback(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname + window.location.search;
    }
    return '/';
  }, []);

  const getCurrentUrlFn = config.getCurrentUrl || defaultGetCurrentUrl;

  // Initialize tracker
  useEffect(() => {
    if (config.enabled ?? true) {
      const tracker = new TimeTracker({
        intervalSeconds: config.intervalSeconds ?? 30,
        onTimeUpdate: handleTimeUpdate,
        getCurrentUrl: getCurrentUrlFn,
        onRouteChange: config.onRouteChange,
      });

      trackerRef.current = tracker;

      return () => {
        tracker.destroy();
      };
    }
  }, [
    config.intervalSeconds,
    config.enabled,
    handleTimeUpdate,
    getCurrentUrlFn,
    config.onRouteChange,
  ]);

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

  const getCurrentUrl = useCallback(() => {
    if (trackerRef.current) {
      return trackerRef.current.getCurrentUrl();
    }
    return getCurrentUrlFn();
  }, [getCurrentUrlFn]);

  const getTimeSpentSinceLastReset = useCallback(() => {
    if (trackerRef.current) {
      return trackerRef.current.getTimeSpentSinceLastReset();
    }
    return 0;
  }, []);

  return {
    pause,
    resume,
    getCurrentUrl,
    getTimeSpentSinceLastReset,
    tenantKey,
    mentorId,
  };
}
