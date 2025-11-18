import type { Meta, StoryObj } from '@storybook/react';

/**
 * # Authentication Utilities
 *
 * Utility functions for handling authentication flows, session management, and cross-SPA synchronization.
 *
 * ## Available Functions
 *
 * ### Auth Flow
 * - `redirectToAuthSpa` - Redirect to authentication SPA for login/logout
 * - `redirectToAuthSpaJoinTenant` - Redirect to signup page for specific tenant
 * - `getAuthSpaJoinUrl` - Get the join/signup URL
 * - `handleLogout` - Handle complete logout flow
 *
 * ### Session Checks
 * - `isLoggedIn` - Check if user is currently authenticated
 * - `getPlatformKey` - Extract platform/tenant key from URL
 *
 * ### Cookie Management
 * - `setCookieForAuth` - Set cross-domain auth cookie
 * - `deleteCookie` - Delete specific cookie
 * - `deleteCookieOnAllDomains` - Delete cookie across all domain variations
 * - `clearCookies` - Clear all cookies
 *
 * ### Helper Functions
 * - `isInIframe` - Check if running in iframe
 * - `sendMessageToParentWebsite` - Send message to parent window
 * - `getDomainParts` - Get domain variations for cookie management
 * - `getParentDomain` - Get parent domain for cookie scope
 *
 * ## Features
 * - ✅ Cross-SPA logout synchronization via cookies
 * - ✅ Iframe detection and handling
 * - ✅ Redirect path preservation
 * - ✅ Multi-domain cookie management
 * - ✅ TypeScript support with full type definitions
 */
