import { useState, useRef, useCallback, useEffect } from "react";

import type { AdvancedTab } from "../../utils/data/advanced-tab";

// Types
export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  url?: string;
  fileType?: string;
  contentType?: string;
  visible?: boolean;
}

type ChatState = Record<AdvancedTab, Message[]>;

export type SendMessageOptions = {
  visible?: boolean;
};

export interface UseChatProps {
  wsUrl: string;
  wsToken: string;
  flowConfig: {
    name: string;
    tenant: string;
    username: string;
    pathway: string;
  };
  sessionId: string;
  stopGenerationWsUrl: string;
  activeTab: AdvancedTab;
  enableHaptics?: boolean;
  hapticFeedback?: {
    impactAsync: (style: any) => Promise<void>;
  };
  // Optional store integration
  store?: {
    sendMessage?: (text: string) => Promise<void>;
  };
  // Optional WebSocket implementation
  WebSocketImpl?: typeof WebSocket;
  errorHandler?: (error: string) => void;
}

export interface UseChatReturn {
  messages: Message[];
  isTyping: boolean;
  sendMessage: (text: string, options?: SendMessageOptions) => Promise<void>;
  currentStreamingMessage: { id: string | null; content: string };
  ws: React.MutableRefObject<WebSocket | null>;
  isConnected: React.MutableRefObject<boolean>;
  messageQueue: React.MutableRefObject<any[]>;
  stopGenerating: () => void;
  streaming: boolean;
  setMessages: (messages: Message[]) => void;
}

const defaultChatState: ChatState = {
  chat: [],
  summarize: [],
  translate: [],
  expand: [],
};

