'use client';
import React from 'react';

import { useGetDetailedFinancialStatsQuery, useGetFinancialStatsQuery } from '@iblai/data-layer';
import { useState } from 'react';
import { ChartFilters } from './chart-filters-context';

// Utility function to format date to YYYY-MM-DD
const formatDateToYYYYMMDD = (date: Date | undefined): string | undefined => {
  if (!date) return undefined;
  return date.toISOString().split('T')[0];
};

export const useFinancial = ({ tenantKey, mentorId }: { tenantKey: string; mentorId: string }) => {
  const FILTER_30D = '30d';
  const [costPerUserPage, setCostPerUserPage] = useState<number>(1);
  const [costPerUserLimit, setCostPerUserLimit] = useState<number>(5);
  const [costPerUserSearch, setCostPerUserSearch] = useState<string>('');

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCostPerUserSearch(e.target.value);
    setCostPerUserPage(1);
  };

  const [detailedCostPerDayFilters, setDetailedCostPerDayFilters] = useState<Partial<ChartFilters>>(
    {
      activeFilter: FILTER_30D,
      dateRange: undefined,
    },
  );

  const [detailedCostPerProviderFilters, setDetailedCostPerProviderFilters] = useState<
    Partial<ChartFilters>
  >({
    activeFilter: FILTER_30D,
    dateRange: undefined,
  });

  const [detailedCostPerUserFilters, setDetailedCostPerUserFilters] = useState<
    Partial<ChartFilters>
  >({
    activeFilter: FILTER_30D,
    dateRange: undefined,
  });

  const [detailedLLMCostFilters, setDetailedLLMCostFilters] = useState<Partial<ChartFilters>>({
    activeFilter: FILTER_30D,
    dateRange: undefined,
  });

  const { data: weeklyCostData, isLoading: isLoadingWeeklyCostData } = useGetFinancialStatsQuery({
    metric: 'weekly_costs',
    date_filter: 'all_time',
    platform_key: tenantKey,
    ...(mentorId ? { mentor_unique_id: mentorId } : {}),
  });

  const { data: monthlyCostData, isLoading: isLoadingMonthlyCostData } = useGetFinancialStatsQuery({
    metric: 'monthly_costs',
    date_filter: 'all_time',
    platform_key: tenantKey,
    ...(mentorId ? { mentor_unique_id: mentorId } : {}),
  });

  const { data: totalCostData, isLoading: isLoadingTotalCostData } = useGetFinancialStatsQuery({
    metric: 'total_costs',
    all_time: 'true',
    platform_key: tenantKey,
    ...(mentorId ? { mentor_unique_id: mentorId } : {}),
    date_filter: 'all_time',
  });

  const { data: detailedCostPerDayData, isLoading: isLoadingDetailedCostPerDayData } =
    useGetFinancialStatsQuery({
      metric: 'total_costs',
      date_filter: detailedCostPerDayFilters.activeFilter || FILTER_30D,
      platform_key: tenantKey,
      ...(detailedCostPerDayFilters.activeFilter === 'custom' && {
        start_date: formatDateToYYYYMMDD(detailedCostPerDayFilters.dateRange?.startDate),
        end_date: formatDateToYYYYMMDD(detailedCostPerDayFilters.dateRange?.endDate),
      }),
      ...(mentorId ? { mentor_unique_id: mentorId } : {}),
    });

  const { data: detailedCostPerProviderData, isLoading: isLoadingDetailedCostPerProviderData } =
    useGetDetailedFinancialStatsQuery({
      group_by: 'provider',
      date_filter: detailedCostPerProviderFilters.activeFilter || FILTER_30D,
      platform_key: tenantKey,
      ...(detailedCostPerProviderFilters.activeFilter === 'custom' && {
        start_date: formatDateToYYYYMMDD(detailedCostPerProviderFilters.dateRange?.startDate),
        end_date: formatDateToYYYYMMDD(detailedCostPerProviderFilters.dateRange?.endDate),
      }),
      ...(mentorId ? { mentor_unique_id: mentorId } : {}),
    });

  const { data: detailedCostPerUserData, isLoading: isLoadingDetailedCostPerUserData } =
    useGetDetailedFinancialStatsQuery({
      metrics: 'total_costs,sessions',
      group_by: 'username',
      date_filter: detailedCostPerUserFilters.activeFilter || FILTER_30D,
      platform_key: tenantKey,
      ...(detailedCostPerUserFilters.activeFilter === 'custom' && {
        start_date: formatDateToYYYYMMDD(detailedCostPerUserFilters.dateRange?.startDate),
        end_date: formatDateToYYYYMMDD(detailedCostPerUserFilters.dateRange?.endDate),
      }),
      page: costPerUserPage,
      limit: costPerUserLimit,
      ...(mentorId ? { mentor_unique_id: mentorId } : {}),
      search: encodeURIComponent(costPerUserSearch),
    });

  const { data: detailedLLMCostData, isLoading: isLoadingDetailedLLMCostData } =
    useGetDetailedFinancialStatsQuery({
      metric: 'total_costs',
      group_by: 'llm_model',
      date_filter: detailedLLMCostFilters.activeFilter || FILTER_30D,
      platform_key: tenantKey,
      ...(detailedLLMCostFilters.activeFilter === 'custom' && {
        start_date: formatDateToYYYYMMDD(detailedLLMCostFilters.dateRange?.startDate),
        end_date: formatDateToYYYYMMDD(detailedLLMCostFilters.dateRange?.endDate),
      }),
      ...(mentorId ? { mentor_unique_id: mentorId } : {}),
    });

  /**
   * Generates an array of resembling colors based on a base color
   */
  const generateResemblingColors = (baseColor: string, totalColors: number): string[] => {
    const colors = [baseColor];
    const baseColorVariations = [
      '#2b7fff',
      '#4d8fff',
      '#6fa0ff',
      '#91b1ff',
      '#b3c2ff',
      '#1a6fee',
      '#0961dd',
      '#0056cc',
      '#004bbb',
      '#0040aa',
    ];

    for (let i = 1; i < totalColors && i < baseColorVariations.length; i++) {
      colors.push(baseColorVariations[i]);
    }

    // If we need more colors, generate variations
    while (colors.length < totalColors) {
      const hue = Math.floor(Math.random() * 360);
      colors.push(`hsl(${hue}, 70%, 50%)`);
    }

    return colors;
  };

  const providerColors = generateResemblingColors(
    '#2b7fff',
    detailedCostPerProviderData?.rows?.length || 0,
  );

  return {
    weeklyCostData,
    isLoadingWeeklyCostData,
    monthlyCostData,
    isLoadingMonthlyCostData,
    totalCostData,
    isLoadingTotalCostData,
    detailedCostPerDayData,
    isLoadingDetailedCostPerDayData,
    detailedCostPerDayFilters,
    setDetailedCostPerDayFilters,
    detailedCostPerProviderData,
    isLoadingDetailedCostPerProviderData,
    detailedCostPerProviderFilters,
    setDetailedCostPerProviderFilters,
    detailedCostPerUserData,
    isLoadingDetailedCostPerUserData,
    detailedCostPerUserFilters,
    setDetailedCostPerUserFilters,
    detailedLLMCostData,
    isLoadingDetailedLLMCostData,
    detailedLLMCostFilters,
    setDetailedLLMCostFilters,
    costPerUserPage,
    setCostPerUserPage,
    costPerUserLimit,
    setCostPerUserLimit,
    generateResemblingColors,
    providerColors,
    costPerUserSearch,
    setCostPerUserSearch,
    handleSearchInputChange,
  };
};
