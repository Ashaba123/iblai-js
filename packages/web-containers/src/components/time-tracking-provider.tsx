'use client';

import { useTimeTracking } from '../hooks/use-time-tracking';

interface TimeTrackingProviderProps {
  intervalSeconds?: number;
  enabled?: boolean;
  sessionUuid?: string;
  getSessionUuid?: () => string | undefined;
  getTenantKey?: () => string;
  getMentorId?: () => string | undefined;
  getCurrentUrl?: () => string;
  onRouteChange?: (callback: () => void) => () => void;
}

/**
 * Provider component that automatically tracks time spent on pages in web applications.
 * Works with both Next.js and React Native applications.
 *
 * Usage:
 * ```tsx
 * <TimeTrackingProvider
 *   intervalSeconds={30}
 *   enabled={true}
 *   getSessionUuid={() => getCurrentSessionId()}
 *   getTenantKey={() => localStorage.getItem('tenant') || ''}
 *   getMentorId={() => extractMentorIdFromUrl()}
 * />
 * ```
 */
export function TimeTrackingProvider({
  intervalSeconds = 30,
  enabled = true,
  sessionUuid,
  getSessionUuid,
  getTenantKey,
  getMentorId,
  getCurrentUrl,
  onRouteChange,
}: TimeTrackingProviderProps) {
  // Initialize time tracking
  useTimeTracking({
    intervalSeconds,
    enabled,
    sessionUuid,
    getSessionUuid,
    getTenantKey,
    getMentorId,
    getCurrentUrl,
    onRouteChange,
  });

  return <></>;
}
