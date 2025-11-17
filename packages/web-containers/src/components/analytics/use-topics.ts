'use client';

import {
  useGetAverageRatingQuery,
  useGetTopicsDetailsStatsQuery,
  useGetTopicsStatsQuery,
  useGetTranscriptsConversationHeadlineQuery,
} from '@iblai/data-layer';
import { useState } from 'react';
import { ChartFilters } from './chart-filters-context';

// Utility function to format date to YYYY-MM-DD
const formatDateToYYYYMMDD = (date: Date | undefined): string | undefined => {
  if (!date) return undefined;
  return date.toISOString().split('T')[0];
};

export const useTopics = ({ tenantKey, mentorId }: { tenantKey: string; mentorId: string }) => {
  const FILTER_30D = '30d';

  const [conversationsStatsDateFilter, setConversationsStatsDateFilter] = useState<
    Partial<ChartFilters>
  >({
    activeFilter: FILTER_30D,
    dateRange: undefined,
  });

  const { data: conversationsStats, isLoading: isLoadingConversationsStats } =
    useGetTranscriptsConversationHeadlineQuery({
      platform_key: tenantKey,
      ...(mentorId ? { mentor_unique_id: mentorId } : {}),
      metric: 'conversations',
      date_filter: conversationsStatsDateFilter.activeFilter || FILTER_30D,
      ...(conversationsStatsDateFilter.activeFilter === 'custom' && {
        start_date: formatDateToYYYYMMDD(conversationsStatsDateFilter.dateRange?.startDate),
        end_date: formatDateToYYYYMMDD(conversationsStatsDateFilter.dateRange?.endDate),
      }),
    });

  const { data: topicsStats, isLoading: isLoadingTopicsStats } = useGetTopicsStatsQuery({
    date_filter: FILTER_30D,
    platform_key: tenantKey,
    ...(mentorId ? { mentor_unique_id: mentorId } : {}),
  });

  const [averageRatingDateFilter, setAverageRatingDateFilter] = useState<Partial<ChartFilters>>({
    activeFilter: FILTER_30D,
    dateRange: undefined,
  });

  const { data: averageRatingStats, isLoading: isLoadingAverageRatingStats } =
    useGetAverageRatingQuery({
      platform_key: tenantKey,
      ...(mentorId ? { mentor_unique_id: mentorId } : {}),
      date_filter: averageRatingDateFilter.activeFilter || FILTER_30D,
      ...(averageRatingDateFilter.activeFilter === 'custom' && {
        start_date: formatDateToYYYYMMDD(averageRatingDateFilter.dateRange?.startDate),
        end_date: formatDateToYYYYMMDD(averageRatingDateFilter.dateRange?.endDate),
      }),
    });

  const [topicsDetailsDateFilter, setTopicsDetailsDateFilter] = useState<Partial<ChartFilters>>({
    activeFilter: FILTER_30D,
    dateRange: undefined,
  });

  const { data: topicsDetailsStats, isLoading: isLoadingTopicsDetailsStats } =
    useGetTopicsDetailsStatsQuery({
      date_filter: topicsDetailsDateFilter.activeFilter || FILTER_30D,
      platform_key: tenantKey,
      ...(topicsDetailsDateFilter.activeFilter === 'custom' && {
        start_date: formatDateToYYYYMMDD(topicsDetailsDateFilter.dateRange?.startDate),
        end_date: formatDateToYYYYMMDD(topicsDetailsDateFilter.dateRange?.endDate),
      }),
      ...(mentorId ? { mentor_unique_id: mentorId } : {}),
    });

  return {
    conversationsStats,
    isLoadingConversationsStats,
    conversationsStatsDateFilter,
    setConversationsStatsDateFilter,
    topicsStats,
    isLoadingTopicsStats,
    averageRatingStats,
    isLoadingAverageRatingStats,
    averageRatingDateFilter,
    setAverageRatingDateFilter,
    topicsDetailsStats,
    isLoadingTopicsDetailsStats,
    topicsDetailsDateFilter,
    setTopicsDetailsDateFilter,
  };
};
