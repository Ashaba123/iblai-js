import type { Meta, StoryObj } from '@storybook/react';

/**
 * # UI Components
 *
 * Pre-built React components from `@iblai/web-containers`.
 *
 * ## Component Categories
 *
 * ### Profile & User Management
 * - `Account` - User account settings
 * - `Security` - Security and privacy settings
 * - `Billing` - Subscription and billing management
 * - `Organization` - Organization settings
 * - `UserProfileModal` - User profile editor modal
 * - `UserProfileDropdown` - User menu dropdown
 *
 * ### Analytics & Data Visualization
 * - `AnalyticsOverview` - Analytics dashboard
 * - `AnalyticsFinancialStats` - Financial statistics
 * - `AnalyticsTopicsStats` - Topic analytics
 * - `AnalyticsUsersStats` - User analytics
 * - `StatCard` - Statistics card component
 *
 * ### Notifications
 * - `NotificationDropdown` - Notification bell and dropdown
 * - `NotificationDisplay` - Single notification display
 * - `SendNotificationDialog` - Send notification form
 *
 * ### UI Elements
 * - `Button` - Customizable button component
 * - `Input` - Form input component
 * - `Modal/Dialog` - Modal dialogs
 * - `Spinner/Loader` - Loading indicators
 * - `Toast` - Toast notifications
 *
 * ### Utilities
 * - `Markdown` - Markdown renderer
 * - `RichTextEditor` - Rich text editor
 * - `SearchableMultiSelect` - Multi-select with search
 * - `TenantSwitch` - Tenant/platform switcher
 */
