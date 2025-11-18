# Data Layer

RTK Query API slices and data management for IBL AI Platform.

## Overview

The data layer provides type-safe API hooks built with RTK Query for interacting with the IBL AI Platform. All hooks support automatic caching, background refetching, and optimistic updates.

## Usage

```typescript
import { useGetMentorsQuery, useCreateChatMutation } from '@iblai/iblai-js';

function MyComponent() {
  const { data, isLoading, error } = useGetMentorsQuery({
    org: 'my-org',
    limit: 10,
  });

  const [createChat] = useCreateChatMutation();

  // Use your data...
}
```

## Available Exports

### Query Hooks

Re-exported from `@iblai/data-layer`:

- `useGetMentorsQuery` - Fetch mentors list
- `useGetMfeContextQuery` - Get MFE context
- `useGetOrganizationsQuery` - Fetch organizations
- And more...

### Mutation Hooks

- `useCreateChatMutation` - Create a new chat
- `useUpdateUserMutation` - Update user data
- And more...

## Adding New API Slices

To add a new API slice:

1. Create a new file in this directory (e.g., `my-api-slice.ts`)
2. Define your RTK Query slice
3. Export it from `index.ts`
4. Document it in this README

Example:

```typescript
// my-api-slice.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const myApi = createApi({
  reducerPath: 'myApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getItems: builder.query({
      query: () => 'items',
    }),
  }),
});

export const { useGetItemsQuery } = myApi;
```

## Documentation Standards

All API hooks must include:

- JSDoc comment with description
- Parameter types and descriptions
- Return type documentation
- Usage example

Example:

```typescript
/**
 * Fetches a list of mentors for an organization
 *
 * @param params - Query parameters
 * @param params.org - Organization ID
 * @param params.limit - Maximum number of results
 * @returns Query result with mentors data
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useGetMentorsQuery({ org: 'my-org', limit: 10 });
 * ```
 */
export const useGetMentorsQuery = ...
```
