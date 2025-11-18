import{j as n,M as t}from"./index-4zb4hhJO.js";import{useMDXComponents as o}from"./index-vABTGKhX.js";import"./iframe-_4MvfpVE.js";import"./index-DhY--VwN.js";import"./index-BoxsY6nR.js";import"./index-DgH-xKnr.js";import"./index-DrFu-skq.js";function s(i){const e={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",hr:"hr",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...o(),...i.components};return n.jsxs(n.Fragment,{children:[n.jsx(t,{title:"Getting Started/Introduction"}),`
`,n.jsx(e.h1,{id:"ibl-ai-sdk---complete-documentation",children:"IBL AI SDK - Complete Documentation"}),`
`,n.jsx(e.p,{children:"Welcome to the IBL AI SDK Storybook documentation! This interactive guide contains complete usage documentation for all hooks, utilities, providers, and components."}),`
`,n.jsx(e.h2,{id:"-documentation-navigation",children:"📚 Documentation Navigation"}),`
`,n.jsx(e.h3,{id:"-core-documentation",children:"📖 Core Documentation"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:n.jsx(e.a,{href:"/?path=/docs/usage-guide--docs",children:"Usage Guide"})})," - Complete setup, installation, and usage instructions"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:n.jsx(e.a,{href:"/?path=/docs/examples-real-world-usage--docs",children:"Real-World Examples"})})," - Full application examples (Chat, Analytics, Profile, Subscriptions)"]}),`
`]}),`
`,n.jsx(e.h3,{id:"-data-layer-rtk-query-hooks",children:"🔌 Data Layer (RTK Query Hooks)"}),`
`,n.jsx(e.p,{children:"Learn about API hooks for data fetching and mutations:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:n.jsx(e.a,{href:"/?path=/docs/data-layer-hooks-mentor--docs",children:"Mentor Hooks"})})," - useGetMentorsQuery, useCreateMentorMutation, and more"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:n.jsx(e.a,{href:"/?path=/docs/data-layer-hooks-chat--docs",children:"Chat Hooks"})})," - useSendChatMessageMutation, useGetChatHistoryQuery, and more"]}),`
`]}),`
`,n.jsx(e.h3,{id:"️-web-utils-providers--hooks",children:"🛠️ Web Utils (Providers & Hooks)"}),`
`,n.jsx(e.p,{children:"Discover utilities and custom hooks:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:n.jsx(e.a,{href:"/?path=/docs/web-utils-providers--docs",children:"Providers"})})," - AuthProvider, MentorProvider, TenantProvider"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:n.jsx(e.a,{href:"/?path=/docs/web-utils-hooks--docs",children:"Custom Hooks"})})," - useChatV2, useSubscriptionHandler, useDayJs, and more"]}),`
`]}),`
`,n.jsx(e.h3,{id:"-web-containers-ui-components",children:"🎨 Web Containers (UI Components)"}),`
`,n.jsx(e.p,{children:"Explore pre-built React components:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:n.jsx(e.a,{href:"/?path=/docs/web-containers-ui-components--docs",children:"UI Components"})})," - Account, Analytics, Notifications, Markdown, and more"]}),`
`]}),`
`,n.jsx(e.hr,{}),`
`,n.jsx(e.h1,{id:"ibl-ai-sdk",children:"IBL AI SDK"}),`
`,n.jsx(e.p,{children:"Welcome to the IBL AI SDK component documentation!"}),`
`,n.jsx(e.h2,{id:"what-is-ibl-ai-sdk",children:"What is IBL AI SDK?"}),`
`,n.jsx(e.p,{children:"The IBL AI SDK is a TypeScript SDK for building AI-powered educational applications with the IBL AI Platform. It provides:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Data Layer"}),": RTK Query API slices and hooks for data fetching"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Web Utils"}),": React providers, hooks, and utilities"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Web Containers"}),": React UI components for web applications"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Native Components"}),": React Native components for mobile apps"]}),`
`]}),`
`,n.jsx(e.h2,{id:"installation",children:"Installation"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-bash",children:`npm install @iblai/iblai-js
# or
yarn add @iblai/iblai-js
# or
pnpm add @iblai/iblai-js
`})}),`
`,n.jsx(e.h2,{id:"quick-start",children:"Quick Start"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`import { useGetMentorsQuery, AuthProvider } from '@iblai/iblai-js';

function App() {
  return (
    <AuthProvider>
      <MentorsList />
    </AuthProvider>
  );
}

function MentorsList() {
  const { data, isLoading } = useGetMentorsQuery({
    org: 'my-org',
    limit: 10,
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {data?.results.map((mentor) => (
        <div key={mentor.id}>{mentor.name}</div>
      ))}
    </div>
  );
}
`})}),`
`,n.jsx(e.h2,{id:"component-documentation",children:"Component Documentation"}),`
`,n.jsx(e.p,{children:"This Storybook contains:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Interactive examples"})," of all UI components"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Component props documentation"})," with types"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Usage examples"})," and best practices"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Visual testing"})," of different states and variants"]}),`
`]}),`
`,n.jsx(e.h2,{id:"contributing",children:"Contributing"}),`
`,n.jsx(e.p,{children:"To add a new component:"}),`
`,n.jsxs(e.ol,{children:[`
`,n.jsx(e.li,{children:"Create your component with TypeScript types"}),`
`,n.jsx(e.li,{children:"Add JSDoc comments for all props"}),`
`,n.jsxs(e.li,{children:["Create a ",n.jsx(e.code,{children:".stories.tsx"})," file (see Example/Button)"]}),`
`,n.jsx(e.li,{children:"Document usage and variants"}),`
`,n.jsx(e.li,{children:"Test your component"}),`
`]}),`
`,n.jsxs(e.p,{children:["See the ",n.jsx(e.a,{href:"https://github.com/iblai/iblai-sdk/blob/main/CONTRIBUTING.md",rel:"nofollow",children:"Contributing Guide"})," for details."]}),`
`,n.jsx(e.h2,{id:"resources",children:"Resources"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:n.jsx(e.a,{href:"https://github.com/iblai/iblai-sdk",rel:"nofollow",children:"GitHub Repository"})}),`
`,n.jsx(e.li,{children:n.jsx(e.a,{href:"https://www.npmjs.com/package/@iblai/iblai-js",rel:"nofollow",children:"NPM Package"})}),`
`,n.jsx(e.li,{children:n.jsx(e.a,{href:"https://ibl.ai",rel:"nofollow",children:"IBL AI Platform"})}),`
`]})]})}function p(i={}){const{wrapper:e}={...o(),...i.components};return e?n.jsx(e,{...i,children:n.jsx(s,{...i})}):s(i)}export{p as default};
