'use client';

import {
  AccessTimeHeatmapResponse,
  useGetAccessTimeHeatmapQuery,
  useGetUserDetailsStatsQuery,
  useGetUsersStatsQuery,
} from '@iblai/data-layer';
import { ChartFilters } from './chart-filters-context';
import React, { useState } from 'react';

// Utility function to format date to YYYY-MM-DD
const formatDateToYYYYMMDD = (date: Date | undefined): string | undefined => {
  if (!date) return undefined;
  return date.toISOString().split('T')[0];
};

export const useUsers = ({ tenantKey, mentorId }: { tenantKey: string; mentorId: string }) => {
  const FILTER_30D = '30d';
  const TODAY = 'today';
  const [activeUsersStatsDateFilter, setActiveUsersStatsDateFilter] = useState<
    Partial<ChartFilters>
  >({
    activeFilter: FILTER_30D,
    dateRange: undefined,
  });

  const [accessTimeHeatmapDateFilter, setAccessTimeHeatmapDateFilter] = useState<
    Partial<ChartFilters>
  >({
    activeFilter: FILTER_30D,
    dateRange: undefined,
  });
  const [userDetailsStatsDateFilter, setUserDetailsStatsDateFilter] = useState<
    Partial<ChartFilters>
  >({
    activeFilter: FILTER_30D,
    dateRange: undefined,
  });
  const [userDetailsStatsPage, setUserDetailsStatsPage] = useState<number>(1);
  const [userDetailsStatsLimit, setUserDetailsStatsLimit] = useState<number>(5);
  const [userDetailsStatsSearch, setUserDetailsStatsSearch] = useState<string>('');

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserDetailsStatsSearch(e.target.value);
    setUserDetailsStatsPage(1);
  };

  const { data: registeredUsers, isLoading: isLoadingRegisteredUsers } = useGetUsersStatsQuery({
    date_filter: FILTER_30D,
    metric: 'registered_users',
    platform_key: tenantKey,
    ...(mentorId ? { mentor_unique_id: mentorId } : {}),
  });

  const { data: activeUsers, isLoading: isLoadingActiveUsers } = useGetUsersStatsQuery({
    date_filter: activeUsersStatsDateFilter.activeFilter || FILTER_30D,
    metric: 'active_users',
    platform_key: tenantKey,
    ...(activeUsersStatsDateFilter.activeFilter === 'custom' && {
      start_date: formatDateToYYYYMMDD(activeUsersStatsDateFilter.dateRange?.startDate),
      end_date: formatDateToYYYYMMDD(activeUsersStatsDateFilter.dateRange?.endDate),
    }),
    ...(mentorId ? { mentor_unique_id: mentorId } : {}),
  });

  const { data: accessTimeHeatmap, isLoading: isLoadingAccessTimeHeatmap } =
    useGetAccessTimeHeatmapQuery({
      date_filter: accessTimeHeatmapDateFilter.activeFilter || FILTER_30D,
      platform_key: tenantKey,
      ...(accessTimeHeatmapDateFilter.activeFilter === 'custom' && {
        start_date: formatDateToYYYYMMDD(accessTimeHeatmapDateFilter.dateRange?.startDate),
        end_date: formatDateToYYYYMMDD(accessTimeHeatmapDateFilter.dateRange?.endDate),
      }),
      ...(mentorId ? { mentor_unique_id: mentorId } : {}),
    });

  const { data: userDetailsStats, isLoading: isLoadingUserDetailsStats } =
    useGetUserDetailsStatsQuery({
      date_filter: userDetailsStatsDateFilter.activeFilter || FILTER_30D,
      platform_key: tenantKey,
      ...(userDetailsStatsDateFilter.activeFilter === 'custom' && {
        start_date: formatDateToYYYYMMDD(userDetailsStatsDateFilter.dateRange?.startDate),
        end_date: formatDateToYYYYMMDD(userDetailsStatsDateFilter.dateRange?.endDate),
      }),
      ...(mentorId ? { mentor_unique_id: mentorId } : {}),
      page: userDetailsStatsPage,
      limit: userDetailsStatsLimit,
      ...(userDetailsStatsSearch && { search: userDetailsStatsSearch }),
    });

  const { data: currentlyActiveUsers, isLoading: isLoadingCurrentlyActiveUsers } =
    useGetUsersStatsQuery({
      date_filter: TODAY,
      metric: 'currently_active',
      platform_key: tenantKey,
      ...(mentorId ? { mentor_unique_id: mentorId } : {}),
    });

  const { data: activeUsers30D, isLoading: isLoadingActiveUsers30D } = useGetUsersStatsQuery({
    date_filter: FILTER_30D,
    metric: 'active_users_last_30d',
    platform_key: tenantKey,
    ...(mentorId ? { mentor_unique_id: mentorId } : {}),
  });

  function convertToHeatmapArray(response: AccessTimeHeatmapResponse | undefined): number[][] {
    // Initialize 7x24 heatmap array with zeros
    if (!response) return [];
    const heatmap: number[][] = Array(7)
      .fill(null)
      .map(() => Array(24).fill(0));

    // Process each data point from the response
    response.data.forEach(({ day_of_week, hour, value }) => {
      // day_of_week is 1-indexed (1 = Sunday, 2 = Monday, etc.)
      // Convert to 0-indexed for array access
      const dayIndex = day_of_week - 1;

      // hour is 0-indexed (0-23)
      const hourIndex = hour;

      // Ensure indices are within bounds
      if (dayIndex >= 0 && dayIndex < 7 && hourIndex >= 0 && hourIndex < 24) {
        heatmap[dayIndex][hourIndex] = value;
      }
    });

    return heatmap;
  }

  return {
    registeredUsers,
    isLoadingRegisteredUsers,
    activeUsers,
    isLoadingActiveUsers,
    setActiveUsersStatsDateFilter,
    activeUsersStatsDateFilter,
    accessTimeHeatmap: convertToHeatmapArray(accessTimeHeatmap),
    isLoadingAccessTimeHeatmap,
    setAccessTimeHeatmapDateFilter,
    accessTimeHeatmapDateFilter,
    userDetailsStats,
    isLoadingUserDetailsStats,
    setUserDetailsStatsDateFilter,
    userDetailsStatsDateFilter,
    setUserDetailsStatsPage,
    userDetailsStatsPage,
    setUserDetailsStatsLimit,
    userDetailsStatsLimit,
    userDetailsStatsSearch,
    setUserDetailsStatsSearch,
    handleSearchInputChange,
    currentlyActiveUsers,
    isLoadingCurrentlyActiveUsers,
    activeUsers30D,
    isLoadingActiveUsers30D,
  };
};
