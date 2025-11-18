/**
 * # Chat UI Components Examples
 *
 * This guide demonstrates how to build chat user interfaces using the IBL AI chat hooks and utilities.
 * While the SDK doesn't provide pre-built chat UI components, it provides all the necessary hooks
 * and data management tools to build your own chat interface.
 *
 * ## Key Building Blocks:
 *
 * ### Hooks (from @iblai/web-utils):
 * - `useAdvancedChat` - Main hook for chat functionality with tabs, sessions, streaming
 * - `useChat` / `useChatV2` - Core WebSocket chat implementation
 * - `useGetChatDetails` - Fetch chat history with RTK Query
 * - `useMentorTools` - Manage AI mentor tools (web browsing, code interpreter, etc.)
 *
 * ### Components (from @iblai/web-containers):
 * - Standard UI components: Avatar, Button, Card, Dialog, Tooltip, etc.
 * - These can be combined to create chat interfaces
 *
 * ### Data Types:
 * - `Message` - Chat message interface
 * - `FileAttachment` - File attachment interface
 * - `MessageAction` - Action buttons in messages
 *
 * @module chat-components
 */

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Examples/Chat UI Components',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj;

/**
 * ## Chat Message Bubble Components
 *
 * Examples of how to build message bubble components for user and AI messages.
 *
 * ### AI Message Bubble
 *
 * ```tsx
 * import { Avatar, AvatarImage, AvatarFallback } from '@iblai/web-containers';
 * import { Message } from '@iblai/web-utils';
 *
 * interface AIMessageBubbleProps {
 *   content: string;
 *   profileImage: string;
 *   mentorName: string;
 *   timestamp: string;
 *   onRetry?: () => void;
 * }
 *
 * export function AIMessageBubble({
 *   content,
 *   profileImage,
 *   mentorName,
 *   timestamp,
 *   onRetry
 * }: AIMessageBubbleProps) {
 *   return (
 *     <div className="mb-4">
 *       <div className="flex items-start">
 *         <Avatar className="h-8 w-8 mr-3">
 *           <AvatarImage src={profileImage} alt={mentorName} />
 *           <AvatarFallback>{mentorName.substring(0, 2)}</AvatarFallback>
 *         </Avatar>
 *         <div className="flex-1 max-w-[75%]">
 *           <div className="flex items-center mb-1">
 *             <span className="font-medium text-gray-900 mr-2">{mentorName}</span>
 *             <span className="text-gray-500 text-xs">{timestamp}</span>
 *           </div>
 *           <div className="bg-gray-100 rounded-lg p-3">
 *             <div className="text-gray-800 text-sm">{content}</div>
 *           </div>
 *           <div className="flex items-center space-x-2 mt-1">
 *             <button onClick={onRetry} className="text-gray-500 hover:text-gray-700">
 *               Retry
 *             </button>
 *           </div>
 *         </div>
 *       </div>
 *     </div>
 *   );
 * }
 * ```
 *
 * ### User Message Bubble
 *
 * ```tsx
 * interface UserMessageBubbleProps {
 *   content: string;
 *   fileAttachments?: FileAttachment[];
 * }
 *
 * export function UserMessageBubble({ content, fileAttachments }: UserMessageBubbleProps) {
 *   return (
 *     <div className="flex flex-col items-end mb-4">
 *       {fileAttachments && fileAttachments.length > 0 && (
 *         <div className="flex flex-col gap-2 mb-2">
 *           {fileAttachments.map((file, idx) => (
 *             <div key={idx} className="bg-white border rounded-lg p-2">
 *               <span className="text-sm">{file.fileName}</span>
 *             </div>
 *           ))}
 *         </div>
 *       )}
 *       {content && (
 *         <div className="bg-blue-50 text-gray-800 rounded-lg px-4 py-2 max-w-[80%]">
 *           {content}
 *         </div>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export const MessageBubbles: Story = {
  render: () => (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Chat Message Bubbles</h2>
      <p className="mb-6 text-gray-600">Examples of AI and user message components</p>

      <div className="max-w-2xl mx-auto bg-white rounded-lg p-4">
        <pre className="text-xs bg-gray-100 p-4 rounded overflow-x-auto">
{`// See the story description above for full implementation
// Key features:
// - Avatar with fallback
// - Timestamp display
// - Message content with markdown support
// - Action buttons (retry, copy, share, rating)
// - File attachment display
// - Reply context`}
        </pre>
      </div>
    </div>
  ),
};

/**
 * ## Chat Input Component
 *
 * Example of building a chat input form with file upload, voice input, and tools.
 *
 * ```tsx
 * import { useRef, useState } from 'react';
 * import { Button } from '@iblai/web-containers';
 * import { Message } from '@iblai/web-utils';
 *
 * interface ChatInputFormProps {
 *   onSubmit: (content: string) => void;
 *   isStreaming: boolean;
 *   stopGenerating: () => void;
 *   sessionId: string;
 * }
 *
 * export function ChatInputForm({
 *   onSubmit,
 *   isStreaming,
 *   stopGenerating,
 *   sessionId
 * }: ChatInputFormProps) {
 *   const [inputValue, setInputValue] = useState('');
 *   const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
 *   const fileInputRef = useRef<HTMLInputElement>(null);
 *
 *   const handleSubmit = (e: React.FormEvent) => {
 *     e.preventDefault();
 *     if (!inputValue.trim() && attachedFiles.length === 0) return;
 *
 *     onSubmit(inputValue);
 *     setInputValue('');
 *     setAttachedFiles([]);
 *   };
 *
 *   const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
 *     if (e.target.files) {
 *       setAttachedFiles(Array.from(e.target.files));
 *     }
 *   };
 *
 *   return (
 *     <form onSubmit={handleSubmit} className="border-t p-4">
 *       {attachedFiles.length > 0 && (
 *         <div className="mb-2 flex gap-2">
 *           {attachedFiles.map((file, idx) => (
 *             <div key={idx} className="bg-gray-100 rounded px-2 py-1 text-xs">
 *               {file.name}
 *             </div>
 *           ))}
 *         </div>
 *       )}
 *
 *       <div className="flex gap-2">
 *         <input
 *           type="file"
 *           ref={fileInputRef}
 *           className="hidden"
 *           onChange={handleFileSelect}
 *           multiple
 *         />
 *
 *         <Button
 *           type="button"
 *           variant="ghost"
 *           onClick={() => fileInputRef.current?.click()}
 *         >
 *           📎 Attach
 *         </Button>
 *
 *         <textarea
 *           value={inputValue}
 *           onChange={(e) => setInputValue(e.target.value)}
 *           placeholder="Ask anything..."
 *           className="flex-1 border rounded px-3 py-2 resize-none"
 *           rows={1}
 *         />
 *
 *         {isStreaming ? (
 *           <Button type="button" onClick={stopGenerating} variant="destructive">
 *             Stop
 *           </Button>
 *         ) : (
 *           <Button type="submit">
 *             Send
 *           </Button>
 *         )}
 *       </div>
 *     </form>
 *   );
 * }
 * ```
 *
 * ### Features to Include:
 *
 * - **File Upload**: Drag & drop, click to upload, file preview
 * - **Voice Input**: Microphone button with recording indicator
 * - **Auto-resize Textarea**: Grows with content
 * - **File Type Validation**: Check file types and sizes
 * - **Upload Progress**: Show upload status for each file
 * - **Tools Menu**: Web browsing, code interpreter, image generation toggles
 */
