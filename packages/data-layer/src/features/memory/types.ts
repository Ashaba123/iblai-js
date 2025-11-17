export interface MemoryEntry {
  unique_id: string;
  key: string;
  value: string;
  inserted_at: string;
  updated_at: string;
  expires_at: string | null;
  category: string;
}

export interface Memory {
  mode: string;
  name: string;
  email: string;
  unique_id: string;
  username: string;
  platform: string;
  mentor: string | null;
  session_id: string | null;
  catalog_item_type: string | null;
  catalog_item_id: string | null;
  entries: MemoryEntry[];
  inserted_at: string;
  updated_at: string;
  is_auto_generated: boolean;
  category: string;
}

export type MemoriesFetchResponse = {
  results: Memory[];
  count: number;
  next: string | null;
  previous: string | null;
};

export type MemoryCategoriesResponse = {
  categories: string[];
};

export type MentorUserSettings = {
  reference_saved_memories: boolean;
};

export type GetMemoriesParams = {
  category?: string;
  limit?: number;
  offset?: number;
};

export type GetMemoriesArgs = {
  tenantKey: string;
  username: string;
  params?: GetMemoriesParams;
};

export type GetFilteredMemoriesParams = {
  category?: string;
  username?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
  page_size?: number;
};

export type GetFilteredMemoriesArgs = {
  tenantKey: string;
  username: string;
  params?: GetFilteredMemoriesParams;
};

export type GetMemoryCategoriesArgs = {
  tenantKey: string;
  username: string;
};

export type GetMentorUserSettingsArgs = {
  tenantKey: string;
  username: string;
  mentorId: string;
};

export type UpdateMentorUserSettingsArgs = {
  tenantKey: string;
  username: string;
  mentorId: string;
  settings: Partial<MentorUserSettings>;
};

export type DeleteMemoryArgs = {
  tenantKey: string;
  username: string;
  memoryId: string;
};

export type DeleteMemoryByCategoryArgs = {
  tenantKey: string;
  username: string;
  category: string;
};

export type UpdateMemoryEntryArgs = {
  tenantKey: string;
  username: string;
  entryId: string;
  data: {
    key?: string;
    value?: string;
  };
};

export type CreateMemoryRequest = {
  name: string;
  platform: string;
  mentor_unique_id?: string;
  entries: Array<{
    key: string;
    value: string;
  }>;
  category: string;
};

export type CreateMemoryArgs = {
  tenantKey: string;
  username: string;
  data: CreateMemoryRequest;
};

export type GetMemoryFiltersArgs = {
  tenantKey: string;
  username: string;
};

export type MemoryFiltersResponse = {
  categories: string[];
  users: { username: string; email: string; lti_email: string }[];
};
