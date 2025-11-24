/**
 * Next.js-specific components and hooks
 *
 * This module contains React components and hooks that require Next.js
 * as a peer dependency. These components use Next.js-specific APIs like
 * `next/navigation`, `next/router`, `next/image`, and `next/link`.
 *
 * For non-Next.js React applications, you'll need to implement
 * framework-agnostic alternatives. See the SDK documentation for examples.
 *
 * @module next
 *
 * @example
 * ```tsx
 * // In a Next.js application
 * import { SsoLogin, ErrorPage, UserProfileDropdown } from '@iblai/iblai-js/next';
 *
 * // Use the components as normal
 * <SsoLogin
 *   localStorageKeys={{...}}
 *   redirectPathKey="redirect-to"
 *   defaultRedirectPath="/"
 * />
 * ```
 */

// Re-export all Next.js-specific components from web-containers
export * from '@iblai/web-containers/next';
