/**
 * AuthProvider Component
 *
 * Provider that handles authentication state and route protection.
 * It manages authentication checks, public route access, and redirects to auth SPA when needed.
 *
 * Platform Support:
 * - Web (Next.js): Uses cookies for cross-SPA synchronization
 * - React Native (Expo): Uses AsyncStorage only (no cookies)
 *
 * IMPORTANT: Cross-SPA Synchronization (Web Only)
 * ================================================
 * On web platforms, this component uses cookies to keep authentication state synchronized
 * across multiple SPAs (e.g., skills and mentor) that share the same domain.
 *
 * To ensure proper synchronization on web, you MUST call the following functions:
 *
 * 1. On Login:
 *    ```typescript
 *    await storageService.setItem(LOCAL_STORAGE_KEYS.USER_DATA, userData);
 *    await storageService.setItem(LOCAL_STORAGE_KEYS.CURRENT_TENANT, tenantKey);
 *    await storageService.setItem(LOCAL_STORAGE_KEYS.TENANTS, tenants);
 *    await syncAuthToCookies(storageService);
 *    ```
 *
 * 2. On Logout:
 *    ```typescript
 *    await storageService.clear();
 *    clearAuthCookies();
 *    ```
 *
 * 3. On Tenant Switch:
 *    ```typescript
 *    await storageService.setItem(LOCAL_STORAGE_KEYS.CURRENT_TENANT, newTenantKey);
 *    await syncAuthToCookies(storageService);
 *    ```
 *
 * The AuthProvider automatically (web only):
 * - Syncs cookies to localStorage on mount
 * - Polls for cookie changes every 2 seconds
 * - Refreshes the page when cross-SPA changes are detected
 * - Listens for storage events to update cookies when localStorage changes
 * - Monitors logout timestamp cookie to trigger cross-SPA logout
 * - Automatically logs out when another SPA initiates logout
 *
 * For React Native:
 * - Relies on AsyncStorage only (handled by StorageService)
 * - No cookie synchronization
 * - No cross-app automatic sync
 */

"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { jwtDecode } from "jwt-decode";

import { StorageService, useLazyRefreshJwtTokenQuery } from "@iblai/data-layer";
import { LOCAL_STORAGE_KEYS } from "@web-utils/utils";

/**
 * Check if we're running in a web browser environment
 */
const isWeb = (): boolean => {
  return typeof window !== "undefined" && typeof document !== "undefined";
};

/**
 * Cookie names for cross-SPA synchronization (web only)
 */
const COOKIE_KEYS = {
  CURRENT_TENANT: "ibl_current_tenant",
  USER_DATA: "ibl_user_data",
  TENANT: "ibl_tenant",
  LOGOUT_TIMESTAMP: "ibl_logout_timestamp",
} as const;

/**
 * Get the base domain for cookie sharing
 * Examples:
 * - mentor.iblai.app -> .iblai.app
 * - iblai.app -> iblai.app
 * - localhost -> localhost
 */
const getBaseDomain = (): string => {
  // Must check for window existence before accessing it
  if (!isWeb()) return "";

  const hostname = window.location.hostname;

  // For localhost or IP addresses, use as-is
  if (hostname === "localhost" || /^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
    return hostname;
  }

  // Split the hostname into parts
  const parts = hostname.split(".");

  // If it's already a base domain (e.g., iblai.app), return as-is
  if (parts.length === 2) {
    return hostname;
  }

  // If it's a subdomain (e.g., mentor.iblai.app), return base domain with leading dot
  if (parts.length > 2) {
    return `.${parts.slice(-2).join(".")}`;
  }

  return hostname;
};

/**
 * Cookie utility functions (web only)
 * These functions are no-ops on React Native
 */
const CookieUtils = {
  /**
   * Set a cookie with optional expiration
   * Uses SameSite=None for cross-subdomain sharing and base domain
   */
  set(name: string, value: string, days: number = 365): void {
    if (!isWeb()) return;

    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    const baseDomain = getBaseDomain();
    const domainAttr = baseDomain ? `;domain=${baseDomain}` : "";
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=None;Secure${domainAttr}`;
  },

  /**
   * Get a cookie value by name
   */
  get(name: string): string | null {
    if (!isWeb()) return null;

    const nameEQ = name + "=";
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i];
      while (cookie.charAt(0) === " ")
        cookie = cookie.substring(1, cookie.length);
      if (cookie.indexOf(nameEQ) === 0) {
        return decodeURIComponent(
          cookie.substring(nameEQ.length, cookie.length),
        );
      }
    }
    return null;
  },

  /**
   * Delete a cookie by name
   * Uses same domain logic as set() to ensure proper deletion
   */
  delete(name: string): void {
    if (!isWeb()) return;

    const baseDomain = getBaseDomain();
    const domainAttr = baseDomain ? `;domain=${baseDomain}` : "";
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=None;Secure${domainAttr}`;
  },
};

