[0.0.6]

## 0.2.0

### Minor Changes

- Minor Updates

## 0.1.1

### Patch Changes

- updates more api calls to go back to using axd service

## 0.1.0

### Minor Changes

- 918e60c: add: axd service with axd token to work with axd service

- Merged develop into main regarding Subscription/Billing features

[0.0.5]

- updates @iblai/iblai-api to 3.42.1-ai-plus
- adds delete messages and unpin messages
- Migrated from AXD to DM token usage across all services
- Improved test infrastructure:
  - Added global test setup with reusable mocks
  - Centralized storage service mocking
  - Standardized config mocking for tests
  - Added automatic mock cleanup
- Removed AXD-related code and configurations
- Added analytics feature with comprehensive test coverage
  - Added analytics API slice with endpoints for overview, users, and topics
  - Added analytics constants and types
  - Added test suite for analytics API slice and constants
  - Added proper TypeScript types and return types for all functions
  - Added test setup configuration for Jest

[0.0.4]

- adds queries for fetching recent messages and vector documents

[0.0.3]

- Initial Release
