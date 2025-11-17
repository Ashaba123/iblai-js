// Platform detection utility
export const isReactNative = () => {
  return typeof global !== 'undefined' && global.navigator?.product === 'ReactNative';
};

export const isWeb = () => {
  return typeof window !== 'undefined' && !isReactNative();
};

export const isNode = () => {
  return typeof process !== 'undefined' && process.versions?.node;
};

export const isExpo = () => {
  return typeof global !== 'undefined' && (global as any).expo;
};

export const getPlatform = () => {
  if (isReactNative() || isExpo()) {
    return 'react-native';
  }
  if (isWeb()) {
    return 'web';
  }
  if (isNode()) {
    return 'node';
  }
  return 'unknown';
};

// Safe access to platform-specific APIs
export const safeRequire = (moduleName: string) => {
  try {
    if (typeof require !== 'undefined') {
      return require(moduleName);
    }
  } catch (error) {
    console.warn(`Failed to require ${moduleName}:`, error);
  }
  return null;
};

// Safe access to Next.js navigation hooks
export const getNextNavigation = () => {
  if (isWeb()) {
    return safeRequire('next/navigation');
  }
  return null;
};