/**
 * Sync authentication state to cookies (web only)
 * Should be called on login, logout, and tenant switch
 * On React Native, this is a no-op
 */
export async function syncAuthToCookies(
  storageService: StorageService,
): Promise<void> {
  if (!isWeb()) return;
  try {
    const currentTenant = await storageService.getItem<string>(
      LOCAL_STORAGE_KEYS.CURRENT_TENANT,
    );
    const userData = await storageService.getItem<string>(
      LOCAL_STORAGE_KEYS.USER_DATA,
    );
    const tenant = await storageService.getItem<string>(
      LOCAL_STORAGE_KEYS.TENANTS,
    );

    if (currentTenant) {
      CookieUtils.set(COOKIE_KEYS.CURRENT_TENANT, currentTenant);
    } else {
      CookieUtils.delete(COOKIE_KEYS.CURRENT_TENANT);
    }

    if (userData) {
      CookieUtils.set(COOKIE_KEYS.USER_DATA, userData);
    } else {
      CookieUtils.delete(COOKIE_KEYS.USER_DATA);
    }

    if (tenant) {
      CookieUtils.set(COOKIE_KEYS.TENANT, tenant);
    } else {
      CookieUtils.delete(COOKIE_KEYS.TENANT);
    }
  } catch (error) {
    console.error("[syncAuthToCookies] Error syncing to cookies:", error);
  }
}

/**
 * Clear current tenant cookie only (web only)
 * Should be called before tenant switching
 * On React Native, this is a no-op
 */
export function clearCurrentTenantCookie(): void {
  if (!isWeb()) return;

  CookieUtils.delete(COOKIE_KEYS.CURRENT_TENANT);
}

/**
 * Clear all authentication cookies (web only)
 * Should be called on logout
 * On React Native, this is a no-op
 */
export function clearAuthCookies(): void {
  if (!isWeb()) return;

  CookieUtils.delete(COOKIE_KEYS.CURRENT_TENANT);
  CookieUtils.delete(COOKIE_KEYS.USER_DATA);
  CookieUtils.delete(COOKIE_KEYS.TENANT);
}

/**
 * Check if cookies differ from localStorage and sync if needed (web only)
 * Returns true if a sync occurred (requiring a refresh)
 * On React Native, always returns false (no-op)
 */
