# @iblai/iblai-js

Unified package for IBL AI - includes all exports from data-layer, web-utils, and web-containers.

## Installation

```bash
npm install @iblai/iblai-js
# or
yarn add @iblai/iblai-js
# or
pnpm add @iblai/iblai-js
```

## Usage

This package re-exports everything from:
- `@iblai/data-layer` - API slices, hooks, and data management
- `@iblai/web-utils` - Utilities, providers, and helper functions
- `@iblai/web-containers` - UI components and containers

### Example

```typescript
// Import everything from a single package
import {
  // From data-layer
  useGetMfeContextQuery,
  authApiSlice,

  // From web-utils
  AuthProvider,
  TenantProvider,

  // From web-containers
  Button,
  Card,
  Input
} from '@iblai/iblai-js';

// Use as normal
function MyComponent() {
  const { data } = useGetMfeContextQuery();

  return (
    <AuthProvider {...authProps}>
      <Button>Click me</Button>
    </AuthProvider>
  );
}
```

## What's Included

### From @iblai/data-layer
- RTK Query API slices for all services
- Redux store configuration
- Data fetching hooks
- Types and interfaces

### From @iblai/web-utils
- Authentication providers
- Tenant providers
- Utility functions
- Constants and helpers

### From @iblai/web-containers
- UI components (buttons, forms, cards, etc.)
- Layout components
- Custom hooks
- Styled components

## Peer Dependencies

This package requires the following peer dependencies:
- `react` ^19.1.0
- `react-dom` ^19.1.0
- `@reduxjs/toolkit` ^2.7.0
- `react-redux` ^9.2.0
- `@iblai/iblai-api` 4.64.2-ai

## License

ISC

## Author

iblai
