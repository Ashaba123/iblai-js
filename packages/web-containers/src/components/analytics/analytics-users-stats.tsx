'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

import { StatCard } from './stat-card';
import { ChartCardWrapper } from './chart-card-wrapper';
import { AccessTimeHeatmap } from './access-time-heatmap';
import { useUsers } from './use-users';
import { EmptyStats } from './empty-stats';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, Search } from 'lucide-react';
import { Input } from '../ui/input';
import { cn } from '@web-containers/lib/utils';

// Utility function to format date to short format
const formatDateToShortFormat = (dateString: string, isToday: boolean = false): string => {
  const date = new Date(dateString);
  if (isToday) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

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

interface AnalyticsUsersStatsProps {
  tenantKey: string;
  mentorId: string;
  selectedMentorId?: string;
}

export function AnalyticsUsersStats({
  tenantKey,
  mentorId,
  selectedMentorId,
}: AnalyticsUsersStatsProps) {
  const currentMentorId = selectedMentorId || mentorId;

  const {
    registeredUsers,
    isLoadingRegisteredUsers,
    activeUsers,
    setActiveUsersStatsDateFilter,
    activeUsersStatsDateFilter,
    accessTimeHeatmap,
    isLoadingAccessTimeHeatmap,
    setAccessTimeHeatmapDateFilter,
    accessTimeHeatmapDateFilter,
    userDetailsStats,
    isLoadingUserDetailsStats,
    setUserDetailsStatsDateFilter,
    userDetailsStatsDateFilter,
    setUserDetailsStatsPage,
    userDetailsStatsSearch,
    handleSearchInputChange,
    currentlyActiveUsers,
    isLoadingCurrentlyActiveUsers,
    activeUsers30D,
    isLoadingActiveUsers30D,
  } = useUsers({ tenantKey, mentorId: currentMentorId });
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="Users logged in right now"
          value={currentlyActiveUsers?.count || 0}
          loading={isLoadingCurrentlyActiveUsers}
        />
        <StatCard
          title="Users logged in past 30 days"
          value={activeUsers30D?.count || 0}
          loading={isLoadingActiveUsers30D}
        />
        <StatCard
          title="Total registered users"
          value={registeredUsers?.count || 0}
          loading={isLoadingRegisteredUsers}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ChartCardWrapper
          title="Active Users"
          label="Active Users"
          filters={activeUsersStatsDateFilter}
          setOutsideFilters={setActiveUsersStatsDateFilter}
        >
          {activeUsers?.points?.length && activeUsers?.points?.length > 0 ? (
            <BarChart
              data={activeUsers?.points?.map((point) => ({
                date: formatDateToShortFormat(
                  point.date,
                  activeUsersStatsDateFilter.activeFilter === 'today',
                ),
                value: point.value,
              }))}
              margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 8, textAnchor: 'end' }}
                angle={-45}
                interval={Math.floor(Number(activeUsers?.points?.length) / 31) || 0}
              />
              <YAxis width={30} domain={[0, 'dataMax']} allowDecimals={false} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;

                  const data = payload[0]?.payload;
                  return (
                    <div
                      className="bg-background border border-border rounded-md p-3 shadow-lg z-50"
                      role="tooltip"
                      aria-label={`Active users for ${label}`}
                      tabIndex={-1}
                      style={{ borderColor: 'oklch(.922 0 0)' }}
                    >
                      <div className="font-medium text-foreground mb-2 text-base">{label}</div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Active Users:</span>
                          <span className="font-medium text-foreground">
                            {data?.value?.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }}
                cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                wrapperStyle={{ outline: 'none' }}
              />
              <Bar dataKey="value" fill="#38A1E5" radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : (
            <EmptyStats />
          )}
        </ChartCardWrapper>
        <ChartCardWrapper
          title="Access Times"
          label="Access Times"
          filters={accessTimeHeatmapDateFilter}
          setOutsideFilters={setAccessTimeHeatmapDateFilter}
        >
          <AccessTimeHeatmap
            loading={isLoadingAccessTimeHeatmap}
            accessTimeData={accessTimeHeatmap}
          />
        </ChartCardWrapper>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <ChartCardWrapper
          title="User Details"
          label="User Details"
          filters={userDetailsStatsDateFilter}
          setOutsideFilters={setUserDetailsStatsDateFilter}
          overflowAuto={true}
          height="450px"
        >
          <div className="space-y-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="search-user"
                type="text"
                placeholder="Search by email or username..."
                value={userDetailsStatsSearch}
                onChange={handleSearchInputChange}
                required
                className={`pl-9 border-gray-300 focus:bg-transparent focus:color-transparent h-11`}
              />
            </div>
            <div
              className="rounded-md"
              style={{ borderColor: 'oklch(.922 0 0)', borderWidth: '1px' }}
            >
              <Table>
                <TableHeader>
                  <TableRow className="h-[48px]" style={{ borderColor: 'oklch(.922 0 0)' }}>
                    <TableHead className="w-[250px]">User Email</TableHead>
                    <TableHead className="w-[200px]">Username</TableHead>
                    <TableHead>Messages</TableHead>
                    <TableHead className="text-right">Last Active</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userDetailsStats?.results?.map((user, index) => (
                    <TableRow
                      key={index}
                      className={cn(index % 2 === 0 ? 'bg-gray-50' : '', 'h-[48px]')}
                      style={{ borderColor: 'oklch(.922 0 0)' }}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          {/* <span className="text-blue-600 mr-2">↗</span> */}
                          {user.email || 'Anonymous'}
                        </div>
                      </TableCell>
                      <TableCell>{user.full_name || ''}</TableCell>
                      <TableCell>{user.messages}</TableCell>
                      <TableCell className="text-right">
                        {user.last_activity ? formatRelativeTime(user.last_activity) : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {/* PAGINATION */}
            {isLoadingUserDetailsStats && (
              <div className="flex items-center justify-center py-4">
                <div className="text-sm text-gray-500">Loading...</div>
              </div>
            )}
            {!isLoadingUserDetailsStats &&
              (!userDetailsStats?.results?.length || userDetailsStats?.results?.length === 0) && (
                <EmptyStats />
              )}
            {userDetailsStats?.pagination && userDetailsStats?.results?.length > 0 && (
              <div className="flex items-center justify-center space-x-2 py-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-2 !w-auto !inline-flex bg-transparent"
                  onClick={() => setUserDetailsStatsPage(1)}
                  disabled={!userDetailsStats.pagination.has_previous}
                >
                  <span className="sr-only">Go to first page</span>
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-2 !w-auto !inline-flex bg-transparent"
                  onClick={() => setUserDetailsStatsPage(userDetailsStats.pagination.page - 1)}
                  disabled={!userDetailsStats.pagination.has_previous}
                >
                  <span className="sr-only">Go to previous page</span>
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {/* Page numbers */}
                {Array.from({ length: userDetailsStats.pagination.total_pages }, (_, i) => i + 1)
                  .filter((page) => {
                    const current = userDetailsStats.pagination.page;
                    const total = userDetailsStats.pagination.total_pages;
                    // Show current page, first page, last page, and pages around current
                    return (
                      page === 1 || page === total || (page >= current - 1 && page <= current + 1)
                    );
                  })
                  .map((page, index, array) => {
                    // Add ellipsis if there are gaps
                    const prevPage = array[index - 1];
                    const showEllipsis = prevPage && page - prevPage > 1;

                    return (
                      <React.Fragment key={page}>
                        {showEllipsis && <span className="px-2 text-gray-500">...</span>}
                        <Button
                          variant="outline"
                          size="sm"
                          className={`h-8 w-8 p-3 !w-auto !inline-flex ${
                            page === userDetailsStats.pagination.page
                              ? 'bg-blue-50 text-blue-600'
                              : 'bg-transparent'
                          }`}
                          onClick={() => setUserDetailsStatsPage(page)}
                        >
                          {page}
                        </Button>
                      </React.Fragment>
                    );
                  })}

                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-2 !w-auto !inline-flex bg-transparent"
                  onClick={() => setUserDetailsStatsPage(userDetailsStats.pagination.page + 1)}
                  disabled={!userDetailsStats.pagination.has_next}
                >
                  <span className="sr-only">Go to next page</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-2 !w-auto !inline-flex bg-transparent"
                  onClick={() => setUserDetailsStatsPage(userDetailsStats.pagination.total_pages)}
                  disabled={!userDetailsStats.pagination.has_next}
                >
                  <span className="sr-only">Go to last page</span>
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </ChartCardWrapper>
      </div>
    </div>
  );
}
