# Web Utils

React providers, custom hooks, and utility functions for IBL AI applications.

## Overview

This module contains reusable utilities, context providers, and custom React hooks for building IBL AI applications.

## Providers

### AuthProvider

Manages authentication state and provides auth context.

```typescript
import { AuthProvider } from '@iblai/iblai-js-sdk';

function App() {
  return (
    <AuthProvider>
      <YourApp />
    </AuthProvider>
  );
}
```

### TenantProvider

Manages multi-tenant context and tenant switching.

```typescript
import { TenantProvider } from '@iblai/iblai-js-sdk';

function App() {
  return (
    <TenantProvider>
      <YourApp />
    </TenantProvider>
  );
}
```

## Hooks

Re-exported from `@iblai/web-utils`:

- `useAuth` - Access authentication context
- `useTenant` - Access tenant context
- `useUser` - Access current user data
- And more...

## Utility Functions

- Helper functions for data transformation
- Date/time utilities
- Validation helpers
- And more...

## Adding New Utilities

To add new utilities:

1. Create a new file in the appropriate subdirectory:
   - `hooks/` for custom React hooks
   - `providers/` for context providers
   - `utils/` for utility functions
2. Export from `index.ts`
3. Add documentation here

### Hook Example

```typescript
/**
 * Custom hook for managing modal state
 *
 * @returns Modal state and controls
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { isOpen, open, close } = useModal();
 *
 *   return (
 *     <>
 *       <button onClick={open}>Open Modal</button>
 *       {isOpen && <Modal onClose={close}>Content</Modal>}
 *     </>
 *   );
 * }
 * ```
 */
export function useModal() {
  const [isOpen, setIsOpen] = useState(false);
  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  };
}
```

### Provider Example

```typescript
/**
 * Theme provider for managing app theme
 *
 * @param props - Provider props
 * @param props.children - Child components
 *
 * @example
 * ```tsx
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 * ```
 */
export function ThemeProvider({ children }) {
  // Implementation
}
```

## Documentation Standards

All exports must include:

- JSDoc comments with clear descriptions
- Parameter and return type documentation
- Usage examples
- Type definitions
