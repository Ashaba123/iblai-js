export type AggregationType = 'daily' | 'hourly' | 'weekly' | 'monthly';

export interface AnalyticsBaseParams {
  org: string;
  userId: string;
  mentorId: string;
}

export interface AnalyticsDateParams extends AnalyticsBaseParams {
  startDate: string;
  endDate: string;
  aggregation: AggregationType;
}

export interface AnalyticsPaginationParams extends AnalyticsDateParams {
  page: number;
  pageSize: number;
}

export interface OverviewSummaryResponse {
  conversation_volume: {
    total: number;
    change: number;
  };
  users: {
    total: number;
    change: number;
  };
  topics: {
    total: number;
    change: number;
  };
  user_rating: {
    total: number;
    change: number;
  };
}

export interface ConversationSummaryResponse {
  date: string;
  conversation_count: number;
}

export interface TopicStatisticsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{
    name: string;
    conversations: number;
    messages: number;
    avg_rating: string;
  }>;
}

export interface TranscriptsMessagesArgs {
  //min_messages: number;
  mentor_unique_id?: string;
  search?: string;
  topic?: string;
  platform_key: string;
  page?: number;
  limit?: number;
}

export interface TranscriptsMessagesDetailsArgs {
  session_id: string;
  platform_key: string;
  mentor_unique_id?: string;
}

export interface TranscriptsMessagesDetailsResponse {
  summary: {
    platform_name: string;
    platform_key: string;
    mentor: string;
    mentor_unique_id: string;
    model: string;
    username: string;
    name: string;
    first_user_message: string;
    topics: string[];
    message_count: number;
    user_queries: number;
    assistant_responses: number;
    average_sentiment: number;
    sentiment: string;
    created_at: string;
    platform: number;
    session: string;
    user: number;
  };
  messages: Array<{
    human: string;
    ai: string;
  }>;
}

export interface TranscriptsMessagesResponse {
  summary: {
    total_conversations: number;
    user_queries: number;
    assistant_responses: number;
    average_sentiment_score: number;
  };
  results: Array<{
    platform_name: string;
    platform_key: string;
    mentor: string;
    mentor_unique_id: string;
    model: string;
    cost: number;
    username: string;
    name: string;
    first_user_message: string;
    topics: string[];
    message_count: number;
    user_queries: number;
    assistant_responses: number;
    average_sentiment: number;
    sentiment: string;
    created_at: string;
    platform: number;
    session: string;
    user: number;
  }>;
  pagination: {
    page: number;
    limit: number;
    total_pages: number;
    total_records: number;
    has_next: boolean;
    has_previous: boolean;
    next_page: number | null;
    previous_page: number | null;
  };
}

export interface TopicOverviewResponse {
  total_topics: number;
  total_topics_change_percentage: number;
  new_topics: number;
  new_topics_change_percentage: number;
}

export interface UserMetricsResponse {
  registered_users: {
    total: number;
    change_percentage: number;
  };
  new_users: {
    total: number;
    change_percentage: number;
  };
  unique_users: {
    total: number;
    change_percentage: number;
  };
  veteran_users: {
    total: number;
    change_percentage: number;
  };
}

export interface UserMetricsPieChartResponse {
  new_users: {
    count: number;
    percentage: number;
  };
  returning_users: {
    count: number;
    percentage: number;
  };
}

export interface UserCohortsOverTimeResponse {
  periods: string[];
  new_users: number[];
  veteran_users: number[];
}

export interface TopStudentsResponse {
  username: string;
  chat_message_count: number;
}

export interface TopicsSummaryResponse {
  name: string;
  conversation_count: number;
}

export interface AverageMessagesPerSessionResponse {
  time: string;
  avg_messages: number;
  total_sessions: number;
}

export type DateFilter = 'today' | '30d' | '7d' | '90d' | 'all_time' | 'custom';

export interface TopicsStatsArgs {
  date_filter: DateFilter;
  platform_key: string;
  mentor_unique_id?: string;
}

export interface TopicsStatsResponse {
  topics: {
    all_time_total: number;
    this_month: number;
    last_month: number;
    percentage_change: number;
  };
  conversations: {
    all_time_total: number;
    this_month: number;
    last_month: number;
    percentage_change: number;
  };
  messages: {
    all_time_total: number;
    this_month: number;
    last_month: number;
    percentage_change: number;
  };
}

export interface UsersStatsResponse {
  points: Array<{
    date: string;
    value: number;
  }>;
  metric: string;
  count: number;
  change: number;
  percentage_change: number;
}

