'use client';

import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

import { StatCard } from './stat-card';
import { ChartCardWrapper } from './chart-card-wrapper';
import { EmptyStats } from './empty-stats';
import { useOverview } from './use-overview';

// Utility function to format date to short format
const formatDateToShortFormat = (dateString: string, isToday: boolean = false): string => {
  const date = new Date(dateString);
  if (isToday) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

interface AnalyticsOverviewProps {
  tenantKey: string;
  mentorId: string;
  selectedMentorId?: string;
}

export function AnalyticsOverview({
  tenantKey,
  mentorId,
  selectedMentorId,
}: AnalyticsOverviewProps) {
  const currentMentorId = selectedMentorId || mentorId;

  const {
    messageStat,
    topicStat,
    conversationStat,
    sessionStats,
    isLoadingAllStats,
    isLoadingUsersStats,
    setSessionStatsDateFilter,
    usersStats,
    sessionStatsDateFilter,
    topicsDetailsStats,
    setTopicsDetailsStatsDateFilter,
    topicsDetailsStatsDateFilter,
    activeUsersStats,
    setUsersStatsDateFilter,
    usersStatsDateFilter,
  } = useOverview({ tenantKey, mentorId: currentMentorId });

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          loading={isLoadingAllStats}
          title="Messages"
          value={messageStat.stat}
          percentage={messageStat.percentage}
        />
        <StatCard
          loading={isLoadingUsersStats}
          title="Active Users"
          value={usersStats?.count || 0}
          percentage={usersStats?.percentage_change || 0}
        />
        <StatCard
          loading={isLoadingAllStats}
          title="Topics"
          value={topicStat.stat}
          percentage={topicStat.percentage}
        />
        <StatCard
          loading={isLoadingAllStats}
          title="Conversations"
          value={conversationStat.stat}
          percentage={conversationStat.percentage}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ChartCardWrapper
          title="Sessions"
          label="Sessions"
          setOutsideFilters={setSessionStatsDateFilter}
          filters={sessionStatsDateFilter}
        >
          {sessionStats?.points?.length && sessionStats?.points?.length > 0 ? (
            <LineChart
              data={
                sessionStats?.points?.map((point) => ({
                  date: formatDateToShortFormat(
                    point.date,
                    sessionStatsDateFilter.activeFilter === 'today',
                  ),
                  value: point.value,
                })) || []
              }
              margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 8, textAnchor: 'end' }}
                angle={-45}
                interval={Math.floor(Number(sessionStats?.points?.length) / 31) || 0}
              />
              <YAxis tick={{ fontSize: 10 }} width={30} allowDecimals={false} />
              <Tooltip
                content={({ active, payload, label }: any) => {
                  if (!active || !payload?.length) return null;

                  const data = payload[0]?.payload;
                  return (
                    <div
                      className="bg-background border border-border rounded-md p-3 shadow-lg z-50"
                      style={{ borderColor: 'oklch(.922 0 0)' }}
                      role="tooltip"
                      aria-label={`Session details for ${label}`}
                      tabIndex={-1}
                    >
                      <div className="font-medium text-foreground mb-2 text-base">{label}</div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Sessions:</span>
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
        <ChartCardWrapper
          title="Topics"
          label="Topics"
          filters={topicsDetailsStatsDateFilter}
          setOutsideFilters={setTopicsDetailsStatsDateFilter}
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
                domain={[0, 'dataMax']}
                allowDecimals={false}
              />
              <YAxis
                dataKey="topic"
                type="category"
                tick={{ fontSize: 10 }}
                interval={0}
                width={80}
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

      <div className="grid grid-cols-1 gap-6">
        <ChartCardWrapper
          title="Active Users"
          label="Active Users"
          filters={usersStatsDateFilter}
          setOutsideFilters={setUsersStatsDateFilter}
        >
          {activeUsersStats?.points?.length && activeUsersStats?.points?.length > 0 ? (
            <BarChart
              data={activeUsersStats?.points?.map((point) => ({
                date: formatDateToShortFormat(
                  point.date,
                  usersStatsDateFilter.activeFilter === 'today',
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
                interval={Math.floor(Number(activeUsersStats?.points?.length) / 90) || 0}
              />
              <YAxis width={30} domain={[0, 'dataMax']} allowDecimals={false} />
              <Tooltip
                content={({ active, payload, label }: any) => {
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
      </div>
    </div>
  );
}
