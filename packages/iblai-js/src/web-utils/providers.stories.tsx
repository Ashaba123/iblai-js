import type { Meta, StoryObj } from '@storybook/react';

/**
 * # Providers
 *
 * Context providers for managing global application state.
 *
 * ## Available Providers
 *
 * - `AuthProvider` - Authentication and user session management
 * - `MentorProvider` - Current mentor context and settings
 * - `TenantProvider` - Platform/tenant configuration
 *
 * ## Features
 * - ✅ React Context API
 * - ✅ TypeScript support
 * - ✅ Automatic state persistence via LocalStorageService
 * - ✅ Built-in error handling with middleware
 * - ✅ Fallback components during loading
 */
const meta = {
  title: 'Web Utils/Providers',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Context providers for global application state management.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * ## AuthProvider
 *
 * Manages authentication state, user sessions, and route protection with middleware.
 *
 * ### Props
 * ```typescript
 * interface AuthProviderProps {
 *   children: React.ReactNode;
 *   redirectToAuthSpa: (pathname?: string, tenant?: string, forceRedirect?: boolean) => void;
 *   hasNonExpiredAuthToken: (pathname?: string) => boolean;
 *   username: string;                    // Current username or empty string
 *   middleware?: Map<RegExp, () => Promise<boolean> | boolean>; // Route middleware
 *   pathname: string;                    // Current full pathname (including search params)
 *   token?: string;                      // Optional auth token from URL
 *   storageService: StorageService;      // LocalStorageService.getInstance()
 *   fallback?: React.ReactNode;          // Loading component (typically <Spinner />)
 * }
 * ```
 *
 * ### Context Value
 * ```typescript
 * {
 *   user: User | null;                    // Current user
 *   isAuthenticated: boolean;             // Auth status
 *   isLoading: boolean;                   // Loading state
 *   token: string | null;                 // Access token
 *   username: string;                     // Username
 *   redirectToAuthSpa: (pathname?, tenant?, forceRedirect?) => void;
 * }
 * ```
 *
 * ### Example - Mentor App Setup
 * ```tsx
 * import { AuthProvider } from '@iblai/web-utils';
 * import { LocalStorageService } from '@iblai/web-utils';
 * import { usePathname, useSearchParams } from 'next/navigation';
 *
 * function AppProviders({ children }: { children: React.ReactNode }) {
 *   const pathname = usePathname();
 *   const searchParams = useSearchParams();
 *
 *   // Create full pathname with search params
 *   const fullPathname = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
 *
 *   // Define route middleware
 *   const middleware = new Map<RegExp, () => Promise<boolean>>([
 *     [/^\/platform\/[^/]+\/[^/]+\/admin/, async () => {
 *       return isAdmin(); // Return true to allow, false to redirect
 *     }],
 *     [/^\/platform\/[^/]+\/[^/]+\/chat/, async () => {
 *       return hasActiveSubscription();
 *     }],
 *   ]);
 *
 *   return (
 *     <AuthProvider
 *       redirectToAuthSpa={redirectToAuthSpa}
 *       hasNonExpiredAuthToken={hasNonExpiredAuthToken}
 *       username={username || ''}
 *       middleware={middleware}
 *       pathname={fullPathname}
 *       token={searchParams.get('token') ?? undefined}
 *       storageService={LocalStorageService.getInstance()}
 *       fallback={<Spinner />}
 *     >
 *       {children}
 *     </AuthProvider>
 *   );
 * }
 * ```
 *
 * ### Middleware Pattern
 * ```tsx
 * // Middleware checks routes in order
 * // Return true to allow access, false to redirect to auth
 * const middleware = new Map<RegExp, () => Promise<boolean>>([
 *   // Protected admin routes
 *   [/^\/admin/, async () => {
 *     const user = await getCurrentUser();
 *     return user?.roles.includes('admin') ?? false;
 *   }],
 *
 *   // Subscription required routes
 *   [/^\/premium/, async () => {
 *     const subscription = await getSubscription();
 *     return subscription?.status === 'active';
 *   }],
 *
 *   // Public routes (no middleware needed)
 * ]);
 * ```
 *
 * ### Using the Hook
 * ```tsx
 * import { useAuth } from '@iblai/web-utils';
 *
 * function UserProfile() {
 *   const { user, isAuthenticated, username, redirectToAuthSpa } = useAuth();
 *
 *   if (!isAuthenticated) {
 *     redirectToAuthSpa(window.location.pathname);
 *     return null;
 *   }
 *
 *   return (
 *     <div>
 *       <h1>Welcome, {username}!</h1>
 *       <p>Email: {user?.email}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export const AuthProviderExample: Story = {
  render: () => (
    <div style={{ padding: '20px', fontFamily: 'monospace', maxWidth: '800px' }}>
      <h3>AuthProvider - Real Usage</h3>

      <h4>1. Setup with Middleware</h4>
      <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
{`import { AuthProvider, LocalStorageService } from '@iblai/web-utils';

function AppProviders({ children }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const fullPathname = pathname + (searchParams.toString() ? \`?\${searchParams.toString()}\` : '');

  // Route protection middleware
  const middleware = new Map([
    [/^\\/admin/, async () => isAdmin()],
    [/^\\/premium/, async () => hasSubscription()],
  ]);

  return (
    <AuthProvider
      redirectToAuthSpa={redirectToAuthSpa}
      hasNonExpiredAuthToken={hasNonExpiredAuthToken}
      username={getUserName() || ''}
      middleware={middleware}
      pathname={fullPathname}
      token={searchParams.get('token') ?? undefined}
      storageService={LocalStorageService.getInstance()}
      fallback={<Spinner />}
    >
      {children}
    </AuthProvider>
  );
}`}
      </pre>

      <h4>2. Anonymous User Support</h4>
      <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
{`import { ANONYMOUS_USERNAME } from '@iblai/web-utils';

<AuthProvider
  username={username || ANONYMOUS_USERNAME}
  // ... other props
>
  {children}
</AuthProvider>`}
      </pre>

      <h4>3. Using in Components</h4>
      <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
{`import { useAuth } from '@iblai/web-utils';

function ProtectedPage() {
  const { isAuthenticated, username, redirectToAuthSpa } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      redirectToAuthSpa(window.location.pathname);
    }
  }, [isAuthenticated]);

  return <div>Protected content for {username}</div>;
}`}
      </pre>
    </div>
  ),
};