export const ChatInputExample: Story = {
  render: () => (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Chat Input Component</h2>
      <p className="mb-6 text-gray-600">Input form with file upload and streaming control</p>

      <div className="max-w-2xl mx-auto bg-white rounded-lg p-4">
        <pre className="text-xs bg-gray-100 p-4 rounded overflow-x-auto">
{`// Key features to implement:
// - File attachments with preview
// - Drag & drop support
// - Voice recording
// - Stop generation button
// - Send button (disabled when streaming)
// - Auto-resize textarea
// - Tool toggles (web browsing, etc.)`}
        </pre>
      </div>
    </div>
  ),
};

/**
 * ## Chat Messages List Component
 *
 * Container component for rendering a list of chat messages with auto-scroll.
 *
 * ```tsx
 * import { useRef, useEffect } from 'react';
 * import { Message } from '@iblai/web-utils';
 *
 * interface ChatMessagesProps {
 *   messages: Message[];
 *   profileImage: string;
 *   mentorName: string;
 *   sessionId: string;
 *   onRetry: (content: string) => void;
 * }
 *
 * export function ChatMessages({
 *   messages,
 *   profileImage,
 *   mentorName,
 *   sessionId,
 *   onRetry
 * }: ChatMessagesProps) {
 *   const containerRef = useRef<HTMLDivElement>(null);
 *   const [isScrolledUp, setIsScrolledUp] = useState(false);
 *
 *   const scrollToBottom = () => {
 *     if (containerRef.current) {
 *       containerRef.current.scrollTo({
 *         top: containerRef.current.scrollHeight,
 *         behavior: 'smooth'
 *       });
 *     }
 *   };
 *
 *   const handleScroll = () => {
 *     if (containerRef.current) {
 *       const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
 *       const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
 *       setIsScrolledUp(!isAtBottom);
 *     }
 *   };
 *
 *   useEffect(() => {
 *     scrollToBottom();
 *   }, [messages]);
 *
 *   return (
 *     <div className="relative flex-1 overflow-y-auto">
 *       <div
 *         ref={containerRef}
 *         onScroll={handleScroll}
 *         className="h-full overflow-y-auto p-4"
 *       >
 *         {messages
 *           .filter(msg => msg.visible)
 *           .map((message, i) => (
 *             message.role === 'user' ? (
 *               <UserMessageBubble key={i} {...message} />
 *             ) : (
 *               <AIMessageBubble
 *                 key={i}
 *                 content={message.content}
 *                 profileImage={profileImage}
 *                 mentorName={mentorName}
 *                 timestamp={message.timestamp}
 *                 onRetry={() => onRetry(message.content)}
 *               />
 *             )
 *           ))}
 *       </div>
 *
 *       {isScrolledUp && (
 *         <button
 *           onClick={scrollToBottom}
 *           className="absolute bottom-4 right-4 bg-white rounded-full p-2 shadow-lg"
 *         >
 *           ↓ Scroll to bottom
 *         </button>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export const ChatMessagesList: Story = {
  render: () => (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Chat Messages List</h2>
      <p className="mb-6 text-gray-600">Scrollable message container with auto-scroll</p>

      <div className="max-w-2xl mx-auto bg-white rounded-lg p-4">
        <pre className="text-xs bg-gray-100 p-4 rounded overflow-x-auto">
{`// Key features:
// - Auto-scroll to bottom on new messages
// - Detect when user scrolls up
// - Show "scroll to bottom" button when scrolled up
// - Filter visible messages
// - Render different components for user/AI messages
// - Handle message highlighting (for replies)`}
        </pre>
      </div>
    </div>
  ),
};

/**
 * ## Loading Message Component
 *
 * Shows a loading indicator while the AI is generating a response.
 *
 * ```tsx
 * import { Avatar, AvatarImage, AvatarFallback } from '@iblai/web-containers';
 *
 * interface LoadingMessageProps {
 *   mentorName: string;
 *   profileImage: string;
 * }
 *
 * export function LoadingMessage({ mentorName, profileImage }: LoadingMessageProps) {
 *   return (
 *     <div className="mb-4">
 *       <div className="flex items-start">
 *         <Avatar className="h-8 w-8 mr-3">
 *           <AvatarImage src={profileImage} alt={mentorName} />
 *           <AvatarFallback>{mentorName.substring(0, 2)}</AvatarFallback>
 *         </Avatar>
 *         <div className="bg-gray-100 rounded-lg p-3">
 *           <div className="flex space-x-1">
 *             <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
 *             <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
 *             <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
 *           </div>
 *         </div>
 *       </div>
 *     </div>
 *   );
 * }
 * ```
 */
