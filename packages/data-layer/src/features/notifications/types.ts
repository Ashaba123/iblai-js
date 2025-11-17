export interface NotificationTemplatePeriodicSettings {
  periodic_learner_scope?: 'ALL_LEARNERS' | 'ACTIVE_LEARNERS';
  periodic_report_period_days?: number;
  periodic_frequency?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'CUSTOM';
  periodic_custom_interval_days?: number;
  periodic_execution_time?: string;
  periodic_timezone?: string;
  periodic_mentors?: NotificationTemplatePeriodicMentor[];
}

export interface NotificationTemplate extends NotificationTemplatePeriodicSettings {
  id: string;
  type: string;
  name: string;
  description: string;
  is_inherited: boolean;
  source_platform: string;
  is_enabled: boolean;
  can_customize: boolean;
  message_title: string;
  email_subject: string;
  email_html_template: string;
  spas: string;
  allowed_channels: string;
  available_context: string;
}

export interface NotificationSpaDetail {
  id: number;
  name: string;
  description: string;
}

export interface NotificationChannelDetail {
  id: number;
  name: string;
}

export interface NotificationTemplatePeriodicMentor {
  unique_id: string;
  prompt?: string;
}

export interface NotificationTemplatePeriodicConfig {
  learner_scope: 'ALL_LEARNERS' | 'ACTIVE_LEARNERS';
  report_period_days: number;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'CUSTOM';
  execution_time?: string;
  timezone?: string;
  mentors: NotificationTemplatePeriodicMentor[];
}

export interface NotificationTemplateDetail extends NotificationTemplatePeriodicSettings {
  id: string;
  type: string;
  name: string;
  description: string;
  message_title: string;
  message_body: string;
  short_message_body: string;
  email_subject: string;
  email_from_address: string;
  email_html_template: string;
  spas_detail: NotificationSpaDetail[];
  allowed_channels_detail: NotificationChannelDetail[];
  is_inherited: boolean;
  is_enabled: boolean;
  source_platform: string;
  metadata: string;
  available_context: string;
  created_at: string;
  updated_at: string;
  periodic_config?: NotificationTemplatePeriodicConfig;
  proactive_prompt_message?: string;
}