/**
 * ## TenantProvider
 *
 * Manages platform/tenant configuration, tenant switching, and user tenant membership.
 *
 * ### Props
 * ```typescript
 * interface TenantProviderProps {
 *   children: React.ReactNode;
 *   currentTenant: string;               // Current tenant key
 *   requestedTenant: string;             // Requested tenant (from URL)
 *   saveCurrentTenant: (key: string) => void;
 *   saveUserTenants: (tenants: Tenant[]) => void;
 *   handleTenantSwitch: (tenant: Tenant) => void;
 *   saveVisitingTenant?: (key: string) => void;
 *   removeVisitingTenant?: () => void;
 *   saveUserTokens?: (tokens: Record<string, string>) => void;
 *   saveTenant?: (tenant: Tenant) => void;
 *   fallback?: React.ReactNode;          // Loading component
 * }
 * ```
 *
 * ### Context Value
 * ```typescript
 * {
 *   currentTenant: Tenant | null;        // Current tenant object
 *   visitingTenant: string | null;       // Visiting tenant key
 *   userTenants: Tenant[];               // User's tenant memberships
 *   tenantKey: string;                   // Current tenant key
 *   isLoading: boolean;
 *   switchTenant: (tenant: Tenant) => void;
 * }
 * ```
 *
 * ### Tenant Type
 * ```typescript
 * interface Tenant {
 *   key: string;
 *   org: string;
 *   name: string;
 *   is_admin: boolean;
 *   logo?: string;
 *   domain?: string;
 *   theme?: {
 *     primaryColor: string;
 *     secondaryColor: string;
 *   };
 * }
 * ```
 *
 * ### Example - Real Setup
 * ```tsx
 * import { TenantProvider } from '@iblai/web-utils';
 *
 * function Providers({ children }: { children: React.ReactNode }) {
 *   const tenantKey = getTenant();
 *   const requestedTenant = getRequestedTenant();
 *
 *   return (
 *     <TenantProvider
 *       currentTenant={tenantKey || ''}
 *       requestedTenant={requestedTenant || ''}
 *       saveCurrentTenant={(key) => localStorage.setItem('tenant', key)}
 *       saveUserTenants={(tenants) => localStorage.setItem('userTenants', JSON.stringify(tenants))}
 *       handleTenantSwitch={(tenant) => {
 *         localStorage.setItem('tenant', tenant.key);
 *         window.location.href = \`/platform/\${tenant.key}\`;
 *       }}
 *       saveVisitingTenant={(key) => sessionStorage.setItem('visitingTenant', key)}
 *       removeVisitingTenant={() => sessionStorage.removeItem('visitingTenant')}
 *       fallback={<Spinner />}
 *     >
 *       {children}
 *     </TenantProvider>
 *   );
 * }
 * ```
 */
