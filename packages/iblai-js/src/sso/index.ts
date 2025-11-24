/**
 * SSO Utilities - Framework agnostic
 *
 * This module contains utilities for handling SSO authentication callbacks.
 * These utilities work in any React application (Next.js, Create React App,
 * Vite, React Router, etc.) without requiring Next.js.
 *
 * For Next.js applications that want to use the pre-built `SsoLogin` component,
 * import from `@iblai/iblai-js/next` instead.
 *
 * @module sso
 *
 * @example
 * ```tsx
 * // React Router implementation
 * import { useEffect } from 'react';
 * import { useNavigate, useSearchParams } from 'react-router-dom';
 * import { handleSsoCallback } from '@iblai/iblai-js/sso';
 *
 * export function SsoLoginPage() {
 *   const navigate = useNavigate();
 *   const [searchParams] = useSearchParams();
 *
 *   useEffect(() => {
 *     handleSsoCallback({
 *       queryParamData: searchParams.get('data'),
 *       redirectPathKey: 'redirect-to',
 *       defaultRedirectPath: '/',
 *       onRedirect: (path) => navigate(path),
 *       onLoginSuccess: (data) => console.log('Login successful', data),
 *       onLoginError: (error) => console.error('Login failed', error),
 *     });
 *   }, [searchParams, navigate]);
 *
 *   return null; // Redirect-only page
 * }
 * ```
 */

// Re-export all SSO utilities from web-containers
export * from '@iblai/web-containers/sso';
