export interface Mentor {
    id: string;
    profile_image: string;
    unique_id: string;
    slug: string;
    name: string;
    description: string;
    imageUrl: string | null;
    recently_accessed_at: string;
    llm_provider: string;
    llm_name: string;
    updated_at: string;
    metadata: { default?: boolean; featured: boolean };
  }

export type MentorsFetchResponse = {
    results: Mentor[];
    count: number;
    next: string | null;
    previous: string | null;
    current_page: number;
    total_pages: number;
  };

export type MentorSummariesResponse = {
    rating: number;
    summary: string;
    tags: string[];
  };

  export type GetMentorSummariesArgs = {
    tenantKey: string;
    username: string;
    mentorId: string;
    summary_type: "users" | "general";
  };

  export type GetMentorsParams = {
    order_by?: string;
    featured?: boolean;
    limit?: number;
    query?: string;
    offset?: number;
    category?: string;
  };

  export type GetMentorsArgs = {
    tenantKey: string;
    username: string;
    params?: GetMentorsParams;
  };

  export type GetConversationMemoriesArgs = {
    tenantKey: string;
    username: string;
    memory_unique_id: string;
  };

export interface ConversationMemoryEntry {
  key: string;
  value: string;
  inserted_at: string;
  updated_at: string;
  expires_at: string;
}

export interface ConversationMemoryResponse {
  mode: string;
  name: string;
  unique_id: string;
  username: string;
  platform: string;
  mentor: string;
  session_id: string;
  catalog_item_type: string;
  catalog_item_id: string;
  entries: ConversationMemoryEntry[];
  inserted_at: string;
  updated_at: string;
  is_auto_generated: boolean;
  category: string;
}