export const TenantProviderExample: Story = {
  render: () => (
    <div style={{ padding: '20px', fontFamily: 'monospace', maxWidth: '800px' }}>
      <h3>TenantProvider - Real Usage</h3>

      <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
{`import { TenantProvider } from '@iblai/web-utils';

<TenantProvider
  currentTenant={getTenant() || ''}
  requestedTenant={getTenant() || ''}
  saveCurrentTenant={(key) => {
    localStorage.setItem('tenant', key);
  }}
  saveUserTenants={(tenants) => {
    localStorage.setItem('userTenants', JSON.stringify(tenants));
  }}
  handleTenantSwitch={(tenant) => {
    localStorage.setItem('tenant', tenant.key);
    router.push(\`/platform/\${tenant.key}\`);
  }}
  saveVisitingTenant={(key) => {
    sessionStorage.setItem('visitingTenant', key);
  }}
  removeVisitingTenant={() => {
    sessionStorage.removeItem('visitingTenant');
  }}
  fallback={<Spinner />}
>
  {children}
</TenantProvider>`}
      </pre>

      <h4>Using in Components</h4>
      <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
{`import { useTenant } from '@iblai/web-utils';

function TenantInfo() {
  const { currentTenant, userTenants, switchTenant } = useTenant();

  return (
    <div>
      <h2>Current: {currentTenant?.name}</h2>
      <select onChange={(e) => {
        const tenant = userTenants.find(t => t.key === e.target.value);
        if (tenant) switchTenant(tenant);
      }}>
        {userTenants.map(t => (
          <option key={t.key} value={t.key}>{t.name}</option>
        ))}
      </select>
    </div>
  );
}`}
      </pre>
    </div>
  ),
};

