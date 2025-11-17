'use client';

import {
  useGetTranscriptsMessagesQuery,
  useGetTranscriptsMessagesDetailsQuery,
  useGetTranscriptsConversationHeadlineQuery,
} from '@iblai/data-layer';
import { useState, useCallback } from 'react';

export const useTranscripts = ({
  tenantKey,
  mentorId,
}: {
  tenantKey: string;
  mentorId: string;
}) => {
  const {
    data: transcriptsConversationHeadlineData,
    isLoading: isLoadingTranscriptsConversationHeadlineData,
  } = useGetTranscriptsConversationHeadlineQuery({
    platform_key: tenantKey,
    ...(mentorId ? { mentor_unique_id: mentorId } : {}),
    metric: 'headline',
  });

  const DEFAULT_FILTERS = {
    topicSearch: '',
    userSearch: '',
    rating: '',
  };

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [debouncedFilters, setDebouncedFilters] = useState(DEFAULT_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20); // Default page size
  const [selectedTranscript, setSelectedTranscript] = useState<string>('');

  // Handle filter changes with immediate local update and debounced API update
  const handleFilterChange = useCallback((newFilters: typeof DEFAULT_FILTERS) => {
    setFilters(newFilters);
    // Simple debouncing - in a real app you'd want to use a proper debounce hook
    setTimeout(() => {
      setDebouncedFilters(newFilters);
    }, 300);
    setCurrentPage(1); // Reset to first page when filters change
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setDebouncedFilters(DEFAULT_FILTERS);
    setCurrentPage(1); // Reset to first page when filters are cleared
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
    // Scroll to top of the list when changing pages
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const {
    data: transcriptsMessagesDetailsData,
    isLoading: isLoadingTranscriptsMessagesDetailsData,
  } = useGetTranscriptsMessagesDetailsQuery(
    {
      session_id: selectedTranscript,
      platform_key: tenantKey,
      ...(mentorId ? { mentor_unique_id: mentorId } : {}),
    },
    {
      skip: !selectedTranscript,
    },
  );

  const {
    data: transcriptsMessagesData,
    isLoading: isLoadingTranscriptsMessagesData,
    isFetching: isFetchingTranscriptsMessagesData,
  } = useGetTranscriptsMessagesQuery({
    //min_messages: 10,
    platform_key: tenantKey,
    ...(mentorId ? { mentor_unique_id: mentorId } : {}),
    search: debouncedFilters.userSearch,
    topic: debouncedFilters.topicSearch,
    page: currentPage,
    limit: pageSize,
  });

  return {
    transcriptsMessagesData,
    isLoadingTranscriptsMessagesData,
    isFetchingTranscriptsMessagesData,
    filters,
    setFilters: handleFilterChange,
    handleClearFilters,
    DEFAULT_FILTERS,
    currentPage,
    pageSize,
    handlePageChange,
    selectedTranscript,
    setSelectedTranscript,
    transcriptsMessagesDetailsData,
    isLoadingTranscriptsMessagesDetailsData,
    transcriptsConversationHeadlineData,
    isLoadingTranscriptsConversationHeadlineData,
  };
};
