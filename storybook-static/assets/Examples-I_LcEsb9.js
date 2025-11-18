import{j as n,M as r}from"./index-4zb4hhJO.js";import{useMDXComponents as s}from"./index-vABTGKhX.js";import"./iframe-_4MvfpVE.js";import"./index-DhY--VwN.js";import"./index-BoxsY6nR.js";import"./index-DgH-xKnr.js";import"./index-DrFu-skq.js";function t(a){const e={a:"a",blockquote:"blockquote",code:"code",h1:"h1",h2:"h2",h3:"h3",hr:"hr",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...s(),...a.components};return n.jsxs(n.Fragment,{children:[n.jsx(r,{title:"Examples/Real World Usage"}),`
`,n.jsx(e.h1,{id:"real-world-examples",children:"Real-World Examples"}),`
`,n.jsx(e.p,{children:"Complete examples showing how to build common features with the IBL AI SDK."}),`
`,n.jsxs(e.blockquote,{children:[`
`,n.jsxs(e.p,{children:[n.jsx(e.strong,{children:"Note:"})," Provider props are simplified in these examples for readability. In production, providers require specific props. See the ",n.jsx(e.a,{href:"/?path=/docs/web-utils-providers--authproviderexample",children:n.jsx(e.strong,{children:"Providers documentation"})})," for complete AuthProvider, TenantProvider, and MentorProvider setup with all required props."]}),`
`]}),`
`,n.jsx(e.h2,{id:"example-1-complete-chat-application",children:"Example 1: Complete Chat Application"}),`
`,n.jsx(e.p,{children:"Build a full-featured chat interface with AI mentors."}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`// ChatApp.tsx
import {
  AuthProvider,
  MentorProvider,
  useChatV2,
  useAuth,
  Markdown,
  Loader,
} from '@iblai/iblai-js';
import { Provider } from 'react-redux';
import { store } from './store';

// Main App Component
export function ChatApp() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <MentorProvider mentorKey="math-tutor" platform="my-platform">
          <ChatInterface />
        </MentorProvider>
      </AuthProvider>
    </Provider>
  );
}

// Chat Interface Component
function ChatInterface() {
  const { user, isAuthenticated } = useAuth();
  const [input, setInput] = useState('');
  const [files, setFiles] = useState<File[]>([]);

  const {
    messages,
    sendMessage,
    isLoading,
    isTyping,
    error,
    clearMessages,
  } = useChatV2({
    mentorKey: 'math-tutor',
    userId: user?.id || '',
    platform: user?.platform || '',
  });

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const handleSend = async () => {
    if (!input.trim()) return;

    try {
      await sendMessage(input, files);
      setInput('');
      setFiles([]);
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-container">
      {/* Header */}
      <div className="chat-header">
        <h2>Math Tutor</h2>
        <button onClick={clearMessages}>Clear Chat</button>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={\`message message-\${message.role}\`}
          >
            <div className="message-content">
              <Markdown content={message.content} />
            </div>
            <div className="message-time">
              {new Date(message.createdAt).toLocaleTimeString()}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="message message-assistant">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}

        {error && (
          <div className="error-message">
            {error.message}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="chat-input">
        {files.length > 0 && (
          <div className="file-list">
            {files.map((file, i) => (
              <div key={i} className="file-item">
                {file.name}
                <button onClick={() => setFiles(files.filter((_, idx) => idx !== i))}>
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="input-row">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question..."
            disabled={isLoading}
          />

          <input
            type="file"
            id="file-upload"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files || []))}
            style={{ display: 'none' }}
          />
          <label htmlFor="file-upload" className="file-button">
            📎
          </label>

          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="send-button"
          >
            {isLoading ? <Loader size="small" /> : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}
`})}),`
`,n.jsx(e.h3,{id:"styles",children:"Styles"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-css",children:`/* ChatApp.css */
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 800px;
  margin: 0 auto;
}

.chat-header {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message {
  display: flex;
  flex-direction: column;
  max-width: 70%;
}

.message-user {
  align-self: flex-end;
  background: #3b82f6;
  color: white;
  border-radius: 1rem 1rem 0 1rem;
}

.message-assistant {
  align-self: flex-start;
  background: #f3f4f6;
  border-radius: 1rem 1rem 1rem 0;
}

.message-content {
  padding: 0.75rem 1rem;
}

.message-time {
  font-size: 0.75rem;
  opacity: 0.7;
  padding: 0 1rem 0.5rem;
}

.typing-indicator {
  display: flex;
  gap: 0.25rem;
  padding: 1rem;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background: #9ca3af;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;
}

.typing-indicator span:nth-child(1) {
  animation-delay: -0.32s;
}

.typing-indicator span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

.chat-input {
  border-top: 1px solid #e5e7eb;
  padding: 1rem;
}

.file-list {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
}

.file-item {
  background: #f3f4f6;
  padding: 0.25rem 0.75rem;
  border-radius: 0.5rem;
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.input-row {
  display: flex;
  gap: 0.5rem;
  align-items: flex-end;
}

.input-row textarea {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  resize: none;
  min-height: 60px;
}

.send-button {
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  min-width: 80px;
}

.send-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
`})}),`
`,n.jsx(e.hr,{}),`
`,n.jsx(e.h2,{id:"example-2-analytics-dashboard",children:"Example 2: Analytics Dashboard"}),`
`,n.jsx(e.p,{children:"Build a comprehensive analytics dashboard with filters and charts."}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`// AnalyticsDashboard.tsx
import {
  TenantProvider,
  AuthProvider,
  AnalyticsOverview,
  AnalyticsFinancialStats,
  AnalyticsUsersStats,
  ChartFiltersProvider,
  useAuth,
  useDayJs,
} from '@iblai/iblai-js';
import { Provider } from 'react-redux';
import { store } from './store';

export function AnalyticsApp() {
  return (
    <Provider store={store}>
      <TenantProvider tenantId="my-platform">
        <AuthProvider>
          <DashboardLayout />
        </AuthProvider>
      </TenantProvider>
    </Provider>
  );
}

function DashboardLayout() {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    end: new Date(),
  });

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="dashboard">
      <DashboardHeader
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      <ChartFiltersProvider>
        <div className="dashboard-content">
          {/* Overview Section */}
          <section className="dashboard-section">
            <h2>Overview</h2>
            <AnalyticsOverview
              platformId={user.platform}
              dateRange={dateRange}
            />
          </section>

          {/* Financial Section */}
          <section className="dashboard-section">
            <h2>Financial Metrics</h2>
            <AnalyticsFinancialStats
              platformId={user.platform}
              dateRange={dateRange}
            />
          </section>

          {/* User Engagement */}
          <section className="dashboard-section">
            <h2>User Engagement</h2>
            <AnalyticsUsersStats
              platformId={user.platform}
              dateRange={dateRange}
            />
          </section>

          {/* Custom Metrics */}
          <section className="dashboard-section">
            <h2>Custom Metrics</h2>
            <CustomMetrics
              platformId={user.platform}
              dateRange={dateRange}
            />
          </section>
        </div>
      </ChartFiltersProvider>
    </div>
  );
}

function DashboardHeader({ dateRange, onDateRangeChange }) {
  const { formatDate } = useDayJs();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const presets = [
    { label: 'Last 7 days', days: 7 },
    { label: 'Last 30 days', days: 30 },
    { label: 'Last 90 days', days: 90 },
    { label: 'Last year', days: 365 },
  ];

  const handlePreset = (days: number) => {
    onDateRangeChange({
      start: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
      end: new Date(),
    });
    setShowDatePicker(false);
  };

  return (
    <header className="dashboard-header">
      <h1>Analytics Dashboard</h1>

      <div className="date-range-selector">
        <button onClick={() => setShowDatePicker(!showDatePicker)}>
          {formatDate(dateRange.start, 'MMM DD')} -{' '}
          {formatDate(dateRange.end, 'MMM DD, YYYY')}
          <span className="dropdown-icon">▼</span>
        </button>

        {showDatePicker && (
          <div className="date-picker-dropdown">
            <div className="presets">
              {presets.map((preset) => (
                <button
                  key={preset.days}
                  onClick={() => handlePreset(preset.days)}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <div className="custom-range">
              <label>
                From:
                <input
                  type="date"
                  value={dateRange.start.toISOString().split('T')[0]}
                  onChange={(e) =>
                    onDateRangeChange({
                      ...dateRange,
                      start: new Date(e.target.value),
                    })
                  }
                />
              </label>
              <label>
                To:
                <input
                  type="date"
                  value={dateRange.end.toISOString().split('T')[0]}
                  onChange={(e) =>
                    onDateRangeChange({
                      ...dateRange,
                      end: new Date(e.target.value),
                    })
                  }
                />
              </label>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

function CustomMetrics({ platformId, dateRange }) {
  const { data, isLoading } = useGetAnalyticsQuery({
    platform: platformId,
    start: dateRange.start.toISOString(),
    end: dateRange.end.toISOString(),
  });

  if (isLoading) return <Loader />;

  return (
    <div className="metrics-grid">
      <StatCard
        title="Total Sessions"
        value={data?.totalSessions.toLocaleString()}
        trend={\`\${data?.sessionGrowth > 0 ? '+' : ''}\${data?.sessionGrowth}%\`}
        description="vs previous period"
      />

      <StatCard
        title="Active Users"
        value={data?.activeUsers.toLocaleString()}
        trend={\`\${data?.userGrowth > 0 ? '+' : ''}\${data?.userGrowth}%\`}
        description="vs previous period"
      />

      <StatCard
        title="Avg. Session Duration"
        value={\`\${Math.round(data?.avgDuration / 60)} min\`}
        trend={\`\${data?.durationChange > 0 ? '+' : ''}\${data?.durationChange}%\`}
        description="vs previous period"
      />
    </div>
  );
}
`})}),`
`,n.jsx(e.hr,{}),`
`,n.jsx(e.h2,{id:"example-3-user-profile-management",children:"Example 3: User Profile Management"}),`
`,n.jsx(e.p,{children:"Complete user profile with settings, billing, and preferences."}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`// ProfileApp.tsx
import {
  AuthProvider,
  TenantProvider,
  Account,
  Security,
  Billing,
  useAuth,
  useUserProfileUpdate,
  useProfileImageUpload,
  toast,
} from '@iblai/iblai-js';
import { Provider } from 'react-redux';
import { store } from './store';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@iblai/iblai-js';

export function ProfileApp() {
  return (
    <Provider store={store}>
      <TenantProvider tenantId="my-platform">
        <AuthProvider>
          <ProfilePage />
        </AuthProvider>
      </TenantProvider>
    </Provider>
  );
}

function ProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('account');

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Settings</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <Account
            userId={user.id}
            platform={user.platform}
            onUpdate={(updatedUser) => {
              toast.success('Profile updated successfully!');
            }}
          />
        </TabsContent>

        <TabsContent value="security">
          <Security userId={user.id} platform={user.platform} />
        </TabsContent>

        <TabsContent value="billing">
          <Billing userId={user.id} platform={user.platform} />
        </TabsContent>

        <TabsContent value="preferences">
          <PreferencesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PreferencesTab() {
  const { user } = useAuth();
  const { updateProfile, isUpdating } = useUserProfileUpdate();
  const [preferences, setPreferences] = useState({
    language: user?.preferences?.language || 'en',
    timezone: user?.preferences?.timezone || 'UTC',
    emailNotifications: user?.preferences?.emailNotifications !== false,
    marketingEmails: user?.preferences?.marketingEmails === true,
  });

  const handleSave = async () => {
    try {
      await updateProfile({ preferences });
      toast.success('Preferences saved!');
    } catch (error) {
      toast.error('Failed to save preferences');
    }
  };

  return (
    <div className="preferences-form">
      <h2>Preferences</h2>

      <div className="form-group">
        <label>Language</label>
        <select
          value={preferences.language}
          onChange={(e) =>
            setPreferences({ ...preferences, language: e.target.value })
          }
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
        </select>
      </div>

      <div className="form-group">
        <label>Timezone</label>
        <select
          value={preferences.timezone}
          onChange={(e) =>
            setPreferences({ ...preferences, timezone: e.target.value })
          }
        >
          <option value="UTC">UTC</option>
          <option value="America/New_York">Eastern Time</option>
          <option value="America/Los_Angeles">Pacific Time</option>
          <option value="Europe/London">London</option>
        </select>
      </div>

      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={preferences.emailNotifications}
            onChange={(e) =>
              setPreferences({
                ...preferences,
                emailNotifications: e.target.checked,
              })
            }
          />
          <span>Email notifications</span>
        </label>
      </div>

      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={preferences.marketingEmails}
            onChange={(e) =>
              setPreferences({
                ...preferences,
                marketingEmails: e.target.checked,
              })
            }
          />
          <span>Marketing emails</span>
        </label>
      </div>

      <button onClick={handleSave} disabled={isUpdating}>
        {isUpdating ? 'Saving...' : 'Save Preferences'}
      </button>
    </div>
  );
}
`})}),`
`,n.jsx(e.hr,{}),`
`,n.jsx(e.h2,{id:"example-4-subscription-management",children:"Example 4: Subscription Management"}),`
`,n.jsx(e.p,{children:"Complete subscription flow with plan selection and payment."}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`// SubscriptionApp.tsx
import {
  AuthProvider,
  useSubscriptionHandler,
  useAuth,
  toast,
  Loader,
} from '@iblai/iblai-js';
import { Provider } from 'react-redux';
import { store } from './store';

export function SubscriptionApp() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <SubscriptionPage />
      </AuthProvider>
    </Provider>
  );
}

function SubscriptionPage() {
  const { user } = useAuth();
  const {
    subscription,
    hasActiveSubscription,
    subscribe,
    cancelSubscription,
    plans,
    isLoading,
  } = useSubscriptionHandler();

  if (isLoading) {
    return <Loader size="large" text="Loading subscription data..." />;
  }

  if (!hasActiveSubscription) {
    return <PlanSelection plans={plans} onSubscribe={subscribe} />;
  }

  return (
    <ActiveSubscription
      subscription={subscription}
      onCancel={cancelSubscription}
    />
  );
}

function PlanSelection({ plans, onSubscribe }) {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const handleSubscribe = async () => {
    if (!selectedPlan) return;

    try {
      await onSubscribe(selectedPlan.id, billingCycle);
      toast.success('Successfully subscribed!');
    } catch (error) {
      toast.error('Subscription failed. Please try again.');
    }
  };

  return (
    <div className="plan-selection">
      <h1>Choose Your Plan</h1>

      <div className="billing-toggle">
        <button
          className={billingCycle === 'monthly' ? 'active' : ''}
          onClick={() => setBillingCycle('monthly')}
        >
          Monthly
        </button>
        <button
          className={billingCycle === 'annual' ? 'active' : ''}
          onClick={() => setBillingCycle('annual')}
        >
          Annual
          <span className="badge">Save 20%</span>
        </button>
      </div>

      <div className="plans-grid">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={\`plan-card \${selectedPlan?.id === plan.id ? 'selected' : ''}\`}
            onClick={() => setSelectedPlan(plan)}
          >
            <h3>{plan.name}</h3>
            <div className="price">
              <span className="amount">
                \${billingCycle === 'monthly' ? plan.monthlyPrice : plan.annualPrice}
              </span>
              <span className="period">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
            </div>

            <ul className="features">
              {plan.features.map((feature, i) => (
                <li key={i}>
                  <span className="check">✓</span> {feature}
                </li>
              ))}
            </ul>

            {selectedPlan?.id === plan.id && (
              <div className="selected-badge">Selected</div>
            )}
          </div>
        ))}
      </div>

      <button
        className="subscribe-button"
        onClick={handleSubscribe}
        disabled={!selectedPlan}
      >
        Subscribe to {selectedPlan?.name || 'Selected Plan'}
      </button>
    </div>
  );
}

function ActiveSubscription({ subscription, onCancel }) {
  const { formatDate } = useDayJs();
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const handleCancel = async () => {
    try {
      await onCancel();
      toast.success('Subscription cancelled');
      setShowCancelDialog(false);
    } catch (error) {
      toast.error('Failed to cancel subscription');
    }
  };

  return (
    <div className="subscription-details">
      <h1>Your Subscription</h1>

      <div className="current-plan">
        <h2>{subscription.planName}</h2>
        <p className="status">Status: <strong>{subscription.status}</strong></p>
        <p className="renewal">
          {subscription.status === 'active'
            ? \`Renews on \${formatDate(subscription.renewalDate, 'MMM DD, YYYY')}\`
            : \`Expires on \${formatDate(subscription.expiryDate, 'MMM DD, YYYY')}\`
          }
        </p>
      </div>

      <div className="subscription-actions">
        <button onClick={() => window.location.href = '/billing'}>
          Update Payment Method
        </button>
        <button
          className="danger"
          onClick={() => setShowCancelDialog(true)}
        >
          Cancel Subscription
        </button>
      </div>

      {showCancelDialog && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Cancel Subscription?</h3>
            <p>
              Are you sure you want to cancel your subscription? You'll lose access
              to premium features at the end of your billing period.
            </p>
            <div className="modal-actions">
              <button onClick={() => setShowCancelDialog(false)}>
                Keep Subscription
              </button>
              <button className="danger" onClick={handleCancel}>
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
`})}),`
`,n.jsx(e.hr,{}),`
`,n.jsx(e.h2,{id:"best-practices",children:"Best Practices"}),`
`,n.jsx(e.h3,{id:"1-error-handling",children:"1. Error Handling"}),`
`,n.jsx(e.p,{children:"Always handle errors gracefully:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`function RobustComponent() {
  const { data, isLoading, error, refetch } = useGetDataQuery();

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <div className="error-state">
        <h3>Something went wrong</h3>
        <p>{error.message}</p>
        <button onClick={refetch}>Try Again</button>
      </div>
    );
  }

  return <DataDisplay data={data} />;
}
`})}),`
`,n.jsx(e.h3,{id:"2-loading-states",children:"2. Loading States"}),`
`,n.jsx(e.p,{children:"Provide clear loading feedback:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`function ButtonWithLoading() {
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async () => {
    setIsLoading(true);
    try {
      await performAction();
      toast.success('Success!');
    } catch (error) {
      toast.error('Failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button onClick={handleAction} disabled={isLoading}>
      {isLoading ? (
        <>
          <Spinner size="small" /> Processing...
        </>
      ) : (
        'Submit'
      )}
    </button>
  );
}
`})}),`
`,n.jsx(e.h3,{id:"3-optimistic-updates",children:"3. Optimistic Updates"}),`
`,n.jsx(e.p,{children:"Use optimistic updates for better UX:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`function TodoItem({ todo }) {
  const [updateTodo] = useUpdateTodoMutation();

  const handleToggle = async () => {
    // Optimistically update UI
    const optimisticUpdate = { ...todo, completed: !todo.completed };

    try {
      await updateTodo(optimisticUpdate).unwrap();
    } catch (error) {
      // Revert on error
      toast.error('Failed to update');
    }
  };

  return (
    <div className="todo-item">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={handleToggle}
      />
      <span>{todo.title}</span>
    </div>
  );
}
`})}),`
`,n.jsx(e.h3,{id:"4-type-safety",children:"4. Type Safety"}),`
`,n.jsx(e.p,{children:"Always use TypeScript for type safety:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`import type { User, Mentor, ChatMessage } from '@iblai/iblai-js';

interface ChatProps {
  mentor: Mentor;
  user: User;
  onMessageSent?: (message: ChatMessage) => void;
}

function TypeSafeChat({ mentor, user, onMessageSent }: ChatProps) {
  // TypeScript ensures type safety
  const { sendMessage } = useChatV2({
    mentorKey: mentor.key,
    userId: user.id,
    platform: user.platform,
  });

  // ...
}
`})}),`
`,n.jsx(e.hr,{}),`
`,n.jsx(e.h2,{id:"next-steps",children:"Next Steps"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Explore individual component documentation in the sidebar"}),`
`,n.jsxs(e.li,{children:["Check out the ",n.jsx(e.a,{href:"/?path=/docs/usage-guide--docs",children:"API Reference"})]}),`
`,n.jsxs(e.li,{children:["Review ",n.jsx(e.a,{href:"/?path=/docs/usage-guide--docs#best-practices",children:"best practices"})]}),`
`,n.jsxs(e.li,{children:["Join our ",n.jsx(e.a,{href:"https://github.com/iblai/iblai-sdk",rel:"nofollow",children:"community"})]}),`
`]})]})}function m(a={}){const{wrapper:e}={...s(),...a.components};return e?n.jsx(e,{...a,children:n.jsx(t,{...a})}):t(a)}export{m as default};