/**
 * ## MentorProvider
 *
 * Manages the current active mentor context, permissions, and mentor switching.
 *
 * ### Props
 * ```typescript
 * interface MentorProviderProps {
 *   children: React.ReactNode;
 *   redirectToAuthSpa: (pathname?: string, tenant?: string, forceRedirect?: boolean) => void;
 *   username: string;                    // Current username or ANONYMOUS_USERNAME
 *   isAdmin: boolean;                    // User admin status
 *   mainTenantKey: string;               // Main platform tenant key
 *   redirectToNoMentorsPage: () => void;
 *   redirectToCreateMentor: () => void;
 *   redirectToMentor: (mentorId: string) => void;
 *   onLoadMentorsPermissions: (permissions: MentorPermissions) => void;
 *   requestedMentorId?: string;          // Mentor ID from URL
 *   onAuthSuccess?: () => void;
 *   fallback?: React.ReactNode;
 *   handleMentorNotFound?: () => void;
 * }
 * ```
 *
 * ### Context Value
 * ```typescript
 * {
 *   activeMentor: Mentor | null;
 *   activeMentorId: string | null;
 *   mentors: Mentor[];
 *   isLoading: boolean;
 *   setActiveMentor: (id: string) => void;
 *   permissions: MentorPermissions;
 * }
 * ```
 *
 * ### Example - Real Setup
 * ```tsx
 * import { MentorProvider, ANONYMOUS_USERNAME } from '@iblai/web-utils';
 *
 * <MentorProvider
 *   redirectToAuthSpa={redirectToAuthSpa}
 *   username={username || ANONYMOUS_USERNAME}
 *   isAdmin={isAdmin}
 *   mainTenantKey={config.mainTenantKey()}
 *   redirectToNoMentorsPage={() => router.push('/no-mentors')}
 *   redirectToCreateMentor={() => router.push('/create-mentor')}
 *   redirectToMentor={(id) => router.push(\`/platform/\${tenantKey}/\${id}\`)}
 *   onLoadMentorsPermissions={(perms) => {
 *     console.log('Mentor permissions:', perms);
 *   }}
 *   requestedMentorId={mentorId}
 *   onAuthSuccess={() => console.log('Auth successful')}
 *   fallback={<Spinner />}
 *   handleMentorNotFound={() => router.push('/404')}
 * >
 *   {children}
 * </MentorProvider>
 * ```
 */
export const MentorProviderExample: Story = {
  render: () => (
    <div style={{ padding: '20px', fontFamily: 'monospace', maxWidth: '800px' }}>
      <h3>MentorProvider - Real Usage</h3>

      <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
{`import { MentorProvider, ANONYMOUS_USERNAME } from '@iblai/web-utils';

<MentorProvider
  redirectToAuthSpa={redirectToAuthSpa}
  username={username || ANONYMOUS_USERNAME}
  isAdmin={isAdmin}
  mainTenantKey={config.mainTenantKey()}
  redirectToNoMentorsPage={() => {
    router.push('/no-mentors');
  }}
  redirectToCreateMentor={() => {
    router.push(\`/platform/\${tenantKey}/create\`);
  }}
  redirectToMentor={(mentorId) => {
    router.push(\`/platform/\${tenantKey}/\${mentorId}\`);
  }}
  onLoadMentorsPermissions={(permissions) => {
    // Handle permissions loading
    console.log('Loaded permissions:', permissions);
  }}
  requestedMentorId={mentorId}
  onAuthSuccess={() => {
    console.log('Auth successful, mentor loaded');
  }}
  fallback={<Spinner />}
  handleMentorNotFound={() => {
    router.push('/404');
  }}
>
  {children}
</MentorProvider>`}
      </pre>

      <h4>Using in Components</h4>
      <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
{`import { useMentor } from '@iblai/web-utils';

function MentorHeader() {
  const { activeMentor, setActiveMentor, mentors } = useMentor();

  return (
    <div>
      <h1>{activeMentor?.name}</h1>
      <select onChange={(e) => setActiveMentor(e.target.value)}>
        {mentors.map(m => (
          <option key={m.unique_id} value={m.unique_id}>
            {m.name}
          </option>
        ))}
      </select>
    </div>
  );
}`}
      </pre>
    </div>
  ),
};

