const N={title:"Web Utils/Providers",parameters:{layout:"centered",docs:{description:{component:"Context providers for global application state management."}}},tags:["autodocs"]},e={render:()=>React.createElement("div",{style:{padding:"20px",fontFamily:"monospace",maxWidth:"800px"}},React.createElement("h3",null,"AuthProvider - Real Usage"),React.createElement("h4",null,"1. Setup with Middleware"),React.createElement("pre",{style:{background:"#f5f5f5",padding:"15px",borderRadius:"4px",overflow:"auto"}},`import { AuthProvider, LocalStorageService } from '@iblai/web-utils';

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
}`),React.createElement("h4",null,"2. Anonymous User Support"),React.createElement("pre",{style:{background:"#f5f5f5",padding:"15px",borderRadius:"4px",overflow:"auto"}},`import { ANONYMOUS_USERNAME } from '@iblai/web-utils';

<AuthProvider
  username={username || ANONYMOUS_USERNAME}
  // ... other props
>
  {children}
</AuthProvider>`),React.createElement("h4",null,"3. Using in Components"),React.createElement("pre",{style:{background:"#f5f5f5",padding:"15px",borderRadius:"4px",overflow:"auto"}},`import { useAuth } from '@iblai/web-utils';

function ProtectedPage() {
  const { isAuthenticated, username, redirectToAuthSpa } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      redirectToAuthSpa(window.location.pathname);
    }
  }, [isAuthenticated]);

  return <div>Protected content for {username}</div>;
}`))},n={render:()=>React.createElement("div",{style:{padding:"20px",fontFamily:"monospace",maxWidth:"800px"}},React.createElement("h3",null,"TenantProvider - Real Usage"),React.createElement("pre",{style:{background:"#f5f5f5",padding:"15px",borderRadius:"4px",overflow:"auto"}},`import { TenantProvider } from '@iblai/web-utils';

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
</TenantProvider>`),React.createElement("h4",null,"Using in Components"),React.createElement("pre",{style:{background:"#f5f5f5",padding:"15px",borderRadius:"4px",overflow:"auto"}},`import { useTenant } from '@iblai/web-utils';

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
}`))},t={render:()=>React.createElement("div",{style:{padding:"20px",fontFamily:"monospace",maxWidth:"800px"}},React.createElement("h3",null,"MentorProvider - Real Usage"),React.createElement("pre",{style:{background:"#f5f5f5",padding:"15px",borderRadius:"4px",overflow:"auto"}},`import { MentorProvider, ANONYMOUS_USERNAME } from '@iblai/web-utils';

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
</MentorProvider>`),React.createElement("h4",null,"Using in Components"),React.createElement("pre",{style:{background:"#f5f5f5",padding:"15px",borderRadius:"4px",overflow:"auto"}},`import { useMentor } from '@iblai/web-utils';

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
}`))},r={render:()=>React.createElement("div",{style:{padding:"20px",fontFamily:"monospace",maxWidth:"800px"}},React.createElement("h3",null,"Provider Composition - Production Pattern"),React.createElement("h4",null,"Mentor App (Full Stack)"),React.createElement("pre",{style:{background:"#f5f5f5",padding:"15px",borderRadius:"4px",overflow:"auto",fontSize:"12px"}},`import { Provider } from 'react-redux';
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
</Provider>`),React.createElement("p",null,React.createElement("strong",null,"Key Points:")),React.createElement("ul",{style:{lineHeight:"1.8"}},React.createElement("li",null,"Redux Provider must be outermost"),React.createElement("li",null,"Auth → Tenant → Mentor nesting order is critical"),React.createElement("li",null,"All providers should have fallback=","<Spinner />"),React.createElement("li",null,"Use LocalStorageService.getInstance() for storage"),React.createElement("li",null,"Use ANONYMOUS_USERNAME for unauthenticated users"),React.createElement("li",null,"pathname must include search parameters")))},a={render:()=>React.createElement("div",{style:{padding:"20px",fontFamily:"monospace",maxWidth:"800px"}},React.createElement("h3",null,"Data Layer Initialization - Required Setup"),React.createElement("pre",{style:{background:"#f5f5f5",padding:"15px",borderRadius:"4px",overflow:"auto"}},`import { initializeDataLayer } from '@iblai/data-layer';
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
</DataLayerInit>`))};var o,i,s,d,c;e.parameters={...e.parameters,docs:{...(o=e.parameters)==null?void 0:o.docs,source:{originalSource:`{
  render: () => <div style={{
    padding: '20px',
    fontFamily: 'monospace',
    maxWidth: '800px'
  }}>
      <h3>AuthProvider - Real Usage</h3>

      <h4>1. Setup with Middleware</h4>
      <pre style={{
      background: '#f5f5f5',
      padding: '15px',
      borderRadius: '4px',
      overflow: 'auto'
    }}>
      {\`import { AuthProvider, LocalStorageService } from '@iblai/web-utils';

function AppProviders({ children }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const fullPathname = pathname + (searchParams.toString() ? \\\`?\\\${searchParams.toString()}\\\` : '');

  // Route protection middleware
  const middleware = new Map([
    [/^\\\\/admin/, async () => isAdmin()],
    [/^\\\\/premium/, async () => hasSubscription()],
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
}\`}
      </pre>

      <h4>2. Anonymous User Support</h4>
      <pre style={{
      background: '#f5f5f5',
      padding: '15px',
      borderRadius: '4px',
      overflow: 'auto'
    }}>
      {\`import { ANONYMOUS_USERNAME } from '@iblai/web-utils';

<AuthProvider
  username={username || ANONYMOUS_USERNAME}
  // ... other props
>
  {children}
</AuthProvider>\`}
      </pre>

      <h4>3. Using in Components</h4>
      <pre style={{
      background: '#f5f5f5',
      padding: '15px',
      borderRadius: '4px',
      overflow: 'auto'
    }}>
      {\`import { useAuth } from '@iblai/web-utils';

function ProtectedPage() {
  const { isAuthenticated, username, redirectToAuthSpa } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      redirectToAuthSpa(window.location.pathname);
    }
  }, [isAuthenticated]);

  return <div>Protected content for {username}</div>;
}\`}
      </pre>
    </div>
}`,...(s=(i=e.parameters)==null?void 0:i.docs)==null?void 0:s.source},description:{story:`## AuthProvider

Manages authentication state, user sessions, and route protection with middleware.

### Props
\`\`\`typescript
interface AuthProviderProps {
  children: React.ReactNode;
  redirectToAuthSpa: (pathname?: string, tenant?: string, forceRedirect?: boolean) => void;
  hasNonExpiredAuthToken: (pathname?: string) => boolean;
  username: string;                    // Current username or empty string
  middleware?: Map<RegExp, () => Promise<boolean> | boolean>; // Route middleware
  pathname: string;                    // Current full pathname (including search params)
  token?: string;                      // Optional auth token from URL
  storageService: StorageService;      // LocalStorageService.getInstance()
  fallback?: React.ReactNode;          // Loading component (typically <Spinner />)
}
\`\`\`

### Context Value
\`\`\`typescript
{
  user: User | null;                    // Current user
  isAuthenticated: boolean;             // Auth status
  isLoading: boolean;                   // Loading state
  token: string | null;                 // Access token
  username: string;                     // Username
  redirectToAuthSpa: (pathname?, tenant?, forceRedirect?) => void;
}
\`\`\`

### Example - Mentor App Setup
\`\`\`tsx
import { AuthProvider } from '@iblai/web-utils';
import { LocalStorageService } from '@iblai/web-utils';
import { usePathname, useSearchParams } from 'next/navigation';

function AppProviders({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Create full pathname with search params
  const fullPathname = pathname + (searchParams.toString() ? \`?\${searchParams.toString()}\` : '');

  // Define route middleware
  const middleware = new Map<RegExp, () => Promise<boolean>>([
    [/^\\/platform\\/[^/]+\\/[^/]+\\/admin/, async () => {
      return isAdmin(); // Return true to allow, false to redirect
    }],
    [/^\\/platform\\/[^/]+\\/[^/]+\\/chat/, async () => {
      return hasActiveSubscription();
    }],
  ]);

  return (
    <AuthProvider
      redirectToAuthSpa={redirectToAuthSpa}
      hasNonExpiredAuthToken={hasNonExpiredAuthToken}
      username={username || ''}
      middleware={middleware}
      pathname={fullPathname}
      token={searchParams.get('token') ?? undefined}
      storageService={LocalStorageService.getInstance()}
      fallback={<Spinner />}
    >
      {children}
    </AuthProvider>
  );
}
\`\`\`

### Middleware Pattern
\`\`\`tsx
// Middleware checks routes in order
// Return true to allow access, false to redirect to auth
const middleware = new Map<RegExp, () => Promise<boolean>>([
  // Protected admin routes
  [/^\\/admin/, async () => {
    const user = await getCurrentUser();
    return user?.roles.includes('admin') ?? false;
  }],

  // Subscription required routes
  [/^\\/premium/, async () => {
    const subscription = await getSubscription();
    return subscription?.status === 'active';
  }],

  // Public routes (no middleware needed)
]);
\`\`\`

### Using the Hook
\`\`\`tsx
import { useAuth } from '@iblai/web-utils';

function UserProfile() {
  const { user, isAuthenticated, username, redirectToAuthSpa } = useAuth();

  if (!isAuthenticated) {
    redirectToAuthSpa(window.location.pathname);
    return null;
  }

  return (
    <div>
      <h1>Welcome, {username}!</h1>
      <p>Email: {user?.email}</p>
    </div>
  );
}
\`\`\``,...(c=(d=e.parameters)==null?void 0:d.docs)==null?void 0:c.description}}};var l,u,m,p,h;n.parameters={...n.parameters,docs:{...(l=n.parameters)==null?void 0:l.docs,source:{originalSource:`{
  render: () => <div style={{
    padding: '20px',
    fontFamily: 'monospace',
    maxWidth: '800px'
  }}>
      <h3>TenantProvider - Real Usage</h3>

      <pre style={{
      background: '#f5f5f5',
      padding: '15px',
      borderRadius: '4px',
      overflow: 'auto'
    }}>
      {\`import { TenantProvider } from '@iblai/web-utils';

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
    router.push(\\\`/platform/\\\${tenant.key}\\\`);
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
</TenantProvider>\`}
      </pre>

      <h4>Using in Components</h4>
      <pre style={{
      background: '#f5f5f5',
      padding: '15px',
      borderRadius: '4px',
      overflow: 'auto'
    }}>
      {\`import { useTenant } from '@iblai/web-utils';

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
}\`}
      </pre>
    </div>
}`,...(m=(u=n.parameters)==null?void 0:u.docs)==null?void 0:m.source},description:{story:`## TenantProvider

Manages platform/tenant configuration, tenant switching, and user tenant membership.

### Props
\`\`\`typescript
interface TenantProviderProps {
  children: React.ReactNode;
  currentTenant: string;               // Current tenant key
  requestedTenant: string;             // Requested tenant (from URL)
  saveCurrentTenant: (key: string) => void;
  saveUserTenants: (tenants: Tenant[]) => void;
  handleTenantSwitch: (tenant: Tenant) => void;
  saveVisitingTenant?: (key: string) => void;
  removeVisitingTenant?: () => void;
  saveUserTokens?: (tokens: Record<string, string>) => void;
  saveTenant?: (tenant: Tenant) => void;
  fallback?: React.ReactNode;          // Loading component
}
\`\`\`

### Context Value
\`\`\`typescript
{
  currentTenant: Tenant | null;        // Current tenant object
  visitingTenant: string | null;       // Visiting tenant key
  userTenants: Tenant[];               // User's tenant memberships
  tenantKey: string;                   // Current tenant key
  isLoading: boolean;
  switchTenant: (tenant: Tenant) => void;
}
\`\`\`

### Tenant Type
\`\`\`typescript
interface Tenant {
  key: string;
  org: string;
  name: string;
  is_admin: boolean;
  logo?: string;
  domain?: string;
  theme?: {
    primaryColor: string;
    secondaryColor: string;
  };
}
\`\`\`

### Example - Real Setup
\`\`\`tsx
import { TenantProvider } from '@iblai/web-utils';

function Providers({ children }: { children: React.ReactNode }) {
  const tenantKey = getTenant();
  const requestedTenant = getRequestedTenant();

  return (
    <TenantProvider
      currentTenant={tenantKey || ''}
      requestedTenant={requestedTenant || ''}
      saveCurrentTenant={(key) => localStorage.setItem('tenant', key)}
      saveUserTenants={(tenants) => localStorage.setItem('userTenants', JSON.stringify(tenants))}
      handleTenantSwitch={(tenant) => {
        localStorage.setItem('tenant', tenant.key);
        window.location.href = \\\`/platform/\\\${tenant.key}\\\`;
      }}
      saveVisitingTenant={(key) => sessionStorage.setItem('visitingTenant', key)}
      removeVisitingTenant={() => sessionStorage.removeItem('visitingTenant')}
      fallback={<Spinner />}
    >
      {children}
    </TenantProvider>
  );
}
\`\`\``,...(h=(p=n.parameters)==null?void 0:p.docs)==null?void 0:h.description}}};var v,f,g,S,T;t.parameters={...t.parameters,docs:{...(v=t.parameters)==null?void 0:v.docs,source:{originalSource:`{
  render: () => <div style={{
    padding: '20px',
    fontFamily: 'monospace',
    maxWidth: '800px'
  }}>
      <h3>MentorProvider - Real Usage</h3>

      <pre style={{
      background: '#f5f5f5',
      padding: '15px',
      borderRadius: '4px',
      overflow: 'auto'
    }}>
      {\`import { MentorProvider, ANONYMOUS_USERNAME } from '@iblai/web-utils';

<MentorProvider
  redirectToAuthSpa={redirectToAuthSpa}
  username={username || ANONYMOUS_USERNAME}
  isAdmin={isAdmin}
  mainTenantKey={config.mainTenantKey()}
  redirectToNoMentorsPage={() => {
    router.push('/no-mentors');
  }}
  redirectToCreateMentor={() => {
    router.push(\\\`/platform/\\\${tenantKey}/create\\\`);
  }}
  redirectToMentor={(mentorId) => {
    router.push(\\\`/platform/\\\${tenantKey}/\\\${mentorId}\\\`);
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
</MentorProvider>\`}
      </pre>

      <h4>Using in Components</h4>
      <pre style={{
      background: '#f5f5f5',
      padding: '15px',
      borderRadius: '4px',
      overflow: 'auto'
    }}>
      {\`import { useMentor } from '@iblai/web-utils';

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
}\`}
      </pre>
    </div>
}`,...(g=(f=t.parameters)==null?void 0:f.docs)==null?void 0:g.source},description:{story:`## MentorProvider

Manages the current active mentor context, permissions, and mentor switching.

### Props
\`\`\`typescript
interface MentorProviderProps {
  children: React.ReactNode;
  redirectToAuthSpa: (pathname?: string, tenant?: string, forceRedirect?: boolean) => void;
  username: string;                    // Current username or ANONYMOUS_USERNAME
  isAdmin: boolean;                    // User admin status
  mainTenantKey: string;               // Main platform tenant key
  redirectToNoMentorsPage: () => void;
  redirectToCreateMentor: () => void;
  redirectToMentor: (mentorId: string) => void;
  onLoadMentorsPermissions: (permissions: MentorPermissions) => void;
  requestedMentorId?: string;          // Mentor ID from URL
  onAuthSuccess?: () => void;
  fallback?: React.ReactNode;
  handleMentorNotFound?: () => void;
}
\`\`\`

### Context Value
\`\`\`typescript
{
  activeMentor: Mentor | null;
  activeMentorId: string | null;
  mentors: Mentor[];
  isLoading: boolean;
  setActiveMentor: (id: string) => void;
  permissions: MentorPermissions;
}
\`\`\`

### Example - Real Setup
\`\`\`tsx
import { MentorProvider, ANONYMOUS_USERNAME } from '@iblai/web-utils';

<MentorProvider
  redirectToAuthSpa={redirectToAuthSpa}
  username={username || ANONYMOUS_USERNAME}
  isAdmin={isAdmin}
  mainTenantKey={config.mainTenantKey()}
  redirectToNoMentorsPage={() => router.push('/no-mentors')}
  redirectToCreateMentor={() => router.push('/create-mentor')}
  redirectToMentor={(id) => router.push(\\\`/platform/\\\${tenantKey}/\\\${id}\\\`)}
  onLoadMentorsPermissions={(perms) => {
    console.log('Mentor permissions:', perms);
  }}
  requestedMentorId={mentorId}
  onAuthSuccess={() => console.log('Auth successful')}
  fallback={<Spinner />}
  handleMentorNotFound={() => router.push('/404')}
>
  {children}
</MentorProvider>
\`\`\``,...(T=(S=t.parameters)==null?void 0:S.docs)==null?void 0:T.description}}};var P,A,y,b,M;r.parameters={...r.parameters,docs:{...(P=r.parameters)==null?void 0:P.docs,source:{originalSource:`{
  render: () => <div style={{
    padding: '20px',
    fontFamily: 'monospace',
    maxWidth: '800px'
  }}>
      <h3>Provider Composition - Production Pattern</h3>

      <h4>Mentor App (Full Stack)</h4>
      <pre style={{
      background: '#f5f5f5',
      padding: '15px',
      borderRadius: '4px',
      overflow: 'auto',
      fontSize: '12px'
    }}>
      {\`import { Provider } from 'react-redux';
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
</Provider>\`}
      </pre>

      <p><strong>Key Points:</strong></p>
      <ul style={{
      lineHeight: '1.8'
    }}>
        <li>Redux Provider must be outermost</li>
        <li>Auth → Tenant → Mentor nesting order is critical</li>
        <li>All providers should have fallback={\`<Spinner />\`}</li>
        <li>Use LocalStorageService.getInstance() for storage</li>
        <li>Use ANONYMOUS_USERNAME for unauthenticated users</li>
        <li>pathname must include search parameters</li>
      </ul>
    </div>
}`,...(y=(A=r.parameters)==null?void 0:A.docs)==null?void 0:y.source},description:{story:`## Provider Composition

**CRITICAL:** Providers must be nested in this exact order for apps to work correctly.

### Correct Order (Used in Production)
1. **Redux Provider** (outermost)
2. **AuthProvider**
3. **TenantProvider**
4. **MentorProvider** (innermost - Mentor app only)

### Complete Example - Mentor App
\`\`\`tsx
import { Provider } from 'react-redux';
import { AuthProvider, TenantProvider, MentorProvider, LocalStorageService, ANONYMOUS_USERNAME } from '@iblai/web-utils';
import { store } from './store';

export function AppProviders({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const fullPathname = pathname + (searchParams.toString() ? \\\`?\\\${searchParams.toString()}\\\` : '');

  const middleware = new Map<RegExp, () => Promise<boolean>>([
    [/^\\\\/admin/, async () => isAdmin()],
  ]);

  return (
    <Provider store={store}>
      <AuthProvider
        redirectToAuthSpa={redirectToAuthSpa}
        hasNonExpiredAuthToken={hasNonExpiredAuthToken}
        username={username || ''}
        middleware={middleware}
        pathname={fullPathname}
        token={searchParams.get('token') ?? undefined}
        storageService={LocalStorageService.getInstance()}
        fallback={<Spinner />}
      >
        <TenantProvider
          currentTenant={tenantKey || ''}
          requestedTenant={tenantKeyParams || ''}
          saveCurrentTenant={saveCurrentTenant}
          saveUserTenants={saveUserTenants}
          handleTenantSwitch={handleTenantSwitch}
          saveVisitingTenant={saveVisitingTenant}
          removeVisitingTenant={removeVisitingTenant}
          fallback={<Spinner />}
        >
          <MentorProvider
            redirectToAuthSpa={redirectToAuthSpa}
            username={username || ANONYMOUS_USERNAME}
            isAdmin={isAdmin}
            mainTenantKey={config.mainTenantKey()}
            redirectToNoMentorsPage={redirectToNoMentorsPage}
            redirectToCreateMentor={redirectToCreateMentor}
            redirectToMentor={redirectToMentor}
            onLoadMentorsPermissions={onLoadMentorsPermissions}
            requestedMentorId={mentorId}
            fallback={<Spinner />}
          >
            {children}
          </MentorProvider>
        </TenantProvider>
      </AuthProvider>
    </Provider>
  );
}
\`\`\`

### Skills App (Simpler - No MentorProvider)
\`\`\`tsx
<Provider store={store}>
  <AuthProvider {...authProps}>
    <TenantProvider {...tenantProps}>
      {children}
    </TenantProvider>
  </AuthProvider>
</Provider>
\`\`\``,...(M=(b=r.parameters)==null?void 0:b.docs)==null?void 0:M.description}}};var R,x,w,E,k;a.parameters={...a.parameters,docs:{...(R=a.parameters)==null?void 0:R.docs,source:{originalSource:`{
  render: () => <div style={{
    padding: '20px',
    fontFamily: 'monospace',
    maxWidth: '800px'
  }}>
      <h3>Data Layer Initialization - Required Setup</h3>

      <pre style={{
      background: '#f5f5f5',
      padding: '15px',
      borderRadius: '4px',
      overflow: 'auto'
    }}>
      {\`import { initializeDataLayer } from '@iblai/data-layer';
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
</DataLayerInit>\`}
      </pre>
    </div>
}`,...(w=(x=a.parameters)==null?void 0:x.docs)==null?void 0:w.source},description:{story:`## Data Layer Initialization

**CRITICAL:** Initialize data layer before rendering providers.

### Pattern
\`\`\`tsx
import { initializeDataLayer } from '@iblai/data-layer';
import { LocalStorageService } from '@iblai/web-utils';

export function DataLayerInitializer({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window.__ENV__ !== 'undefined') {
      loadDataLayer();
    } else {
      // Load env.js if not loaded
      const script = document.createElement('script');
      script.src = '/env.js';
      script.async = false;
      script.onload = () => loadDataLayer();
      script.onerror = () => loadDataLayer();
      document.head.appendChild(script);
    }
  }, []);

  const loadDataLayer = () => {
    initializeDataLayer(
      config.dmUrl(),
      config.lmsUrl(),
      LocalStorageService.getInstance(),
      {
        401: () => {
          console.log('[auth-redirect] API returned 401 Unauthorized');
          redirectToAuthSpa(undefined, undefined, true);
        },
        402: () => {
          handle402Error({ error: 'Subscription credit limit reached' });
        },
      }
    );
    setReady(true);
  };

  if (!ready) return null;

  return <>{children}</>;
}
\`\`\``,...(k=(E=a.parameters)==null?void 0:E.docs)==null?void 0:k.description}}};const U=["AuthProviderExample","TenantProviderExample","MentorProviderExample","ProviderComposition","DataLayerInit"];export{e as AuthProviderExample,a as DataLayerInit,t as MentorProviderExample,r as ProviderComposition,n as TenantProviderExample,U as __namedExportsOrder,N as default};