export interface UsersStatsArgs {
  date_filter: DateFilter;
  platform_key: string;
  metric?: string;
  start_date?: string;
  end_date?: string;
  mentor_unique_id?: string;
}

export interface SessionStatsArgs {
  platform_key: string;
  mentor_unique_id?: string;
  date_filter?: string;
  start_date?: string;
  end_date?: string;
  metric?: string;
}

export interface SessionStatsResponse {
  metric: string;
  points: Array<{
    date: string;
    value: number;
  }>;
  avg_messages_per_session?: {
    value: number;
    prev_value: number;
    percentage_change: number;
  };
  avg_rating?: {
    value: number;
    prev_value: number;
    percentage_change: number;
  };
  avg_cost_per_session?: {
    value: number;
    prev_value: number;
    percentage_change: number;
  };
}

export interface TopicsDetailsStatsArgs {
  date_filter: string;
  platform_key: string;
  start_date?: string;
  end_date?: string;
  mentor_unique_id?: string;
}

export interface TopicsDetailsStatsResponse {
  results: Array<{
    topic_id: number;
    name: string;
    messages: number;
    conversations: number;
    average_rating: string;
    rating_count: number;
  }>;
  pagination: {
    page: number;
    limit: number;
    total_pages: number;
    total_records: number;
    has_next: boolean;
    has_previous: boolean;
    next_page: number;
    previous_page: number;
  };
}

export interface AccessTimeHeatmapArgs {
  date_filter: string;
  platform_key: string;
  start_date?: string;
  end_date?: string;
  mentor_unique_id?: string;
}

export interface AccessTimeHeatmapResponse {
  metric: string;
  data: Array<{
    day_of_week: number;
    hour: number;
    value: number;
  }>;
}

export interface UserDetailsStatsArgs {
  date_filter: string;
  platform_key: string;
  start_date?: string;
  end_date?: string;
  page: number;
  limit?: number;
  mentor_unique_id?: string;
  search?: string;
}

export interface UserDetailsStatsResponse {
  results: Array<{
    email: string;
    full_name: string;
    messages: number;
    last_activity: string;
  }>;
  total: number;
  pagination: {
    page: number;
    limit: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
    start_index: number;
    end_index: number;
  };
}

export interface FinancialStatsArgs {
  metric: 'total_costs' | 'weekly_costs' | 'monthly_costs';
  date_filter?: DateFilter;
  platform_key: string;
  mentor_unique_id?: string;
  start_date?: string;
  end_date?: string;
  all_time?: 'true';
}

export interface FinancialStatsFilters {
  start_date: string;
  end_date: string;
  granularity: string;
  all_time: boolean;
}

export interface FinancialStatsPeriodInfo {
  start_date: string;
  end_date: string;
  period_days: number;
  range_type: string;
}

export interface FinancialStatsResponse {
  metric: string;
  filters: FinancialStatsFilters;
  value: number;
  percentage_change: number | undefined;
  overtime: Array<{
    date: string;
    value: number;
  }>;
  period_info: FinancialStatsPeriodInfo;
  comparison_info: Record<string, any>;
}

export interface DetailedFinancialStatsArgs {
  metric?: string;
  metrics?: string;
  group_by: 'llm_model' | 'provider' | 'username';
  date_filter: DateFilter;
  platform_key: string;
  mentor_unique_id?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
  limit?: number;
  search?: string;
}

export interface DetailedFinancialStatsMetric {
  name: string;
  unit: string;
  description: string;
}

export interface DetailedFinancialStatsResponse {
  page: number;
  limit: number;
  total_pages: number;
  total_records: number;
  rows: Record<string, any>[];
  total_cost: number;
  metrics: DetailedFinancialStatsMetric[];
}

export interface TimeTrackingRequest {
  timestamp: string;
  url: string;
  org: string;
  count: number;
  course_id?: number;
  block_id?: number;
  session_uuid?: string;
  mentor_uuid?: string;
}

export interface TimeTrackingResponse {
  message: string;
  success: true;
}
export interface TranscriptsConversationHeadlineArgs {
  platform_key: string;
  metric: string;
  mentor_unique_id?: string;
  start_date?: string;
  end_date?: string;
  date_filter?: string;
}

export interface TranscriptsConversationHeadlineResponse {
  metric: 'headline';
  avg_messages_per_conversation: {
    value: number;
    prev_value: number;
    percentage_change: number;
  };
  avg_rating: {
    value: number;
    prev_value: number;
    percentage_change: number;
  };
  avg_cost_per_conversation: {
    value: number;
    prev_value: number;
    percentage_change: number;
  };
  points?: Array<{
    date: string;
    value: number;
  }>;
}