export const LoadingMessageExample: Story = {
  render: () => (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Loading Message</h2>
      <p className="mb-6 text-gray-600">Animated loading indicator for AI responses</p>

      <div className="max-w-2xl mx-auto bg-white rounded-lg p-4">
        <pre className="text-xs bg-gray-100 p-4 rounded overflow-x-auto">
{`// Shows while waiting for AI response
// Displays mentor avatar and animated dots
// Use when: isPending || (isStreaming && !currentStreamingMessage)`}
        </pre>
      </div>
    </div>
  ),
};

/**
 * ## Recent/Pinned Messages Sidebar
 *
 * Sidebar component showing recent and pinned chat sessions.
 *
 * ```tsx
 * import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@iblai/web-containers';
 * import { useGetRecentMessageQuery, useGetPinnedMessagesQuery } from '@iblai/data-layer';
 *
 * interface ChatSidebarProps {
 *   tenantKey: string;
 *   userId: string;
 *   mentorId: string;
 *   onSelectSession: (sessionId: string) => void;
 *   currentSessionId?: string;
 * }
 *
 * export function ChatSidebar({
 *   tenantKey,
 *   userId,
 *   mentorId,
 *   onSelectSession,
 *   currentSessionId
 * }: ChatSidebarProps) {
 *   const { data: recentMessages } = useGetRecentMessageQuery({
 *     org: tenantKey,
 *     userId: userId,
 *   });
 *
 *   const { data: pinnedMessages } = useGetPinnedMessagesQuery({
 *     org: tenantKey,
 *     userId: userId,
 *     sessionId: currentSessionId,
 *   });
 *
 *   return (
 *     <div className="w-64 border-r bg-white p-4">
 *       <Accordion type="single" collapsible>
 *         {pinnedMessages?.results?.length > 0 && (
 *           <AccordionItem value="pinned">
 *             <AccordionTrigger>📌 Pinned</AccordionTrigger>
 *             <AccordionContent>
 *               {pinnedMessages.results.map((msg) => (
 *                 <button
 *                   key={msg.session_id}
 *                   onClick={() => onSelectSession(msg.session_id)}
 *                   className="w-full text-left p-2 hover:bg-gray-100 rounded"
 *                 >
 *                   <div className="text-sm truncate">
 *                     {msg.messages[0]?.message?.data?.content}
 *                   </div>
 *                 </button>
 *               ))}
 *             </AccordionContent>
 *           </AccordionItem>
 *         )}
 *
 *         <AccordionItem value="recent">
 *           <AccordionTrigger>💬 Recent</AccordionTrigger>
 *           <AccordionContent>
 *             {recentMessages?.results?.map((msg) => (
 *               <button
 *                 key={msg.session_id}
 *                 onClick={() => onSelectSession(msg.session_id)}
 *                 className="w-full text-left p-2 hover:bg-gray-100 rounded"
 *               >
 *                 <div className="text-sm truncate">
 *                   {msg.messages[0]?.message?.data?.content}
 *                 </div>
 *               </button>
 *             ))}
 *           </AccordionContent>
 *         </AccordionItem>
 *       </Accordion>
 *     </div>
 *   );
 * }
 * ```
 */
