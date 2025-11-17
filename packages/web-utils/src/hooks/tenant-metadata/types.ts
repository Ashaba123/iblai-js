export interface TenantMetadata {
  slug: string;
  label: string;
  defaultValue: any;
  SPA?: string;
  value?: any;
  description?: string;
  type?: "boolean" | "string" | "number";
} 