/**
 * Authentication and Authorization Utilities
 *
 * This module provides utility functions for handling authentication flows,
 * including redirects to auth SPA, cookie management, and session handling.
 */

/**
 * Check if the current window is inside an iframe
 * @returns {boolean} True if running in an iframe, false otherwise
 */
export function isInIframe(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  return window?.self !== window?.top;
}

/**
 * Send a message to the parent website (when in iframe)
 * @param payload - The data to send to parent window
 */
export function sendMessageToParentWebsite(payload: unknown): void {
  window.parent.postMessage(payload, '*');
}

/**
 * Delete a cookie with specific name, path, and domain
 * @param name - Cookie name
 * @param path - Cookie path
 * @param domain - Cookie domain
 */
export function deleteCookie(name: string, path: string, domain: string): void {
  const expires = 'expires=Thu, 01 Jan 1970 00:00:00 UTC;';
  const cookieValue = `${name}=;`;
  const pathValue = path ? `path=${path};` : '';
  const domainValue = domain ? `domain=${domain};` : '';
  document.cookie = cookieValue + expires + pathValue + domainValue;
}

/**
 * Get all possible domain parts for cookie deletion
 * @param domain - The domain to split
 * @returns Array of domain parts
 * @example
 * getDomainParts('app.example.com') // returns ['app.example.com', 'example.com', 'com']
 */
export function getDomainParts(domain: string): string[] {
  const parts = domain.split('.');
  const domains: string[] = [];
  for (let i = parts.length - 1; i >= 0; i--) {
    domains.push(parts.slice(i).join('.'));
  }
  return domains;
}

/**
 * Delete a cookie across all possible domain variations
 * @param name - Cookie name to delete
 * @param childDomain - The current domain
 */
export function deleteCookieOnAllDomains(name: string, childDomain: string): void {
  getDomainParts(childDomain).forEach((domainPart) => {
    deleteCookie(name, '/', domainPart);
    deleteCookie(name, '', domainPart);
  });
}

/**
 * Get the parent domain from a given domain
 * @param domain - The domain to process
 * @returns The parent domain (e.g., 'app.example.com' → '.example.com')
 */
export function getParentDomain(domain?: string): string {
  if (!domain) {
    return '';
  }
  const parts = domain.split('.');
  return parts.length > 1 ? `.${parts.slice(-2).join('.')}` : domain;
}

/**
 * Set a cookie for authentication with cross-domain support
 * @param name - Cookie name
 * @param value - Cookie value
 * @param days - Number of days until expiration (default: 365)
 */
export function setCookieForAuth(name: string, value: string, days: number = 365): void {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  const hostname = window.location.hostname;
  let baseDomain = hostname;

  // Calculate base domain (skip for localhost and IP addresses)
  if (hostname !== 'localhost' && !/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
    const parts = hostname.split('.');
    if (parts.length > 2) {
      baseDomain = `.${parts.slice(-2).join('.')}`;
    }
  }

  const domainAttr = baseDomain ? `;domain=${baseDomain}` : '';
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=None;Secure${domainAttr}`;
}

/**
 * Clear all cookies for the current domain
 */
export function clearCookies(): void {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf('=');
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    deleteCookieOnAllDomains(name, window.location.hostname);
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;Domain=${getParentDomain(
      window.location.hostname,
    )}`;
  }
}

/**
 * Check if user is currently logged in
 * @param tokenKey - The localStorage key for the auth token (default: 'axd_token')
 * @returns True if logged in, false otherwise
 */
export function isLoggedIn(tokenKey: string = 'axd_token'): boolean {
  return !!localStorage.getItem(tokenKey);
}

/**
 * Extract platform/tenant key from URL
 * @param url - The URL to parse
 * @param pattern - RegExp pattern to match platform key (default matches /platform/[key]/...)
 * @returns The platform key or null if not found
 */
export function getPlatformKey(
  url: string,
  pattern: RegExp = /\/platform\/([^/]+)/,
): string | null {
  const match = url.match(pattern);
  return match ? match[1] : null;
}