const meta = {
  title: 'Web Containers/UI Components',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Pre-built React components for IBL AI applications.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * ## Account Component
 *
 * User account settings interface with profile editing, email management, and preferences.
 *
 * ![Account Component Screenshot](../../../public/screenshots/Account.png)
 *
 * ### Props
 * ```typescript
 * interface AccountProps {
 *   userId: string;              // User ID
 *   platform: string;            // Platform ID
 *   onUpdate?: (user: User) => void;  // Update callback
 * }
 * ```
 *
 * ### Features
 * - ✅ Profile information editing
 * - ✅ Email address management
 * - ✅ Profile image upload
 * - ✅ Password change
 * - ✅ Account preferences
 *
 * ### Example
 * ```tsx
 * import { Account } from '@iblai/iblai-js';
 *
 * function AccountSettings() {
 *   const { user } = useAuth();
 *
 *   return (
 *     <Account
 *       userId={user.id}
 *       platform={user.platform}
 *       onUpdate={(updatedUser) => {
 *         console.log('User updated:', updatedUser);
 *       }}
 *     />
 *   );
 * }
 * ```
 */
export const AccountComponent: Story = {
  render: () => (
    <div style={{ padding: '20px', fontFamily: 'monospace', maxWidth: '800px' }}>
      <h3>Account Component</h3>

      <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
{`import { Account } from '@iblai/iblai-js';

function UserSettings() {
  const { user } = useAuth();

  return (
    <div className="settings-container">
      <h1>Account Settings</h1>
      <Account
        userId={user.id}
        platform={user.platform}
        onUpdate={(updatedUser) => {
          // Handle user update
          console.log('Profile updated:', updatedUser);
          showToast('Profile updated successfully!');
        }}
      />
    </div>
  );
}`}
      </pre>

      <p><strong>Included Features:</strong></p>
      <ul style={{ lineHeight: '1.8' }}>
        <li>Profile photo upload with preview</li>
        <li>First name, last name, bio editing</li>
        <li>Email address management</li>
        <li>Password change form</li>
        <li>Account preferences (language, timezone, notifications)</li>
      </ul>
    </div>
  ),
};

/**
 * ## Analytics Components
 *
 * Pre-built analytics and data visualization components.
 *
 * ![Analytics Components Screenshot](../../../public/screenshots/Analytics.png)
 *
 * ### AnalyticsOverview
 * Complete analytics dashboard with charts and statistics.
 *
 * ```typescript
 * interface AnalyticsOverviewProps {
 *   platformId: string;           // Platform to analyze
 *   dateRange?: {                 // Optional date filter
 *     start: Date;
 *     end: Date;
 *   };
 * }
 * ```
 *
 * ### Example - Full Dashboard
 * ```tsx
 * import {
 *   AnalyticsOverview,
 *   ChartFiltersProvider
 * } from '@iblai/iblai-js';
 *
 * function AnalyticsDashboard() {
 *   return (
 *     <ChartFiltersProvider>
 *       <AnalyticsOverview platformId="my-platform" />
 *     </ChartFiltersProvider>
 *   );
 * }
 * ```
 *
 * ### Individual Analytics Components
 * ```tsx
 * import {
 *   AnalyticsFinancialStats,
 *   AnalyticsUsersStats,
 *   AnalyticsTopicsStats,
 * } from '@iblai/iblai-js';
 *
 * function CustomDashboard() {
 *   return (
 *     <div className="dashboard">
 *       <AnalyticsFinancialStats platformId="my-platform" />
 *       <AnalyticsUsersStats platformId="my-platform" />
 *       <AnalyticsTopicsStats platformId="my-platform" />
 *     </div>
 *   );
 * }
 * ```
 */
export const AnalyticsComponents: Story = {
  render: () => (
    <div style={{ padding: '20px', fontFamily: 'monospace', maxWidth: '800px' }}>
      <h3>Analytics Components</h3>

      <h4>Complete Dashboard</h4>
      <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
{`import {
  AnalyticsOverview,
  ChartFiltersProvider
} from '@iblai/iblai-js';

function Dashboard() {
  return (
    <ChartFiltersProvider>
      <AnalyticsOverview
        platformId="my-platform"
        dateRange={{
          start: new Date('2024-01-01'),
          end: new Date('2024-01-31'),
        }}
      />
    </ChartFiltersProvider>
  );
}`}
      </pre>

      <h4>Individual Components</h4>
      <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
{`import {
  AnalyticsFinancialStats,
  AnalyticsUsersStats,
  AnalyticsTopicsStats,
  StatCard,
} from '@iblai/iblai-js';

function CustomAnalytics() {
  return (
    <div className="analytics-grid">
      {/* Financial metrics */}
      <AnalyticsFinancialStats platformId="my-platform" />

      {/* User engagement */}
      <AnalyticsUsersStats platformId="my-platform" />

      {/* Topic popularity */}
      <AnalyticsTopicsStats platformId="my-platform" />

      {/* Custom stat card */}
      <StatCard
        title="Total Sessions"
        value="12,345"
        trend="+12.5%"
        description="vs last month"
      />
    </div>
  );
}`}
      </pre>

      <p><strong>Available Charts:</strong></p>
      <ul style={{ lineHeight: '1.8' }}>
        <li>Line charts for trends over time</li>
        <li>Bar charts for comparisons</li>
        <li>Pie charts for distribution</li>
        <li>Heatmaps for activity patterns</li>
        <li>Custom stat cards with trends</li>
      </ul>
    </div>
  ),
};

/**
 * ## Notification Components
 *
 * Notification system with dropdown, display, and management.
 *
 * ![Notification Components Screenshot](../../../public/screenshots/Notification.png)
 *
 * ### NotificationDropdown
 * Bell icon with notification counter and dropdown list.
 *
 * ```typescript
 * interface NotificationDropdownProps {
 *   userId: string;
 *   platform: string;
 *   onNotificationClick?: (notification: Notification) => void;
 * }
 * ```
 *
 * ### Example
 * ```tsx
 * import { NotificationDropdown } from '@iblai/iblai-js';
 *
 * function AppHeader() {
 *   return (
 *     <header>
 *       <Logo />
 *       <Navigation />
 *       <NotificationDropdown
 *         userId="user-123"
 *         platform="my-platform"
 *         onNotificationClick={(notification) => {
 *           // Mark as read and navigate
 *           markAsRead(notification.id);
 *           navigate(notification.link);
 *         }}
 *       />
 *       <UserMenu />
 *     </header>
 *   );
 * }
 * ```
 *
 * ### Toast Notifications
 * ```tsx
 * import { toast } from '@iblai/iblai-js';
 *
 * function SaveButton() {
 *   const handleSave = async () => {
 *     try {
 *       await saveData();
 *       toast.success('Saved successfully!');
 *     } catch (error) {
 *       toast.error('Failed to save');
 *     }
 *   };
 *
 *   return <button onClick={handleSave}>Save</button>;
 * }
 * ```
 */
export const NotificationComponents: Story = {
  render: () => (
    <div style={{ padding: '20px', fontFamily: 'monospace', maxWidth: '800px' }}>
      <h3>Notification Components</h3>

      <h4>Notification Dropdown</h4>
      <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
{`import { NotificationDropdown } from '@iblai/iblai-js';

function Header() {
  const { user } = useAuth();

  return (
    <header>
      <NotificationDropdown
        userId={user.id}
        platform={user.platform}
        onNotificationClick={(notification) => {
          // Handle notification click
          if (notification.link) {
            navigate(notification.link);
          }
        }}
      />
    </header>
  );
}`}
      </pre>

      <h4>Toast Notifications</h4>
      <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
{`import { toast, Toaster } from '@iblai/iblai-js';

// In your App component
function App() {
  return (
    <>
      <YourApp />
      <Toaster position="top-right" />
    </>
  );
}

// In any component
function ActionButton() {
  const handleAction = async () => {
    try {
      await performAction();
      toast.success('Action completed!');
    } catch (error) {
      toast.error('Action failed');
    }
  };

  return <button onClick={handleAction}>Do Action</button>;
}

// Advanced usage
toast.promise(
  asyncOperation(),
  {
    loading: 'Processing...',
    success: 'Done!',
    error: 'Failed!',
  }
);`}
      </pre>
    </div>
  ),
};

/**
 * ## Markdown Component
 *
 * Render markdown content with syntax highlighting and copy buttons.
 *
 * ### Props
 * ```typescript
 * interface MarkdownProps {
 *   content: string;              // Markdown content
 *   className?: string;           // Custom CSS class
 *   components?: Record<string, React.ComponentType>; // Custom components
 * }
 * ```
 *
 * ### Features
 * - ✅ Full markdown syntax support
 * - ✅ Syntax highlighting for code blocks
 * - ✅ Copy to clipboard for code
 * - ✅ Custom component rendering
 * - ✅ Sanitized HTML output
 *
 * ### Example
 * ```tsx
 * import { Markdown } from '@iblai/iblai-js';
 *
 * function DocumentViewer({ content }: { content: string }) {
 *   return (
 *     <div className="document">
 *       <Markdown content={content} />
 *     </div>
 *   );
 * }
 * ```
 *
 * ### Custom Components
 * ```tsx
 * function CustomMarkdown({ content }) {
 *   return (
 *     <Markdown
 *       content={content}
 *       components={{
 *         // Custom heading renderer
 *         h1: ({ children }) => (
 *           <h1 className="custom-heading">{children}</h1>
 *         ),
 *         // Custom code block
 *         code: ({ children, className }) => (
 *           <CodeBlock language={className} code={children} />
 *         ),
 *       }}
 *     />
 *   );
 * }
 * ```
 */
export const MarkdownComponent: Story = {
  render: () => (
    <div style={{ padding: '20px', fontFamily: 'monospace', maxWidth: '800px' }}>
      <h3>Markdown Component</h3>

      <h4>Basic Usage</h4>
      <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
{`import { Markdown } from '@iblai/iblai-js';

function ChatMessage({ message }) {
  return (
    <div className="message">
      <Markdown content={message.content} />
    </div>
  );
}

// Supports full markdown:
const content = \`
# Heading 1
## Heading 2

**Bold text** and *italic text*

- Bullet list
- Item 2

\\\`\\\`\\\`javascript
function hello() {
  console.log('Hello world');
}
\\\`\\\`\\\`

[Link](https://example.com)
\`;`}
      </pre>

      <h4>With Custom Components</h4>
      <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
{`function CustomMarkdown({ content }) {
  return (
    <Markdown
      content={content}
      components={{
        // Custom link renderer
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="custom-link"
          >
            {children} →
          </a>
        ),
        // Custom code block with copy button
        code: (props) => (
          <CodeBlock {...props} showCopyButton />
        ),
      }}
    />
  );
}`}
      </pre>

      <p><strong>Supported Features:</strong></p>
      <ul style={{ lineHeight: '1.8' }}>
        <li>Headings (h1-h6)</li>
        <li>Bold, italic, strikethrough</li>
        <li>Lists (ordered and unordered)</li>
        <li>Code blocks with syntax highlighting</li>
        <li>Tables</li>
        <li>Links and images</li>
        <li>Blockquotes</li>
        <li>HTML sanitization for security</li>
      </ul>
    </div>
  ),
};

/**
 * ## RichTextEditor
 *
 * WYSIWYG editor for rich text content.
 *
 * ### Props
 * ```typescript
 * interface RichTextEditorProps {
 *   initialContent?: string;       // Initial HTML content
 *   onChange: (html: string) => void; // Change callback
 *   placeholder?: string;          // Placeholder text
 *   readOnly?: boolean;            // Read-only mode
 * }
 * ```
 *
 * ### Features
 * - ✅ Formatting toolbar (bold, italic, underline, etc.)
 * - ✅ Headings and lists
 * - ✅ Link insertion
 * - ✅ Undo/redo
 * - ✅ Markdown shortcuts
 *
 * ### Example
 * ```tsx
 * import { RichTextEditor } from '@iblai/iblai-js';
 *
 * function ArticleEditor() {
 *   const [content, setContent] = useState('');
 *
 *   const handleSave = async () => {
 *     await saveArticle({ content });
 *   };
 *
 *   return (
 *     <div>
 *       <RichTextEditor
 *         initialContent={content}
 *         onChange={setContent}
 *         placeholder="Start writing..."
 *       />
 *       <button onClick={handleSave}>Save Article</button>
 *     </div>
 *   );
 * }
 * ```
 */
export const RichTextEditorComponent: Story = {
  render: () => (
    <div style={{ padding: '20px', fontFamily: 'monospace', maxWidth: '800px' }}>
      <h3>RichTextEditor Component</h3>

      <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
{`import { RichTextEditor } from '@iblai/iblai-js';

function ContentEditor() {
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveContent({ html: content });
      toast.success('Saved!');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="editor-container">
      <RichTextEditor
        initialContent={content}
        onChange={setContent}
        placeholder="Start writing your content..."
      />

      <div className="editor-actions">
        <button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
}`}
      </pre>

      <p><strong>Toolbar Features:</strong></p>
      <ul style={{ lineHeight: '1.8' }}>
        <li>Text formatting (bold, italic, underline, strikethrough)</li>
        <li>Headings (H1-H6)</li>
        <li>Lists (bullet and numbered)</li>
        <li>Link insertion and editing</li>
        <li>Text alignment</li>
        <li>Undo/Redo</li>
        <li>Markdown shortcuts (**, *, #, etc.)</li>
      </ul>
    </div>
  ),
};

/**
 * ## Loader/Spinner Components
 *
 * Loading indicators for async operations.
 *
 * ![Loading Components Screenshot](../../../public/screenshots/Loading.png)
 *
 * ### Loader
 * ```tsx
 * import { Loader } from '@iblai/iblai-js';
 *
 * function LoadingPage() {
 *   return (
 *     <div className="page">
 *       <Loader size="large" text="Loading data..." />
 *     </div>
 *   );
 * }
 * ```
 *
 * ### Inline Spinner
 * ```tsx
 * function SaveButton() {
 *   const [isSaving, setIsSaving] = useState(false);
 *
 *   return (
 *     <button disabled={isSaving}>
 *       {isSaving && <Spinner size="small" />}
 *       {isSaving ? 'Saving...' : 'Save'}
 *     </button>
 *   );
 * }
 * ```
 */
export const LoaderComponents: Story = {
  render: () => (
    <div style={{ padding: '20px', fontFamily: 'monospace', maxWidth: '800px' }}>
      <h3>Loader Components</h3>

      <h4>Full Page Loader</h4>
      <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
{`import { Loader } from '@iblai/iblai-js';

function DataPage() {
  const { data, isLoading } = useGetDataQuery();

  if (isLoading) {
    return <Loader size="large" text="Loading data..." />;
  }

  return <DataDisplay data={data} />;
}`}
      </pre>

      <h4>Button with Spinner</h4>
      <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
{`import { Spinner } from '@iblai/iblai-js';

function ActionButton() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <button disabled={isLoading}>
      {isLoading && <Spinner size="small" className="mr-2" />}
      {isLoading ? 'Processing...' : 'Submit'}
    </button>
  );
}`}
      </pre>

      <p><strong>Available Sizes:</strong> small, medium, large</p>
    </div>
  ),
};
