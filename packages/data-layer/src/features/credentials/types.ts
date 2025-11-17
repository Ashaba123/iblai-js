export interface CredentialsSchema {
  name: string;
  schema: Record<string, string>;
}

export interface LLMServiceInfo {
  id: number;
  name: string;
  display_name: string;
  logo: string;
}

export interface MaskLLM {
  name: string;
  value: Record<string, string>;
  platform: string;
  service_info: LLMServiceInfo;
}
