export interface CustomDomainImage {
  image: string;
  alt: string;
}

export interface CustomDomain {
  id: number;
  custom_domain: string;
  spa: string;
  spa_display?: string;
  registered_with_dns_pro?: boolean;
  dns_pro_display?: string;
  instructions?: string;
  platform_id?: number;
  platform_key?: string;
  platform_name?: string;
  platform_metadata?: {
    auth_web_display_title_info?: string;
    auth_web_display_description_info?: string;
    auth_web_display_images?: CustomDomainImage[];
  };
  created_at?: string;
  updated_at?: string;
  is_deleted?: boolean;
}

export interface CustomDomainResponse {
  message?: string;
  custom_domain?: CustomDomain;
  results?: CustomDomain[];
  custom_domains?: CustomDomain[];
}

export type CustomDomainListResponse = CustomDomain[] | CustomDomainResponse;

export interface CreateCustomDomainPayload {
  platform_key: string;
  custom_domain: string;
  spa: 'skillsai' | 'mentorai' | 'analyticsai';
  registered_with_dns_pro: boolean;
}

export interface CreateCustomDomainRequest extends Record<string, unknown> {
  requestBody: CreateCustomDomainPayload;
}

export interface GetCustomDomainsArgs {
  params: {
    platform_key?: string;
    domain?: string;
  };
}
