// Export the main hook
export { useTenantMetadata } from './use-tenant-metadata';

// Export configuration loader functions
export { 
  loadMetadataConfig, 
  getAvailableSPAs, 
  getSPAConfig, 
  getAllConfigs 
} from './config-loader';

// Export types
export type { TenantMetadata } from './types';
export type { ConfigSetting, ConfigFile } from './config-loader';

// Legacy exports for backward compatibility
export { METADATAS } from './constants'; 