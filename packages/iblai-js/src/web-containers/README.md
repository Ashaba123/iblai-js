# Web Containers

React UI components for building IBL AI web applications.

## Overview

This module contains reusable React components and containers for web applications. All components are documented in Storybook and include TypeScript types.

## Usage

```typescript
import { Button, ProfileCard, NotificationBell } from '@iblai/iblai-js';

function MyComponent() {
  return (
    <div>
      <Button variant="primary">Click me</Button>
      <ProfileCard userId="123" />
      <NotificationBell />
    </div>
  );
}
```

## Available Components

Re-exported from `@iblai/web-containers`:

- UI Components (buttons, inputs, cards, etc.)
- Profile components
- Notification components
- SSO login components
- And more...

## Adding New Components

To add a new component:

1. Create component file: `components/my-component.tsx`
2. Create Storybook story: `components/my-component.stories.tsx`
3. Add tests: `components/my-component.test.tsx`
4. Export from `index.ts`
5. Document here

### Component Template

```tsx
import React from 'react';

/**
 * Button component for user interactions
 *
 * @param props - Component props
 * @param props.variant - Button style variant
 * @param props.onClick - Click handler
 * @param props.children - Button content
 *
 * @example
 * ```tsx
 * <Button variant="primary" onClick={() => alert('clicked')}>
 *   Click me
 * </Button>
 * ```
 */
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  onClick?: () => void;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  onClick,
  children,
}) => {
  return (
    <button className={`btn btn-${variant}`} onClick={onClick}>
      {children}
    </button>
  );
};
```

### Storybook Story Template

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'Danger Button',
  },
};
```

## Component Documentation Requirements

Every component must have:

1. **TypeScript interface** for props
2. **JSDoc comments** with:
   - Component description
   - All prop descriptions
   - Usage example
3. **Storybook story** showing:
   - All variants
   - Interactive controls
   - Common use cases
4. **Tests** covering:
   - Rendering
   - User interactions
   - Edge cases

## Viewing Components

Start Storybook to view all components:

```bash
pnpm storybook
```

Then open http://localhost:6006