/**
 * ## Provider Composition
 *
 * **CRITICAL:** Providers must be nested in this exact order for apps to work correctly.
 *
 * ### Correct Order (Used in Production)
 * 1. **Redux Provider** (outermost)
 * 2. **AuthProvider**
 * 3. **TenantProvider**
 * 4. **MentorProvider** (innermost - Mentor app only)
 *
 * ### Complete Example - Mentor App
 * ```tsx
 * import { Provider } from 'react-redux';
 * import { AuthProvider, TenantProvider, MentorProvider, LocalStorageService, ANONYMOUS_USERNAME } from '@iblai/web-utils';
 * import { store } from './store';
 *
 * export function AppProviders({ children }: { children: React.ReactNode }) {
 *   const pathname = usePathname();
 *   const searchParams = useSearchParams();
 *   const fullPathname = pathname + (searchParams.toString() ? \`?\${searchParams.toString()}\` : '');
 *
 *   const middleware = new Map<RegExp, () => Promise<boolean>>([
 *     [/^\\/admin/, async () => isAdmin()],
 *   ]);
 *
 *   return (
 *     <Provider store={store}>
 *       <AuthProvider
 *         redirectToAuthSpa={redirectToAuthSpa}
 *         hasNonExpiredAuthToken={hasNonExpiredAuthToken}
 *         username={username || ''}
 *         middleware={middleware}
 *         pathname={fullPathname}
 *         token={searchParams.get('token') ?? undefined}
 *         storageService={LocalStorageService.getInstance()}
 *         fallback={<Spinner />}
 *       >
 *         <TenantProvider
 *           currentTenant={tenantKey || ''}
 *           requestedTenant={tenantKeyParams || ''}
 *           saveCurrentTenant={saveCurrentTenant}
 *           saveUserTenants={saveUserTenants}
 *           handleTenantSwitch={handleTenantSwitch}
 *           saveVisitingTenant={saveVisitingTenant}
 *           removeVisitingTenant={removeVisitingTenant}
 *           fallback={<Spinner />}
 *         >
 *           <MentorProvider
 *             redirectToAuthSpa={redirectToAuthSpa}
 *             username={username || ANONYMOUS_USERNAME}
 *             isAdmin={isAdmin}
 *             mainTenantKey={config.mainTenantKey()}
 *             redirectToNoMentorsPage={redirectToNoMentorsPage}
 *             redirectToCreateMentor={redirectToCreateMentor}
 *             redirectToMentor={redirectToMentor}
 *             onLoadMentorsPermissions={onLoadMentorsPermissions}
 *             requestedMentorId={mentorId}
 *             fallback={<Spinner />}
 *           >
 *             {children}
 *           </MentorProvider>
 *         </TenantProvider>
 *       </AuthProvider>
 *     </Provider>
 *   );
 * }
 * ```
 *
 * ### Skills App (Simpler - No MentorProvider)
 * ```tsx
 * <Provider store={store}>
 *   <AuthProvider {...authProps}>
 *     <TenantProvider {...tenantProps}>
 *       {children}
 *     </TenantProvider>
 *   </AuthProvider>
 * </Provider>
 * ```
 */