export const ChatSidebarExample: Story = {
  render: () => (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Chat Sidebar</h2>
      <p className="mb-6 text-gray-600">Recent and pinned messages navigation</p>

      <div className="max-w-2xl mx-auto bg-white rounded-lg p-4">
        <pre className="text-xs bg-gray-100 p-4 rounded overflow-x-auto">
{`// Features:
// - Pinned messages section
// - Recent messages section
// - Session selection
// - Pin/unpin messages
// - Export messages
// - Delete messages
// - Uses RTK Query hooks for data fetching`}
        </pre>
      </div>
    </div>
  ),
};

/**
 * ## Complete Chat Interface Example
 *
 * Full example combining all components with the useAdvancedChat hook.
 *
 * ```tsx
 * import { useAdvancedChat } from '@iblai/web-utils';
 *
 * export function ChatInterface() {
 *   const {
 *     messages,
 *     sendMessage,
 *     isStreaming,
 *     stopGenerating,
 *     sessionId,
 *     mentorName,
 *     profileImage,
 *     activeTab,
 *     changeTab,
 *     setMessage,
 *     currentStreamingMessage,
 *     isPending,
 *   } = useAdvancedChat({
 *     mentorId: 'mentor-123',
 *     mode: 'advanced',
 *     tenantKey: 'my-tenant',
 *     username: 'user123',
 *     token: 'auth-token',
 *     wsUrl: 'wss://api.iblai.app/ws/langflow/',
 *     stopGenerationWsUrl: 'wss://api.iblai.app/ws/langflow-stop-generation/',
 *     redirectToAuthSpa: (redirectTo?: string) => {
 *       window.location.href = `/auth?redirect=${redirectTo}`;
 *     },
 *   });
 *
 *   const handleSubmit = (content: string) => {
 *     sendMessage(activeTab, content, { visible: true });
 *   };
 *
 *   return (
 *     <div className="flex h-screen">
 *       <ChatSidebar
 *         tenantKey="my-tenant"
 *         userId="user123"
 *         mentorId="mentor-123"
 *         onSelectSession={(sessionId) => {
 *           // Load session messages
 *         }}
 *         currentSessionId={sessionId}
 *       />
 *
 *       <div className="flex-1 flex flex-col">
 *         <div className="flex-1 overflow-y-auto">
 *           {messages.length === 0 ? (
 *             <WelcomeScreen
 *               mentorName={mentorName}
 *               profileImage={profileImage}
 *               onPromptSelect={handleSubmit}
 *             />
 *           ) : (
 *             <ChatMessages
 *               messages={messages}
 *               profileImage={profileImage}
 *               mentorName={mentorName}
 *               sessionId={sessionId}
 *               onRetry={handleSubmit}
 *             />
 *           )}
 *
 *           {(isPending || isStreaming) && !currentStreamingMessage?.content && (
 *             <LoadingMessage mentorName={mentorName} profileImage={profileImage} />
 *           )}
 *         </div>
 *
 *         <ChatInputForm
 *           onSubmit={handleSubmit}
 *           isStreaming={isStreaming}
 *           stopGenerating={stopGenerating}
 *           sessionId={sessionId}
 *         />
 *       </div>
 *     </div>
 *   );
 * }
 * ```
 *
 * This creates a complete chat interface with:
 * - Sidebar for navigation
 * - Welcome screen for new chats
 * - Message list with auto-scroll
 * - Loading indicators
 * - Input form with file upload
 * - Real-time streaming
 */
