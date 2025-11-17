export interface PlatformConfigurationListResponse {
  platform_key: string;
  configurations: Record<string, any>;
  count: number;
}

export interface PlatformConfigurationItem {
  key: string;
  value: any;
  description: string;
}

export interface PlatformConfigurationSetArgs {
  platform_key: string;
  configurations: PlatformConfigurationItem[];
}

export interface PlatformUserDetails {
  username: string;
  user_id: number;
  name: string;
  platform_org: string;
  expired_on: string | null;
  is_admin: boolean;
  is_staff: boolean;
  platform_key: string;
  active: boolean;
  email: string;
  added_on: string;
}

export interface PlatformUserWithPolicies extends PlatformUserDetails {
  policies: string[];
}

export interface PlatformUsersListWithPoliciesResponse {
  allowed_policies: string[];
  data: PlatformUserWithPolicies[];
}

export interface PlatformUsersListResponse {
  count: number;
  next_page: number | null;
  previous_page: number | null;
  results: PlatformUsersListWithPoliciesResponse | PlatformUserDetails[];
}

// Type guard for discriminating response types
export function isPoliciesResponse(
  results: PlatformUsersListResponse['results'],
): results is PlatformUsersListWithPoliciesResponse {
  return (
    typeof results === 'object' &&
    results !== null &&
    'allowed_policies' in results &&
    'data' in results
  );
}

export interface PlatformUserPolicyUpdateRequest {
  user_id: number;
  platform_key: string;
  policies_to_add?: string[];
  policies_to_remove?: string[];
  policies_to_set?: string[];
}
