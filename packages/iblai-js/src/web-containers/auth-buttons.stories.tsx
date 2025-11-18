import type { Meta, StoryObj } from '@storybook/react';

/**
 * # Authentication Buttons
 *
 * Pre-built button components for authentication flows. These components integrate
 * seamlessly with IBL AI's auth utilities from `@iblai/web-utils`.
 *
 * ## Available Components
 *
 * - `LoginButton` - Handles login and tenant join flows
 * - `SignupButton` - Dedicated signup/registration button
 *
 * ## Features
 * - ✅ Built-in auth redirect handling
 * - ✅ Tenant-specific authentication
 * - ✅ Customizable labels and styling
 * - ✅ TypeScript support
 * - ✅ Integrates with shadcn/ui Button component
 * - ✅ Support for custom onClick handlers
 */
const meta = {
  title: 'Web Containers/Auth Buttons',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Pre-built authentication button components.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * ## LoginButton
 *
 * A versatile button component for handling login and tenant join flows.
 * Automatically redirects to auth SPA with proper context.
 *
 * ![LoginButton Screenshot](../../../public/screenshots/LoginButton.png)
 *
 * ### Props
 * ```typescript
 * interface LoginButtonProps extends ButtonProps {
 *   authUrl: string;                        // Auth SPA base URL
 *   appName: string;                        // App identifier
 *   platformKey?: string;                   // Tenant key
 *   redirectTo?: string;                    // Post-auth redirect
 *   isJoinTenant?: boolean;                 // Use join/signup flow
 *   label?: string;                         // Button text
 *   onClick?: () => void;                   // Custom handler
 *   redirectOptions?: Partial<RedirectToAuthSpaOptions>;
 *   // ... all Button props (variant, size, className, etc.)
 * }
 * ```
 *
 * ### Features
 * - Automatic auth redirect handling
 * - Tenant-specific login support
 * - Join/signup flow option
 * - Custom redirect paths
 * - Full Button component customization
 * - Override with custom onClick
 *
 * ### Usage Examples
 *
 * #### Basic Login Button
 * ```tsx
 * import { LoginButton } from '@iblai/web-containers';
 *
 * function Header() {
 *   return (
 *     <LoginButton
 *       authUrl="https://auth.example.com"
 *       appName="mentor"
 *       label="Log In"
 *     />
 *   );
 * }
 * ```
 *
 * #### Tenant-Specific Login
 * ```tsx
 * import { LoginButton } from '@iblai/web-containers';
 *
 * function TenantLogin({ tenantKey }: { tenantKey: string }) {
 *   return (
 *     <LoginButton
 *       authUrl="https://auth.example.com"
 *       appName="mentor"
 *       platformKey={tenantKey}
 *       label="Log In to University Portal"
 *       className="ibl-button-primary"
 *     />
 *   );
 * }
 * ```
 *
 * #### Join Tenant (Signup)
 * ```tsx
 * import { LoginButton } from '@iblai/web-containers';
 *
 * function JoinButton({ tenantKey }: { tenantKey: string }) {
 *   return (
 *     <LoginButton
 *       authUrl="https://auth.example.com"
 *       appName="mentor"
 *       platformKey={tenantKey}
 *       isJoinTenant
 *       label="Join University"
 *       variant="outline"
 *     />
 *   );
 * }
 * ```
 *
 * #### With Custom Redirect
 * ```tsx
 * import { LoginButton } from '@iblai/web-containers';
 *
 * function CustomRedirectLogin() {
 *   return (
 *     <LoginButton
 *       authUrl="https://auth.example.com"
 *       appName="mentor"
 *       redirectTo="/dashboard"
 *       label="Log In"
 *     />
 *   );
 * }
 * ```
 *
 * #### With Custom Handler
 * ```tsx
 * import { LoginButton } from '@iblai/web-containers';
 *
 * function CustomLogin() {
 *   const handleLogin = () => {
 *     // Track analytics
 *     analytics.track('login_clicked');
 *
 *     // Custom login logic
 *     window.location.href = '/custom-login';
 *   };
 *
 *   return (
 *     <LoginButton
 *       authUrl="https://auth.example.com"
 *       appName="mentor"
 *       onClick={handleLogin}
 *       label="Log In"
 *     />
 *   );
 * }
 * ```
 *
 * #### Complete Navbar Integration
 * ```tsx
 * import { LoginButton } from '@iblai/web-containers';
 * import { isLoggedIn } from '@iblai/web-utils';
 *
 * function NavBar() {
 *   if (isLoggedIn()) {
 *     return <UserMenu />;
 *   }
 *
 *   return (
 *     <div className="flex gap-x-2">
 *       <LoginButton
 *         authUrl="https://auth.example.com"
 *         appName="mentor"
 *         label="Log In"
 *         className="ibl-button-primary"
 *       />
 *       <LoginButton
 *         authUrl="https://auth.example.com"
 *         appName="mentor"
 *         isJoinTenant
 *         label="Sign Up"
 *         variant="outline"
 *       />
 *     </div>
 *   );
 * }
 * ```
 *
 * #### With Advanced Options
 * ```tsx
 * import { LoginButton } from '@iblai/web-containers';
 *
 * function AdvancedLogin() {
 *   return (
 *     <LoginButton
 *       authUrl="https://auth.example.com"
 *       appName="mentor"
 *       platformKey="university"
 *       redirectOptions={{
 *         saveRedirect: true,
 *         redirectPathStorageKey: 'custom_redirect',
 *         queryParams: {
 *           app: 'application',
 *           redirectTo: 'return_url',
 *           tenant: 'org',
 *         },
 *       }}
 *       label="Log In"
 *     />
 *   );
 * }
 * ```
 */
export const LoginButtonExample: Story = {
  render: () => (
    <div style={{ padding: '20px', fontFamily: 'monospace', maxWidth: '800px' }}>
      <h3>LoginButton - Authentication Button</h3>

      <h4>1. Basic Login</h4>
      <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
{`import { LoginButton } from '@iblai/web-containers';

<LoginButton
  authUrl="https://auth.example.com"
  appName="mentor"
  label="Log In"
/>`}
      </pre>

      <h4>2. Tenant-Specific Login</h4>
      <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
{`<LoginButton
  authUrl="https://auth.example.com"
  appName="mentor"
  platformKey="university-tenant"
  label="Log In to University"
  className="ibl-button-primary"
/>`}
      </pre>

      <h4>3. Join Tenant (Signup)</h4>
      <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
{`<LoginButton
  authUrl="https://auth.example.com"
  appName="mentor"
  platformKey="university-tenant"
  isJoinTenant
  label="Join University"
  variant="outline"
/>`}
      </pre>

      <h4>4. Navbar Example</h4>
      <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
{`import { LoginButton } from '@iblai/web-containers';
import { isLoggedIn } from '@iblai/web-utils';

function NavBar() {
  if (isLoggedIn()) {
    return <UserMenu />;
  }

  return (
    <div className="flex gap-x-2">
      <LoginButton
        authUrl="https://auth.example.com"
        appName="mentor"
        label="Log In"
        className="ibl-button-primary"
      />
      <LoginButton
        authUrl="https://auth.example.com"
        appName="mentor"
        isJoinTenant
        label="Sign Up"
        variant="outline"
      />
    </div>
  );
}`}
      </pre>

      <h4>Key Features</h4>
      <ul style={{ lineHeight: '1.8' }}>
        <li>Automatic redirect to auth SPA</li>
        <li>Tenant context preservation</li>
        <li>Join/signup flow support</li>
        <li>Custom redirect paths</li>
        <li>All Button props supported</li>
        <li>Custom onClick override</li>
      </ul>
    </div>
  ),
};

/**
 * ## SignupButton
 *
 * A dedicated button component for user signup/registration flows.
 * Specifically designed for the join/signup flow with tenant context.
 *
 * ![SignupButton Screenshot](../../../public/screenshots/SignUpButton.png)
 *
 * ### Props
 * ```typescript
 * interface SignupButtonProps extends ButtonProps {
 *   authUrl: string;           // Auth SPA base URL
 *   tenantKey?: string;        // Tenant to join
 *   redirectTo?: string;       // Post-signup redirect
 *   label?: string;            // Button text
 *   onClick?: () => void;      // Custom handler
 *   openInNewTab?: boolean;    // Open in new tab
 *   // ... all Button props (variant, size, className, etc.)
 * }
 * ```
 *
 * ### Features
 * - Dedicated signup flow
 * - Tenant-specific registration
 * - New tab option
 * - Custom redirect support
 * - Full Button customization
 *
 * ### Usage Examples
 *
 * #### Basic Signup Button
 * ```tsx
 * import { SignupButton } from '@iblai/web-containers';
 *
 * function Header() {
 *   return (
 *     <SignupButton
 *       authUrl="https://auth.example.com"
 *       label="Sign Up"
 *     />
 *   );
 * }
 * ```
 *
 * #### Join Specific Tenant
 * ```tsx
 * import { SignupButton } from '@iblai/web-containers';
 *
 * function JoinTenant({ tenantKey }: { tenantKey: string }) {
 *   return (
 *     <SignupButton
 *       authUrl="https://auth.example.com"
 *       tenantKey={tenantKey}
 *       label="Join University"
 *       variant="outline"
 *     />
 *   );
 * }
 * ```
 *
 * #### Open in New Tab
 * ```tsx
 * import { SignupButton } from '@iblai/web-containers';
 *
 * function SignupLink() {
 *   return (
 *     <SignupButton
 *       authUrl="https://auth.example.com"
 *       tenantKey="my-tenant"
 *       label="Sign Up (New Tab)"
 *       openInNewTab
 *     />
 *   );
 * }
 * ```
 *
 * #### With Custom Redirect
 * ```tsx
 * import { SignupButton } from '@iblai/web-containers';
 *
 * function GetStarted() {
 *   return (
 *     <SignupButton
 *       authUrl="https://auth.example.com"
 *       tenantKey="university"
 *       redirectTo="https://app.example.com/onboarding"
 *       label="Get Started"
 *       size="lg"
 *     />
 *   );
 * }
 * ```
 *
 * #### CTA Section
 * ```tsx
 * import { SignupButton } from '@iblai/web-containers';
 *
 * function CallToAction() {
 *   return (
 *     <div className="text-center py-12">
 *       <h1>Start Your Journey Today</h1>
 *       <p>Join thousands of learners on our platform</p>
 *       <SignupButton
 *         authUrl="https://auth.example.com"
 *         tenantKey="main"
 *         label="Sign Up for Free"
 *         size="lg"
 *         className="mt-4"
 *       />
 *     </div>
 *   );
 * }
 * ```
 *
 * #### With Analytics Tracking
 * ```tsx
 * import { SignupButton } from '@iblai/web-containers';
 *
 * function TrackedSignup() {
 *   const handleSignupClick = () => {
 *     analytics.track('signup_button_clicked', {
 *       source: 'homepage',
 *       tenant: 'university',
 *     });
 *
 *     // Then proceed with default signup
 *     // Note: Need to manually call redirectToAuthSpaJoinTenant
 *     // or let the button handle it by not providing onClick
 *   };
 *
 *   return (
 *     <SignupButton
 *       authUrl="https://auth.example.com"
 *       tenantKey="university"
 *       label="Sign Up"
 *       // Either use onClick for full control
 *       // or omit it to use default behavior
 *     />
 *   );
 * }
 * ```
 */
export const SignupButtonExample: Story = {
  render: () => (
    <div style={{ padding: '20px', fontFamily: 'monospace', maxWidth: '800px' }}>
      <h3>SignupButton - Registration Button</h3>

      <h4>1. Basic Signup</h4>
      <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
{`import { SignupButton } from '@iblai/web-containers';

<SignupButton
  authUrl="https://auth.example.com"
  label="Sign Up"
/>`}
      </pre>

      <h4>2. Join Tenant</h4>
      <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
{`<SignupButton
  authUrl="https://auth.example.com"
  tenantKey="university-tenant"
  label="Join University"
  variant="outline"
/>`}
      </pre>

      <h4>3. Open in New Tab</h4>
      <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
{`<SignupButton
  authUrl="https://auth.example.com"
  tenantKey="my-tenant"
  label="Sign Up (New Tab)"
  openInNewTab
/>`}
      </pre>

      <h4>4. CTA Section</h4>
      <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
{`<div className="text-center py-12">
  <h1>Start Your Journey Today</h1>
  <p>Join thousands of learners</p>
  <SignupButton
    authUrl="https://auth.example.com"
    tenantKey="main"
    label="Sign Up for Free"
    size="lg"
    className="mt-4"
  />
</div>`}
      </pre>

      <h4>Key Features</h4>
      <ul style={{ lineHeight: '1.8' }}>
        <li>Dedicated signup/registration flow</li>
        <li>Tenant-specific joining</li>
        <li>Open in new tab option</li>
        <li>Custom post-signup redirects</li>
        <li>All Button props supported</li>
      </ul>
    </div>
  ),
};

/**
 * ## Combined Usage
 *
 * Best practices for using LoginButton and SignupButton together.
 *
 * ### Navigation Bar Pattern
 * The most common pattern is displaying both buttons in the navigation bar
 * for unauthenticated users.
 *
 * ```tsx
 * import { LoginButton, SignupButton } from '@iblai/web-containers';
 * import { isLoggedIn } from '@iblai/web-utils';
 *
 * function NavBar() {
 *   const authenticated = isLoggedIn();
 *
 *   if (authenticated) {
 *     return (
 *       <nav>
 *         <Logo />
 *         <UserMenu />
 *       </nav>
 *     );
 *   }
 *
 *   return (
 *     <nav>
 *       <Logo />
 *       <div className="ml-auto flex gap-x-2">
 *         <LoginButton
 *           authUrl="https://auth.example.com"
 *           appName="mentor"
 *           label="Log In"
 *           className="ibl-button-primary"
 *         />
 *         <SignupButton
 *           authUrl="https://auth.example.com"
 *           label="Sign Up for Free"
 *           variant="outline"
 *         />
 *       </div>
 *     </nav>
 *   );
 * }
 * ```
 *
 * ### Landing Page Pattern
 * Using both buttons in a marketing/landing page context.
 *
 * ```tsx
 * import { LoginButton, SignupButton } from '@iblai/web-containers';
 *
 * function Hero() {
 *   return (
 *     <div className="hero-section">
 *       <h1>Transform Your Learning Experience</h1>
 *       <p>Join our AI-powered education platform today</p>
 *       <div className="flex gap-4 justify-center mt-6">
 *         <SignupButton
 *           authUrl="https://auth.example.com"
 *           label="Get Started Free"
 *           size="lg"
 *         />
 *         <LoginButton
 *           authUrl="https://auth.example.com"
 *           appName="mentor"
 *           label="Log In"
 *           variant="ghost"
 *           size="lg"
 *         />
 *       </div>
 *     </div>
 *   );
 * }
 * ```
 *
 * ### Conditional Tenant Flow
 * Showing different buttons based on tenant context.
 *
 * ```tsx
 * import { LoginButton, SignupButton } from '@iblai/web-containers';
 *
 * function TenantAuth({ tenantKey, requiresJoin }: {
 *   tenantKey: string;
 *   requiresJoin: boolean;
 * }) {
 *   if (requiresJoin) {
 *     return (
 *       <div>
 *         <p>You need to join {tenantKey} to continue</p>
 *         <SignupButton
 *           authUrl="https://auth.example.com"
 *           tenantKey={tenantKey}
 *           label="Join Now"
 *         />
 *       </div>
 *     );
 *   }
 *
 *   return (
 *     <div className="flex gap-2">
 *       <LoginButton
 *         authUrl="https://auth.example.com"
 *         appName="mentor"
 *         platformKey={tenantKey}
 *         label="Log In"
 *       />
 *       <SignupButton
 *         authUrl="https://auth.example.com"
 *         tenantKey={tenantKey}
 *         label="Sign Up"
 *         variant="outline"
 *       />
 *     </div>
 *   );
 * }
 * ```
 */
export const CombinedUsageExample: Story = {
  render: () => (
    <div style={{ padding: '20px', fontFamily: 'monospace', maxWidth: '800px' }}>
      <h3>Combined Usage - Navigation Bar Pattern</h3>

      <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
{`import { LoginButton, SignupButton } from '@iblai/web-containers';
import { isLoggedIn } from '@iblai/web-utils';

function NavBar() {
  if (isLoggedIn()) {
    return (
      <nav>
        <Logo />
        <UserMenu />
      </nav>
    );
  }

  return (
    <nav>
      <Logo />
      <div className="ml-auto flex gap-x-2">
        <LoginButton
          authUrl="https://auth.example.com"
          appName="mentor"
          label="Log In"
          className="ibl-button-primary"
        />
        <SignupButton
          authUrl="https://auth.example.com"
          label="Sign Up for Free"
          variant="outline"
        />
      </div>
    </nav>
  );
}`}
      </pre>

      <h4>Landing Page Hero</h4>
      <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
{`function Hero() {
  return (
    <div className="hero-section">
      <h1>Transform Your Learning</h1>
      <p>Join our AI-powered platform</p>
      <div className="flex gap-4 mt-6">
        <SignupButton
          authUrl="https://auth.example.com"
          label="Get Started Free"
          size="lg"
        />
        <LoginButton
          authUrl="https://auth.example.com"
          appName="mentor"
          label="Log In"
          variant="ghost"
          size="lg"
        />
      </div>
    </div>
  );
}`}
      </pre>

      <h4>Best Practices</h4>
      <ul style={{ lineHeight: '1.8' }}>
        <li>Place login button first (primary action)</li>
        <li>Use contrasting button variants (primary + outline)</li>
        <li>Check authentication state before rendering</li>
        <li>Provide tenant context when available</li>
        <li>Use consistent authUrl across both buttons</li>
      </ul>
    </div>
  ),
};