async function syncCookiesToLocalStorage(
  storageService: StorageService,
): Promise<boolean> {
  if (!isWeb()) return false;

  try {
    let needsRefresh = false;

    // Check current_tenant
    const cookieCurrentTenant = CookieUtils.get(COOKIE_KEYS.CURRENT_TENANT);
    console.log(
      "[syncCookiesToLocalStorage] cookieCurrentTenant",
      cookieCurrentTenant,
    );
    const localCurrentTenant = await storageService.getItem<string>(
      LOCAL_STORAGE_KEYS.CURRENT_TENANT,
    );
    console.log(
      "[syncCookiesToLocalStorage] localCurrentTenant",
      localCurrentTenant,
    );

    // Compare current tenant objects by key field only to avoid false positives from extra fields
    let currentTenantIsDifferent = false;
    if (cookieCurrentTenant && localCurrentTenant) {
      try {
        const cookieTenant = JSON.parse(cookieCurrentTenant);
        const localTenant = JSON.parse(localCurrentTenant);
        // Compare by the tenant key only
        currentTenantIsDifferent = cookieTenant.key !== localTenant.key;
      } catch (e) {
        // If parsing fails, fall back to string comparison
        currentTenantIsDifferent = cookieCurrentTenant !== localCurrentTenant;
      }
    }

    if (currentTenantIsDifferent) {
      if (cookieCurrentTenant) {
        await storageService.setItem(
          LOCAL_STORAGE_KEYS.CURRENT_TENANT,
          cookieCurrentTenant,
        );
      } else {
        await storageService.removeItem(LOCAL_STORAGE_KEYS.CURRENT_TENANT);
      }
      needsRefresh = true;
      console.log(
        "[syncCookiesToLocalStorage] Synced current_tenant from cookie",
      );
    }

    // Check userData
    const cookieUserData = CookieUtils.get(COOKIE_KEYS.USER_DATA);
    console.log("[syncCookiesToLocalStorage] cookieUserData", cookieUserData);
    const localUserData = await storageService.getItem<string>(
      LOCAL_STORAGE_KEYS.USER_DATA,
    );
    console.log("[syncCookiesToLocalStorage] localUserData", localUserData);

    // Compare userData objects by user_id to avoid false positives from extra fields
    let userDataIsDifferent = false;
    if (cookieUserData && localUserData) {
      try {
        const cookieUser = JSON.parse(cookieUserData);
        const localUser = JSON.parse(localUserData);
        // Compare by user_id - the primary identifier
        userDataIsDifferent = cookieUser.user_id !== localUser.user_id;
      } catch (e) {
        // If parsing fails, fall back to string comparison
        userDataIsDifferent = cookieUserData !== localUserData;
      }
    }

    if (userDataIsDifferent) {
      if (cookieUserData) {
        await storageService.setItem(
          LOCAL_STORAGE_KEYS.USER_DATA,
          cookieUserData,
        );
      } else {
        await storageService.removeItem(LOCAL_STORAGE_KEYS.USER_DATA);
      }
      needsRefresh = true;
      console.log("[syncCookiesToLocalStorage] Synced userData from cookie");
    }

    // Check tenant
    const cookieTenant = CookieUtils.get(COOKIE_KEYS.TENANT);
    console.log("[syncCookiesToLocalStorage] cookieTenant", cookieTenant);
    const localTenant = await storageService.getItem<string>(
      LOCAL_STORAGE_KEYS.TENANTS,
    );
    console.log("[syncCookiesToLocalStorage] localTenant", localTenant);

    // Compare tenant arrays by checking length and tenant keys
    let tenantsAreDifferent = false;
    if (
      cookieTenant &&
      localTenant &&
      cookieTenant !== "[]" &&
      localTenant !== "[]"
    ) {
      try {
        const cookieTenantsArray = JSON.parse(cookieTenant);
        const localTenantsArray = JSON.parse(localTenant);

        // Check if arrays have same length
        if (cookieTenantsArray.length !== localTenantsArray.length) {
          tenantsAreDifferent = true;
        } else {
          // Check if all tenant keys match
          const cookieKeys = new Set(cookieTenantsArray.map((t: any) => t.key));
          const localKeys = new Set(localTenantsArray.map((t: any) => t.key));

          tenantsAreDifferent =
            cookieKeys.size !== localKeys.size ||
            [...cookieKeys].some((key) => !localKeys.has(key));
        }
      } catch (e) {
        // If parsing fails, fall back to string comparison
        tenantsAreDifferent = cookieTenant !== localTenant;
      }
    }

    if (tenantsAreDifferent) {
      if (cookieTenant) {
        await storageService.setItem(LOCAL_STORAGE_KEYS.TENANTS, cookieTenant);
      } else {
        await storageService.removeItem(LOCAL_STORAGE_KEYS.TENANTS);
      }
      needsRefresh = true;
      console.log("[syncCookiesToLocalStorage] Synced tenant from cookie");
    }

    return needsRefresh;
  } catch (error) {
    console.error(
      "[syncCookiesToLocalStorage] Error syncing cookies to localStorage:",
      error,
    );
    return false;
  }
}

export async function getUserName(storageService: StorageService) {
  const userData =
    (await storageService.getItem<string>(LOCAL_STORAGE_KEYS.USER_DATA)) || "";
  const userDataObj = JSON.parse(userData);
  return userDataObj.user_nicename || "";
}

/**
 * Checks if the dm_token JWT has expired
 * @param storageService - Storage service to access localStorage
 * @returns boolean indicating if token has expired
 */