export const CompleteIntegration: Story = {
  render: () => (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Complete Chat Interface</h2>
      <p className="mb-6 text-gray-600">
        Full integration example combining all chat components
      </p>

      <div className="max-w-4xl mx-auto space-y-4">
        <div className="bg-white rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">Implementation Checklist</h3>
          <ul className="space-y-2 text-sm">
            <li>✅ Install packages: @iblai/web-utils, @iblai/web-containers, @iblai/data-layer</li>
            <li>✅ Set up Redux store with data-layer API</li>
            <li>✅ Configure WebSocket URLs (wsUrl, stopGenerationWsUrl)</li>
            <li>✅ Implement authentication flow (redirectToAuthSpa)</li>
            <li>✅ Build message bubble components (AI and user)</li>
            <li>✅ Build input form with file upload</li>
            <li>✅ Build messages list with auto-scroll</li>
            <li>✅ Add loading indicators</li>
            <li>✅ Implement sidebar navigation (optional)</li>
            <li>✅ Handle error states and retry logic</li>
            <li>✅ Add accessibility features (ARIA labels, keyboard nav)</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">Key Data Flow</h3>
          <pre className="text-xs bg-gray-100 p-4 rounded overflow-x-auto">
{`1. User types message and clicks send
2. ChatInputForm calls onSubmit(content)
3. Parent component calls sendMessage(activeTab, content, options)
4. useAdvancedChat sends message via WebSocket
5. WebSocket receives streaming response
6. Redux state updated with new messages
7. ChatMessages re-renders with new messages
8. Auto-scroll to bottom
9. Show loading indicator while streaming
10. Hide loading when response complete`}
          </pre>
        </div>

        <div className="bg-white rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">File Upload Flow</h3>
          <pre className="text-xs bg-gray-100 p-4 rounded overflow-x-auto">
{`1. User selects files
2. Validate file types and sizes
3. Upload files to S3 (use useChatFileUpload hook)
4. Store file metadata in Redux
5. Display file preview in input area
6. When user sends message:
   - Include file references in message
   - Clear attached files
7. Display files in user message bubble`}
          </pre>
        </div>

        <div className="bg-white rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">Related Documentation</h3>
          <ul className="space-y-1 text-sm text-blue-600">
            <li>→ See "Chat Hooks" story for hook API details</li>
            <li>→ See "Auth Components" story for login/signup</li>
            <li>→ See web-utils README for utility functions</li>
            <li>→ See web-containers README for UI components</li>
            <li>→ See data-layer README for API hooks</li>
          </ul>
        </div>
      </div>
    </div>
  ),
};

