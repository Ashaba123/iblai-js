import{j as e,M as t}from"./index-4zb4hhJO.js";import{useMDXComponents as r}from"./index-vABTGKhX.js";import"./iframe-_4MvfpVE.js";import"./index-DhY--VwN.js";import"./index-BoxsY6nR.js";import"./index-DgH-xKnr.js";import"./index-DrFu-skq.js";function s(i){const n={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...r(),...i.components};return e.jsxs(e.Fragment,{children:[e.jsx(t,{title:"Usage Guide"}),`
`,e.jsx(n.h1,{id:"ibl-ai-sdk-usage-guide",children:"IBL AI SDK Usage Guide"}),`
`,e.jsx(n.p,{children:"Welcome to the IBL AI SDK! This comprehensive SDK provides everything you need to build powerful AI-powered education applications."}),`
`,e.jsx(n.h2,{id:"package-overview",children:"Package Overview"}),`
`,e.jsx(n.p,{children:"The SDK re-exports from three core packages:"}),`
`,e.jsxs(n.h3,{id:"-data-layer-iblaidata-layer",children:["📊 Data Layer (",e.jsx(n.code,{children:"@iblai/data-layer"}),")"]}),`
`,e.jsx(n.p,{children:"RTK Query API slices and hooks for data fetching and state management."}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Key Features:"})}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"API Hooks"}),": Pre-built hooks for all IBL AI Platform endpoints"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Automatic Caching"}),": Built-in request caching and deduplication"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Type Safety"}),": Full TypeScript support with auto-generated types"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Optimistic Updates"}),": Instant UI updates with automatic rollback on errors"]}),`
`]}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Common Use Cases:"})}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Fetching mentor data"}),`
`,e.jsx(n.li,{children:"Managing chat sessions"}),`
`,e.jsx(n.li,{children:"User authentication"}),`
`,e.jsx(n.li,{children:"Analytics and reporting"}),`
`]}),`
`,e.jsxs(n.h3,{id:"️-web-utils-iblaiweb-utils",children:["🛠️ Web Utils (",e.jsx(n.code,{children:"@iblai/web-utils"}),")"]}),`
`,e.jsx(n.p,{children:"Utilities, providers, and custom hooks for React applications."}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Key Features:"})}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Context Providers"}),": AuthProvider, MentorProvider, TenantProvider"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Custom Hooks"}),": Chat management, subscriptions, profile updates"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Utilities"}),": Date formatting, platform detection, helpers"]}),`
`]}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Common Use Cases:"})}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Setting up authentication"}),`
`,e.jsx(n.li,{children:"Managing application state"}),`
`,e.jsx(n.li,{children:"Building chat interfaces"}),`
`,e.jsx(n.li,{children:"Handling subscriptions"}),`
`]}),`
`,e.jsxs(n.h3,{id:"-web-containers-iblaiweb-containers",children:["🎨 Web Containers (",e.jsx(n.code,{children:"@iblai/web-containers"}),")"]}),`
`,e.jsx(n.p,{children:"Pre-built React components and UI containers."}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Key Features:"})}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Profile Components"}),": Account settings, billing, security"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Analytics Components"}),": Charts, stats, reports"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"UI Components"}),": Buttons, modals, forms (built with shadcn/ui)"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Notification System"}),": Toast notifications and alerts"]}),`
`]}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Common Use Cases:"})}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Building user profiles"}),`
`,e.jsx(n.li,{children:"Displaying analytics dashboards"}),`
`,e.jsx(n.li,{children:"Creating admin interfaces"}),`
`,e.jsx(n.li,{children:"Showing notifications"}),`
`]}),`
`,e.jsx(n.h2,{id:"installation",children:"Installation"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-bash",children:`npm install @iblai/iblai-js
# or
pnpm add @iblai/iblai-js
# or
yarn add @iblai/iblai-js
`})}),`
`,e.jsx(n.h2,{id:"peer-dependencies",children:"Peer Dependencies"}),`
`,e.jsx(n.p,{children:"You'll need to install these peer dependencies:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-bash",children:`npm install @reduxjs/toolkit react react-dom react-redux
`})}),`
`,e.jsx(n.h2,{id:"quick-start",children:"Quick Start"}),`
`,e.jsx(n.h3,{id:"1-set-up-redux-store",children:"1. Set up Redux Store"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { apiSlice } from '@iblai/iblai-js';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

setupListeners(store.dispatch);
`})}),`
`,e.jsx(n.h3,{id:"2-wrap-your-app-with-providers",children:"2. Wrap Your App with Providers"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`import { Provider } from 'react-redux';
import { AuthProvider, TenantProvider, MentorProvider, LocalStorageService, ANONYMOUS_USERNAME } from '@iblai/iblai-js';
import { store } from './store';

function App() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const fullPathname = pathname + (searchParams.toString() ? \`?\${searchParams.toString()}\` : '');

  return (
    <Provider store={store}>
      <AuthProvider
        redirectToAuthSpa={redirectToAuthSpa}
        hasNonExpiredAuthToken={hasNonExpiredAuthToken}
        username={username || ''}
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
            redirectToNoMentorsPage={() => router.push('/no-mentors')}
            redirectToCreateMentor={() => router.push('/create-mentor')}
            redirectToMentor={(id) => router.push(\`/mentor/\${id}\`)}
            onLoadMentorsPermissions={(perms) => console.log('Loaded permissions:', perms)}
            fallback={<Spinner />}
          >
            <YourApp />
          </MentorProvider>
        </TenantProvider>
      </AuthProvider>
    </Provider>
  );
}
`})}),`
`,e.jsx(n.h3,{id:"3-use-hooks-in-your-components",children:"3. Use Hooks in Your Components"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`import { useGetMentorsQuery, useAuth } from '@iblai/iblai-js';

function MentorsList() {
  const { user } = useAuth();
  const { data: mentors, isLoading, error } = useGetMentorsQuery({
    platform: user?.platform,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading mentors</div>;

  return (
    <div>
      {mentors?.map((mentor) => (
        <div key={mentor.id}>{mentor.name}</div>
      ))}
    </div>
  );
}
`})}),`
`,e.jsx(n.h2,{id:"documentation-structure",children:"Documentation Structure"}),`
`,e.jsx(n.h3,{id:"data-layer",children:"Data Layer"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:e.jsx(n.a,{href:"/?path=/docs/data-layer-hooks-mentor--docs",children:"RTK Query Hooks"})})," - API hooks for data fetching"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:e.jsx(n.a,{href:"/?path=/docs/data-layer-constants--docs",children:"Constants"})})," - API endpoints and configuration"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:e.jsx(n.a,{href:"/?path=/docs/data-layer-types--docs",children:"Types"})})," - TypeScript type definitions"]}),`
`]}),`
`,e.jsx(n.h3,{id:"web-utils",children:"Web Utils"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:e.jsx(n.a,{href:"/?path=/docs/web-utils-providers-authprovider--docs",children:"Providers"})})," - Context providers for state management"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:e.jsx(n.a,{href:"/?path=/docs/web-utils-hooks-usechat--docs",children:"Hooks"})})," - Custom React hooks"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:e.jsx(n.a,{href:"/?path=/docs/web-utils-utilities-helpers--docs",children:"Utilities"})})," - Helper functions and utilities"]}),`
`]}),`
`,e.jsx(n.h3,{id:"web-containers",children:"Web Containers"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:e.jsx(n.a,{href:"/?path=/docs/web-containers-profile-account--docs",children:"Profile Components"})})," - User profile and settings"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:e.jsx(n.a,{href:"/?path=/docs/web-containers-analytics-overview--docs",children:"Analytics Components"})})," - Charts and statistics"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:e.jsx(n.a,{href:"/?path=/docs/web-containers-ui-button--docs",children:"UI Components"})})," - Reusable UI elements"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:e.jsx(n.a,{href:"/?path=/docs/web-containers-notifications-toast--docs",children:"Notifications"})})," - Notification system"]}),`
`]}),`
`,e.jsx(n.h2,{id:"best-practices",children:"Best Practices"}),`
`,e.jsx(n.h3,{id:"1-always-use-typescript",children:"1. Always Use TypeScript"}),`
`,e.jsx(n.p,{children:"The SDK is built with TypeScript and provides full type safety. Always enable strict mode:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-json",children:`{
  "compilerOptions": {
    "strict": true
  }
}
`})}),`
`,e.jsx(n.h3,{id:"2-handle-loading-and-error-states",children:"2. Handle Loading and Error States"}),`
`,e.jsx(n.p,{children:"Always handle loading and error states when using API hooks:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`const { data, isLoading, error, isFetching } = useGetMentorsQuery(params);

if (isLoading) return <Spinner />;
if (error) return <ErrorMessage error={error} />;
if (!data) return null;

// Render your component
`})}),`
`,e.jsx(n.h3,{id:"3-use-optimistic-updates",children:"3. Use Optimistic Updates"}),`
`,e.jsx(n.p,{children:"For better UX, use optimistic updates for mutations:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`const [updateMentor] = useUpdateMentorMutation();

await updateMentor({
  id: mentorId,
  // Optimistic update will show changes immediately
  ...updates,
});
`})}),`
`,e.jsx(n.h3,{id:"4-leverage-caching",children:"4. Leverage Caching"}),`
`,e.jsx(n.p,{children:"RTK Query automatically caches responses. Use tags for cache invalidation:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`// The mutation automatically invalidates the cache
const [deleteMentor] = useDeleteMentorMutation();
await deleteMentor(mentorId);
// useGetMentorsQuery will automatically refetch
`})}),`
`,e.jsx(n.h2,{id:"common-patterns",children:"Common Patterns"}),`
`,e.jsx(n.h3,{id:"authentication-flow",children:"Authentication Flow"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`import { AuthProvider, useAuth } from '@iblai/iblai-js';

function LoginButton() {
  const { login, logout, user, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <button onClick={logout}>Logout {user.email}</button>;
  }

  return <button onClick={() => login(credentials)}>Login</button>;
}
`})}),`
`,e.jsx(n.h3,{id:"chat-integration",children:"Chat Integration"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`import { useChatV2 } from '@iblai/iblai-js';

function ChatInterface() {
  const {
    messages,
    sendMessage,
    isLoading,
  } = useChatV2({
    mentorId: 'mentor-id',
    userId: 'user-id',
  });

  return (
    <div>
      {messages.map(msg => <Message key={msg.id} {...msg} />)}
      <ChatInput onSend={sendMessage} disabled={isLoading} />
    </div>
  );
}
`})}),`
`,e.jsx(n.h3,{id:"analytics-dashboard",children:"Analytics Dashboard"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`import { AnalyticsOverview, ChartFiltersProvider } from '@iblai/iblai-js';

function Dashboard() {
  return (
    <ChartFiltersProvider>
      <AnalyticsOverview platformId="platform-id" />
    </ChartFiltersProvider>
  );
}
`})}),`
`,e.jsx(n.h2,{id:"support-and-resources",children:"Support and Resources"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:e.jsx(n.a,{href:"https://docs.ibl.ai",rel:"nofollow",children:"API Documentation"})})," - Complete API reference"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:e.jsx(n.a,{href:"https://github.com/iblai/iblai-sdk",rel:"nofollow",children:"GitHub"})})," - Source code and issues"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:e.jsx(n.a,{href:"https://github.com/iblai/iblai-sdk/tree/main/examples",rel:"nofollow",children:"Examples"})})," - Sample applications"]}),`
`]}),`
`,e.jsx(n.h2,{id:"next-steps",children:"Next Steps"}),`
`,e.jsx(n.p,{children:"Explore the stories in the sidebar to see detailed documentation and examples for each exported item."})]})}function p(i={}){const{wrapper:n}={...r(),...i.components};return n?e.jsx(n,{...i,children:e.jsx(s,{...i})}):s(i)}export{p as default};
