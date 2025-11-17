import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

/**
 * Example Button component for demonstration purposes
 *
 * This shows the expected documentation and structure for all components.
 * Replace this with actual components from @iblai/web-containers.
 */
interface ExampleButtonProps {
  /** Button style variant */
  variant?: 'primary' | 'secondary' | 'danger';
  /** Click handler */
  onClick?: () => void;
  /** Button content */
  children: React.ReactNode;
  /** Disable the button */
  disabled?: boolean;
}

const ExampleButton: React.FC<ExampleButtonProps> = ({
  variant = 'primary',
  onClick,
  children,
  disabled = false,
}) => {
  const styles: Record<string, React.CSSProperties> = {
    button: {
      padding: '12px 24px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: 600,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1,
      transition: 'all 0.2s',
    },
    primary: {
      backgroundColor: '#007AFF',
      color: '#FFFFFF',
    },
    secondary: {
      backgroundColor: '#5856D6',
      color: '#FFFFFF',
    },
    danger: {
      backgroundColor: '#FF3B30',
      color: '#FFFFFF',
    },
  };

  return (
    <button
      style={{ ...styles.button, ...styles[variant] }}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

const meta: Meta<typeof ExampleButton> = {
  title: 'Example/Button',
  component: ExampleButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Example button component showing documentation standards.

## Usage

\`\`\`tsx
import { ExampleButton } from '@iblai/iblai-js-sdk';

<ExampleButton variant="primary" onClick={() => alert('clicked')}>
  Click me
</ExampleButton>
\`\`\`

## Features

- Multiple variants (primary, secondary, danger)
- Disabled state
- Accessible
- Fully typed with TypeScript
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger'],
      description: 'Button style variant',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the button',
    },
    onClick: {
      action: 'clicked',
      description: 'Click handler function',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ExampleButton>;

/**
 * Primary button for main actions
 */
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};

/**
 * Secondary button for less prominent actions
 */
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
};

/**
 * Danger button for destructive actions
 */
export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'Delete',
  },
};

/**
 * Disabled state prevents interaction
 */
export const Disabled: Story = {
  args: {
    variant: 'primary',
    children: 'Disabled Button',
    disabled: true,
  },
};

/**
 * Example with custom content
 */
export const WithIcon: Story = {
  args: {
    variant: 'primary',
    children: (
      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>⭐</span>
        <span>Star</span>
      </span>
    ),
  },
};
