'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';

import { StatCard } from './stat-card';
import { ChartCardWrapper } from './chart-card-wrapper';
import { useFinancial } from './use-financial';
import { EmptyStats } from './empty-stats';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react';
import { formatRelativeTime } from '@iblai/web-utils';
import { cn } from '@web-containers/lib/utils';

// Utility function to format date to short format
const formatDateToShortFormat = (dateString: string, isToday: boolean = false): string => {
  const date = new Date(dateString);
  if (isToday) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

interface AnalyticsFinancialStatsProps {
  tenantKey: string;
  mentorId: string;
  selectedMentorId?: string;
}

export function AnalyticsFinancialStats({
  tenantKey,
  mentorId,
  selectedMentorId,
}: AnalyticsFinancialStatsProps) {
  const currentMentorId = selectedMentorId || mentorId;

  const {
    weeklyCostData,
    isLoadingWeeklyCostData,
    monthlyCostData,
    isLoadingMonthlyCostData,
    totalCostData,
    isLoadingTotalCostData,
    detailedCostPerDayData,
    detailedCostPerDayFilters,
    setDetailedCostPerDayFilters,
    detailedCostPerProviderData,
    detailedCostPerProviderFilters,
    setDetailedCostPerProviderFilters,
    detailedCostPerUserData,
    detailedCostPerUserFilters,
    setDetailedCostPerUserFilters,
    costPerUserPage,
    setCostPerUserPage,
    costPerUserLimit,
    providerColors,
    detailedLLMCostData,
    detailedLLMCostFilters,
    setDetailedLLMCostFilters,
  } = useFinancial({ tenantKey, mentorId: currentMentorId });

  // Pagination handlers
  const handleFirstPage = () => {
    setCostPerUserPage(1);
  };

  const handlePreviousPage = () => {
    if (costPerUserPage > 1) {
      setCostPerUserPage(costPerUserPage - 1);
    }
  };

  const handleNextPage = () => {
    if (detailedCostPerUserData && costPerUserPage < detailedCostPerUserData.total_pages) {
      setCostPerUserPage(costPerUserPage + 1);
    }
  };

  const handleLastPage = () => {
    if (detailedCostPerUserData) {
      setCostPerUserPage(detailedCostPerUserData.total_pages);
    }
  };

  // Generate page numbers for paginations display
  const generatePageNumbers = () => {
    if (!detailedCostPerUserData) return [];

    const totalPages = detailedCostPerUserData.total_pages;
    const currentPage = costPerUserPage;
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      // Show all pages if total is 7 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard
          loading={isLoadingWeeklyCostData}
          title="Weekly Costs"
          value={Number(weeklyCostData?.value || 0).toFixed(2)}
          percentage={weeklyCostData?.percentage_change || 0}
          showDollarSign={true}
        />
        <StatCard
          loading={isLoadingMonthlyCostData}
          title="Monthly Costs"
          value={Number(monthlyCostData?.value || 0).toFixed(2)}
          percentage={monthlyCostData?.percentage_change || 0}
          showDollarSign={true}
        />
        <StatCard
          loading={isLoadingTotalCostData}
          title="Total Costs"
          value={Number(totalCostData?.value || 0).toFixed(2)}
          percentage={totalCostData?.percentage_change}
          showDollarSign={true}
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <ChartCardWrapper
          title="Cost per Day"
          label="Cost per Day"
          filters={detailedCostPerDayFilters}
          setOutsideFilters={setDetailedCostPerDayFilters}
        >
          {detailedCostPerDayData?.overtime?.length &&
          detailedCostPerDayData?.overtime?.length > 0 ? (
            <BarChart
              data={detailedCostPerDayData.overtime.map((item) => ({
                date: formatDateToShortFormat(
                  item.date,
                  detailedCostPerDayFilters.activeFilter === 'today',
                ),
                value: item.value,
              }))}
              margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 8, textAnchor: 'end' }}
                angle={-45}
                height={50}
                interval={Math.floor(Number(detailedCostPerDayData?.overtime?.length) / 31) || 0}
              />
              <YAxis
                tick={{ fontSize: 10 }}
                width={40}
                domain={[0, 0.06]}
                tickFormatter={(value) => `$${value.toFixed(3)}`}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;

                  const data = payload[0]?.payload;
                  return (
                    <div
                      className="bg-background border border-border rounded-md p-3 shadow-lg z-50"
                      style={{ borderColor: 'oklch(.922 0 0)' }}
                      role="tooltip"
                      aria-label={`Cost details for ${label}`}
                      tabIndex={-1}
                    >
                      <div className="font-medium text-foreground mb-2 text-base">{label}</div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Cost:</span>
                          <span className="font-medium text-foreground">
                            ${(Number(data?.value) || 0).toFixed(3)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }}
                cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                wrapperStyle={{ outline: 'none' }}
              />
              <Bar dataKey="value" fill="#38A1E5" radius={[5, 5, 5, 5]} barSize={30} />
            </BarChart>
          ) : (
            <EmptyStats />
          )}
        </ChartCardWrapper>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ChartCardWrapper
          title="Cost by Provider"
          label="Cost by Provider"
          filters={detailedCostPerProviderFilters}
          setOutsideFilters={setDetailedCostPerProviderFilters}
        >
          <PieChart>
            <Pie
              data={detailedCostPerProviderData?.rows?.map((item) => ({
                name: item.provider,
                value: item.total_cost,
              }))}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={1}
              dataKey="value"
              label={false}
              startAngle={90}
              endAngle={-270}
            >
              {detailedCostPerProviderData?.rows?.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={providerColors[index] ?? '#38A1E5'}
                  strokeWidth={0}
                  style={{ transition: 'all 0.3s' }}
                  // opacity={activeIndex === index ? 1 : 0.8}
                />
              ))}
            </Pie>
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              iconSize={10}
              wrapperStyle={{ paddingTop: '0px' }}
              fontSize={13}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;

                const data = payload[0]?.payload;
                return (
                  <div
                    className="bg-background border border-border rounded-md p-3 shadow-lg z-[99999999]"
                    style={{ borderColor: 'oklch(.922 0 0)' }}
                    role="tooltip"
                    aria-label={`Provider cost details for ${label}`}
                    tabIndex={-1}
                  >
                    <div className="font-medium text-foreground mb-2 text-base">{label}</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">{data?.name}:</span>
                        <span className="font-medium text-foreground">
                          ${data?.value?.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }}
              wrapperStyle={{ outline: 'none' }}
            />
          </PieChart>
        </ChartCardWrapper>
        <ChartCardWrapper
          title="Cost by LLM"
          label="Cost by LLM"
          filters={detailedLLMCostFilters}
          setOutsideFilters={setDetailedLLMCostFilters}
        >
          {detailedLLMCostData?.rows?.length && detailedLLMCostData?.rows?.length > 0 ? (
            <BarChart
              data={detailedLLMCostData?.rows?.map((item) => ({
                name: item.llm_model,
                value: item.total_cost,
              }))}
              margin={{ top: 5, right: 5, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 9, textAnchor: 'end' }}
                angle={-45}
                height={50}
                interval={Math.floor(Number(detailedLLMCostData?.rows?.length) / 31) || 0}
              />
              <YAxis
                tick={{ fontSize: 10 }}
                width={30}
                tickFormatter={(value) => `$${value.toFixed(3)}`}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;

                  const data = payload[0]?.payload;
                  return (
                    <div
                      className="bg-background border border-border rounded-md p-3 shadow-lg z-50"
                      style={{ borderColor: 'oklch(.922 0 0)' }}
                      role="tooltip"
                      aria-label={`LLM cost details for ${label}`}
                      tabIndex={-1}
                    >
                      <div className="font-medium text-foreground mb-2 text-base">{label}</div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Total Cost:</span>
                          <span className="font-medium text-foreground">
                            ${data?.value?.toFixed(3)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }}
                cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                wrapperStyle={{ outline: 'none' }}
              />
              <Bar dataKey="value" fill="#38A1E5" radius={[5, 5, 5, 5]} barSize={25} />
            </BarChart>
          ) : (
            <EmptyStats />
          )}
        </ChartCardWrapper>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <ChartCardWrapper
          title="Cost per User"
          label="Cost per User"
          filters={detailedCostPerUserFilters}
          setOutsideFilters={setDetailedCostPerUserFilters}
          overflowAuto={true}
          height="450px"
        >
          <div className="space-y-4">
            <div
              className="rounded-md"
              style={{ borderColor: 'oklch(.922 0 0)', borderWidth: '1px' }}
            >
              <Table>
                <TableHeader>
                  <TableRow className="h-[48px]" style={{ borderColor: 'oklch(.922 0 0)' }}>
                    <TableHead className="w-[250px]">User Email</TableHead>
                    <TableHead className="w-[120px]">Total Cost</TableHead>
                    <TableHead>Sessions</TableHead>
                    <TableHead className="text-right">Last Active</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {detailedCostPerUserData?.rows?.map((user, index) => (
                    <TableRow
                      key={index}
                      className={cn(index % 2 === 0 ? 'bg-gray-50' : '', 'h-[48px]')}
                      style={{ borderColor: 'oklch(.922 0 0)' }}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          {/* <span className="text-blue-600 mr-2">↗</span> */}
                          {user?.email || user?.username || 'Anonymous'}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        ${Number(user.total_cost || 0).toFixed(2)}
                      </TableCell>
                      <TableCell>{user.sessions}</TableCell>
                      <TableCell className="text-right">
                        {user.last_active ? formatRelativeTime(user.last_active) : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {(!detailedCostPerUserData?.rows?.length ||
              detailedCostPerUserData?.rows?.length === 0) && (
              <div className="h-[60px]">
                <EmptyStats />
              </div>
            )}
            {/* Pagination */}
            {detailedCostPerUserData && detailedCostPerUserData.total_pages > 1 && (
              <div className="flex items-center justify-between py-3">
                <div className="text-sm text-gray-700">
                  Showing {(costPerUserPage - 1) * costPerUserLimit + 1} to{' '}
                  {Math.min(
                    costPerUserPage * costPerUserLimit,
                    detailedCostPerUserData.total_records,
                  )}{' '}
                  of {detailedCostPerUserData.total_records} results
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 p-2 !w-auto !inline-flex bg-transparent"
                    onClick={handleFirstPage}
                    disabled={costPerUserPage === 1}
                  >
                    <span className="sr-only">Go to first page</span>
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 p-2 !w-auto !inline-flex bg-transparent"
                    onClick={handlePreviousPage}
                    disabled={costPerUserPage === 1}
                  >
                    <span className="sr-only">Go to previous page</span>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  {generatePageNumbers().map((page, index) => (
                    <React.Fragment key={index}>
                      {page === '...' ? (
                        <span className="px-2 text-gray-500">...</span>
                      ) : (
                        <Button
                          variant={costPerUserPage === page ? 'default' : 'outline'}
                          size="sm"
                          className={`h-8 p-3 !w-auto !inline-flex ${
                            costPerUserPage === page ? 'bg-blue-50 text-blue-600' : 'bg-transparent'
                          }`}
                          onClick={() => setCostPerUserPage(page as number)}
                        >
                          {page}
                        </Button>
                      )}
                    </React.Fragment>
                  ))}

                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 p-2 !w-auto !inline-flex bg-transparent"
                    onClick={handleNextPage}
                    disabled={costPerUserPage === detailedCostPerUserData.total_pages}
                  >
                    <span className="sr-only">Go to next page</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 p-2 !w-auto !inline-flex bg-transparent"
                    onClick={handleLastPage}
                    disabled={costPerUserPage === detailedCostPerUserData.total_pages}
                  >
                    <span className="sr-only">Go to last page</span>
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </ChartCardWrapper>
      </div>
    </div>
  );
}
