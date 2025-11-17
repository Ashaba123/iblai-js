'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar, Tooltip } from 'recharts';
import { StatCard } from './stat-card';
import { ChartCardWrapper } from './chart-card-wrapper';
import { useTopics } from './use-topics';
import { EmptyStats } from './empty-stats';
import { cn } from '@web-containers/lib/utils';

// Utility function to format date to short format
const formatDateToShortFormat = (dateString: string, isToday: boolean = false): string => {
  const date = new Date(dateString);
  if (isToday) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

interface AnalyticsTopicsStatsProps {
  tenantKey: string;
  mentorId: string;
  selectedMentorId?: string;
}

export function AnalyticsTopicsStats({
  tenantKey,
  mentorId,
  selectedMentorId,
}: AnalyticsTopicsStatsProps) {
  const currentMentorId = selectedMentorId || mentorId;

  const {
    topicsStats,
    isLoadingTopicsStats,
    conversationsStats,
    conversationsStatsDateFilter,
    setConversationsStatsDateFilter,
    averageRatingStats,
    averageRatingDateFilter,
    setAverageRatingDateFilter,
    topicsDetailsStats,
    topicsDetailsDateFilter,
    setTopicsDetailsDateFilter,
  } = useTopics({ tenantKey, mentorId: currentMentorId });

  const averageRatingDisplayed =
    averageRatingStats?.points?.length && averageRatingStats?.points?.length > 0;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="Topics"
          value={topicsStats?.topics?.this_month || 0}
          loading={isLoadingTopicsStats}
          percentage={topicsStats?.topics?.percentage_change || 0}
        />
        <StatCard
          title="Conversations"
          value={topicsStats?.conversations?.this_month || 0}
          loading={isLoadingTopicsStats}
          percentage={topicsStats?.conversations?.percentage_change || 0}
        />
        <StatCard
          title="Messages"
          value={topicsStats?.messages?.this_month || 0}
          loading={isLoadingTopicsStats}
          percentage={topicsStats?.messages?.percentage_change || 0}
        />
      </div>

      <div
        className={cn(
          'grid grid-cols-1 lg:grid-cols-2 gap-5',
          !averageRatingDisplayed ? 'lg:grid-cols-1' : '',
        )}
      >
        <ChartCardWrapper
          title="Conversations"
          label="Conversations"
          filters={conversationsStatsDateFilter}
          setOutsideFilters={setConversationsStatsDateFilter}
        >
          {conversationsStats?.points?.length && conversationsStats?.points?.length > 0 ? (
            <LineChart
              data={conversationsStats?.points?.map((point) => ({
                date: formatDateToShortFormat(
                  point.date,
                  conversationsStatsDateFilter.activeFilter === 'today',
                ),
                value: point.value,
              }))}
              margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 8, textAnchor: 'end' }}
                angle={-45}
                interval={Math.floor(Number(conversationsStats?.points?.length) / 31) || 0}
              />
              <YAxis tick={{ fontSize: 10 }} width={30} allowDecimals={false} />
              <Tooltip
                content={({ active, payload, label }: any) => {
                  if (!active || !payload?.length) return null;

                  const data = payload[0]?.payload;
                  return (
                    <div
                      className="bg-background border border-border rounded-md p-3 shadow-lg z-50"
                      role="tooltip"
                      aria-label={`Conversations for ${label}`}
                      tabIndex={-1}
                      style={{ borderColor: 'oklch(.922 0 0)' }}
                    >
                      <div className="font-medium text-foreground mb-2 text-base">{label}</div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Conversations:</span>
                          <span className="font-medium text-foreground">
                            {data?.value?.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }}
                cursor={{ stroke: '#38A1E5', strokeWidth: 1, strokeDasharray: '5 5' }}
                wrapperStyle={{ outline: 'none' }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#38A1E5"
                strokeWidth={2}
                dot={false}
                activeDot={{
                  r: 6,
                  stroke: '#38A1E5',
                  strokeWidth: 2,
                  fill: 'white',
                }}
              />
            </LineChart>
          ) : (
            <EmptyStats />
          )}
        </ChartCardWrapper>
        {averageRatingDisplayed ? (
          <ChartCardWrapper
            title="Average Rating"
            label="Rating"
            filters={averageRatingDateFilter}
            setOutsideFilters={setAverageRatingDateFilter}
          >
            {averageRatingStats?.points?.length && averageRatingStats?.points?.length > 0 ? (
              <LineChart
                data={averageRatingStats?.points?.map((point) => ({
                  date: formatDateToShortFormat(
                    point.date,
                    averageRatingDateFilter.activeFilter === 'today',
                  ),
                  value: point.value,
                }))}
                margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 8, textAnchor: 'end' }}
                  angle={-45}
                  interval={Math.floor(Number(averageRatingStats?.points?.length) / 31) || 0}
                />
                <YAxis tick={{ fontSize: 10 }} width={30} domain={[0, 5]} tickCount={6} />
                <Tooltip
                  content={({ active, payload, label }: any) => {
                    if (!active || !payload?.length) return null;

                    const data = payload[0]?.payload;
                    return (
                      <div
                        className="bg-background border border-border rounded-md p-3 shadow-lg z-50"
                        role="tooltip"
                        aria-label={`Rating for ${label}`}
                        tabIndex={-1}
                        style={{ borderColor: 'oklch(.922 0 0)' }}
                      >
                        <div className="font-medium text-foreground mb-2 text-base">{label}</div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Average Rating:</span>
                            <span className="font-medium text-foreground">
                              {data?.value?.toFixed(1)} / 5
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }}
                  cursor={{ stroke: '#38A1E5', strokeWidth: 1, strokeDasharray: '5 5' }}
                  wrapperStyle={{ outline: 'none' }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#38A1E5"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{
                    r: 6,
                    stroke: '#38A1E5',
                    strokeWidth: 2,
                    fill: 'white',
                  }}
                />
              </LineChart>
            ) : (
              <EmptyStats />
            )}
          </ChartCardWrapper>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-6">
        <ChartCardWrapper
          title="Topics Details"
          label="Messages"
          filters={topicsDetailsDateFilter}
          setOutsideFilters={setTopicsDetailsDateFilter}
        >
          {topicsDetailsStats?.results?.length && topicsDetailsStats?.results?.length > 0 ? (
            <BarChart
              data={topicsDetailsStats?.results?.map((result) => ({
                topic: result.name,
                value: result.messages,
              }))}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 10 }}
                allowDecimals={false}
                domain={[0, 'dataMax']}
              />
              <YAxis
                dataKey="topic"
                type="category"
                tick={{ fontSize: 10 }}
                interval={0}
                width={120}
              />
              <Tooltip
                content={({ active, payload, label }: any) => {
                  if (!active || !payload?.length) return null;

                  const data = payload[0]?.payload;
                  return (
                    <div
                      className="bg-background border border-border rounded-md p-3 shadow-lg z-50"
                      role="tooltip"
                      aria-label={`Topic details for ${label}`}
                      tabIndex={-1}
                      style={{ borderColor: 'oklch(.922 0 0)' }}
                    >
                      <div className="font-medium text-foreground mb-2 text-base">{label}</div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Messages:</span>
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
              <Bar dataKey="value" fill="#38A1E5" barSize={20} radius={[0, 4, 4, 0]} />
            </BarChart>
          ) : (
            <EmptyStats />
          )}
        </ChartCardWrapper>
      </div>
    </div>
  );
}
