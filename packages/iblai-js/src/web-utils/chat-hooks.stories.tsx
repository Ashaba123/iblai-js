import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

/**
 * # Chat Hooks
 *
 * IBL AI provides powerful React hooks for building AI chat interfaces with real-time streaming,
 * message management, and WebSocket communication.
 *
 * ## Available Hooks
 *
 * - **useAdvancedChat** - Full-featured chat hook with tabs, session management, and advanced features
 * - **useChat** - Core WebSocket-based chat hook with streaming support
 * - **useChatV2** - Updated version of useChat with improved error handling
 * - **useGetChatDetails** - Fetch chat session details and history
 * - **useMentorTools** - Manage AI mentor tools and capabilities
 *
 * ## Installation
 *
 * ```bash
 * pnpm add @iblai/web-utils @iblai/data-layer
 * ```
 */

const meta: Meta = {
  title: 'Web Utils/Chat Hooks',
  parameters: {
    docs: {
      description: {
        component: 'React hooks for building AI-powered chat interfaces with real-time streaming.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

/**
 * ## useAdvancedChat
 *
 * The most comprehensive chat hook with support for multiple chat tabs, session management,
 * and integration with Redux store.
 *
 * ### Features
 * - Multi-tab chat support
 * - Session management with API integration
 * - Real-time WebSocket streaming
 * - File attachments
 * - Message actions and formatting
 * - Error handling and recovery
 * - 402 (payment required) error handling
 *
 * ### Basic Usage
 *
 * ```tsx
 * import { useAdvancedChat } from '@iblai/web-utils';
 * import { Provider } from 'react-redux';
 * import { store } from '@iblai/data-layer';
 *
 * function ChatInterface() {
 *   const {
 *     chats,
 *     sessionId,
 *     streaming,
 *     sendMessage,
 *     stopGeneration,
 *     switchTab,
 *     startNewChat,
 *     status,
 *   } = useAdvancedChat({
 *     tenantKey: 'my-tenant',
 *     mentorId: 'mentor-123',
 *     username: 'user@example.com',
 *     token: 'auth-token',
 *     wsUrl: 'wss://api.example.com/chat',
 *     stopGenerationWsUrl: 'wss://api.example.com/stop',
 *     redirectToAuthSpa: (redirectTo, platformKey, logout) => {
 *       // Handle auth redirect
 *     },
 *   });
 *
 *   return (
 *     <div>
 *       {chats.map((message) => (
 *         <div key={message.id}>
 *           <strong>{message.role}:</strong> {message.content}
 *         </div>
 *       ))}
 *       {streaming && <LoadingIndicator />}
 *       <button onClick={() => sendMessage('Hello!')}>Send</button>
 *     </div>
 *   );
 * }
 *
 * function App() {
 *   return (
 *     <Provider store={store}>
 *       <ChatInterface />
 *     </Provider>
 *   );
 * }
 * ```
 *
 * ### With Multiple Tabs
 *
 * ```tsx
 * function MultiTabChat() {
 *   const {
 *     chats,
 *     activeTab,
 *     switchTab,
 *     startNewChat,
 *     sendMessage,
 *   } = useAdvancedChat({
 *     tenantKey: 'my-tenant',
 *     mentorId: 'mentor-123',
 *     username: 'user@example.com',
 *     token: 'auth-token',
 *     wsUrl: 'wss://api.example.com/chat',
 *     stopGenerationWsUrl: 'wss://api.example.com/stop',
 *     redirectToAuthSpa: () => {},
 *   });
 *
 *   return (
 *     <div>
 *       <div className="tabs">
 *         <button onClick={() => switchTab('documents')}>Documents</button>
 *         <button onClick={() => switchTab('web')}>Web Search</button>
 *         <button onClick={() => switchTab('general')}>General</button>
 *       </div>
 *
 *       <div className="chat-messages">
 *         {chats[activeTab]?.map((msg) => (
 *           <Message key={msg.id} {...msg} />
 *         ))}
 *       </div>
 *
 *       <button onClick={() => startNewChat(activeTab)}>New Chat</button>
 *     </div>
 *   );
 * }
 * ```
 *
 * ### Props
 *
 * | Prop | Type | Required | Description |
 * |------|------|----------|-------------|
 * | tenantKey | string | Yes | Platform/tenant key |
 * | mentorId | string | Yes | AI mentor ID |
 * | username | string | No | User's username (defaults to ANONYMOUS_USERNAME) |
 * | token | string | Yes | Authentication token |
 * | wsUrl | string | Yes | WebSocket URL for chat |
 * | stopGenerationWsUrl | string | Yes | WebSocket URL to stop generation |
 * | redirectToAuthSpa | function | Yes | Auth redirect handler |
 * | errorHandler | function | No | Custom error handler |
 * | sendMessageToParentWebsite | function | No | Post messages to parent window (iframe) |
 * | isPreviewMode | boolean | No | Enable preview mode |
 * | mentorShareableToken | string | No | Token for shared mentor access |
 * | on402Error | function | No | Handle payment required errors |
 * | cachedSessionId | string | No | Resume from cached session |
 * | onStartNewChat | function | No | Callback when new chat starts |
 *
 * ### Return Values
 *
 * | Property | Type | Description |
 * |----------|------|-------------|
 * | chats | Record<string, Message[]> | Messages grouped by tab |
 * | sessionId | string | Current session ID |
 * | sessionIds | Record<string, string> | Session IDs for each tab |
 * | streaming | boolean | Whether AI is currently streaming |
 * | currentStreamingMessage | object | Current streaming message |
 * | activeTab | string | Currently active tab |
 * | status | ChatStatus | Connection status |
 * | isPending | boolean | Whether connection is pending |
 * | isStopped | boolean | Whether generation is stopped |
 * | isError | boolean | Whether an error occurred |
 * | shouldStartNewChat | boolean | Whether to start new chat |
 * | showingSharedChat | boolean | Whether showing shared chat |
 * | sendMessage | function | Send a message |
 * | stopGeneration | function | Stop AI generation |
 * | switchTab | function | Switch active tab |
 * | startNewChat | function | Start new chat session |
 */
export const AdvancedChatExample: Story = {
  render: () => (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">useAdvancedChat Example</h2>
      <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
        {`const {
  chats,
  sessionId,
  streaming,
  sendMessage,
  stopGeneration,
  switchTab,
  startNewChat,
  status,
} = useAdvancedChat({
  tenantKey: 'my-tenant',
  mentorId: 'mentor-123',
  username: 'user@example.com',
  token: 'auth-token',
  wsUrl: 'wss://api.example.com/chat',
  stopGenerationWsUrl: 'wss://api.example.com/stop',
  redirectToAuthSpa: () => {},
});`}
      </pre>
    </div>
  ),
};

/**
 * ## useChat / useChatV2
 *
 * Core WebSocket-based chat hook with real-time streaming support.
 * useChatV2 is an improved version with better error handling.
 *
 * ### Features
 * - Real-time WebSocket communication
 * - Streaming message support
 * - File attachments
 * - Message actions (buttons)
 * - Auto-reconnection
 * - Status tracking
 *
 * ### Basic Usage
 *
 * ```tsx
 * import { useChat } from '@iblai/web-utils';
 * import { useDispatch } from 'react-redux';
 * import { chatActions } from '@iblai/web-utils';
 *
 * function SimpleChatInterface() {
 *   const dispatch = useDispatch();
 *
 *   const { sendMessage, stopGeneration } = useChat({
 *     wsUrl: 'wss://api.example.com/chat',
 *     wsToken: 'auth-token',
 *     flowConfig: {
 *       name: 'chat-flow',
 *       tenant: 'my-tenant',
 *       username: 'user@example.com',
 *       pathway: 'default',
 *     },
 *     sessionId: 'session-123',
 *     stopGenerationWsUrl: 'wss://api.example.com/stop',
 *     activeTab: 'general',
 *     redirectToAuthSpa: () => {},
 *     onStatusChange: (status) => {
 *       dispatch(chatActions.setStatus(status));
 *     },
 *     onStreamingChange: (streaming) => {
 *       dispatch(chatActions.setStreaming(streaming));
 *     },
 *     onStreamingMessageUpdate: (message) => {
 *       dispatch(chatActions.setCurrentStreamingMessage(message));
 *     },
 *   });
 *
 *   return (
 *     <div>
 *       <button onClick={() => sendMessage('general', 'Hello AI!')}>
 *         Send Message
 *       </button>
 *       <button onClick={stopGeneration}>Stop</button>
 *     </div>
 *   );
 * }
 * ```
 *
 * ### With File Attachments
 *
 * ```tsx
 * function ChatWithFiles() {
 *   const { sendMessage } = useChat({...config});
 *   const [files, setFiles] = useState([]);
 *
 *   const handleSendWithFiles = () => {
 *     sendMessage('general', 'Please analyze these files', {
 *       fileReferences: files.map(file => ({
 *         id: file.id,
 *         url: file.url,
 *         type: file.type,
 *         name: file.name,
 *       })),
 *     });
 *   };
 *
 *   return (
 *     <div>
 *       <FileUploader onFilesUploaded={setFiles} />
 *       <button onClick={handleSendWithFiles}>Send with Files</button>
 *     </div>
 *   );
 * }
 * ```
 *
 * ### Props
 *
 * | Prop | Type | Required | Description |
 * |------|------|----------|-------------|
 * | wsUrl | string | Yes | WebSocket server URL |
 * | wsToken | string | Yes | Authentication token |
 * | flowConfig | object | Yes | Chat flow configuration |
 * | sessionId | string | Yes | Chat session ID |
 * | stopGenerationWsUrl | string | Yes | URL to stop generation |
 * | activeTab | string | Yes | Current active tab |
 * | redirectToAuthSpa | function | Yes | Auth redirect handler |
 * | onStatusChange | function | Yes | Status change callback |
 * | onStreamingChange | function | Yes | Streaming change callback |
 * | onStreamingMessageUpdate | function | Yes | Streaming message callback |
 * | enableHaptics | boolean | No | Enable haptic feedback (mobile) |
 * | errorHandler | function | No | Custom error handler |
 * | sendMessageToParentWebsite | function | No | Post to parent window |
 * | on402Error | function | No | Payment required handler |
 *
 * ### Return Values
 *
 * | Property | Type | Description |
 * |----------|------|-------------|
 * | sendMessage | function | Send message (tab, content, options) |
 * | stopGeneration | function | Stop AI generation |
 * | wsRef | React.Ref | WebSocket reference |
 */
export const ChatV2Example: Story = {
  render: () => (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">useChat / useChatV2 Example</h2>
      <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
        {`const { sendMessage, stopGeneration } = useChat({
  wsUrl: 'wss://api.example.com/chat',
  wsToken: 'auth-token',
  flowConfig: {
    name: 'chat-flow',
    tenant: 'my-tenant',
    username: 'user@example.com',
    pathway: 'default',
  },
  sessionId: 'session-123',
  stopGenerationWsUrl: 'wss://api.example.com/stop',
  activeTab: 'general',
  redirectToAuthSpa: () => {},
  onStatusChange: (status) => console.log(status),
  onStreamingChange: (streaming) => console.log(streaming),
  onStreamingMessageUpdate: (msg) => console.log(msg),
});

// Send a message
sendMessage('general', 'Hello AI!');

// Send with file attachments
sendMessage('general', 'Analyze this', {
  fileReferences: [{ id: '1', url: '...', name: 'doc.pdf' }],
});`}
      </pre>
    </div>
  ),
};

/**
 * ## useGetChatDetails
 *
 * Fetch chat session details and message history using RTK Query.
 *
 * ### Features
 * - Fetch chat history
 * - Session metadata
 * - Automatic caching
 * - Loading and error states
 *
 * ### Basic Usage
 *
 * ```tsx
 * import { useGetChatDetails } from '@iblai/web-utils';
 *
 * function ChatHistory({ sessionId }) {
 *   const {
 *     data: chatDetails,
 *     isLoading,
 *     error,
 *     refetch,
 *   } = useGetChatDetails({
 *     sessionId,
 *     tenantKey: 'my-tenant',
 *     mentorId: 'mentor-123',
 *   });
 *
 *   if (isLoading) return <div>Loading chat history...</div>;
 *   if (error) return <div>Error loading chat</div>;
 *
 *   return (
 *     <div>
 *       <h3>Session: {chatDetails.sessionId}</h3>
 *       <p>Created: {chatDetails.createdAt}</p>
 *
 *       <div className="messages">
 *         {chatDetails.messages.map((msg) => (
 *           <div key={msg.id}>
 *             <strong>{msg.role}:</strong> {msg.content}
 *           </div>
 *         ))}
 *       </div>
 *
 *       <button onClick={refetch}>Refresh</button>
 *     </div>
 *   );
 * }
 * ```
 *
 * ### With Polling
 *
 * ```tsx
 * function LiveChatHistory({ sessionId }) {
 *   const { data } = useGetChatDetails(
 *     {
 *       sessionId,
 *       tenantKey: 'my-tenant',
 *       mentorId: 'mentor-123',
 *     },
 *     {
 *       pollingInterval: 3000, // Poll every 3 seconds
 *     }
 *   );
 *
 *   return <ChatHistoryView messages={data?.messages} />;
 * }
 * ```
 */
export const GetChatDetailsExample: Story = {
  render: () => (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">useGetChatDetails Example</h2>
      <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
        {`const {
  data: chatDetails,
  isLoading,
  error,
  refetch,
} = useGetChatDetails({
  sessionId: 'session-123',
  tenantKey: 'my-tenant',
  mentorId: 'mentor-123',
});

// Access chat history
const messages = chatDetails?.messages || [];

// Refresh chat history
refetch();`}
      </pre>
    </div>
  ),
};

/**
 * ## useMentorTools
 *
 * Manage AI mentor tools and capabilities.
 *
 * ### Features
 * - Fetch available tools
 * - Tool configuration
 * - Enable/disable tools
 * - Tool permissions
 *
 * ### Basic Usage
 *
 * ```tsx
 * import { useMentorTools } from '@iblai/web-utils';
 *
 * function MentorToolsPanel({ mentorId }) {
 *   const {
 *     tools,
 *     isLoading,
 *     enableTool,
 *     disableTool,
 *   } = useMentorTools({
 *     mentorId,
 *     tenantKey: 'my-tenant',
 *   });
 *
 *   if (isLoading) return <div>Loading tools...</div>;
 *
 *   return (
 *     <div>
 *       <h3>Available Tools</h3>
 *       {tools.map((tool) => (
 *         <div key={tool.id}>
 *           <span>{tool.name}</span>
 *           <button
 *             onClick={() =>
 *               tool.enabled ? disableTool(tool.id) : enableTool(tool.id)
 *             }
 *           >
 *             {tool.enabled ? 'Disable' : 'Enable'}
 *           </button>
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export const MentorToolsExample: Story = {
  render: () => (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">useMentorTools Example</h2>
      <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
        {`const {
  tools,
  isLoading,
  enableTool,
  disableTool,
} = useMentorTools({
  mentorId: 'mentor-123',
  tenantKey: 'my-tenant',
});

// Available tools
tools.forEach(tool => {
  console.log(tool.name, tool.enabled);
});

// Enable/disable a tool
enableTool('web-search');
disableTool('code-interpreter');`}
      </pre>
    </div>
  ),
};

/**
 * ## Chat Redux Actions
 *
 * Redux actions for managing chat state.
 *
 * ### Available Actions
 *
 * ```tsx
 * import { chatActions } from '@iblai/web-utils';
 * import { useDispatch } from 'react-redux';
 *
 * function ChatControls() {
 *   const dispatch = useDispatch();
 *
 *   // Set streaming state
 *   dispatch(chatActions.setStreaming(true));
 *
 *   // Set chat status
 *   dispatch(chatActions.setStatus('connected'));
 *
 *   // Update streaming message
 *   dispatch(chatActions.setCurrentStreamingMessage({
 *     id: 'msg-123',
 *     content: 'Streaming content...',
 *   }));
 *
 *   // Add user message
 *   dispatch(chatActions.addUserMessage({
 *     tab: 'general',
 *     message: {
 *       id: 'msg-456',
 *       role: 'user',
 *       content: 'Hello!',
 *       timestamp: new Date().toISOString(),
 *       visible: true,
 *     },
 *   }));
 *
 *   // Clear messages
 *   dispatch(chatActions.clearMessages('general'));
 *
 *   // Switch tab
 *   dispatch(chatActions.setActiveTab('documents'));
 *
 *   return <div>Chat Controls</div>;
 * }
 * ```
 *
 * ### Selectors
 *
 * ```tsx
 * import {
 *   selectChats,
 *   selectStreaming,
 *   selectSessionId,
 *   selectActiveTab,
 *   selectStatus,
 * } from '@iblai/web-utils';
 * import { useSelector } from 'react-redux';
 *
 * function ChatStatus() {
 *   const chats = useSelector(selectChats);
 *   const streaming = useSelector(selectStreaming);
 *   const sessionId = useSelector(selectSessionId);
 *   const activeTab = useSelector(selectActiveTab);
 *   const status = useSelector(selectStatus);
 *
 *   return (
 *     <div>
 *       <p>Session: {sessionId}</p>
 *       <p>Active Tab: {activeTab}</p>
 *       <p>Status: {status}</p>
 *       <p>Streaming: {streaming ? 'Yes' : 'No'}</p>
 *       <p>Messages: {chats[activeTab]?.length || 0}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export const ReduxActionsExample: Story = {
  render: () => (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">Chat Redux Actions Example</h2>
      <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
        {`import { chatActions, selectChats } from '@iblai/web-utils';
import { useDispatch, useSelector } from 'react-redux';

// Dispatch actions
dispatch(chatActions.setStreaming(true));
dispatch(chatActions.setStatus('connected'));
dispatch(chatActions.setActiveTab('documents'));

// Use selectors
const chats = useSelector(selectChats);
const streaming = useSelector(selectStreaming);
const sessionId = useSelector(selectSessionId);`}
      </pre>
    </div>
  ),
};

/**
 * ## Complete Chat Integration Example
 *
 * Full example integrating all chat hooks and components.
 *
 * ```tsx
 * import { useAdvancedChat, chatActions } from '@iblai/web-utils';
 * import { Provider } from 'react-redux';
 * import { store } from '@iblai/data-layer';
 *
 * function ChatApp() {
 *   const {
 *     chats,
 *     activeTab,
 *     sessionId,
 *     streaming,
 *     sendMessage,
 *     stopGeneration,
 *     switchTab,
 *     startNewChat,
 *     status,
 *   } = useAdvancedChat({
 *     tenantKey: 'my-tenant',
 *     mentorId: 'mentor-123',
 *     username: 'user@example.com',
 *     token: localStorage.getItem('auth_token'),
 *     wsUrl: 'wss://api.example.com/chat',
 *     stopGenerationWsUrl: 'wss://api.example.com/stop',
 *     redirectToAuthSpa: (redirectTo, platformKey, logout) => {
 *       window.location.href = `https://auth.example.com/login`;
 *     },
 *     errorHandler: (message, error) => {
 *       console.error('Chat error:', message, error);
 *     },
 *     on402Error: (message) => {
 *       // Handle payment required
 *       showPaywallModal();
 *     },
 *   });
 *
 *   const currentMessages = chats[activeTab] || [];
 *
 *   return (
 *     <div className="chat-container">
 *       <header>
 *         <h1>AI Mentor Chat</h1>
 *         <div className="status">
 *           Status: {status}
 *           {streaming && ' (AI is typing...)'}
 *         </div>
 *       </header>
 *
 *       <div className="tabs">
 *         <button onClick={() => switchTab('general')}>General</button>
 *         <button onClick={() => switchTab('documents')}>Documents</button>
 *         <button onClick={() => switchTab('web')}>Web Search</button>
 *       </div>
 *
 *       <div className="messages">
 *         {currentMessages.map((msg) => (
 *           <div key={msg.id} className={`message ${msg.role}`}>
 *             <strong>{msg.role}:</strong>
 *             <p>{msg.content}</p>
 *             {msg.fileAttachments?.map((file) => (
 *               <a key={file.fileId} href={file.uploadUrl}>
 *                 {file.fileName}
 *               </a>
 *             ))}
 *           </div>
 *         ))}
 *       </div>
 *
 *       <div className="input-area">
 *         <textarea
 *           placeholder="Type your message..."
 *           onKeyDown={(e) => {
 *             if (e.key === 'Enter' && !e.shiftKey) {
 *               e.preventDefault();
 *               sendMessage(e.currentTarget.value);
 *               e.currentTarget.value = '';
 *             }
 *           }}
 *         />
 *         {streaming && (
 *           <button onClick={stopGeneration}>Stop</button>
 *         )}
 *         <button onClick={() => startNewChat(activeTab)}>
 *           New Chat
 *         </button>
 *       </div>
 *     </div>
 *   );
 * }
 *
 * export default function App() {
 *   return (
 *     <Provider store={store}>
 *       <ChatApp />
 *     </Provider>
 *   );
 * }
 * ```
 */
export const CompleteIntegrationExample: Story = {
  render: () => (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">Complete Chat Integration</h2>
      <p className="text-gray-600">
        See the code example above for a complete chat application integration.
      </p>
      <div className="bg-blue-50 border border-blue-200 p-4 rounded">
        <h3 className="font-semibold text-blue-900 mb-2">Key Features Demonstrated:</h3>
        <ul className="list-disc list-inside text-blue-800 space-y-1">
          <li>Multi-tab chat interface</li>
          <li>Real-time message streaming</li>
          <li>Session management</li>
          <li>Error handling and auth redirects</li>
          <li>Payment required (402) handling</li>
          <li>File attachments support</li>
          <li>Status indicators</li>
        </ul>
      </div>
    </div>
  ),
};
