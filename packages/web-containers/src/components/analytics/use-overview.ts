'use client';
import {
  useGetSessionStatsQuery,
  useGetTopicsDetailsStatsQuery,
  useGetTopicsStatsQuery,
  useGetUsersStatsQuery,
} from '@iblai/data-layer';
import { useState } from 'react';
import { ChartFilters } from './chart-filters-context';

// Utility function to format date to YYYY-MM-DD
const formatDateToYYYYMMDD = (date: Date | undefined): string | undefined => {
  if (!date) return undefined;
  return date.toISOString().split('T')[0];
};

export const useOverview = ({ tenantKey, mentorId }: { tenantKey: string; mentorId: string }) => {
  const FILTER_30D = '30d';
  const [sessionStatsDateFilter, setSessionStatsDateFilter] = useState<Partial<ChartFilters>>({
    activeFilter: '30d',
    dateRange: undefined,
  });
  const [topicsDetailsStatsDateFilter, setTopicsDetailsStatsDateFilter] = useState<
    Partial<ChartFilters>
  >({
    activeFilter: '30d',
    dateRange: undefined,
  });
  const [usersStatsDateFilter, setUsersStatsDateFilter] = useState<Partial<ChartFilters>>({
    activeFilter: '30d',
    dateRange: undefined,
  });

  const { data: allStats, isLoading: isLoadingAllStats } = useGetTopicsStatsQuery({
    date_filter: FILTER_30D,
    platform_key: tenantKey,
    ...(mentorId ? { mentor_unique_id: mentorId } : {}),
  });

  const { data: usersStats, isLoading: isLoadingUsersStats } = useGetUsersStatsQuery({
    date_filter: FILTER_30D,
    metric: 'active_users_last_30d',
    platform_key: tenantKey,
    ...(mentorId ? { mentor_unique_id: mentorId } : {}),
  });

  const messageStat = {
    stat: allStats?.messages?.this_month || 0,
    percentage: allStats?.messages?.percentage_change || 0,
  };

  const topicStat = {
    stat: allStats?.topics?.this_month || 0,
    percentage: allStats?.topics?.percentage_change || 0,
  };

  const conversationStat = {
    stat: allStats?.conversations?.this_month || 0,
    percentage: allStats?.conversations?.percentage_change || 0,
  };

  const { data: activeUsersStats, isLoading: isLoadingActiveUsersStats } = useGetUsersStatsQuery({
    date_filter: usersStatsDateFilter.activeFilter || FILTER_30D,
    metric: 'active_users',
    platform_key: tenantKey,
    ...(usersStatsDateFilter.activeFilter === 'custom' && {
      start_date: formatDateToYYYYMMDD(usersStatsDateFilter.dateRange?.startDate),
      end_date: formatDateToYYYYMMDD(usersStatsDateFilter.dateRange?.endDate),
    }),
    ...(mentorId ? { mentor_unique_id: mentorId } : {}),
  });

  const { data: sessionStats, isLoading: isLoadingSessionStats } = useGetSessionStatsQuery({
    date_filter: sessionStatsDateFilter.activeFilter || FILTER_30D,
    platform_key: tenantKey,
    ...(sessionStatsDateFilter.activeFilter === 'custom' && {
      start_date: formatDateToYYYYMMDD(sessionStatsDateFilter.dateRange?.startDate),
      end_date: formatDateToYYYYMMDD(sessionStatsDateFilter.dateRange?.endDate),
    }),
    ...(mentorId ? { mentor_unique_id: mentorId } : {}),
  });

  const { data: topicsDetailsStats, isLoading: isLoadingTopicsDetailsStats } =
    useGetTopicsDetailsStatsQuery({
      date_filter: topicsDetailsStatsDateFilter.activeFilter || FILTER_30D,
      platform_key: tenantKey,
      ...(topicsDetailsStatsDateFilter.activeFilter === 'custom' && {
        start_date: formatDateToYYYYMMDD(topicsDetailsStatsDateFilter.dateRange?.startDate),
        end_date: formatDateToYYYYMMDD(topicsDetailsStatsDateFilter.dateRange?.endDate),
      }),
      ...(mentorId ? { mentor_unique_id: mentorId } : {}),
    });

  return {
    messageStat,
    topicStat,
    conversationStat,
    sessionStats,
    isLoadingAllStats,
    isLoadingUsersStats,
    isLoadingSessionStats,
    setSessionStatsDateFilter,
    usersStats,
    sessionStatsDateFilter,
    topicsDetailsStats,
    isLoadingTopicsDetailsStats,
    setTopicsDetailsStatsDateFilter,
    topicsDetailsStatsDateFilter,
    activeUsersStats,
    isLoadingActiveUsersStats,
    setUsersStatsDateFilter,
    usersStatsDateFilter,
  };
};
