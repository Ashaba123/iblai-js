/**
 * @iblai/iblai-js-sdk - TypeScript SDK for IBL AI Platform
 *
 * A unified SDK providing:
 * - Data Layer: RTK Query API slices and data management
 * - Web Utils: React providers, hooks, and utilities
 * - Web Containers: React UI components for web
 * - Native Components: React Native components for mobile
 *
 * @example
 * ```typescript
 * import { useGetMentorsQuery, AuthProvider, Button } from '@iblai/iblai-js-sdk';
 * ```
 */

// Export data layer (API slices, hooks, data management)
export * from './data-layer';

// Export web utilities (providers, hooks, utils)
export * from './web-utils';

// Export web containers (React UI components)
export * from './web-containers';

// Export native components (React Native components)
// Note: Uncomment when native components are added
// export * from './native-components';
