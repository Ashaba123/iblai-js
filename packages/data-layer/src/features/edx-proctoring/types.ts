export interface ActiveAttempt {
  in_timed_exam: boolean;
  taking_as_proctored: boolean;
  exam_type: string;
  exam_display_name: string;
  exam_url_path: string;
  time_remaining_seconds: number;
  total_time: string;
  low_threshold_sec: number;
  critically_low_threshold_sec: number;
  course_id: string;
  attempt_id: number;
  external_id: string | null;
  accessibility_time_string: string;
  attempt_status: string;
  exam_started_poll_url: string;
  attempt_ready_to_resume: boolean;
  use_legacy_attempt_api: boolean;
  desktop_application_js_url: string;
}

export interface Exam {
  id: number;
  course_id: string;
  content_id: string;
  external_id: string | null;
  exam_name: string;
  time_limit_mins: number;
  is_proctored: boolean;
  is_practice_exam: boolean;
  is_active: boolean;
  due_date: string | null;
  hide_after_due: boolean;
  backend: string;
  attempt: ActiveAttempt;
  type: string;
  passed_due_date: boolean;
  use_legacy_attempt_api: boolean;
}

export interface ExamInfo {
  exam: Exam;
  active_attempt: ActiveAttempt;
}

export interface ExamInfoQueryParams {
  course_id: string;
  content_id: string;
  is_learning_mfe: boolean;
}

export interface ExamAttemptArgs {
  attemptID: number;
  action: 'submit' | 'stop';
}

export interface ExamAttemptResponse {
  exam_attempt_id: number;
}

export interface ExamStartArgs {
  examID: number;
  start_clock: boolean;
}

export interface ExamStartResponse {
  exam_attempt_id: number;
}
