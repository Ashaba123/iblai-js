import type { Preview } from '@storybook/react';
import React from 'react';

// Make React available globally to fix "React is not defined" errors
if (typeof window !== 'undefined') {
  (window as any).React = React;
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      toc: true,
    },
  },
};

export default preview;
