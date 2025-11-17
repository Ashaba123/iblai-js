// Mobile-specific entry point for @iblai/web-utils
// This excludes web-specific dependencies like Next.js

// Export mobile-compatible hooks
export { useGetChatDetails } from './hooks/chat/use-get-chat-details';
export { useAdvancedChat } from './hooks/chat/use-advanced-chat';
export { useTimeTracker } from './features/tracking/use-time-tracker';
export { useMentorSettings } from './hooks/use-mentor-settings';

// Export types
export type { ChatMode } from './types';

// Export utilities
export { advancedTabsProperties, ANONYMOUS_USERNAME } from './utils';

// Export validation functions
export { isAlphaNumeric32 } from './utils';

// Export time utilities
export { getTimeAgo } from './utils';

// Export profile utilities
export { getInitials } from './utils';

// Export chat actions
export { chatActions, selectSessionId } from './features/chat/slice';

// Note: This entry point excludes web-specific dependencies like:
// - Next.js navigation hooks
// - Web-specific routing
// - Browser-only APIs
