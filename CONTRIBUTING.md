# Contributing to IBL AI SDK

Thank you for your interest in contributing to the IBL AI SDK! This document provides guidelines and instructions for contributing to this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Release Process](#release-process)

## Code of Conduct

This project adheres to a code of conduct that we expect all contributors to follow. Please read and follow our code of conduct to ensure a welcoming and inclusive environment for everyone.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.0.0
- **pnpm** >= 9.0.0
- **Git**

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:

```bash
git clone https://github.com/YOUR_USERNAME/iblai-sdk.git
cd iblai-sdk
```

3. Add the upstream repository:

```bash
git remote add upstream https://github.com/iblai/iblai-sdk.git
```

## Development Setup

1. Install dependencies:

```bash
pnpm install
```

2. Build all packages:

```bash
pnpm build
```

3. Run tests to ensure everything is set up correctly:

```bash
pnpm test
```

## Project Structure

```
iblai-sdk/
├── packages/
│   ├── data-layer/          # RTK Query API slices and data management
│   │   ├── src/
│   │   │   ├── features/    # API slices by feature
│   │   │   ├── types/       # TypeScript types
│   │   │   └── index.ts     # Main entry point
│   │   ├── package.json
│   │   └── rollup.config.js
│   ├── web-utils/           # Utilities, providers, and hooks
│   │   ├── src/
│   │   │   ├── providers/   # React context providers
│   │   │   ├── hooks/       # Custom React hooks
│   │   │   ├── utils/       # Helper functions
│   │   │   └── index.ts
│   │   └── package.json
│   ├── web-containers/      # React UI components and containers
│   │   ├── src/
│   │   │   ├── components/  # Reusable components
│   │   │   ├── hooks/       # Component-specific hooks
│   │   │   └── index.ts
│   │   └── package.json
│   └── iblai/              # Unified package (re-exports)
│       ├── src/
│       │   └── index.ts    # Re-exports all packages
│       └── package.json
├── examples/               # Example applications
├── .github/               # GitHub workflows and config
├── turbo.json            # Turborepo configuration
├── pnpm-workspace.yaml   # pnpm workspace config
└── package.json          # Root package.json
```

## Development Workflow

### Creating a Feature Branch

Always create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### Making Changes

1. **Make your changes** in the appropriate package(s)
2. **Write or update tests** for your changes
3. **Run linter and fix any issues:**

```bash
pnpm lint
pnpm lint:fix
```

4. **Run type checking:**

```bash
pnpm typecheck
```

5. **Run tests:**

```bash
pnpm test
```

### Watch Mode

For faster development, use watch mode:

```bash
# Watch all packages
pnpm watch

# Watch a specific package
pnpm watch:data-layer
pnpm watch:web-utils
pnpm watch:web-containers
```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Provide proper type definitions
- Avoid `any` types when possible
- Document complex types with JSDoc comments

```typescript
/**
 * Represents a mentor configuration
 */
interface MentorConfig {
  id: string;
  name: string;
  settings?: MentorSettings;
}
```

### Code Style

We use Prettier for code formatting. The configuration is defined in `.prettierrc`.

```bash
# Format all files
pnpm format

# Check formatting
pnpm format:check
```

### Naming Conventions

- **Files**: Use kebab-case for file names (`my-component.tsx`)
- **Components**: Use PascalCase (`MyComponent`)
- **Functions/Variables**: Use camelCase (`getUserData`)
- **Constants**: Use UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Types/Interfaces**: Use PascalCase (`UserData`, `ApiResponse`)

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
feat: add new feature
fix: resolve bug in component
docs: update README
chore: update dependencies
refactor: restructure code
test: add missing tests
```

Examples:
```
feat(data-layer): add getMentors query hook
fix(web-utils): correct auth provider token refresh
docs(readme): add installation instructions
```

## Testing

### Writing Tests

- Place test files next to the code they test
- Use `.test.ts` or `.test.tsx` extension
- Follow the Arrange-Act-Assert pattern

```typescript
describe('useAuth', () => {
  it('should return authenticated user', () => {
    // Arrange
    const { result } = renderHook(() => useAuth());

    // Act
    act(() => {
      result.current.login({ username: 'test', password: 'test' });
    });

    // Assert
    expect(result.current.isAuthenticated).toBe(true);
  });
});
```

### Running Tests

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage report
pnpm test:coverage
```

## Submitting Changes

### Before Submitting

1. Ensure all tests pass
2. Run linter and fix any issues
3. Update documentation if needed
4. Add/update tests for your changes
5. Create a changeset (see below)

### Creating a Changeset

We use [Changesets](https://github.com/changesets/changesets) for version management:

```bash
pnpm changeset
```

Follow the prompts to:
1. Select the packages you've modified
2. Choose the version bump type (major, minor, patch)
3. Write a summary of your changes

### Pull Request Process

1. **Push your branch** to your fork:

```bash
git push origin feature/your-feature-name
```

2. **Open a Pull Request** on GitHub

3. **Fill out the PR template** with:
   - Description of changes
   - Related issue numbers
   - Testing performed
   - Screenshots (if applicable)

4. **Respond to feedback** from reviewers

5. **Ensure CI passes** - All automated checks must pass

### PR Guidelines

- Keep PRs focused on a single feature or fix
- Write clear, descriptive PR titles
- Include tests for new features
- Update documentation as needed
- Reference related issues

## Release Process

Releases are managed through Changesets and GitHub Actions.

### For Maintainers

1. **Merge approved PRs** with changesets

2. **Version packages:**

```bash
pnpm changeset:version
```

3. **Review and commit** the version changes

4. **Publish to npm:**

```bash
pnpm changeset:publish
```

5. **Push tags** to GitHub:

```bash
git push --follow-tags
```

## Additional Resources

- [Monorepo Guide](https://monorepo.tools)
- [Turborepo Documentation](https://turbo.build/repo/docs)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Changesets Documentation](https://github.com/changesets/changesets)

## Questions?

If you have questions, please:

1. Check existing [Issues](https://github.com/iblai/iblai-sdk/issues)
2. Start a [Discussion](https://github.com/iblai/iblai-sdk/discussions)
3. Reach out to the maintainers

Thank you for contributing to IBL AI SDK! 🎉
