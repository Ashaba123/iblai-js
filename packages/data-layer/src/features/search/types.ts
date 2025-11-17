export interface GetRecommendationsAiSearchArgs {
  params: {
    platform_key: string;
    platform_org?: string;
    recommendation_type: recommendationPromptTypeEnum;
    use_llm_ranking?: boolean;
    ranking_strategy?: 'relevance' | 'difficulty' | 'personalized' | 'custom';
    include_main_catalog?: boolean;
    limit?: number;
    search_terms?: string;
    domains?: string[];
    difficulty_levels?: string[];
    spa_url?: string;
  };
}

export enum recommendationPromptTypeEnum {
  mentors = 'mentors',
  catalog = 'catalog',
}

export interface RecommendationItem {
  course_id: string;
  course_title: string;
  reason: string;
  domain: string;
  difficulty_level: string;
  estimated_hours: number;
  confidence_score: number;
  platform_key: string;
  description: string;
}

export interface RecommendationSystemUserContext {
  completed_courses: string[];
  strong_domains: string[];
  average_completion_rate: number;
}

export interface GetRecommendationsAiSearchResponse {
  success: boolean;
  recommendations: RecommendationItem[];
  user_context: RecommendationSystemUserContext;
  recommendation_id: string;
  generated_at: string;
  platform_key: string;
  method_used: string;
  search_query_used: string;
  candidates_retrieved: number;
  processing_time_seconds: number;
}

export interface RecommendedPromptDetailResponse {
  id: number | null;
  platform_key: string;
  prompt_text: string;
  recommendation_type: string;
  spa_url?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface GetRecommendedPromptsListArgs {
  params: {
    platform_key: string;
    recommendation_type?: recommendationPromptTypeEnum;
    active_only?: boolean;
  };
}

export interface CreateRecommendedPromptArgs {
  requestBody: {
    platform_key: string;
    recommendation_type: recommendationPromptTypeEnum;
    spa_url?: string;
    prompt_text: string;
    active: boolean;
    ranking_strategy: 'relevance' | 'difficulty' | 'personalized' | 'custom';
  };
}

export interface UpdateRecommendedPromptArgs {
  requestBody: {
    prompt_text: string;
    active: boolean;
  };
  prompt_id: number;
  platform_key: string;
}

export interface DeleteRecommendedPromptArgs {
  params: {
    prompt_id: number;
    platform_key: string;
  };
}