export interface RedirectToAuthSpaOptions {
  /** URL to redirect to after auth (defaults to current path + search) */
  redirectTo?: string;
  /** Platform/tenant key */
  platformKey?: string;
  /** Whether this is a logout action */
  logout?: boolean;
  /** Whether to save redirect path to localStorage (default: true) */
  saveRedirect?: boolean;
  /** Auth SPA base URL */
  authUrl: string;
  /** Current app/platform identifier (e.g., 'mentor', 'skills') */
  appName: string;
  /** Query param names */
  queryParams?: {
    app?: string;
    redirectTo?: string;
    tenant?: string;
  };
  /** localStorage key for saving redirect path */
  redirectPathStorageKey?: string;
  /** Cookie names for cross-SPA sync */
  cookieNames?: {
    currentTenant?: string;
    userData?: string;
    tenant?: string;
    logoutTimestamp?: string;
  };
}

/**
 * Redirect to authentication SPA for login/logout
 *
 * This function handles the complete authentication flow:
 * - Clears localStorage and cookies on logout
 * - Saves redirect path for post-auth return
 * - Handles iframe scenarios
 * - Syncs logout across multiple SPAs via cookies
 *
 * @param options - Configuration options for the redirect
 *
 * @example
 * ```tsx
 * // Basic usage
 * redirectToAuthSpa({
 *   authUrl: 'https://auth.example.com',
 *   appName: 'mentor',
 * });
 *
 * // With logout
 * redirectToAuthSpa({
 *   authUrl: 'https://auth.example.com',
 *   appName: 'mentor',
 *   logout: true,
 *   platformKey: 'my-tenant',
 * });
 *
 * // With custom redirect
 * redirectToAuthSpa({
 *   authUrl: 'https://auth.example.com',
 *   appName: 'mentor',
 *   redirectTo: '/dashboard',
 *   platformKey: 'my-tenant',
 * });
 * ```
 */
export async function redirectToAuthSpa(options: RedirectToAuthSpaOptions): Promise<void> {
  const {
    redirectTo,
    platformKey,
    logout = false,
    saveRedirect = true,
    authUrl,
    appName,
    queryParams = {
      app: 'app',
      redirectTo: 'redirect-to',
      tenant: 'tenant',
    },
    redirectPathStorageKey = 'redirect_to',
    cookieNames = {
      currentTenant: 'ibl_current_tenant',
      userData: 'ibl_user_data',
      tenant: 'ibl_tenant',
      logoutTimestamp: 'ibl_logout_timestamp',
    },
  } = options;

  // Clear localStorage
  localStorage.clear();

  if (logout) {
    // Delete authentication cookies for cross-SPA synchronization
    const currentDomain = window.location.hostname;
    if (cookieNames.currentTenant) {
      deleteCookieOnAllDomains(cookieNames.currentTenant, currentDomain);
    }
    if (cookieNames.userData) {
      deleteCookieOnAllDomains(cookieNames.userData, currentDomain);
    }
    if (cookieNames.tenant) {
      deleteCookieOnAllDomains(cookieNames.tenant, currentDomain);
    }

    // Set logout timestamp cookie to trigger logout on other SPAs
    if (cookieNames.logoutTimestamp) {
      setCookieForAuth(cookieNames.logoutTimestamp, Date.now().toString());
    }
  }

  // Handle iframe scenario
  if (isInIframe()) {
    console.log('[redirectToAuthSpa]: sending authExpired to parent');
    sendMessageToParentWebsite({ authExpired: true });
    return;
  }

  const redirectPath = redirectTo ?? `${window.location.pathname}${window.location.search}`;

  // Never save sso-login routes as redirect paths
  if (!redirectPath.startsWith('/sso-login') && saveRedirect) {
    window.localStorage.setItem(redirectPathStorageKey, redirectPath);
  }

  const platform = platformKey ?? getPlatformKey(redirectPath);

  const redirectToUrl = `${window.location.origin}`;

  let authRedirectUrl = `${authUrl}/login?${queryParams.app}=${appName}`;

  authRedirectUrl += `&${queryParams.redirectTo}=${redirectToUrl}`;

  if (platform) {
    authRedirectUrl += `&${queryParams.tenant}=${platform}`;
  }
  if (logout) {
    authRedirectUrl += '&logout=1';
  }

  // Small delay for any pending operations
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Redirect to auth SPA
  window.location.href = authRedirectUrl;
}

