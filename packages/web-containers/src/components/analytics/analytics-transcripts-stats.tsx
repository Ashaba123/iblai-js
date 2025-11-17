'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  Search,
  ThumbsDown,
  ThumbsUp,
  X,
} from 'lucide-react';

import { StatCard } from './stat-card';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useTranscripts } from './use-transcripts';
import { cn } from '../../lib/utils';
import { Markdown } from '../markdown';

// Utility function to format relative time
const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  if (diffInDays < 30) return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;

  return date.toLocaleDateString();
};

interface AnalyticsTranscriptsStatsProps {
  tenantKey: string;
  mentorId: string;
  selectedMentorId?: string;
}

export function AnalyticsTranscriptsStats({
  tenantKey,
  mentorId,
  selectedMentorId,
}: AnalyticsTranscriptsStatsProps) {
  const currentMentorId = selectedMentorId || mentorId;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    transcriptsMessagesData,
    isLoadingTranscriptsMessagesData,
    isFetchingTranscriptsMessagesData,
    filters,
    setFilters,
    handleClearFilters,
    currentPage,
    handlePageChange,
    selectedTranscript,
    setSelectedTranscript,
    transcriptsMessagesDetailsData,
    isLoadingTranscriptsMessagesDetailsData,
    transcriptsConversationHeadlineData,
    isLoadingTranscriptsConversationHeadlineData,
  } = useTranscripts({ tenantKey, mentorId: currentMentorId });

  // Get pagination data from API response
  const pagination = transcriptsMessagesData?.pagination;
  const totalPages = pagination?.total_pages || 1;
  const hasNext = pagination?.has_next || false;
  const hasPrevious = pagination?.has_previous || false;
  const nextPage = pagination?.next_page;
  const previousPage = pagination?.previous_page;

  // Handle transcript selection
  const handleTranscriptSelect = (transcriptId: string) => {
    setSelectedTranscript(transcriptId);
    // On mobile, open the modal
    if (window.innerWidth < 768) {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Handle pagination navigation
  const handleFirstPage = () => {
    setSelectedTranscript(''); // Reset selected transcript when changing pages
    setIsModalOpen(false); // Close modal when changing pages
    handlePageChange(1);
  };
  const handleLastPage = () => {
    setSelectedTranscript(''); // Reset selected transcript when changing pages
    setIsModalOpen(false); // Close modal when changing pages
    handlePageChange(totalPages);
  };
  const handleNextPage = () => {
    if (nextPage) {
      setSelectedTranscript(''); // Reset selected transcript when changing pages
      setIsModalOpen(false); // Close modal when changing pages
      handlePageChange(nextPage);
    }
  };
  const handlePreviousPage = () => {
    if (previousPage) {
      setSelectedTranscript(''); // Reset selected transcript when changing pages
      setIsModalOpen(false); // Close modal when changing pages
      handlePageChange(previousPage);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show current page with context
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, currentPage + 2);

      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) pages.push('...');
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  // Transcript Detail Component (reusable for both desktop and mobile)
  const TranscriptDetail = ({ className = '' }: { className?: string }) => (
    <div className={cn('h-full flex flex-col', className)}>
      {!selectedTranscript || !transcriptsMessagesDetailsData ? (
        <div className="flex items-center justify-center h-full text-gray-400">
          <div className="text-center">
            <ArrowLeft className="h-6 w-6 mx-auto mb-2" />
            <p>Select a conversation to view its transcript</p>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-4 flex-shrink-0">
            <h2 className="text-lg font-semibold mb-2">Conversation Transcript</h2>
            <div className="text-sm text-gray-500">
              <div>Full Name: {transcriptsMessagesDetailsData?.summary?.name || '-'}</div>
              <div>Username: {transcriptsMessagesDetailsData?.summary?.username || '-'}</div>
              <div>Mentor: {transcriptsMessagesDetailsData?.summary?.mentor || '-'}</div>
              <div>Model: {transcriptsMessagesDetailsData?.summary?.model || '-'}</div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 min-h-0">
            {transcriptsMessagesDetailsData?.messages?.length > 0 &&
              transcriptsMessagesDetailsData?.messages?.map((message, index) => (
                <React.Fragment key={index}>
                  {message?.human && (
                    <div key={`${index}-human`} className={`p-3 rounded-lg bg-blue-100 ml-4`}>
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-sm">Student</span>
                      </div>
                      <p className="text-sm">{message.human}</p>
                    </div>
                  )}
                  {message?.ai && (
                    <div key={`${index}-ai`} className={`p-3 rounded-lg bg-white mr-4`}>
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-sm">Mentor</span>
                      </div>
                      <Markdown>{message.ai}</Markdown>
                    </div>
                  )}
                </React.Fragment>
              ))}

            {(!transcriptsMessagesDetailsData?.messages ||
              transcriptsMessagesDetailsData?.messages?.length === 0) && (
              <div className="text-center text-gray-500 py-8">
                <p>No transcript data available for this conversation.</p>
              </div>
            )}
            {isLoadingTranscriptsMessagesDetailsData && (
              <div className="text-center text-gray-500 py-8">
                <p>Loading...</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="Average number of messages per conversation"
          value={transcriptsConversationHeadlineData?.avg_messages_per_conversation?.value || 0}
          percentage={
            transcriptsConversationHeadlineData?.avg_messages_per_conversation?.percentage_change ||
            undefined
          }
          loading={isLoadingTranscriptsConversationHeadlineData}
        />
        <StatCard
          title="Average cost per conversation"
          value={Number(
            transcriptsConversationHeadlineData?.avg_cost_per_conversation?.value || 0,
          ).toFixed(2)}
          percentage={
            transcriptsConversationHeadlineData?.avg_cost_per_conversation?.percentage_change ||
            undefined
          }
          showDollarSign={true}
          loading={isLoadingTranscriptsConversationHeadlineData}
        />
        <StatCard
          title="Average rating"
          value={transcriptsConversationHeadlineData?.avg_rating?.value || 0}
          percentage={
            transcriptsConversationHeadlineData?.avg_rating?.percentage_change || undefined
          }
          loading={isLoadingTranscriptsConversationHeadlineData}
        />
      </div>

      <div className="flex h-[calc(100vh-120px)]">
        {/* Left Column - Transcript List */}
        <div className="w-full md:w-2/3 md:pr-6 overflow-y-auto md:border-r border-gray-200 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* Search and filter bar */}
          <div className="mb-6">
            <div className="flex gap-2 mb-4 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Topics"
                  value={filters.topicSearch}
                  onChange={(e) => setFilters({ ...filters, topicSearch: e.target.value })}
                  className="pl-10 w-[200px]"
                />
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Users"
                  value={filters.userSearch}
                  onChange={(e) => setFilters({ ...filters, userSearch: e.target.value })}
                  className="pl-10 w-[200px]"
                />
              </div>
              {isFetchingTranscriptsMessagesData && (filters.userSearch || filters.topicSearch) ? (
                <div
                  className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 ml-2"
                  aria-hidden="true"
                ></div>
              ) : (
                <Button
                  variant="outline"
                  onClick={handleClearFilters}
                  className="whitespace-nowrap"
                >
                  Clear All
                </Button>
              )}
            </div>
          </div>

          {/* Stats summary */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-gray-600">
              <div aria-label="Total transcripts conversations">
                {transcriptsMessagesData?.summary.total_conversations} conversations
              </div>
              <div>•</div>
              <div>{transcriptsMessagesData?.summary.user_queries} user queries</div>
              <div>•</div>
              <div>{transcriptsMessagesData?.summary.assistant_responses} assistant responses</div>
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-gray-600 mt-2">
              <div>
                {transcriptsMessagesData?.summary.average_sentiment_score} average sentiment score
              </div>
            </div>
          </div>

          {/* Transcript list */}
          <div className="flex flex-col gap-4">
            {isLoadingTranscriptsMessagesData ? (
              // Loading state
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Card key={index} className="p-4 animate-pulse">
                    <div className="mb-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                      <div className="h-6 bg-gray-200 rounded w-20"></div>
                    </div>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 mb-2">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </div>
                    <div className="flex flex-wrap gap-x-6 gap-y-2">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : transcriptsMessagesData?.results && transcriptsMessagesData.results.length > 0 ? (
              // Results
              transcriptsMessagesData.results.map((transcript) => (
                <Card
                  key={transcript.session}
                  className={cn(
                    `p-4 hover:shadow-md transition-shadow cursor-pointer border ${
                      selectedTranscript === transcript.session
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200'
                    }`,
                  )}
                  onClick={() => handleTranscriptSelect(transcript.session)}
                >
                  <div className="mb-3">
                    <p className="text-gray-800">{transcript.first_user_message}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {transcript?.topics?.length > 0 &&
                      transcript.topics?.map((topic, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-600 px-3 py-1 rounded-[5px] text-xs"
                        >
                          {topic}
                        </span>
                      ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm mb-2">
                    <div
                      className={cn(
                        'flex items-center gap-1',
                        transcript.sentiment === 'negative'
                          ? 'text-blue-600'
                          : transcript.sentiment === 'positive'
                            ? 'text-green-600'
                            : 'text-gray-600',
                      )}
                    >
                      {transcript.sentiment === 'negative' ? (
                        <ThumbsDown className="h-4 w-4" />
                      ) : (
                        <ThumbsUp className="h-4 w-4" />
                      )}
                      <span>
                        {transcript.sentiment === 'negative'
                          ? 'Negative'
                          : transcript.sentiment === 'positive'
                            ? 'Positive'
                            : 'Neutral'}{' '}
                        User Sentiment
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-500 mb-2">
                    <div>Student: {transcript?.name || transcript?.username || '-'}</div>
                    <div>Mentor: {transcript?.mentor || '-'}</div>
                  </div>

                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-500 mb-2">
                    <div>model: {transcript?.model || '-'}</div>
                    <div>user_id: {transcript?.username || '-'}</div>
                  </div>

                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-500">
                    <div>{transcript.message_count} messages</div>
                    <div>•</div>
                    <div>${Number(transcript?.cost || 0).toFixed(2)} estimated cost</div>

                    {transcript?.created_at && (
                      <>
                        <div>•</div>
                        <div>Created {formatRelativeTime(transcript.created_at)}</div>
                      </>
                    )}
                  </div>
                </Card>
              ))
            ) : (
              // Empty state
              <div className="text-center py-12">
                <p className="text-gray-500">
                  {filters.topicSearch || filters.userSearch || filters.rating
                    ? 'No transcripts found matching your filters.'
                    : 'No transcripts available.'}
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav
              aria-label="Transcript pagination"
              className="flex items-center justify-center space-x-2 py-4"
            >
              <Button
                variant="outline"
                size="sm"
                className="h-8 p-2 !w-auto !inline-flex bg-transparent"
                onClick={handleFirstPage}
                disabled={currentPage === 1 || isLoadingTranscriptsMessagesData}
                aria-label={`Go to first page (page 1 of ${totalPages})`}
                aria-disabled={currentPage === 1 || isLoadingTranscriptsMessagesData}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeft className={cn('h-4 w-4', currentPage === 1 && 'opacity-50')} />
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="h-8 p-2 !w-auto !inline-flex bg-transparent"
                onClick={handlePreviousPage}
                disabled={!hasPrevious || isLoadingTranscriptsMessagesData}
                aria-label={`Go to previous page (page ${previousPage || 'none'} of ${totalPages})`}
                aria-disabled={!hasPrevious || isLoadingTranscriptsMessagesData}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeft className={cn('h-4 w-4', !hasPrevious && 'opacity-50')} />
              </Button>

              {/* Page numbers */}
              <div
                className="flex items-center space-x-1"
                role="group"
                aria-label="Page navigation"
              >
                {getPageNumbers().map((page, index) => (
                  <React.Fragment key={index}>
                    {page === '...' ? (
                      <span className="px-2 text-gray-400" aria-hidden="true">
                        ...
                      </span>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          'h-8 p-3 !w-auto !inline-flex',
                          currentPage === page
                            ? 'bg-blue-50 text-blue-600 border-blue-200'
                            : 'bg-transparent hover:bg-gray-50',
                        )}
                        onClick={() => {
                          setSelectedTranscript('');
                          setIsModalOpen(false);
                          handlePageChange(page as number);
                        }}
                        disabled={isLoadingTranscriptsMessagesData}
                        aria-label={`Go to page ${page} of ${totalPages}`}
                        aria-current={currentPage === page ? 'page' : undefined}
                        aria-disabled={isLoadingTranscriptsMessagesData}
                      >
                        {page}
                      </Button>
                    )}
                  </React.Fragment>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                className="h-8 p-2 !w-auto !inline-flex bg-transparent"
                onClick={handleNextPage}
                disabled={!hasNext || isLoadingTranscriptsMessagesData}
                aria-label={`Go to next page (page ${nextPage || 'none'} of ${totalPages})`}
                aria-disabled={!hasNext || isLoadingTranscriptsMessagesData}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRight className={cn('h-4 w-4', !hasNext && 'opacity-50')} />
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="h-8 p-2 !w-auto !inline-flex bg-transparent"
                onClick={handleLastPage}
                disabled={currentPage === totalPages || isLoadingTranscriptsMessagesData}
                aria-label={`Go to last page (page ${totalPages} of ${totalPages})`}
                aria-disabled={currentPage === totalPages || isLoadingTranscriptsMessagesData}
              >
                <span className="sr-only">Go to last page</span>
                <ChevronsRight
                  className={cn('h-4 w-4', currentPage === totalPages && 'opacity-50')}
                />
              </Button>
            </nav>
          )}

          {/* Pagination info */}
          {pagination && (
            <div
              className="text-center text-sm text-gray-500 py-2"
              aria-live="polite"
              aria-atomic="true"
            >
              {isLoadingTranscriptsMessagesData ? (
                <span className="inline-flex items-center gap-2">
                  <div
                    className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-500"
                    aria-hidden="true"
                  ></div>
                  Loading...
                </span>
              ) : (
                `Page ${currentPage} of ${totalPages} • ${pagination.total_records} total records`
              )}
            </div>
          )}
        </div>

        {/* Right Column - Transcript Detail (Desktop Only) */}
        <div className="hidden md:block w-1/3 p-6 bg-gray-50 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <TranscriptDetail />
        </div>
      </div>

      {/* Mobile Modal for Transcript Detail */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl h-[90vh] max-h-[90vh] flex flex-col overflow-hidden">
            <div
              className="flex items-center justify-between p-4 border-b flex-shrink-0"
              style={{ borderColor: 'oklch(.922 0 0)' }}
            >
              <h2 className="text-lg font-semibold">Conversation Transcript</h2>
              <Button variant="ghost" size="sm" onClick={handleCloseModal} className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div
              className="flex-1 overflow-y-auto p-4"
              style={{
                WebkitOverflowScrolling: 'touch',
                overscrollBehavior: 'contain',
              }}
            >
              {!selectedTranscript || !transcriptsMessagesDetailsData ? (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <div className="text-center">
                    <ArrowLeft className="h-6 w-6 mx-auto mb-2" />
                    <p>Select a conversation to view its transcript</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="mb-4">
                    <div className="text-sm text-gray-500 space-y-1">
                      <div>Full Name: {transcriptsMessagesDetailsData?.summary?.name || '-'}</div>
                      <div>
                        Username: {transcriptsMessagesDetailsData?.summary?.username || '-'}
                      </div>
                      <div>Mentor: {transcriptsMessagesDetailsData?.summary?.mentor || '-'}</div>
                      <div>Model: {transcriptsMessagesDetailsData?.summary?.model || '-'}</div>
                    </div>
                  </div>

                  <div className="space-y-4 pb-4">
                    {transcriptsMessagesDetailsData?.messages?.length > 0 &&
                      transcriptsMessagesDetailsData?.messages?.map((message, index) => (
                        <React.Fragment key={index}>
                          {message?.human && (
                            <div className="p-3 rounded-lg bg-blue-100 ml-4">
                              <div className="flex justify-between items-start mb-1">
                                <span className="font-medium text-sm">Student</span>
                              </div>
                              <p className="text-sm">{message.human}</p>
                            </div>
                          )}
                          {message?.ai && (
                            <div
                              className="p-3 rounded-lg bg-white mr-4 border"
                              style={{ borderColor: 'oklch(.922 0 0)' }}
                            >
                              <div className="flex justify-between items-start mb-1">
                                <span className="font-medium text-sm">Mentor</span>
                              </div>
                              <Markdown>{message.ai}</Markdown>
                            </div>
                          )}
                        </React.Fragment>
                      ))}

                    {(!transcriptsMessagesDetailsData?.messages ||
                      transcriptsMessagesDetailsData?.messages?.length === 0) && (
                      <div className="text-center text-gray-500 py-8">
                        <p>No transcript data available for this conversation.</p>
                      </div>
                    )}
                    {isLoadingTranscriptsMessagesDetailsData && (
                      <div className="text-center text-gray-500 py-8">
                        <p>Loading...</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
