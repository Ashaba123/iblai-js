import { loadMetadataConfig } from './config-loader';

export interface TenantMetadata {
    slug: string;
    label: string;
    defaultValue: any;
    SPA?: string;
    value?: any;
}

// Legacy METADATAS array for backward compatibility
// This will be deprecated in favor of the new configuration system
export const METADATAS = loadMetadataConfig();

// Export the new configuration loader functions
export { loadMetadataConfig } from './config-loader';