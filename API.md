# API Documentation

Complete reference for all exports from `@iblai/iblai-js`.

## Table of Contents

- [Data Layer](#data-layer) - API hooks and data management
- [Web Utils](#web-utils) - Providers, hooks, and utilities
- [Web Containers](#web-containers) - React UI components
- [Native Components](#native-components) - React Native components

---

## Data Layer

RTK Query hooks for API interactions. All hooks follow RTK Query patterns with automatic caching and refetching.

### Query Hooks

Re-exported from `@iblai/data-layer`. These hooks are used for fetching data:

```typescript
// Example usage
const { data, isLoading, error, refetch } = useGetMentorsQuery(params);
```

**Available Hooks:**

> **Note**: This section will be populated with actual exports from @iblai/data-layer.
> Contributors should document each hook with:
> - Description
> - Parameters
> - Return type
> - Example usage

### Mutation Hooks

Re-exported from `@iblai/data-layer`. These hooks are used for creating, updating, or deleting data:

```typescript
// Example usage
const [createChat, { isLoading, error }] = useCreateChatMutation();

await createChat({ content: 'Hello' });
```

**Available Hooks:**

> **Note**: This section will be populated with actual exports from @iblai/data-layer.

---

## Web Utils

React utilities, providers, and hooks for web applications.

### Providers

Context providers for managing global state.

#### AuthProvider

Manages authentication state and provides auth context to the app.

```typescript
import { AuthProvider } from '@iblai/iblai-js';

function App() {
  return (
    <AuthProvider>
      <YourApp />
    </AuthProvider>
  );
}
```

**Props:**
- `children: ReactNode` - Child components

#### TenantProvider

Manages multi-tenant context and tenant switching.

```typescript
import { TenantProvider } from '@iblai/iblai-js';

function App() {
  return (
    <TenantProvider>
      <YourApp />
    </TenantProvider>
  );
}
```

**Props:**
- `children: ReactNode` - Child components

> **Note**: Additional providers from @iblai/web-utils should be documented here.

### Hooks

Custom React hooks for common functionality.

#### useAuth

Access authentication context and user state.

```typescript
import { useAuth } from '@iblai/iblai-js';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  if (!isAuthenticated) {
    return <button onClick={login}>Login</button>;
  }

  return <div>Welcome, {user.name}</div>;
}
```

**Returns:**
- `user: User | null` - Current user object
- `isAuthenticated: boolean` - Authentication status
- `login: () => void` - Login function
- `logout: () => void` - Logout function

#### useTenant

Access tenant context and switching functionality.

```typescript
import { useTenant } from '@iblai/iblai-js';

function MyComponent() {
  const { currentTenant, tenants, switchTenant } = useTenant();

  return (
    <select onChange={(e) => switchTenant(e.target.value)}>
      {tenants.map((tenant) => (
        <option key={tenant.id} value={tenant.id}>
          {tenant.name}
        </option>
      ))}
    </select>
  );
}
```

**Returns:**
- `currentTenant: Tenant | null` - Current tenant object
- `tenants: Tenant[]` - Available tenants
- `switchTenant: (id: string) => void` - Switch tenant function

> **Note**: Additional hooks from @iblai/web-utils should be documented here.

### Utility Functions

Helper functions for common tasks.

> **Note**: Utility functions from @iblai/web-utils should be documented here with:
> - Function signature
> - Description
> - Parameters
> - Return value
> - Example usage

---

## Web Containers

React UI components for web applications. See [Storybook](http://localhost:6006) for interactive documentation.

### Components

Re-exported from `@iblai/web-containers`. All components include:
- TypeScript types
- JSDoc documentation
- Storybook stories
- Interactive examples

**Available Components:**

> **Note**: This section will be populated with actual components from @iblai/web-containers.
> Contributors should document each component with:
> - Description
> - Props interface
> - Usage example
> - Link to Storybook story

### Example Documentation

```typescript
/**
 * Button component for user interactions
 *
 * @example
 * ```tsx
 * <Button variant="primary" onClick={handleClick}>
 *   Click me
 * </Button>
 * ```
 */
interface ButtonProps {
  /** Button style variant */
  variant?: 'primary' | 'secondary' | 'danger';
  /** Click handler */
  onClick?: () => void;
  /** Button content */
  children: React.ReactNode;
}
```

---

## Native Components

React Native components for mobile applications.

### Components

Mobile-optimized components for iOS and Android.

> **Note**: This section will be populated with actual React Native components.
> Contributors should document each component with:
> - Description
> - Props interface
> - Platform-specific notes
> - Usage example

---

## Contributing

To contribute to this documentation:

1. **Add your exports** to the appropriate module
2. **Document with JSDoc** comments in code
3. **Add entry here** with description and example
4. **Create Storybook story** (for UI components)
5. **Update module README** in the source directory

### Documentation Template

```typescript
/**
 * [Component/Hook/Function Name]
 *
 * [Brief description]
 *
 * @param [param] - [Description]
 * @returns [Return value description]
 *
 * @example
 * ```tsx
 * [Usage example]
 * ```
 */
```

See [Contributing Guide](./CONTRIBUTING.md) for more details.
