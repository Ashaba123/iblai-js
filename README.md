# IBL AI SDK

[![npm version](https://img.shields.io/npm/v/@iblai/iblai.svg)](https://www.npmjs.com/package/@iblai/iblai)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

TypeScript SDK for the IBL AI Platform - providing data layer, utilities, and React components for building AI-powered educational applications.

## Features

- 🎯 **Type-Safe API** - Full TypeScript support with auto-generated types
- 📦 **Modular Packages** - Use only what you need
- ⚡ **RTK Query Integration** - Powerful data fetching and caching
- 🎨 **React Components** - Pre-built UI components and containers
- 🛠️ **Developer Tools** - Comprehensive utilities and hooks
- 🔒 **Built-in Auth** - Authentication providers and utilities

## Packages

This monorepo contains the following packages:

- **[@iblai/data-layer](./packages/data-layer)** - API slices, RTK Query hooks, and data management
- **[@iblai/web-utils](./packages/web-utils)** - Utilities, providers, hooks, and helper functions
- **[@iblai/web-containers](./packages/web-containers)** - React UI components and containers
- **[@iblai/iblai](./packages/iblai)** - Unified package that re-exports all three packages

## Quick Start

### Installation

```bash
# Install the unified package
npm install @iblai/iblai

# Or install individual packages
npm install @iblai/data-layer @iblai/web-utils @iblai/web-containers
```

### Basic Usage

```typescript
import { useGetMentorsQuery, AuthProvider, Button } from '@iblai/iblai';

function App() {
  return (
    <AuthProvider>
      <MentorsList />
    </AuthProvider>
  );
}

function MentorsList() {
  const { data, isLoading } = useGetMentorsQuery({
    org: 'my-org',
    limit: 10,
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {data?.results.map((mentor) => (
        <div key={mentor.id}>{mentor.name}</div>
      ))}
    </div>
  );
}
```

## Development

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 9.0.0

### Setup

```bash
# Clone the repository
git clone https://github.com/iblai/iblai-sdk.git
cd iblai-sdk

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test
```

### Development Workflow

```bash
# Watch mode for all packages
pnpm watch

# Watch specific package
pnpm watch:data-layer
pnpm watch:web-utils
pnpm watch:web-containers

# Run linter
pnpm lint

# Type checking
pnpm typecheck

# Format code
pnpm format
```

## Documentation

- [Getting Started Guide](./docs/getting-started.md)
- [API Reference](./docs/api-reference.md)
- [Examples](./examples)
- [Contributing Guide](./CONTRIBUTING.md)
- [Cursor AI Instructions](./CURSOR.md)

## Examples

Check out the [examples directory](./examples) for complete working examples:

- [Basic Usage](./examples/basic-usage)
- [Next.js Integration](./examples/nextjs-app)
- [Authentication](./examples/auth-example)

## Architecture

```
iblai-sdk/
├── packages/
│   ├── data-layer/      # RTK Query API slices and hooks
│   ├── web-utils/       # Utilities, providers, and hooks
│   ├── web-containers/  # React UI components
│   └── iblai/          # Unified package (re-exports all)
├── examples/           # Example applications
└── .github/           # CI/CD workflows
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### Development Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`pnpm test`)
5. Commit your changes (`git commit -m 'feat: add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## Publishing

This project uses [Changesets](https://github.com/changesets/changesets) for version management and publishing.

```bash
# Create a changeset
pnpm changeset

# Version packages
pnpm changeset:version

# Publish to npm
pnpm changeset:publish
```

## License

MIT © [IBL AI](https://ibl.ai)

## Support

- [Documentation](https://docs.ibl.ai)
- [GitHub Issues](https://github.com/iblai/iblai-sdk/issues)
- [Community Discussions](https://github.com/iblai/iblai-sdk/discussions)

## Links

- [IBL AI Platform](https://ibl.ai)
- [NPM Package](https://www.npmjs.com/package/@iblai/iblai)
- [GitHub Repository](https://github.com/iblai/iblai-sdk)