const meta = {
  title: 'Web Utils/Auth Utilities',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Authentication and session management utilities for IBL AI applications.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * ## redirectToAuthSpa
 *
 * Main authentication redirect function. Handles complete login/logout flow with cross-SPA synchronization.
 *
 * ### Function Signature
 * ```typescript
 * function redirectToAuthSpa(options: RedirectToAuthSpaOptions): Promise<void>
 *
 * interface RedirectToAuthSpaOptions {
 *   redirectTo?: string;              // URL to return to after auth
 *   platformKey?: string;             // Tenant/platform identifier
 *   logout?: boolean;                 // Is this a logout action?
 *   saveRedirect?: boolean;           // Save redirect path? (default: true)
 *   authUrl: string;                  // Auth SPA base URL
 *   appName: string;                  // App identifier (e.g., 'mentor', 'skills')
 *   queryParams?: {                   // Query parameter names
 *     app?: string;
 *     redirectTo?: string;
 *     tenant?: string;
 *   };
 *   redirectPathStorageKey?: string; // localStorage key for redirect
 *   cookieNames?: {                  // Cookie names for sync
 *     currentTenant?: string;
 *     userData?: string;
 *     tenant?: string;
 *     logoutTimestamp?: string;
 *   };
 * }
 * ```
 *
 * ### Features
 * - Clears localStorage and cookies on logout
 * - Saves current path for post-auth redirect
 * - Handles iframe scenarios
 * - Syncs logout across SPAs via cookies
 * - Preserves tenant context
 *
 * ### Usage Examples
 *
 * #### Basic Login Redirect
 * ```tsx
 * import { redirectToAuthSpa } from '@iblai/web-utils';
 *
 * function LoginButton() {
 *   const handleLogin = () => {
 *     redirectToAuthSpa({
 *       authUrl: 'https://auth.example.com',
 *       appName: 'mentor',
 *     });
 *   };
 *
 *   return <button onClick={handleLogin}>Log In</button>;
 * }
 * ```
 *
 * #### Logout with Tenant Context
 * ```tsx
 * import { redirectToAuthSpa } from '@iblai/web-utils';
 *
 * function LogoutButton() {
 *   const handleLogout = () => {
 *     redirectToAuthSpa({
 *       authUrl: 'https://auth.example.com',
 *       appName: 'mentor',
 *       logout: true,
 *       platformKey: 'my-university',
 *     });
 *   };
 *
 *   return <button onClick={handleLogout}>Log Out</button>;
 * }
 * ```
 *
 * #### Custom Redirect Path
 * ```tsx
 * import { redirectToAuthSpa } from '@iblai/web-utils';
 *
 * function ProtectedRoute({ children }: { children: React.ReactNode }) {
 *   const isAuthenticated = useAuth().isAuthenticated;
 *
 *   useEffect(() => {
 *     if (!isAuthenticated) {
 *       redirectToAuthSpa({
 *         authUrl: 'https://auth.example.com',
 *         appName: 'mentor',
 *         redirectTo: '/dashboard',
 *         platformKey: getTenantKey(),
 *       });
 *     }
 *   }, [isAuthenticated]);
 *
 *   return isAuthenticated ? children : null;
 * }
 * ```
 *
 * #### Complete Mentor App Integration
 * ```tsx
 * import { redirectToAuthSpa } from '@iblai/web-utils';
 * import { config } from './config';
 *
 * // Create a configured redirect function
 * export const redirectToMentorAuth = (
 *   redirectTo?: string,
 *   platformKey?: string,
 *   logout?: boolean,
 * ) => {
 *   return redirectToAuthSpa({
 *     authUrl: config.authUrl(),
 *     appName: config.iblPlatform() || 'mentor',
 *     redirectTo,
 *     platformKey,
 *     logout,
 *     queryParams: {
 *       app: 'app',
 *       redirectTo: 'redirect-to',
 *       tenant: 'tenant',
 *     },
 *     redirectPathStorageKey: 'redirect_to',
 *     cookieNames: {
 *       currentTenant: 'ibl_current_tenant',
 *       userData: 'ibl_user_data',
 *       tenant: 'ibl_tenant',
 *       logoutTimestamp: 'ibl_logout_timestamp',
 *     },
 *   });
 * };
 *
 * // Use in components
 * function NavBar() {
 *   return (
 *     <button onClick={() => redirectToMentorAuth(undefined, undefined, true)}>
 *       Logout
 *     </button>
 *   );
 * }
 * ```
 */
export const RedirectToAuthSpaExample: Story = {
  render: () => (
    <div style={{ padding: '20px', fontFamily: 'monospace', maxWidth: '800px' }}>
      <h3>redirectToAuthSpa - Authentication Redirect</h3>

      <h4>1. Basic Login</h4>
      <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
{`import { redirectToAuthSpa } from '@iblai/web-utils';

redirectToAuthSpa({
  authUrl: 'https://auth.example.com',
  appName: 'mentor',
});`}
      </pre>

      <h4>2. Logout with Tenant</h4>
      <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
{`redirectToAuthSpa({
  authUrl: 'https://auth.example.com',
  appName: 'mentor',
  logout: true,
  platformKey: 'university-tenant',
});`}
      </pre>

      <h4>3. Custom Redirect</h4>
      <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
{`redirectToAuthSpa({
  authUrl: 'https://auth.example.com',
  appName: 'mentor',
  redirectTo: '/dashboard',
  platformKey: 'my-tenant',
});`}
      </pre>

      <h4>Key Features</h4>
      <ul style={{ lineHeight: '1.8' }}>
        <li>Automatically clears localStorage on logout</li>
        <li>Deletes auth cookies across all domains</li>
        <li>Saves redirect path for return after auth</li>
        <li>Handles iframe scenarios gracefully</li>
        <li>Syncs logout across multiple SPAs</li>
        <li>Preserves tenant context</li>
      </ul>
    </div>
  ),
};

/**
 * ## handleLogout
 *
 * Complete logout handler with cookie cleanup and cross-SPA synchronization.
 *
 * ### Function Signature
 * ```typescript
 * function handleLogout(options: HandleLogoutOptions): void
 *
 * interface HandleLogoutOptions {
 *   redirectUrl?: string;           // URL to redirect after logout
 *   authUrl: string;                // Auth SPA base URL
 *   tenantStorageKey?: string;      // localStorage key for tenant
 *   logoutTimestampCookie?: string; // Cookie name for logout timestamp
 *   callback?: () => void;          // Pre-logout callback
 * }
 * ```
 *
 * ### What It Does
 * 1. Preserves tenant in localStorage (everything else cleared)
 * 2. Sets logout timestamp cookie for cross-SPA sync
 * 3. Clears all cookies
 * 4. Executes optional callback
 * 5. Redirects to auth SPA logout endpoint
 *
 * ### Usage Examples
 *
 * ```tsx
 * import { handleLogout } from '@iblai/web-utils';
 *
 * // Basic logout
 * function LogoutButton() {
 *   return (
 *     <button onClick={() => handleLogout({
 *       authUrl: 'https://auth.example.com',
 *     })}>
 *       Logout
 *     </button>
 *   );
 * }
 *
 * // With callback
 * function LogoutWithTracking() {
 *   const trackLogout = () => {
 *     analytics.track('user_logged_out');
 *   };
 *
 *   return (
 *     <button onClick={() => handleLogout({
 *       authUrl: 'https://auth.example.com',
 *       callback: trackLogout,
 *     })}>
 *       Logout
 *     </button>
 *   );
 * }
 *
 * // Custom redirect
 * function LogoutToHome() {
 *   return (
 *     <button onClick={() => handleLogout({
 *       authUrl: 'https://auth.example.com',
 *       redirectUrl: 'https://example.com/home',
 *     })}>
 *       Logout
 *     </button>
 *   );
 * }
 * ```
 */
export const HandleLogoutExample: Story = {
  render: () => (
    <div style={{ padding: '20px', fontFamily: 'monospace', maxWidth: '800px' }}>
      <h3>handleLogout - Complete Logout Flow</h3>

      <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
{`import { handleLogout } from '@iblai/web-utils';

// Basic usage
handleLogout({
  authUrl: 'https://auth.example.com',
});

// With callback and custom redirect
handleLogout({
  authUrl: 'https://auth.example.com',
  redirectUrl: 'https://example.com/home',
  callback: () => {
    analytics.track('user_logged_out');
  },
});`}
      </pre>

      <h4>What Happens During Logout</h4>
      <ol style={{ lineHeight: '1.8' }}>
        <li>Preserves tenant key in localStorage</li>
        <li>Clears all other localStorage data</li>
        <li>Sets logout timestamp cookie for cross-SPA sync</li>
        <li>Clears all browser cookies</li>
        <li>Executes optional callback</li>
        <li>Redirects to auth SPA logout endpoint</li>
      </ol>
    </div>
  ),
};

/**
 * ## Join/Signup Flow
 *
 * Functions for handling tenant signup flows.
 *
 * ### redirectToAuthSpaJoinTenant
 * Redirect to signup page for specific tenant
 *
 * ```typescript
 * function redirectToAuthSpaJoinTenant(
 *   authUrl: string,
 *   tenantKey?: string,
 *   redirectUrl?: string,
 * ): void
 * ```
 *
 * ### getAuthSpaJoinUrl
 * Get the join URL without redirecting
 *
 * ```typescript
 * function getAuthSpaJoinUrl(
 *   authUrl: string,
 *   tenantKey?: string,
 *   redirectUrl?: string,
 * ): string
 * ```
 *
 * ### Usage Examples
 *
 * ```tsx
 * import { redirectToAuthSpaJoinTenant, getAuthSpaJoinUrl } from '@iblai/web-utils';
 *
 * // Direct redirect to signup
 * function SignupButton() {
 *   return (
 *     <button onClick={() => redirectToAuthSpaJoinTenant(
 *       'https://auth.example.com',
 *       'university-tenant',
 *     )}>
 *       Sign Up
 *     </button>
 *   );
 * }
 *
 * // Get URL for custom handling
 * function SignupLink() {
 *   const joinUrl = getAuthSpaJoinUrl(
 *     'https://auth.example.com',
 *     'university-tenant',
 *     'https://app.example.com/welcome',
 *   );
 *
 *   return <a href={joinUrl}>Join Our Platform</a>;
 * }
 * ```
 */
export const JoinTenantExample: Story = {
  render: () => (
    <div style={{ padding: '20px', fontFamily: 'monospace', maxWidth: '800px' }}>
      <h3>Join/Signup Functions</h3>

      <h4>1. Direct Redirect</h4>
      <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
{`import { redirectToAuthSpaJoinTenant } from '@iblai/web-utils';

redirectToAuthSpaJoinTenant(
  'https://auth.example.com',
  'university-tenant',
);`}
      </pre>

      <h4>2. Get Join URL</h4>
      <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
{`import { getAuthSpaJoinUrl } from '@iblai/web-utils';

const joinUrl = getAuthSpaJoinUrl(
  'https://auth.example.com',
  'university-tenant',
  'https://app.example.com/welcome',
);

// Use in link or button
<a href={joinUrl}>Join Now</a>`}
      </pre>
    </div>
  ),
};

/**
 * ## Helper Functions
 *
 * Utility functions for session checking, cookie management, and URL parsing.
 *
 * ### Session Checks
 *
 * #### isLoggedIn
 * ```typescript
 * function isLoggedIn(tokenKey?: string): boolean
 * ```
 *
 * Check if user has valid auth token in localStorage.
 *
 * ```tsx
 * import { isLoggedIn } from '@iblai/web-utils';
 *
 * if (isLoggedIn()) {
 *   // User is authenticated
 * }
 *
 * // Custom token key
 * if (isLoggedIn('custom_auth_token')) {
 *   // Check specific token
 * }
 * ```
 *
 * #### getPlatformKey
 * ```typescript
 * function getPlatformKey(url: string, pattern?: RegExp): string | null
 * ```
 *
 * Extract platform/tenant key from URL.
 *
 * ```tsx
 * import { getPlatformKey } from '@iblai/web-utils';
 *
 * const tenantKey = getPlatformKey('/platform/university/mentor');
 * // Returns: 'university'
 *
 * // Custom pattern
 * const key = getPlatformKey('/org/company/app', /\/org\/([^/]+)/);
 * // Returns: 'company'
 * ```
 *
 * ### Cookie Management
 *
 * #### setCookieForAuth
 * ```typescript
 * function setCookieForAuth(name: string, value: string, days?: number): void
 * ```
 *
 * Set a cross-domain cookie for authentication.
 *
 * ```tsx
 * import { setCookieForAuth } from '@iblai/web-utils';
 *
 * setCookieForAuth('ibl_current_tenant', 'university');
 * setCookieForAuth('session_id', 'abc123', 7); // 7 days
 * ```
 *
 * #### deleteCookieOnAllDomains
 * ```typescript
 * function deleteCookieOnAllDomains(name: string, domain: string): void
 * ```
 *
 * Delete cookie across all domain variations.
 *
 * ```tsx
 * import { deleteCookieOnAllDomains } from '@iblai/web-utils';
 *
 * deleteCookieOnAllDomains('session_id', window.location.hostname);
 * ```
 *
 * ### Iframe Helpers
 *
 * #### isInIframe
 * ```typescript
 * function isInIframe(): boolean
 * ```
 *
 * Check if app is running in iframe.
 *
 * ```tsx
 * import { isInIframe } from '@iblai/web-utils';
 *
 * if (isInIframe()) {
 *   // Running in iframe, handle differently
 *   sendMessageToParentWebsite({ authExpired: true });
 * } else {
 *   // Normal browser window
 *   redirectToAuthSpa({ ... });
 * }
 * ```
 *
 * #### sendMessageToParentWebsite
 * ```typescript
 * function sendMessageToParentWebsite(payload: unknown): void
 * ```
 *
 * Send message to parent window (when in iframe).
 *
 * ```tsx
 * import { sendMessageToParentWebsite } from '@iblai/web-utils';
 *
 * sendMessageToParentWebsite({
 *   type: 'authExpired',
 *   timestamp: Date.now(),
 * });
 * ```
 */
export const HelperFunctionsExample: Story = {
  render: () => (
    <div style={{ padding: '20px', fontFamily: 'monospace', maxWidth: '800px' }}>
      <h3>Helper Functions</h3>

      <h4>Session Checks</h4>
      <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
{`import { isLoggedIn, getPlatformKey } from '@iblai/web-utils';

// Check auth status
if (isLoggedIn()) {
  console.log('User is authenticated');
}

// Extract tenant from URL
const tenant = getPlatformKey('/platform/university/mentor');
// Returns: 'university'`}
      </pre>

      <h4>Cookie Management</h4>
      <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
{`import {
  setCookieForAuth,
  deleteCookieOnAllDomains,
  clearCookies
} from '@iblai/web-utils';

// Set auth cookie
setCookieForAuth('session_id', 'abc123', 7);

// Delete specific cookie
deleteCookieOnAllDomains('old_session', window.location.hostname);

// Clear all cookies
clearCookies();`}
      </pre>

      <h4>Iframe Helpers</h4>
      <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
{`import { isInIframe, sendMessageToParentWebsite } from '@iblai/web-utils';

if (isInIframe()) {
  // Notify parent of auth expiration
  sendMessageToParentWebsite({ authExpired: true });
}`}
      </pre>
    </div>
  ),
};

/**
 * ## Cross-SPA Logout Synchronization
 *
 * The auth utilities support automatic logout synchronization across multiple Single Page Applications (SPAs)
 * running on different subdomains of the same parent domain.
 *
 * ### How It Works
 *
 * 1. **Logout Timestamp Cookie**: When logout occurs in one SPA, a `ibl_logout_timestamp` cookie is set
 *    with the current timestamp at the parent domain level
 *
 * 2. **Cookie Monitoring**: Other SPAs can monitor this cookie to detect logout events
 *
 * 3. **Automatic Cleanup**: Auth data cookies (`ibl_current_tenant`, `ibl_user_data`, `ibl_tenant`)
 *    are deleted across all domain variations
 *
 * ### Implementation Example
 *
 * ```tsx
 * import { useEffect } from 'react';
 * import { handleLogout } from '@iblai/web-utils';
 *
 * // In your root App component
 * function App() {
 *   useEffect(() => {
 *     // Monitor for cross-SPA logout
 *     const checkLogoutTimestamp = () => {
 *       const timestamp = getCookie('ibl_logout_timestamp');
 *       const lastCheck = localStorage.getItem('last_logout_check');
 *
 *       if (timestamp && timestamp !== lastCheck) {
 *         // Logout detected from another SPA
 *         localStorage.setItem('last_logout_check', timestamp);
 *         handleLogout({
 *           authUrl: 'https://auth.example.com',
 *         });
 *       }
 *     };
 *
 *     // Check every 5 seconds
 *     const interval = setInterval(checkLogoutTimestamp, 5000);
 *
 *     return () => clearInterval(interval);
 *   }, []);
 *
 *   return <YourApp />;
 * }
 * ```
 *
 * ### Cookie Structure
 *
 * All auth cookies are set with:
 * - `SameSite=None` - Allow cross-site access
 * - `Secure` - HTTPS only
 * - Domain set to parent domain (e.g., `.example.com`)
 * - Path: `/`
 * - 365 days expiration (by default)
 *
 * ### Benefits
 *
 * - User logs out from one app (e.g., Mentor SPA)
 * - Automatically logged out from Skills SPA, Admin SPA, etc.
 * - No backend coordination needed
 * - Works across subdomains
 */
export const CrossSPASyncExample: Story = {
  render: () => (
    <div style={{ padding: '20px', fontFamily: 'monospace', maxWidth: '800px' }}>
      <h3>Cross-SPA Logout Synchronization</h3>

      <h4>Cookie-Based Synchronization</h4>
      <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
{`// When user logs out from mentor.example.com
handleLogout({
  authUrl: 'https://auth.example.com',
});

// This sets cookie: ibl_logout_timestamp=1234567890
// Cookie domain: .example.com (parent domain)
// All apps on *.example.com can read it`}
      </pre>

      <h4>Monitoring in Other SPAs</h4>
      <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
{`import { useEffect } from 'react';
import { handleLogout } from '@iblai/web-utils';

function App() {
  useEffect(() => {
    const checkLogout = () => {
      const timestamp = getCookie('ibl_logout_timestamp');
      const lastCheck = localStorage.getItem('last_logout_check');

      if (timestamp && timestamp !== lastCheck) {
        localStorage.setItem('last_logout_check', timestamp);
        // Trigger logout in this SPA
        handleLogout({ authUrl: 'https://auth.example.com' });
      }
    };

    const interval = setInterval(checkLogout, 5000);
    return () => clearInterval(interval);
  }, []);

  return <YourApp />;
}`}
      </pre>

      <h4>Synced Cookies</h4>
      <ul style={{ lineHeight: '1.8' }}>
        <li><code>ibl_logout_timestamp</code> - Timestamp of logout event</li>
        <li><code>ibl_current_tenant</code> - Current tenant (deleted on logout)</li>
        <li><code>ibl_user_data</code> - User data (deleted on logout)</li>
        <li><code>ibl_tenant</code> - Tenant list (deleted on logout)</li>
      </ul>
    </div>
  ),
};
