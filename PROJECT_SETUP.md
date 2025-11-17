# IBL AI SDK - Project Setup Complete

This document summarizes the setup of the standalone `iblai-sdk` repository.

## What's Been Created

### ✅ Repository Structure

```
/Users/user/dev/IBL/web/iblai-sdk/
├── packages/
│   ├── data-layer/          # Copied from ibl-frontend
│   ├── web-utils/           # Copied from ibl-frontend
│   ├── web-containers/      # Copied from ibl-frontend
│   └── iblai/              # Unified package
├── examples/               # Ready for example apps
├── .github/workflows/      # Ready for CI/CD
├── README.md              # Main documentation
├── CONTRIBUTING.md        # Contribution guidelines
├── CURSOR.md             # AI assistant instructions
├── LICENSE               # MIT License
├── package.json          # Root package configuration
├── pnpm-workspace.yaml   # Workspace configuration
├── turbo.json           # Turborepo configuration
├── tsconfig.json        # TypeScript configuration
├── .prettierrc          # Prettier configuration
├── .prettierignore      # Prettier ignore rules
└── .gitignore          # Git ignore rules
```

## Next Steps

### 1. Initialize Git Repository

```bash
cd /Users/user/dev/IBL/web/iblai-sdk
git init
git add .
git commit -m "feat: initial iblai-sdk repository setup"
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Build Packages

```bash
pnpm build
```

### 4. Set Up GitHub Repository

1. Create a new repository on GitHub: `iblai/iblai-sdk`
2. Add remote and push:

```bash
git remote add origin git@github.com:iblai/iblai-sdk.git
git branch -M main
git push -u origin main
```

### 5. Set Up CI/CD (Next Section)

Create `.github/workflows/ci.yml` for automated testing and publishing.

### 6. Set Up Changesets

```bash
pnpm changeset init
```

### 7. Publish Initial Version

```bash
# Build packages
pnpm build:packages

# Create changeset
pnpm changeset

# Version packages
pnpm changeset:version

# Publish to npm (requires npm login)
pnpm changeset:publish
```

## Updating ibl-frontend to Use the SDK

### Option 1: Use Published Packages

Once published to npm:

```json
// In ibl-frontend/package.json
{
  "dependencies": {
    "@iblai/data-layer": "^1.0.0",
    "@iblai/web-utils": "^1.0.0",
    "@iblai/web-containers": "^1.0.0"
  }
}
```

### Option 2: Use Local Development (pnpm link)

For local development:

```bash
# In iblai-sdk
cd packages/data-layer && pnpm link --global
cd ../web-utils && pnpm link --global
cd ../web-containers && pnpm link --global
cd ../iblai && pnpm link --global

# In ibl-frontend
pnpm link --global @iblai/data-layer @iblai/web-utils @iblai/web-containers
```

### Option 3: Use Workspace Protocol (Recommended for Development)

Update `ibl-frontend/pnpm-workspace.yaml`:

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - '../iblai-sdk/packages/*'  # Add this line
```

Then update dependencies to use `workspace:*`:

```json
{
  "dependencies": {
    "@iblai/data-layer": "workspace:*",
    "@iblai/web-utils": "workspace:*",
    "@iblai/web-containers": "workspace:*"
  }
}
```

## Package Information

### @iblai/data-layer
- **Purpose**: RTK Query API slices and data management
- **Main Export**: API hooks for data fetching
- **Key Features**: Type-safe queries, automatic caching

### @iblai/web-utils
- **Purpose**: React providers, hooks, and utilities
- **Main Export**: Context providers and custom hooks
- **Key Features**: Auth, tenant, user management

### @iblai/web-containers
- **Purpose**: Reusable React UI components
- **Main Export**: UI components and containers
- **Key Features**: Profile, notifications, SSO login

### @iblai/iblai
- **Purpose**: Unified package re-exporting all three
- **Main Export**: Everything from all packages
- **Key Features**: Single import for all SDK features

## Development Workflow

### Watch Mode

```bash
# Watch all packages
pnpm watch

# Watch specific package
pnpm watch:data-layer
```

### Testing

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage
pnpm test:coverage
```

### Linting and Formatting

```bash
# Lint
pnpm lint
pnpm lint:fix

# Format
pnpm format
pnpm format:check
```

## Important Files to Review

1. **package.json** files in each package - Verify peer dependencies
2. **tsconfig.json** in each package - Verify path aliases
3. **rollup.config.js** in each package - Verify build configuration
4. **.npmrc** - Set up npm registry authentication

## Known Issues to Address

1. Update package.json versions in all packages
2. Verify all import paths are correct
3. Add GitHub Actions workflows
4. Set up automated testing
5. Configure npm publishing
6. Add example applications
7. Generate API documentation

## Resources

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Changesets](https://github.com/changesets/changesets)
- [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)

## Maintainers

For questions or issues, contact:
- Repository: https://github.com/iblai/iblai-sdk
- Email: dev@ibl.ai