async function isJwtTokenExpired(
  storageService: StorageService,
): Promise<boolean> {
  try {
    const dmTokenExpires = await storageService.getItem<string>(
      LOCAL_STORAGE_KEYS.DM_TOKEN_EXPIRES,
    );

    if (!dmTokenExpires) {
      console.warn("[AuthProvider] No dm_token_expires found");
      return true; // Treat as expired if no expiry time found
    }

    const expiryTime = new Date(dmTokenExpires).getTime();
    const currentTime = Date.now();

    if (currentTime >= expiryTime) {
      console.warn("[AuthProvider] JWT token has expired");
      return true;
    }

    return false;
  } catch (error) {
    console.error("[AuthProvider] Error checking JWT token expiry:", error);
    return true; // Treat as expired on error
  }
}

/**
 * Validates if the JWT token's user_id matches the stored user_data user_id
 * @param storageService - Storage service to access localStorage
 * @returns boolean indicating if token is valid for current user
 */
async function validateJwtToken(
  storageService: StorageService,
): Promise<boolean> {
  try {
    const edxJwtToken = await storageService.getItem<string>(
      LOCAL_STORAGE_KEYS.EDX_TOKEN_KEY,
    );
    console.log("[AuthProvider] JWT token ", edxJwtToken);
    const userData = await storageService.getItem<string>(
      LOCAL_STORAGE_KEYS.USER_DATA,
    );

    if (!edxJwtToken || !userData) {
      return false;
    }

    const decodedToken = jwtDecode<{ user_id?: string | number }>(edxJwtToken);
    const userDataObj = JSON.parse(userData);

    // Compare user_id from token with user_id from user_data
    if (
      decodedToken.user_id &&
      String(decodedToken.user_id) !== String(userDataObj.user_id)
    ) {
      console.warn(
        "[AuthProvider] JWT token user_id mismatch with stored user_data",
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error("[AuthProvider] Error validating JWT token:", error);
    return false;
  }
}

export function useAuthProvider({
  middleware = new Map(),
  onAuthSuccess,
  onAuthFailure,
  redirectToAuthSpa,
  hasNonExpiredAuthToken,
  username,
  pathname,
  storageService,
  skipAuthCheck,
  token,
}: Props) {
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [userIsAccessingPublicRoute, setUserIsAccessingPublicRoute] =
    useState(false);
  const [initialSyncComplete, setInitialSyncComplete] = useState(false);
  const cookieCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastLogoutTimestampRef = useRef<string | null>(null);

  // RTK Query hook for refreshing JWT token
  const [refreshJwtToken] = useLazyRefreshJwtTokenQuery();

  /**
   * Sync cookies to localStorage on mount and periodically (web only)
   * This ensures the SPA stays in sync with other SPAs that might have updated cookies
   * On React Native, this is a no-op
   */
  useEffect(() => {
    if (!storageService || !isWeb()) {
      // If no storage service or not web, mark sync as complete immediately
      setInitialSyncComplete(true);
      return;
    }

    // Initial sync on mount
    async function initialSync() {
      try {
        // Initialize last known logout timestamp
        lastLogoutTimestampRef.current = CookieUtils.get(
          COOKIE_KEYS.LOGOUT_TIMESTAMP,
        );

        const needsRefresh = await syncCookiesToLocalStorage(storageService!);
        if (needsRefresh) {
          console.log(
            "[auth-redirect] Cookie sync detected changes, refreshing page",
          );
          redirectToAuthSpa(undefined, undefined, false, false);
        } else {
          await syncAuthToCookies(storageService!);
        }
      } finally {
        // Mark initial sync as complete
        setInitialSyncComplete(true);
      }
    }
    initialSync();

    // Poll for cookie changes every 2 seconds to detect cross-SPA updates
    cookieCheckIntervalRef.current = setInterval(async () => {
      // Skip cookie sync checks if user is completing SSO at /sso-login
      const completingSso = new RegExp("^\/sso-login").test(pathname);
      if (completingSso) {
        console.log(
          "[AuthProvider] Skipping cookie sync check for public route",
        );
        return;
      }

      // Check for logout timestamp changes (cross-SPA logout detection)
      const currentLogoutTimestamp = CookieUtils.get(
        COOKIE_KEYS.LOGOUT_TIMESTAMP,
      );
      if (
        currentLogoutTimestamp &&
        lastLogoutTimestampRef.current &&
        currentLogoutTimestamp !== lastLogoutTimestampRef.current
      ) {
        console.log("[auth-redirect] Logout detected from another SPA", {
          previousTimestamp: lastLogoutTimestampRef.current,
          newTimestamp: currentLogoutTimestamp,
        });
        lastLogoutTimestampRef.current = currentLogoutTimestamp;
        redirectToAuthSpa(undefined, undefined, true);
        return;
      }

      const needsRefresh = await syncCookiesToLocalStorage(storageService!);
      if (needsRefresh) {
        console.log(
          "[auth-redirect] Cookie sync detected changes from another SPA, refreshing page",
        );
        let cookieTenantKey;
        try {
          const cookieCurrentTenant = JSON.parse(
            CookieUtils.get(COOKIE_KEYS.CURRENT_TENANT)!,
          );
          cookieTenantKey = cookieCurrentTenant.key;
        } catch {}
        redirectToAuthSpa(undefined, cookieTenantKey, false, false);
      } else {
        await syncAuthToCookies(storageService!);
      }
    }, 2000);

    // Cleanup interval on unmount
    return () => {
      if (cookieCheckIntervalRef.current) {
        clearInterval(cookieCheckIntervalRef.current);
      }
    };
  }, [storageService, middleware, pathname]);

  /**
   * Listen for storage events from other tabs/windows (web only)
   * This catches same-SPA changes in different tabs
   * On React Native, this is a no-op
   */
  useEffect(() => {
    if (!storageService || !isWeb()) return;

    const handleStorageChange = async (event: StorageEvent) => {
      // Only handle changes to our auth-related keys
      if (
        event.key === LOCAL_STORAGE_KEYS.CURRENT_TENANT ||
        event.key === LOCAL_STORAGE_KEYS.USER_DATA ||
        event.key === LOCAL_STORAGE_KEYS.TENANTS
      ) {
        console.log("[AuthProvider] Storage change detected:", event.key);
        // Update cookies to reflect localStorage changes
        await syncAuthToCookies(storageService!);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [storageService]);

  /**
   * Performs the authentication check by:
   * 1. Validating the auth token
   * 2. Checking JWT token expiry for protected routes
   * 3. Validating JWT token for protected routes
   * 4. Refreshing JWT token if user_id mismatch
   * 5. Fetching user metadata
   * 6. Handling success/failure cases
   */
  async function performAuthCheck(isProtectedRoute: boolean = true) {
    try {
      setIsAuthenticating(true);

      if (!hasNonExpiredAuthToken()) {
        const reason = "Auth token expired";
        onAuthFailure?.(reason);
        console.log("[auth-redirect] Auth token expired");
        redirectToAuthSpa(undefined, undefined, true);
        return;
      }

      // Check JWT token expiry and force logout for protected routes
      if (isProtectedRoute && storageService) {
        const jwtExpired = await isJwtTokenExpired(storageService);

        if (jwtExpired) {
          console.log("[auth-redirect] JWT token has expired, forcing logout");
          // Clear all auth-related storage keys
          clearAuthCookies();
          const reason = "JWT token expired";
          onAuthFailure?.(reason);
          redirectToAuthSpa(undefined, undefined, true);
          return;
        }

        // Validate JWT token user_id
        const isJwtValid = await validateJwtToken(storageService);

        if (!isJwtValid) {
          console.log(
            "[AuthProvider] JWT token invalid, attempting to refresh...",
          );
          // Remove old token
          await storageService.removeItem(LOCAL_STORAGE_KEYS.EDX_TOKEN_KEY);

          try {
            // Request new token using RTK Query
            const result = await refreshJwtToken();

            if (result.data?.jwt_token) {
              await storageService.setItem(
                LOCAL_STORAGE_KEYS.EDX_TOKEN_KEY,
                result.data.jwt_token,
              );
              console.log("[AuthProvider] JWT token refreshed successfully");
            } else if (result.error) {
              console.log("[auth-redirect] Failed to refresh JWT token", {
                error: result.error,
              });
              redirectToAuthSpa(undefined, undefined, true);
              return;
            }
          } catch (refreshError) {
            console.log("[auth-redirect] JWT token refresh error", {
              error: refreshError,
            });
            redirectToAuthSpa(undefined, undefined, true);
            // Continue with auth check even if JWT refresh fails
          }
        }
      }

      if (!username && storageService) {
        username = await getUserName(storageService);
      }

      onAuthSuccess?.();
      setIsAuthenticating(false);
    } catch (error) {
      console.error("[AuthProvider] Error performing auth check:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      onAuthFailure?.(`Unexpected error: ${errorMessage}`);
      redirectToAuthSpa();
    }
  }

  useEffect(() => {
    // Wait for initial sync to complete before performing auth check
    if (!initialSyncComplete) {
      console.log("[useAuthProvider] Waiting for initial sync to complete...");
      return;
    }

    async function checkAuth() {
      setIsAuthenticating(true);

      const authRequired =
        (await determineAuthRequired(middleware, pathname)) && !token;

      if (authRequired) {
        setUserIsAccessingPublicRoute(false);
        if (!skipAuthCheck) {
          // Pass true to indicate this is a protected route
          await performAuthCheck(true);
        } else {
          setIsAuthenticating(false);
        }
      } else {
        setUserIsAccessingPublicRoute(true);
        setIsAuthenticating(false);
      }
    }
    console.log("[useAuthProvider] performing auth check for ", username);
    checkAuth();
  }, [username, initialSyncComplete]);
  return {
    isAuthenticating,
    userIsAccessingPublicRoute,
    setUserIsAccessingPublicRoute,
  };
}

/**
 * Type definition for the authentication context
 * Tracks whether the user is accessing a public route and provides a setter
 */
export type AuthContextType = {
  userIsAccessingPublicRoute: boolean;
  setUserIsAccessingPublicRoute: (iuserIsAccessingPublicRoute: boolean) => void;
};
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

/**
 * Hook to access the auth context
 * @throws Error if used outside of AuthContextProvider
 */
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) console.error("useAuthContext must be used within a provider");
  return context as AuthContextType;
};

/**
 * Context Provider component that wraps children with auth context
 */
export const AuthContextProvider = ({
  value,
  children,
}: {
  value: AuthContextType;
  children: React.ReactNode;
}) => {
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Determines if authentication is required for a given path
 * @param middleware - Map of route patterns to functions that determine if auth is required
 * @param pathname - Current route path
 * @returns boolean indicating if authentication is required
 */
async function determineAuthRequired(
  middleware: Map<string | RegExp, () => Promise<boolean>>,
  pathname: string,
) {
  if (middleware && middleware.size > 0) {
    for (const [pattern, fn] of middleware.entries()) {
      const regex = typeof pattern === "string" ? new RegExp(pattern) : pattern;
      if (regex.test(pathname)) {
        return await fn();
      }
    }
    return true;
  }

  return true;
}

/**
 * Props for the AuthProvider component
 */
type Props = {
  children?: React.ReactNode;
  fallback?: React.ReactNode; // Component to show during authentication
  middleware?: Map<string | RegExp, () => Promise<boolean>>; // Route protection rules
  onAuthSuccess?: () => void; // Callback for successful authentication
  onAuthFailure?: (reason: string) => void; // Callback for failed authentication
  redirectToAuthSpa: (
    redirectTo?: string,
    platformKey?: string,
    logout?: boolean,
    saveRedirect?: boolean,
  ) => void; // Function to redirect to auth SPA
  hasNonExpiredAuthToken: () => boolean; // Function to check token validity
  username: string; // Current user's username
  pathname: string; // Current route path
  skipAuthCheck?: boolean;
  storageService?: StorageService;
  token?: string;
};

/**
 * AuthProvider Component
 *
 * Main authentication provider that:
 * 1. Checks if the current route requires authentication
 * 2. Validates the auth token
 * 3. Fetches user metadata to verify authentication
 * 4. Handles redirects to auth SPA when needed
 * 5. Manages public route access state
 */
export function AuthProvider({
  children,
  fallback,
  middleware = new Map(),
  onAuthSuccess,
  onAuthFailure,
  redirectToAuthSpa,
  hasNonExpiredAuthToken,
  username,
  pathname,
  skipAuthCheck = false,
  storageService,
  token,
}: Props) {
  const {
    isAuthenticating,
    userIsAccessingPublicRoute,
    setUserIsAccessingPublicRoute,
  } = useAuthProvider({
    middleware,
    onAuthSuccess,
    onAuthFailure,
    redirectToAuthSpa,
    hasNonExpiredAuthToken,
    username,
    pathname,
    storageService,
    skipAuthCheck,
    token,
  });
  if (isAuthenticating) {
    return fallback;
  }

  return (
    <AuthContextProvider
      value={{ userIsAccessingPublicRoute, setUserIsAccessingPublicRoute }}
    >
      {children}
    </AuthContextProvider>
  );
}
