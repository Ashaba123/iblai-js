export interface Project {
  id: number;
  name: string;
  description: string;
  shared: boolean;
  owner: number;
  owner_username: string;
  platform: number;
  platform_key: string;
  platform_name: string;
  mentor_count: number;
  is_personal: boolean;
  created_at: string;
  updated_at: string;
  mentors: Mentor[];
  instructions?: string;
  files?: File[];
}

export interface Mentor {
  id: number;
  name: string;
  description: string;
  unique_id: string;
  slug: string;
  created_at: string;
}

export type ProjectsFetchResponse = {
  results: Project[];
  count: number;
  next: string | null;
  previous: string | null;
};

export type GetProjectsParams = {
  shared?: boolean;
  search?: string;
  sort?: string;
  limit?: number;
  offset?: number;
  username?: string; // For admin route
};

export type GetProjectsArgs = {
  tenantKey: string;
  username?: string; // Optional for admin routes
  params?: GetProjectsParams;
};

export type GetProjectDetailsArgs = {
  tenantKey: string;
  username?: string; // Optional for admin routes
  id: number;
};

export type CreateProjectData = {
  name: string;
  description: string;
  shared: boolean;
  mentors_to_add?: string[];
};

export type CreateProjectArgs = {
  tenantKey: string;
  username?: string; // Optional for admin routes
  data: CreateProjectData;
};

export type UpdateProjectData = {
  name?: string;
  description?: string;
  shared?: boolean;
  mentors_to_add?: string[];
  mentors_to_remove?: string[];
};

export type UpdateProjectArgs = {
  tenantKey: string;
  username?: string; // Optional for admin routes
  id: number;
  data: UpdateProjectData;
};

export type DeleteProjectArgs = {
  tenantKey: string;
  username?: string; // Optional for admin routes
  id: number;
};