/**
 * ## Additional Chat Features
 *
 * ### Message Actions
 *
 * - **Rating**: thumbs up/down for AI messages
 * - **Copy**: copy message content to clipboard
 * - **Share**: share chat session
 * - **Retry**: regenerate AI response
 * - **Reply**: reply to specific message
 *
 * ### File Handling
 *
 * - **Upload**: Drag & drop or click to upload
 * - **Preview**: Show image previews, file cards
 * - **Validation**: Check file types and sizes
 * - **Progress**: Show upload progress
 *
 * ### Advanced Features
 *
 * - **Multi-tab Chat**: Chat, Research, Code tabs
 * - **Tools**: Web browsing, code interpreter, image generation
 * - **Voice**: Voice input and voice call
 * - **Screen Sharing**: Share screen with AI
 * - **Guided Prompts**: Suggested follow-up questions
 *
 * ### Accessibility
 *
 * - **Keyboard Navigation**: Tab through messages and buttons
 * - **Screen Reader**: ARIA labels and live regions
 * - **Focus Management**: Trap focus in modals
 * - **Color Contrast**: WCAG AA compliant colors
 */
export const AdditionalFeatures: Story = {
  render: () => (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Additional Chat Features</h2>
      <p className="mb-6 text-gray-600">
        Advanced features you can add to your chat interface
      </p>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-4">
          <h3 className="font-semibold mb-2">Message Actions</h3>
          <ul className="text-sm space-y-1 text-gray-600">
            <li>• Rate AI responses (thumbs up/down)</li>
            <li>• Copy message to clipboard</li>
            <li>• Share chat session</li>
            <li>• Retry generation</li>
            <li>• Reply to message</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg p-4">
          <h3 className="font-semibold mb-2">File Upload</h3>
          <ul className="text-sm space-y-1 text-gray-600">
            <li>• Drag & drop files</li>
            <li>• Image preview</li>
            <li>• File type validation</li>
            <li>• Upload progress</li>
            <li>• Multiple file support</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg p-4">
          <h3 className="font-semibold mb-2">AI Tools</h3>
          <ul className="text-sm space-y-1 text-gray-600">
            <li>• Web browsing</li>
            <li>• Code interpreter</li>
            <li>• Image generation</li>
            <li>• Deep research</li>
            <li>• Google Docs/Slides</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg p-4">
          <h3 className="font-semibold mb-2">Communication</h3>
          <ul className="text-sm space-y-1 text-gray-600">
            <li>• Voice input (speech-to-text)</li>
            <li>• Voice call with AI</li>
            <li>• Screen sharing</li>
            <li>• Text streaming</li>
          </ul>
        </div>
      </div>
    </div>
  ),
};
