const H={title:"Web Utils/Hooks",parameters:{layout:"centered",docs:{description:{component:"Custom React hooks for common IBL AI functionality."}}},tags:["autodocs"]},e={render:()=>React.createElement("div",{style:{padding:"20px",fontFamily:"monospace",maxWidth:"800px"}},React.createElement("h3",null,"useAdvancedChat - Production Pattern"),React.createElement("pre",{style:{background:"#f5f5f5",padding:"15px",borderRadius:"4px",overflow:"auto",fontSize:"11px"}},`import { useAdvancedChat, ANONYMOUS_USERNAME } from '@iblai/web-utils';

const {
  messages,
  currentStreamingMessage,
  isStreaming,
  isPending,
  sendMessage,
  stopGenerating,
  startNewChat,
  sessionId,
  activeTab,
  enabledGuidedPrompts,
} = useAdvancedChat({
  mentorId,
  mode: 'chat',
  stopGenerationWsUrl: \`\${config.baseWsUrl()}/ws/langflow-stop-generation/\`,
  tenantKey,
  token: axdToken,
  username: username ?? ANONYMOUS_USERNAME,
  wsUrl: \`\${config.baseWsUrl()}/ws/langflow/\`,
  errorHandler: async (message) => {
    toast.error(
      <ToastErrorMessage message={message} supportEmail={supportEmail} />,
      { closeButton: true, duration: 5000 }
    );
  },
  redirectToAuthSpa,
  isPreviewMode: isPreview || (!!visitingTenant && isLoggedIn() && !allowAnonymous),
  on402Error: handle402Error,
  cachedSessionId: getCachedSessionId(),
  onStartNewChat: (sessionId) => {
    dispatch(chatActions.updateSessionIds(sessionId));
    saveCachedSessionId(sessionId);
  },
});

// Send message with files
const handleSend = (content: string) => {
  const fileReferences = attachedFiles
    .filter(f => f.uploadStatus === 'success' && f.fileKey && f.fileId)
    .map(f => ({
      file_id: f.fileId!,
      file_key: f.fileKey!,
      file_name: f.fileName,
      content_type: f.fileType,
      file_size: f.fileSize,
      upload_url: f.fileUrl || f.uploadUrl,
    }));

  sendMessage(activeTab, content, {
    visible: true,
    fileReferences: fileReferences.length > 0 ? fileReferences : undefined,
  });

  // Clear files after sending
  if (fileReferences.length > 0) {
    dispatch(clearFiles(undefined));
  }
};`),React.createElement("h4",null,"Key Features"),React.createElement("ul",{style:{lineHeight:"1.8"}},React.createElement("li",null,"Streaming responses via WebSocket"),React.createElement("li",null,"File attachment support"),React.createElement("li",null,"Session persistence"),React.createElement("li",null,"Error handling with custom toast components"),React.createElement("li",null,"402 error handling for subscriptions"),React.createElement("li",null,"Preview mode to disable sending"),React.createElement("li",null,"Tab switching (chat/search)"),React.createElement("li",null,"Guided prompts")))},n={render:()=>React.createElement("div",{style:{padding:"20px",fontFamily:"monospace",maxWidth:"800px"}},React.createElement("h3",null,"useMentorTools Hook"),React.createElement("pre",{style:{background:"#f5f5f5",padding:"15px",borderRadius:"4px",overflow:"auto"}},`import { useMentorTools, ANONYMOUS_USERNAME } from '@iblai/web-utils';

const {
  enableWebBrowsing,
  updateSessionTools,
  activeTools,
  deepResearch,
  imageGeneration,
  codeInterpreter,
} = useMentorTools({
  mentorId,
  tenantKey,
  username: username ?? ANONYMOUS_USERNAME,
  errorHandler: async (message) => {
    toast.error(message);
  },
});

// Toggle single tool
<Checkbox
  checked={enableWebBrowsing}
  onCheckedChange={() => updateSessionTools('web_browsing')}
/>

// activeTools is array: ['web_browsing', 'deep_research']`))},t={render:()=>React.createElement("div",{style:{padding:"20px",fontFamily:"monospace",maxWidth:"800px"}},React.createElement("h3",null,"useChatFileUpload Hook"),React.createElement("pre",{style:{background:"#f5f5f5",padding:"15px",borderRadius:"4px",overflow:"auto"}},`import { useChatFileUpload } from '@iblai/web-utils';
import { useAppSelector } from '@/lib/hooks';

const { uploadFiles, retryUpload } = useChatFileUpload({
  org: tenantKey,
  userId: username,
  errorHandler: (error) => toast.error(error),
  capabilities: {
    supportsFileUpload: true,
    allSupportedTypes: ['pdf', 'docx', 'txt', 'png', 'jpg'],
    maxFileSizeMB: 10,
    maxFilesPerMessage: 5,
  },
});

// Files are in Redux state
const attachedFiles = useAppSelector((state) => state.files.attachedFiles);

// Upload files
const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
  const files = Array.from(e.target.files || []);
  await uploadFiles(files); // Validates, uploads to S3, updates Redux
};

// When sending message, filter successful uploads
const fileReferences = attachedFiles
  .filter(f => f.uploadStatus === 'success' && f.fileKey && f.fileId)
  .map(f => ({
    file_id: f.fileId!,
    file_key: f.fileKey!,
    file_name: f.fileName,
    content_type: f.fileType,
    file_size: f.fileSize,
    upload_url: f.fileUrl || f.uploadUrl,
  }));`))},a={render:()=>React.createElement("div",{style:{padding:"20px",fontFamily:"monospace",maxWidth:"800px"}},React.createElement("h3",null,"useTenantMetadata Hook"),React.createElement("pre",{style:{background:"#f5f5f5",padding:"15px",borderRadius:"4px",overflow:"auto"}},`import { useTenantMetadata } from '@iblai/web-utils';

const { metadata, platformName, metadataLoaded } = useTenantMetadata({
  org: tenantKey
});

// Always check metadataLoaded before using
if (!metadataLoaded) {
  return <Spinner />;
}

// Access nested metadata
const title = metadata?.auth_web_skillsai?.title?.trim();
const logo = metadata?.auth_web_skillsai?.logo;
const primaryColor = metadata?.auth_web_skillsai?.primaryColor;

// Fallback chain
const displayTitle = useMemo(() => {
  const preferredTitle = metadata?.auth_web_skillsai?.title?.trim();
  if (preferredTitle) return preferredTitle;
  if (platformName?.trim()) return platformName;
  return 'Default Title';
}, [metadata, platformName]);`))},r={render:()=>React.createElement("div",{style:{padding:"20px",fontFamily:"monospace",maxWidth:"800px"}},React.createElement("h3",null,"useDayJs Hook"),React.createElement("pre",{style:{background:"#f5f5f5",padding:"15px",borderRadius:"4px",overflow:"auto"}},`import { useDayJs } from '@iblai/web-utils';

const {
  getTimeDifferenceBetweenTwoDates,
  getDayJSDurationObjFromSeconds,
  generateFutureDateForNMinutes,
} = useDayJs();

// Get time difference
const diff = getTimeDifferenceBetweenTwoDates(
  futureDate,
  pastDate,
  "second"
);

// Convert seconds to duration object
const duration = getDayJSDurationObjFromSeconds(120);

// Generate future date
const futureDate = generateFutureDateForNMinutes(30);`))},s={render:()=>React.createElement("div",{style:{padding:"20px",fontFamily:"monospace",maxWidth:"800px"}},React.createElement("h3",null,"useSubscriptionHandlerV2 Hook"),React.createElement("pre",{style:{background:"#f5f5f5",padding:"15px",borderRadius:"4px",overflow:"auto",fontSize:"11px"}},`import {
  useSubscriptionHandlerV2,
  MentorSubscriptionFlowV2
} from '@iblai/web-utils';

// Create subscription flow instance
const subscriptionFlow = new MentorSubscriptionFlowV2({
  platformName: config.iblPlatform(),
  currentTenantKey: currentTenant?.key || '',
  username: getUserName(),
  currentTenantOrg: currentTenant?.org || '',
  userTenants,
  isAdmin: currentTenant?.is_admin || false,
  mainTenantKey: config.mainTenantKey(),
  userEmail: getUserEmail(),
  dispatch,
  topBannerOptions,
  mentorUrl: config.mentorUrl(),
});

const { handleSubscriptionCheck, CREDIT_INTERVAL_CHECK_COUNTER } =
  useSubscriptionHandlerV2(subscriptionFlow);

// Set up interval checking
useEffect(() => {
  handleSubscriptionCheck(); // Check immediately

  const intervalId = setInterval(() => {
    handleSubscriptionCheck();
  }, CREDIT_INTERVAL_CHECK_COUNTER);

  return () => clearInterval(intervalId);
}, [error402Detected]);`))};var o,i,l,d,c;e.parameters={...e.parameters,docs:{...(o=e.parameters)==null?void 0:o.docs,source:{originalSource:`{
  render: () => <div style={{
    padding: '20px',
    fontFamily: 'monospace',
    maxWidth: '800px'
  }}>
      <h3>useAdvancedChat - Production Pattern</h3>

      <pre style={{
      background: '#f5f5f5',
      padding: '15px',
      borderRadius: '4px',
      overflow: 'auto',
      fontSize: '11px'
    }}>
      {\`import { useAdvancedChat, ANONYMOUS_USERNAME } from '@iblai/web-utils';

const {
  messages,
  currentStreamingMessage,
  isStreaming,
  isPending,
  sendMessage,
  stopGenerating,
  startNewChat,
  sessionId,
  activeTab,
  enabledGuidedPrompts,
} = useAdvancedChat({
  mentorId,
  mode: 'chat',
  stopGenerationWsUrl: \\\`\\\${config.baseWsUrl()}/ws/langflow-stop-generation/\\\`,
  tenantKey,
  token: axdToken,
  username: username ?? ANONYMOUS_USERNAME,
  wsUrl: \\\`\\\${config.baseWsUrl()}/ws/langflow/\\\`,
  errorHandler: async (message) => {
    toast.error(
      <ToastErrorMessage message={message} supportEmail={supportEmail} />,
      { closeButton: true, duration: 5000 }
    );
  },
  redirectToAuthSpa,
  isPreviewMode: isPreview || (!!visitingTenant && isLoggedIn() && !allowAnonymous),
  on402Error: handle402Error,
  cachedSessionId: getCachedSessionId(),
  onStartNewChat: (sessionId) => {
    dispatch(chatActions.updateSessionIds(sessionId));
    saveCachedSessionId(sessionId);
  },
});

// Send message with files
const handleSend = (content: string) => {
  const fileReferences = attachedFiles
    .filter(f => f.uploadStatus === 'success' && f.fileKey && f.fileId)
    .map(f => ({
      file_id: f.fileId!,
      file_key: f.fileKey!,
      file_name: f.fileName,
      content_type: f.fileType,
      file_size: f.fileSize,
      upload_url: f.fileUrl || f.uploadUrl,
    }));

  sendMessage(activeTab, content, {
    visible: true,
    fileReferences: fileReferences.length > 0 ? fileReferences : undefined,
  });

  // Clear files after sending
  if (fileReferences.length > 0) {
    dispatch(clearFiles(undefined));
  }
};\`}
      </pre>

      <h4>Key Features</h4>
      <ul style={{
      lineHeight: '1.8'
    }}>
        <li>Streaming responses via WebSocket</li>
        <li>File attachment support</li>
        <li>Session persistence</li>
        <li>Error handling with custom toast components</li>
        <li>402 error handling for subscriptions</li>
        <li>Preview mode to disable sending</li>
        <li>Tab switching (chat/search)</li>
        <li>Guided prompts</li>
      </ul>
    </div>
}`,...(l=(i=e.parameters)==null?void 0:i.docs)==null?void 0:l.source},description:{story:`## useAdvancedChat

Complete chat interface hook with streaming, tools, file uploads, and session management.

### Parameters
\`\`\`typescript
{
  mentorId: string;                    // Mentor unique ID
  mode?: 'chat' | 'search';           // Chat mode
  stopGenerationWsUrl: string;         // WebSocket URL for stopping generation
  tenantKey: string;                   // Current tenant
  token?: string;                      // Auth token
  username: string;                    // Username or ANONYMOUS_USERNAME
  wsUrl: string;                       // WebSocket URL for chat
  errorHandler: (message: string) => Promise<void>; // Error callback
  redirectToAuthSpa: () => void;
  sendMessageToParentWebsite?: (data: any) => void; // For iframe communication
  isPreviewMode?: boolean;             // Disable actual sending
  mentorShareableToken?: string;       // Token for shared mentors
  on402Error?: (error: { error: string }) => void; // Credit limit handler
  cachedSessionId?: string;            // Resume session
  onStartNewChat?: (sessionId: string) => void; // New session callback
}
\`\`\`

### Returns
\`\`\`typescript
{
  // State
  messages: Message[];
  currentStreamingMessage: Message | null;
  isStreaming: boolean;
  isPending: boolean;
  sessionId: string | null;

  // Tabs
  activeTab: 'chat' | 'search';
  changeTab: (tab: 'chat' | 'search') => void;

  // Mentor info
  mentorName: string;
  profileImage: string;
  uniqueMentorId: string;

  // Features
  enabledGuidedPrompts: string[];
  enableSafetyDisclaimer: boolean;

  // Actions
  sendMessage: (tab: string, content: string, options?: SendOptions) => void;
  setMessage: (content: string) => void;
  stopGenerating: () => void;
  startNewChat: () => void;
}
\`\`\`

### Example - Full Setup
\`\`\`tsx
import { useAdvancedChat, ANONYMOUS_USERNAME } from '@iblai/web-utils';
import { config } from '@/config';
import { toast } from 'sonner';

function ChatInterface() {
  const {
    messages,
    currentStreamingMessage,
    isStreaming,
    isPending,
    sendMessage,
    stopGenerating,
    startNewChat,
    sessionId,
    activeTab,
    changeTab,
    enabledGuidedPrompts,
  } = useAdvancedChat({
    mentorId: 'mentor-123',
    mode: 'chat',
    stopGenerationWsUrl: \\\`\\\${config.baseWsUrl()}/ws/langflow-stop-generation/\\\`,
    tenantKey: 'my-platform',
    token: authToken,
    username: username || ANONYMOUS_USERNAME,
    wsUrl: \\\`\\\${config.baseWsUrl()}/ws/langflow/\\\`,
    errorHandler: async (message) => {
      toast.error(
        <ToastErrorMessage message={message} supportEmail={config.supportEmail()} />,
        { closeButton: true, duration: 5000 }
      );
    },
    redirectToAuthSpa,
    isPreviewMode: isPreview,
    on402Error: (error) => {
      // Handle subscription/credit errors
      console.error('402 Error:', error);
      router.push('/billing');
    },
    cachedSessionId: getCachedSessionId(),
    onStartNewChat: (sessionId) => {
      // Save session ID
      saveCachedSessionId(sessionId);
      dispatch(chatActions.updateSessionIds(sessionId));
    },
  });

  const handleSend = (content: string, fileReferences?: FileReference[]) => {
    sendMessage(activeTab, content, {
      visible: true,
      fileReferences,
    });
  };

  return (
    <div>
      {/ Tab switcher /}
      <div>
        <button onClick={() => changeTab('chat')}>Chat</button>
        <button onClick={() => changeTab('search')}>Search</button>
      </div>

      {/ Messages /}
      <div>
        {messages.map(msg => (
          <Message key={msg.id} {...msg} />
        ))}
        {(isPending || isStreaming) && !currentStreamingMessage && (
          <LoadingMessage />
        )}
        {currentStreamingMessage && (
          <StreamingMessage content={currentStreamingMessage.content} />
        )}
      </div>

      {/ Input /}
      <ChatInput
        onSend={handleSend}
        disabled={isStreaming || isPending}
        guidedPrompts={enabledGuidedPrompts}
      />

      {/ Actions /}
      {isStreaming && (
        <button onClick={stopGenerating}>Stop Generating</button>
      )}
      <button onClick={startNewChat}>New Chat</button>
    </div>
  );
}
\`\`\``,...(c=(d=e.parameters)==null?void 0:d.docs)==null?void 0:c.description}}};var p,u,m,f,g;n.parameters={...n.parameters,docs:{...(p=n.parameters)==null?void 0:p.docs,source:{originalSource:`{
  render: () => <div style={{
    padding: '20px',
    fontFamily: 'monospace',
    maxWidth: '800px'
  }}>
      <h3>useMentorTools Hook</h3>

      <pre style={{
      background: '#f5f5f5',
      padding: '15px',
      borderRadius: '4px',
      overflow: 'auto'
    }}>
      {\`import { useMentorTools, ANONYMOUS_USERNAME } from '@iblai/web-utils';

const {
  enableWebBrowsing,
  updateSessionTools,
  activeTools,
  deepResearch,
  imageGeneration,
  codeInterpreter,
} = useMentorTools({
  mentorId,
  tenantKey,
  username: username ?? ANONYMOUS_USERNAME,
  errorHandler: async (message) => {
    toast.error(message);
  },
});

// Toggle single tool
<Checkbox
  checked={enableWebBrowsing}
  onCheckedChange={() => updateSessionTools('web_browsing')}
/>

// activeTools is array: ['web_browsing', 'deep_research']\`}
      </pre>
    </div>
}`,...(m=(u=n.parameters)==null?void 0:u.docs)==null?void 0:m.source},description:{story:`## useMentorTools

Manage mentor tool capabilities (web browsing, deep research, image generation, etc.).

### Parameters
\`\`\`typescript
{
  mentorId: string;
  tenantKey: string;
  username: string;                    // Username or ANONYMOUS_USERNAME
  errorHandler: (message: string) => Promise<void>;
}
\`\`\`

### Returns
\`\`\`typescript
{
  // Tool flags
  enableWebBrowsing: boolean;
  screenSharing: boolean;
  deepResearch: boolean;
  imageGeneration: boolean;
  codeInterpreter: boolean;
  promptsIsEnabled: boolean;
  googleSlidesIsEnabled: boolean;
  googleDocumentIsEnabled: boolean;

  // Active tools list
  activeTools: string[];               // Array of enabled tool names

  // Actions
  updateSessionTools: (tool: string) => void; // Toggle single tool
  setSessionTools: (tools: string[]) => void; // Set multiple tools
}
\`\`\`

### Example
\`\`\`tsx
import { useMentorTools, ANONYMOUS_USERNAME } from '@iblai/web-utils';

function MentorToolsPanel() {
  const {
    enableWebBrowsing,
    updateSessionTools,
    setSessionTools,
    activeTools,
    screenSharing,
    deepResearch,
    imageGeneration,
    codeInterpreter,
  } = useMentorTools({
    mentorId: 'mentor-123',
    tenantKey: 'my-platform',
    username: username ?? ANONYMOUS_USERNAME,
    errorHandler: async (message) => {
      toast.error(message, { duration: 5000 });
    },
  });

  return (
    <div>
      <h3>Available Tools</h3>

      <label>
        <input
          type="checkbox"
          checked={enableWebBrowsing}
          onChange={() => updateSessionTools('web_browsing')}
        />
        Web Browsing
      </label>

      <label>
        <input
          type="checkbox"
          checked={deepResearch}
          onChange={() => updateSessionTools('deep_research')}
        />
        Deep Research
      </label>

      <label>
        <input
          type="checkbox"
          checked={imageGeneration}
          onChange={() => updateSessionTools('image_generation')}
        />
        Image Generation
      </label>

      <label>
        <input
          type="checkbox"
          checked={codeInterpreter}
          onChange={() => updateSessionTools('code_interpreter')}
        />
        Code Interpreter
      </label>

      <p>Active: {activeTools.join(', ')}</p>

      <button onClick={() => setSessionTools([])}>
        Disable All Tools
      </button>
    </div>
  );
}
\`\`\``,...(g=(f=n.parameters)==null?void 0:f.docs)==null?void 0:g.description}}};var b,h,y,S,T;t.parameters={...t.parameters,docs:{...(b=t.parameters)==null?void 0:b.docs,source:{originalSource:`{
  render: () => <div style={{
    padding: '20px',
    fontFamily: 'monospace',
    maxWidth: '800px'
  }}>
      <h3>useChatFileUpload Hook</h3>

      <pre style={{
      background: '#f5f5f5',
      padding: '15px',
      borderRadius: '4px',
      overflow: 'auto'
    }}>
      {\`import { useChatFileUpload } from '@iblai/web-utils';
import { useAppSelector } from '@/lib/hooks';

const { uploadFiles, retryUpload } = useChatFileUpload({
  org: tenantKey,
  userId: username,
  errorHandler: (error) => toast.error(error),
  capabilities: {
    supportsFileUpload: true,
    allSupportedTypes: ['pdf', 'docx', 'txt', 'png', 'jpg'],
    maxFileSizeMB: 10,
    maxFilesPerMessage: 5,
  },
});

// Files are in Redux state
const attachedFiles = useAppSelector((state) => state.files.attachedFiles);

// Upload files
const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
  const files = Array.from(e.target.files || []);
  await uploadFiles(files); // Validates, uploads to S3, updates Redux
};

// When sending message, filter successful uploads
const fileReferences = attachedFiles
  .filter(f => f.uploadStatus === 'success' && f.fileKey && f.fileId)
  .map(f => ({
    file_id: f.fileId!,
    file_key: f.fileKey!,
    file_name: f.fileName,
    content_type: f.fileType,
    file_size: f.fileSize,
    upload_url: f.fileUrl || f.uploadUrl,
  }));\`}
      </pre>
    </div>
}`,...(y=(h=t.parameters)==null?void 0:h.docs)==null?void 0:y.source},description:{story:`## useChatFileUpload

Handle file uploads for chat with validation, S3 upload, and progress tracking.

### Parameters
\`\`\`typescript
{
  org: string;                         // Tenant key
  userId: string;                      // Username
  errorHandler: (error: string) => void;
  capabilities: {
    supportsFileUpload: boolean;
    allSupportedTypes: string[];       // ['pdf', 'docx', 'png', ...]
    maxFileSizeMB: number;
    maxFilesPerMessage: number;
  };
}
\`\`\`

### Returns
\`\`\`typescript
{
  uploadFiles: (files: File[]) => Promise<void>;
  retryUpload: (fileId: string) => Promise<void>;
}
\`\`\`

### File State (Redux)
Files are stored in Redux state:
\`\`\`typescript
interface UploadedFile {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadProgress: number;              // 0-100
  uploadStatus: 'pending' | 'uploading' | 'success' | 'error';
  uploadUrl: string;
  fileKey?: string;
  fileId?: string;
  retryCount?: number;
}
\`\`\`

### Example
\`\`\`tsx
import { useChatFileUpload } from '@iblai/web-utils';
import { useAppSelector } from '@/lib/hooks';

function ChatFileUploader() {
  const { uploadFiles, retryUpload } = useChatFileUpload({
    org: tenantKey,
    userId: username,
    errorHandler: (error) => toast.error(error),
    capabilities: {
      supportsFileUpload: true,
      allSupportedTypes: ['pdf', 'docx', 'txt', 'png', 'jpg'],
      maxFileSizeMB: 10,
      maxFilesPerMessage: 5,
    },
  });

  // Get files from Redux
  const attachedFiles = useAppSelector((state) => state.files.attachedFiles);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    await uploadFiles(files);
  };

  return (
    <div>
      <input
        type="file"
        multiple
        accept=".pdf,.docx,.txt,.png,.jpg"
        onChange={handleFileSelect}
      />

      <div className="file-list">
        {attachedFiles.map((file) => (
          <div key={file.id} className="file-item">
            <span>{file.fileName}</span>

            {file.uploadStatus === 'uploading' && (
              <progress value={file.uploadProgress} max={100} />
            )}

            {file.uploadStatus === 'success' && (
              <span>✓ Uploaded</span>
            )}

            {file.uploadStatus === 'error' && (
              <button onClick={() => retryUpload(file.id)}>
                Retry
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
\`\`\``,...(T=(S=t.parameters)==null?void 0:S.docs)==null?void 0:T.description}}};var w,v,E,C,U;a.parameters={...a.parameters,docs:{...(w=a.parameters)==null?void 0:w.docs,source:{originalSource:`{
  render: () => <div style={{
    padding: '20px',
    fontFamily: 'monospace',
    maxWidth: '800px'
  }}>
      <h3>useTenantMetadata Hook</h3>

      <pre style={{
      background: '#f5f5f5',
      padding: '15px',
      borderRadius: '4px',
      overflow: 'auto'
    }}>
      {\`import { useTenantMetadata } from '@iblai/web-utils';

const { metadata, platformName, metadataLoaded } = useTenantMetadata({
  org: tenantKey
});

// Always check metadataLoaded before using
if (!metadataLoaded) {
  return <Spinner />;
}

// Access nested metadata
const title = metadata?.auth_web_skillsai?.title?.trim();
const logo = metadata?.auth_web_skillsai?.logo;
const primaryColor = metadata?.auth_web_skillsai?.primaryColor;

// Fallback chain
const displayTitle = useMemo(() => {
  const preferredTitle = metadata?.auth_web_skillsai?.title?.trim();
  if (preferredTitle) return preferredTitle;
  if (platformName?.trim()) return platformName;
  return 'Default Title';
}, [metadata, platformName]);\`}
      </pre>
    </div>
}`,...(E=(v=a.parameters)==null?void 0:v.docs)==null?void 0:E.source},description:{story:`## useTenantMetadata

Access tenant metadata, branding, and custom settings.

### Parameters
\`\`\`typescript
{
  org: string;                         // Tenant key
}
\`\`\`

### Returns
\`\`\`typescript
{
  metadata: TenantMetadata | null;     // Full metadata object
  platformName: string;                // Platform display name
  metadataLoaded: boolean;             // Loading complete flag
}
\`\`\`

### Metadata Structure
\`\`\`typescript
interface TenantMetadata {
  auth_web_skillsai?: {
    title?: string;
    logo?: string;
    favicon?: string;
    primaryColor?: string;
  };
  mentor_web?: {
    title?: string;
    // ... other settings
  };
  // ... other app-specific metadata
}
\`\`\`

### Example
\`\`\`tsx
import { useTenantMetadata } from '@iblai/web-utils';
import { useMemo } from 'react';

function AppHeader() {
  const { metadata, platformName, metadataLoaded } = useTenantMetadata({
    org: tenantKey,
  });

  const displayTitle = useMemo(() => {
    const preferredTitle = metadata?.auth_web_skillsai?.title?.trim();
    if (preferredTitle) {
      return preferredTitle;
    }
    if (platformName?.trim()) {
      return platformName;
    }
    return 'IBL AI Platform';
  }, [metadata?.auth_web_skillsai?.title, platformName]);

  const logoUrl = metadata?.auth_web_skillsai?.logo;
  const primaryColor = metadata?.auth_web_skillsai?.primaryColor || '#3b82f6';

  if (!metadataLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <header style={{ backgroundColor: primaryColor }}>
      {logoUrl && <img src={logoUrl} alt={displayTitle} />}
      <h1>{displayTitle}</h1>
    </header>
  );
}
\`\`\``,...(U=(C=a.parameters)==null?void 0:C.docs)==null?void 0:U.description}}};var M,R,x,k,F;r.parameters={...r.parameters,docs:{...(M=r.parameters)==null?void 0:M.docs,source:{originalSource:`{
  render: () => <div style={{
    padding: '20px',
    fontFamily: 'monospace',
    maxWidth: '800px'
  }}>
      <h3>useDayJs Hook</h3>

      <pre style={{
      background: '#f5f5f5',
      padding: '15px',
      borderRadius: '4px',
      overflow: 'auto'
    }}>
      {\`import { useDayJs } from '@iblai/web-utils';

const {
  getTimeDifferenceBetweenTwoDates,
  getDayJSDurationObjFromSeconds,
  generateFutureDateForNMinutes,
} = useDayJs();

// Get time difference
const diff = getTimeDifferenceBetweenTwoDates(
  futureDate,
  pastDate,
  "second"
);

// Convert seconds to duration object
const duration = getDayJSDurationObjFromSeconds(120);

// Generate future date
const futureDate = generateFutureDateForNMinutes(30);\`}
      </pre>
    </div>
}`,...(x=(R=r.parameters)==null?void 0:R.docs)==null?void 0:x.source},description:{story:`## useDayJs

Simple date/time utility functions.

### Returns
\`\`\`typescript
{
  getTimeDifferenceBetweenTwoDates: (
    futureDate: Date,
    pastDate: Date,
    unit: 'second' | 'minute' | 'hour' | 'day'
  ) => number;
  getDayJSDurationObjFromSeconds: (seconds: number) => Duration;
  generateFutureDateForNMinutes: (minutes: number) => Date;
}
\`\`\`

### Example
\`\`\`tsx
import { useDayJs } from '@iblai/web-utils';

function ExpiryTimer() {
  const {
    getTimeDifferenceBetweenTwoDates,
    generateFutureDateForNMinutes,
  } = useDayJs();

  const expiryDate = generateFutureDateForNMinutes(30); // 30 minutes from now
  const secondsRemaining = getTimeDifferenceBetweenTwoDates(
    expiryDate,
    new Date(),
    'second'
  );

  return <div>Expires in {secondsRemaining} seconds</div>;
}
\`\`\``,...(F=(k=r.parameters)==null?void 0:k.docs)==null?void 0:F.description}}};var N,I,_,A,D;s.parameters={...s.parameters,docs:{...(N=s.parameters)==null?void 0:N.docs,source:{originalSource:`{
  render: () => <div style={{
    padding: '20px',
    fontFamily: 'monospace',
    maxWidth: '800px'
  }}>
      <h3>useSubscriptionHandlerV2 Hook</h3>

      <pre style={{
      background: '#f5f5f5',
      padding: '15px',
      borderRadius: '4px',
      overflow: 'auto',
      fontSize: '11px'
    }}>
      {\`import {
  useSubscriptionHandlerV2,
  MentorSubscriptionFlowV2
} from '@iblai/web-utils';

// Create subscription flow instance
const subscriptionFlow = new MentorSubscriptionFlowV2({
  platformName: config.iblPlatform(),
  currentTenantKey: currentTenant?.key || '',
  username: getUserName(),
  currentTenantOrg: currentTenant?.org || '',
  userTenants,
  isAdmin: currentTenant?.is_admin || false,
  mainTenantKey: config.mainTenantKey(),
  userEmail: getUserEmail(),
  dispatch,
  topBannerOptions,
  mentorUrl: config.mentorUrl(),
});

const { handleSubscriptionCheck, CREDIT_INTERVAL_CHECK_COUNTER } =
  useSubscriptionHandlerV2(subscriptionFlow);

// Set up interval checking
useEffect(() => {
  handleSubscriptionCheck(); // Check immediately

  const intervalId = setInterval(() => {
    handleSubscriptionCheck();
  }, CREDIT_INTERVAL_CHECK_COUNTER);

  return () => clearInterval(intervalId);
}, [error402Detected]);\`}
      </pre>
    </div>
}`,...(_=(I=s.parameters)==null?void 0:I.docs)==null?void 0:_.source},description:{story:`## useSubscriptionHandlerV2

Manage subscription status and credit checking with periodic polling.

### Setup
\`\`\`typescript
import { MentorSubscriptionFlowV2, useSubscriptionHandlerV2 } from '@iblai/web-utils';

const subscriptionFlow = new MentorSubscriptionFlowV2({
  platformName: config.iblPlatform(),
  currentTenantKey: currentTenant?.key || '',
  username: getUserName(),
  currentTenantOrg: currentTenant?.org || '',
  userTenants,
  isAdmin: currentTenant?.is_admin || false,
  mainTenantKey: config.mainTenantKey(),
  userEmail: getUserEmail(),
  dispatch,
  topBannerOptions,
  mentorUrl: config.mentorUrl(),
});

const { handleSubscriptionCheck, CREDIT_INTERVAL_CHECK_COUNTER } =
  useSubscriptionHandlerV2(subscriptionFlow);
\`\`\`

### Example - With Interval
\`\`\`tsx
import { useSubscriptionHandlerV2, MentorSubscriptionFlowV2 } from '@iblai/web-utils';

function SubscriptionMonitor() {
  const subscriptionFlow = useMemo(
    () => new MentorSubscriptionFlowV2({
      platformName: config.iblPlatform(),
      currentTenantKey: tenantKey,
      username: getUserName(),
      currentTenantOrg: currentTenant?.org || '',
      userTenants,
      isAdmin: isAdmin,
      mainTenantKey: config.mainTenantKey(),
      userEmail: getUserEmail(),
      dispatch,
      topBannerOptions,
      mentorUrl: config.mentorUrl(),
    }),
    [tenantKey, isAdmin]
  );

  const { handleSubscriptionCheck, CREDIT_INTERVAL_CHECK_COUNTER } =
    useSubscriptionHandlerV2(subscriptionFlow);

  useEffect(() => {
    handleSubscriptionCheck(); // Check immediately

    // Poll periodically
    const intervalId = setInterval(() => {
      handleSubscriptionCheck();
    }, CREDIT_INTERVAL_CHECK_COUNTER);

    return () => clearInterval(intervalId);
  }, [error402Detected]);

  return null; // This is a background monitor
}
\`\`\``,...(D=(A=s.parameters)==null?void 0:A.docs)==null?void 0:D.description}}};const O=["UseAdvancedChat","UseMentorTools","UseChatFileUpload","UseTenantMetadata","UseDayJs","UseSubscriptionHandlerV2"];export{e as UseAdvancedChat,t as UseChatFileUpload,r as UseDayJs,n as UseMentorTools,s as UseSubscriptionHandlerV2,a as UseTenantMetadata,O as __namedExportsOrder,H as default};