export const ProviderComposition: Story = {
  render: () => (
    <div style={{ padding: '20px', fontFamily: 'monospace', maxWidth: '800px' }}>
      <h3>Provider Composition - Production Pattern</h3>

      <h4>Mentor App (Full Stack)</h4>
      <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '4px', overflow: 'auto', fontSize: '12px' }}>
{`import { Provider } from 'react-redux';
import {
  AuthProvider,
  TenantProvider,
  MentorProvider,
  LocalStorageService,
  ANONYMOUS_USERNAME
} from '@iblai/web-utils';

<Provider store={store}>
  <AuthProvider
    redirectToAuthSpa={redirectToAuthSpa}
    hasNonExpiredAuthToken={hasNonExpiredAuthToken}
    username={username || ''}
    middleware={middleware}
    pathname={fullPathname}
    storageService={LocalStorageService.getInstance()}
    fallback={<Spinner />}
  >
    <TenantProvider
      currentTenant={tenantKey || ''}
      requestedTenant={tenantKeyParams || ''}
      saveCurrentTenant={saveCurrentTenant}
      saveUserTenants={saveUserTenants}
      handleTenantSwitch={handleTenantSwitch}
      fallback={<Spinner />}
    >
      <MentorProvider
        username={username || ANONYMOUS_USERNAME}
        isAdmin={isAdmin}
        mainTenantKey={config.mainTenantKey()}
        requestedMentorId={mentorId}
        fallback={<Spinner />}
        {/* ... more props */}
      >
        {children}
      </MentorProvider>
    </TenantProvider>
  </AuthProvider>
</Provider>`}
      </pre>

      <p><strong>Key Points:</strong></p>
      <ul style={{ lineHeight: '1.8' }}>
        <li>Redux Provider must be outermost</li>
        <li>Auth → Tenant → Mentor nesting order is critical</li>
        <li>All providers should have fallback={`<Spinner />`}</li>
        <li>Use LocalStorageService.getInstance() for storage</li>
        <li>Use ANONYMOUS_USERNAME for unauthenticated users</li>
        <li>pathname must include search parameters</li>
      </ul>
    </div>
  ),
};

/**
 * ## Data Layer Initialization
 *
 * **CRITICAL:** Initialize data layer before rendering providers.
 *
 * ### Pattern
 * ```tsx
 * import { initializeDataLayer } from '@iblai/data-layer';
 * import { LocalStorageService } from '@iblai/web-utils';
 *
 * export function DataLayerInitializer({ children }: { children: React.ReactNode }) {
 *   const [ready, setReady] = useState(false);
 *
 *   useEffect(() => {
 *     if (typeof window.__ENV__ !== 'undefined') {
 *       loadDataLayer();
 *     } else {
 *       // Load env.js if not loaded
 *       const script = document.createElement('script');
 *       script.src = '/env.js';
 *       script.async = false;
 *       script.onload = () => loadDataLayer();
 *       script.onerror = () => loadDataLayer();
 *       document.head.appendChild(script);
 *     }
 *   }, []);
 *
 *   const loadDataLayer = () => {
 *     initializeDataLayer(
 *       config.dmUrl(),
 *       config.lmsUrl(),
 *       LocalStorageService.getInstance(),
 *       {
 *         401: () => {
 *           console.log('[auth-redirect] API returned 401 Unauthorized');
 *           redirectToAuthSpa(undefined, undefined, true);
 *         },
 *         402: () => {
 *           handle402Error({ error: 'Subscription credit limit reached' });
 *         },
 *       }
 *     );
 *     setReady(true);
 *   };
 *
 *   if (!ready) return null;
 *
 *   return <>{children}</>;
 * }
 * ```
 */
export const DataLayerInit: Story = {
  render: () => (
    <div style={{ padding: '20px', fontFamily: 'monospace', maxWidth: '800px' }}>
      <h3>Data Layer Initialization - Required Setup</h3>

      <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
{`import { initializeDataLayer } from '@iblai/data-layer';
import { LocalStorageService } from '@iblai/web-utils';

function DataLayerInit({ children }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const loadDataLayer = () => {
      initializeDataLayer(
        config.dmUrl(),      // Data management API URL
        config.lmsUrl(),     // LMS API URL
        LocalStorageService.getInstance(),
        {
          401: () => redirectToAuthSpa(undefined, undefined, true),
          402: () => handle402Error({ error: 'Credit limit' }),
        }
      );
      setReady(true);
    };

    if (typeof window.__ENV__ !== 'undefined') {
      loadDataLayer();
    } else {
      const script = document.createElement('script');
      script.src = '/env.js';
      script.onload = loadDataLayer;
      document.head.appendChild(script);
    }
  }, []);

  if (!ready) return null;
  return <>{children}</>;
}

// Use before providers:
<DataLayerInit>
  <AppProviders>
    <App />
  </AppProviders>
</DataLayerInit>`}
      </pre>
    </div>
  ),
};
