# Native Components

React Native UI components for building IBL AI mobile applications.

## Overview

This module contains reusable React Native components for iOS and Android applications.

## Usage

```typescript
import { Button, ProfileCard } from '@iblai/iblai-js-sdk';
import { View } from 'react-native';

function MyScreen() {
  return (
    <View>
      <Button variant="primary" onPress={() => console.log('pressed')}>
        Click me
      </Button>
      <ProfileCard userId="123" />
    </View>
  );
}
```

## Adding New Components

To add a new React Native component:

1. Create component file: `components/my-component.tsx`
2. Add tests: `components/my-component.test.tsx`
3. Export from `index.ts`
4. Document here

### Component Template

```tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

/**
 * Button component for React Native apps
 *
 * @param props - Component props
 * @param props.variant - Button style variant
 * @param props.onPress - Press handler
 * @param props.children - Button content
 *
 * @example
 * ```tsx
 * <Button variant="primary" onPress={() => alert('pressed')}>
 *   Click me
 * </Button>
 * ```
 */
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  onPress?: () => void;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  onPress,
  children,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, styles[variant]]}
      onPress={onPress}
    >
      <Text style={styles.text}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  primary: {
    backgroundColor: '#007AFF',
  },
  secondary: {
    backgroundColor: '#5856D6',
  },
  danger: {
    backgroundColor: '#FF3B30',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
```

## Component Documentation Requirements

Every component must have:

1. **TypeScript interface** for props
2. **JSDoc comments** with:
   - Component description
   - All prop descriptions
   - Usage example
3. **Tests** covering:
   - Rendering
   - User interactions
   - Platform-specific behavior
4. **StyleSheet** definitions

## Platform-Specific Code

Use Platform API for platform-specific implementations:

```tsx
import { Platform } from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: Platform.select({
      ios: 12,
      android: 16,
    }),
  },
});
```