export const useChat = ({
  wsUrl,
  wsToken,
  flowConfig,
  sessionId,
  stopGenerationWsUrl,
  activeTab,
  enableHaptics = false,
  hapticFeedback,
  store,
  errorHandler,
  WebSocketImpl = WebSocket,
}: UseChatProps): UseChatReturn => {
  const [chats, setChats] = useState<ChatState>(defaultChatState);
  const [isTyping, setIsTyping] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const ws = useRef<WebSocket | null>(null);
  const isConnected = useRef(false);
  const messageQueue = useRef<any[]>([]);
  const currentStreamingMessage = useRef<{
    id: string | null;
    content: string;
  }>({
    id: null,
    content: "",
  });
  const stopGenerationSocket = useRef<WebSocket | null>(null);

  const triggerHapticFeedback = useCallback(async () => {
    if (enableHaptics && hapticFeedback) {
      try {
        await hapticFeedback.impactAsync("medium");
      } catch (error) {
        console.warn("Haptic feedback failed:", error);
      }
    }
  }, [enableHaptics, hapticFeedback]);

  const initializeWebSocket = useCallback(() => {
    if (!wsUrl || !wsToken) {
      console.error("WebSocket URL or token is missing");
      return;
    }

    const socket = new WebSocketImpl(wsUrl);
    ws.current = socket;

    socket.addEventListener("open", () => {
      isConnected.current = true;

      // Send queued messages if any
      if (messageQueue.current.length > 0) {
        messageQueue.current.forEach((message) => {
          socket.send(JSON.stringify(message));
        });
        messageQueue.current = [];
      }
    });

    socket.addEventListener("message", (event: MessageEvent) => {
      try {
        const messageData =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        console.log("Received message:", messageData);

        // error handling
        if (messageData.error) {
          errorHandler?.(messageData.error);
          setIsTyping(false);
          return;
        }

        // Handle typing indicator
        if (messageData.type === "typing") {
          setIsTyping(!!messageData.isTyping);
          return;
        }

        // Handle start of new streaming session
        if (
          messageData.generation_id &&
          !messageData.data &&
          !messageData.hasOwnProperty("eos")
        ) {
          // Reset streaming state for new generation
          currentStreamingMessage.current = {
            id: messageData.generation_id,
            content: "",
          };
          setIsTyping(true);
          setStreaming(true);
          return;
        }

        // Handle streaming message content
        if (messageData.data !== undefined || messageData.eos !== undefined) {
          const messageText = messageData.data || "";

          // If we have content to add
          if (messageText) {
            currentStreamingMessage.current.content += messageText;

            // Update or create the message in the messages array
            setChats((prevChats) => {
              const messageExists = prevChats[activeTab].some(
                (msg) => msg.id === currentStreamingMessage.current.id,
              );

              if (messageExists) {
                // Update existing message
                return {
                  ...prevChats,
                  [activeTab]: prevChats[activeTab].map((msg) =>
                    msg.id === currentStreamingMessage.current.id
                      ? {
                          ...msg,
                          content: currentStreamingMessage.current.content,
                        }
                      : msg,
                  ),
                };
              } else {
                // Create new message
                return {
                  ...prevChats,
                  [activeTab]: [
                    ...prevChats[activeTab],
                    {
                      id: currentStreamingMessage.current.id!,
                      role: "assistant",
                      content: currentStreamingMessage.current.content,
                      timestamp: new Date().toISOString(),
                    },
                  ],
                };
              }
            });
          }

          // Handle end of stream
          if (messageData.eos) {
            setIsTyping(false);
            setStreaming(false);
            // Reset for next stream
            currentStreamingMessage.current = { id: null, content: "" };
          }
        }
      } catch (error) {
        console.error("Error processing message:", error);
        setIsTyping(false);
        setStreaming(false);
      }
    });

    socket.addEventListener("error", (error: Event) => {
      console.error("WebSocket error:", JSON.stringify(error));
      setIsTyping(false);
      setStreaming(false);
    });

    socket.addEventListener("close", () => {
      isConnected.current = false;
      setIsTyping(false);
      setStreaming(false);
    });

    return () => {
      socket.close();
    };
  }, [wsUrl, wsToken, WebSocketImpl, sessionId, activeTab]);

  const sendMessage = useCallback(
    async (
      text: string,
      { visible }: SendMessageOptions = { visible: true },
    ) => {
      if (!text.trim()) return;

      await triggerHapticFeedback();

      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content: text,
        timestamp: new Date().toISOString(),
        visible,
      };

      setChats((prev) => ({
        ...prev,
        [activeTab]: [...prev[activeTab], userMessage],
      }));
      setIsTyping(true);

      const messageData = {
        flow: flowConfig,
        session_id: sessionId,
        token: wsToken,
        prompt: text,
      };

      const socket = ws.current;
      if (socket) {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify(messageData));
        } else {
          messageQueue.current.push(messageData);
          console.log("WebSocket not connected, queuing message");
          setIsTyping(false);
        }
      } else {
        console.error("WebSocket connection not available");
        messageQueue.current.push(messageData);
        setIsTyping(false);
      }

      // Also send to store if provided
      if (store?.sendMessage) {
        await store.sendMessage(text);
      }
    },
    [flowConfig, sessionId, wsToken, store, triggerHapticFeedback],
  );

  const _endConnection = (): void => {
    if (ws?.current?.readyState === WebSocket.OPEN) {
      ws?.current?.close();
    }
    setStreaming(false);
    setIsTyping(false);
    (window as any).proActiveSession = null;
  };

  const handleStopGenerationSocketMessage = (event: MessageEvent): void => {
    let response = JSON.parse(event.data);
    if (response?.detail === "Stopped") {
      setIsTyping(false);
      setStreaming(false);
      stopGenerationSocket?.current?.close();
      _endConnection();
    }
  };

  const _initiateServerStopGeneration = (): void => {
    stopGenerationSocket?.current?.send(
      JSON.stringify({
        generation_id: currentStreamingMessage.current.id,
        name: flowConfig.name,
        tenant: flowConfig.tenant,
        username: flowConfig.username,
        token: wsToken,
      }),
    );
  };

  const _handleOpenStopGenerationConnection = (): void => {
    const stopGenerationSocket = new WebSocket(stopGenerationWsUrl);
    stopGenerationSocket.onopen = _initiateServerStopGeneration;
    stopGenerationSocket.onmessage = handleStopGenerationSocketMessage;
  };

  const stopGenerating = (): void => {
    _handleOpenStopGenerationConnection();
  };

  const setMessages = (messages: Message[]) => {
    setChats((prev) => ({
      ...prev,
      [activeTab]: messages,
    }));
  };

  // Initialize WebSocket on mount
  useEffect(() => {
    const cleanup = initializeWebSocket();
    return () => {
      cleanup?.();
    };
  }, [initializeWebSocket]);

  return {
    messages: chats[activeTab],
    isTyping,
    sendMessage,
    currentStreamingMessage: currentStreamingMessage.current,
    ws,
    isConnected,
    messageQueue,
    stopGenerating,
    streaming,
    setMessages,
  };
};
