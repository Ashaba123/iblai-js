'use client';
import { DateFilter } from '@iblai/data-layer';
import React from 'react';

export type ChartDateRange = {
  startDate: Date | undefined;
  endDate: Date | undefined;
};

export type ChartFilters = {
  activeFilter: DateFilter;
  dateRange?: ChartDateRange;
};

type ChartFiltersContextValue = {
  filters: ChartFilters;
  setFilters: (next: ChartFilters) => void;
  setActiveFilter: (next: ChartFilters['activeFilter']) => void;
  setDateRange: (next: ChartDateRange) => void;
  setOutsideFilters: (next: Partial<ChartFilters>) => void;
};

const defaultFilters: ChartFilters = {
  activeFilter: 'today',
  dateRange: undefined,
};

const ChartFiltersContext = React.createContext<ChartFiltersContextValue | undefined>(undefined);

type ProviderProps = {
  initialFilters?: Partial<ChartFilters>;
  children: React.ReactNode;
  setOutsideFilters: (next: Partial<ChartFilters>) => void;
};

export function ChartFiltersProvider({
  initialFilters,
  children,
  setOutsideFilters,
}: ProviderProps) {
  const [filters, setFilters] = React.useState<ChartFilters>({
    ...defaultFilters,
    ...initialFilters,
    dateRange: initialFilters?.dateRange ?? defaultFilters.dateRange,
  });

  const setActiveFilter = React.useCallback((next: ChartFilters['activeFilter']) => {
    setFilters((prev) => ({ ...prev, activeFilter: next }));
  }, []);

  const setDateRange = React.useCallback((next: ChartDateRange) => {
    setFilters((prev) => ({ ...prev, dateRange: next }));
  }, []);

  const value = React.useMemo<ChartFiltersContextValue>(
    () => ({
      filters,
      setFilters,
      setActiveFilter,
      setDateRange,
      setOutsideFilters,
    }),
    [filters, setActiveFilter, setDateRange, setOutsideFilters],
  );

  return <ChartFiltersContext.Provider value={value}>{children}</ChartFiltersContext.Provider>;
}

export function useChartFilters() {
  const ctx = React.useContext(ChartFiltersContext);
  if (!ctx) {
    throw new Error('useChartFilters must be used within a ChartFiltersProvider');
  }
  return ctx;
}