/**
 * Get the URL for joining a tenant (sign up flow)
 * @param authUrl - Auth SPA base URL
 * @param tenantKey - Tenant to join
 * @param redirectUrl - URL to redirect to after joining (defaults to current URL)
 * @returns The join URL
 */
export function getAuthSpaJoinUrl(
  authUrl: string,
  tenantKey?: string,
  redirectUrl?: string,
): string {
  const resolvedTenant = tenantKey || getPlatformKey(window.location.pathname) || '';

  if (!resolvedTenant) {
    return '';
  }

  const targetUrl = redirectUrl ?? window.location.href;
  const joinUrl = `${authUrl}/join?tenant=${encodeURIComponent(resolvedTenant)}&redirect-to=${encodeURIComponent(
    targetUrl,
  )}`;
  return joinUrl;
}

/**
 * Redirect to auth SPA's join/signup page for a specific tenant
 * @param authUrl - Auth SPA base URL
 * @param tenantKey - Tenant to join
 * @param redirectUrl - URL to redirect to after joining (defaults to current URL)
 */
export function redirectToAuthSpaJoinTenant(
  authUrl: string,
  tenantKey?: string,
  redirectUrl?: string,
): void {
  const resolvedTenant = tenantKey || getPlatformKey(window.location.pathname) || '';

  if (!resolvedTenant) {
    console.log('[auth-redirect] Missing tenant key for join', { tenantKey, redirectUrl });
    redirectToAuthSpa({
      authUrl,
      appName: 'app', // Will need to be configured
      redirectTo: redirectUrl,
    });
    return;
  }

  const targetUrl = redirectUrl ?? window.location.href;
  const joinUrl = `${authUrl}/join?tenant=${encodeURIComponent(resolvedTenant)}&redirect-to=${encodeURIComponent(
    targetUrl,
  )}`;

  window.location.href = joinUrl;
}

export interface HandleLogoutOptions {
  /** URL to redirect to after logout (defaults to current origin) */
  redirectUrl?: string;
  /** Auth SPA base URL */
  authUrl: string;
  /** localStorage key for tenant */
  tenantStorageKey?: string;
  /** Cookie name for logout timestamp */
  logoutTimestampCookie?: string;
  /** Callback to execute before logout */
  callback?: () => void;
}

/**
 * Handle user logout
 *
 * This function:
 * - Clears localStorage (preserving tenant)
 * - Sets logout timestamp cookie for cross-SPA sync
 * - Clears all cookies
 * - Redirects to auth SPA logout endpoint
 *
 * @param options - Logout configuration options
 *
 * @example
 * ```tsx
 * handleLogout({
 *   authUrl: 'https://auth.example.com',
 *   redirectUrl: 'https://app.example.com',
 * });
 * ```
 */
export function handleLogout(options: HandleLogoutOptions): void {
  const {
    redirectUrl = window.location.origin,
    authUrl,
    tenantStorageKey = 'tenant',
    logoutTimestampCookie = 'ibl_logout_timestamp',
    callback,
  } = options;

  const tenant = window.localStorage.getItem(tenantStorageKey);
  window.localStorage.clear();
  if (tenant) {
    window.localStorage.setItem(tenantStorageKey, tenant);
  }

  // Set logout timestamp cookie to trigger logout on other SPAs
  setCookieForAuth(logoutTimestampCookie, Date.now().toString());

  clearCookies();
  callback?.();

  if (!isInIframe()) {
    window.location.href = `${authUrl}/logout?redirect-to=${redirectUrl}${tenant ? '&tenant=' + tenant : ''}`;
  }
}
