import { RbacGroup, RbacPolicy, RbacRole, RbacUser } from '@iblai/iblai-api';

export interface PlatformMembershipConfigResponse {
  platform_key: string;
  platform_name: string;
  allow_self_linking: boolean;
  created: string;
  modified: string;
}

export interface PlatformMembershipConfigPostRequest {
  platform_key: string;
  allow_self_linking: boolean;
}

export interface PlatformImageAsset {
  id: number;
  category: string;
  url: string;
  created_on: string;
  last_updated: string;
}

export interface PlatformImageAssetPostRequest {
  platform_key: string;
  request: FormData;
}

export interface PlatformImageAssetUpdateRequest {
  platform_key: string;
  asset_id: number;
  request: FormData;
}

export interface RbacPolicyDetailsResponse {
  id: number;
  name: string;
  description: string;
  created: string;
  modified: string;
}

export interface RbacPolicyDetailsRequest {
  id: number;
  platform_key: string;
}

export interface CustomRbacPolicyDetailsResponse extends RbacPolicy {
  is_internal: boolean;
}

export interface CustomRbacRoleDetailsResponse extends RbacRole {
  is_internal: boolean;
}

export interface CustomRbacGroupDetailsResponse extends RbacGroup {
  is_internal: boolean;
}

export interface CustomRbacMentorAccessListPolicy {
  id: number;
  name: string;
  role: string;
  resources: string[];
  users: RbacUser[];
  groups: RbacGroup[];
}

export interface CustomRbacMentorAccessList {
  mentor_id: number;
  policies: CustomRbacMentorAccessListPolicy[];
}
