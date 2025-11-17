"use client";

import { useRef, useCallback, useEffect } from "react";

import type { AdvancedTab } from "../../utils/data/advanced-tab";
import { useAuthContext } from "@web-utils/providers";
import {
  chatActions,
  selectDocumentFilter,
  selectIframeContext,
  selectToken,
} from "@web-utils/features";
import { useDispatch, useSelector } from "react-redux";
import { ChatStatus } from "@web-utils/features";
import { MAX_INITIAL_WEBSOCKET_CONNECTION_ATTEMPTS } from "../../utils/constants";
import { FileReference } from "../../types/file-upload";

// Types

type MessageActionTypes = "redirectToAuthSpaJoinTenant";

export interface MessageAction {
  text: string;
  type: "primary" | "danger";
  actionType: MessageActionTypes;
}
export interface FileAttachment {
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadUrl?: string;
  fileId?: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  url?: string;
  fileType?: string;
  contentType?: string;
  visible: boolean;
  actions?: MessageAction[];
  fileAttachments?: FileAttachment[];
}

export type SendMessageOptions =
  | {
      visible?: boolean;
      fileReferences?: FileReference[];
    }
  | undefined;

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
  redirectToAuthSpa: (
    redirectTo?: string,
    platformKey?: string,
    logout?: boolean,
  ) => void;

  // Optional store integration
  store?: {
    sendMessage?: (text: string) => Promise<void>;
  };

  // Optional WebSocket implementation
  WebSocketImpl?: typeof WebSocket;
  errorHandler?: (message: string, error?: any) => void;

  // State update callbacks
  onStatusChange: (status: ChatStatus) => void;
  onStreamingChange: (streaming: boolean) => void;
  onStreamingMessageUpdate: (message: {
    id: string | null;
    content: string;
  }) => void;
  onAddUserMessage?: (activeTab: AdvancedTab, message: Message) => void;
  sendMessageToParentWebsite?: (payload: unknown) => void;
  on402Error?: (message: Record<string, unknown>) => void;
  cachedSessionId?: string;
}

export interface UseChatReturn {
  sendMessage: (
    tab: AdvancedTab,
    text: string,
    options?: SendMessageOptions,
  ) => Promise<void>;
  ws: React.MutableRefObject<WebSocket | null>;
  isConnected: React.MutableRefObject<boolean>;
  messageQueue: React.MutableRefObject<any[]>;
  stopGenerating: () => void;
  resetConnection: () => void;
}

export const useChat = ({
  wsUrl,
  wsToken,
  flowConfig,
  sessionId,
  stopGenerationWsUrl,
  enableHaptics = false,
  hapticFeedback,
  store,
  errorHandler,
  onStatusChange,
  onStreamingChange,
  onStreamingMessageUpdate,
  WebSocketImpl = WebSocket,
  redirectToAuthSpa,
  sendMessageToParentWebsite,
  on402Error,
  cachedSessionId,
}: UseChatProps): UseChatReturn => {
  const dispatch = useDispatch();
  const isWebSocketPaused = useRef<boolean>(false);
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
  const isInitialConnection = useRef<boolean>(true);
  const connectionAttempts = useRef<number>(0);
  const { userIsAccessingPublicRoute } = useAuthContext();
  const iframeContext = useSelector(selectIframeContext);
  const documentFilter = useSelector(selectDocumentFilter);
  const linkToken = useSelector(selectToken);

  const triggerHapticFeedback = useCallback(async () => {
    if (enableHaptics && hapticFeedback) {
      try {
        await hapticFeedback.impactAsync("medium");
      } catch (error) {
        console.warn("Haptic feedback failed:", error);
      }
    }
  }, [enableHaptics, hapticFeedback]);

  const initializeWebSocket = () => {
    console.log("initializeWebSocket", wsUrl);
    if (!wsUrl) {
      console.error("WebSocket URL is missing");
      return;
    }

    if (!wsToken) {
      if (!userIsAccessingPublicRoute) {
        console.log(
          "[auth-redirect] WebSocket token is missing for non-anonymous user",
        );
        redirectToAuthSpa(undefined, undefined, true);
        return;
      }
    }

    const socket = new WebSocketImpl(wsUrl);
    ws.current = socket;
    console.log("socket", socket);

    socket.addEventListener("open", () => {
      isConnected.current = true;
      isInitialConnection.current = false;
      connectionAttempts.current = 0;

      // Send queued messages if any
      if (messageQueue.current.length > 0) {
        messageQueue.current.forEach((message) => {
          socket.send(JSON.stringify(message));
        });
        messageQueue.current = [];
      }
    });

    socket.addEventListener("error", (error: Event) => {
      connectionAttempts.current += 1;

      // Only show error to user after initial attempts or if not first connection
      const shouldShowError =
        !isInitialConnection.current ||
        connectionAttempts.current > MAX_INITIAL_WEBSOCKET_CONNECTION_ATTEMPTS;

      if (shouldShowError) {
        errorHandler?.("Failed to connect to the mentor", error);
        onStatusChange("error");
      } else {
        console.warn("Initial connection attempt failed, will retry...");
      }
      onStreamingChange?.(false);
    });

    socket.addEventListener("message", (event: MessageEvent) => {
      if (isWebSocketPaused.current) return;

      try {
        const messageData =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        // error handling
        if (messageData.error) {
          if (messageData?.status_code === 402 && on402Error) {
            on402Error?.(messageData);
            return;
          }
          errorHandler?.(messageData.error, messageData.error);
          onStatusChange("error");
          onStreamingChange(false);
          return;
        }

        // Handle typing indicator
        if (messageData.type === "typing") {
          onStatusChange("pending");
          onStreamingChange(!!messageData.isTyping);
          return;
        }

        // Handle file processing success
        if (messageData.type === "file_processing_success") {
          console.log("🟣 File processing success:", messageData);
          dispatch(
            chatActions.updateFileUrlInMessage({
              fileId: messageData.file_id,
              fileName: messageData.file_name,
              fileUrl: messageData.file_url,
            }),
          );
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

          onStreamingMessageUpdate?.(currentStreamingMessage.current);
          onStatusChange("streaming");
          onStreamingChange(true);
          return;
        }

        // Handle streaming message content
        if (messageData.data !== undefined || messageData.eos !== undefined) {
          const messageText = messageData.data || "";

          // If we have content to add
          if (messageText) {
            currentStreamingMessage.current = {
              ...currentStreamingMessage.current,
              content: currentStreamingMessage.current.content + messageText,
            };
            onStreamingMessageUpdate?.(currentStreamingMessage.current);

            // Update or add message in Redux store
            if (currentStreamingMessage.current.id) {
              dispatch(
                chatActions.appendMessageToActiveTab({
                  id: currentStreamingMessage.current.id,
                  content: currentStreamingMessage.current.content,
                }),
              );
            }
          }

          // Handle end of stream
          if (messageData.eos) {
            // Final update to Redux store with complete message
            if (
              currentStreamingMessage.current.id &&
              currentStreamingMessage.current.content
            ) {
              dispatch(
                chatActions.appendMessageToActiveTab({
                  id: currentStreamingMessage.current.id,
                  content: currentStreamingMessage.current.content,
                }),
              );
            }

            onStreamingChange?.(false);
            onStatusChange("stopped");
            // Reset for next stream
            currentStreamingMessage.current = { id: null, content: "" };
            onStreamingMessageUpdate?.(currentStreamingMessage.current);
          }
        }
      } catch (error) {
        console.error("Error processing message:", error);
        onStreamingChange?.(false);
        onStatusChange("error");
      }
    });

    socket.addEventListener("error", (error: Event) => {
      console.error("WebSocket error:", error);
      onStreamingChange?.(false);
      onStatusChange("error");
    });

    socket.addEventListener("close", () => {
      isConnected.current = false;
      onStreamingChange?.(false);

      // If this is an initial connection failure and we haven't exceeded max attempts
      if (
        isInitialConnection.current &&
        connectionAttempts.current < MAX_INITIAL_WEBSOCKET_CONNECTION_ATTEMPTS
      ) {
        console.log(
          `Initial connection closed, attempting retry ${
            connectionAttempts.current + 1
          }/${MAX_INITIAL_WEBSOCKET_CONNECTION_ATTEMPTS}`,
        );
        // Retry with exponential backoff
        const backoffDelay = Math.min(
          1000 * Math.pow(2, connectionAttempts.current),
          5000,
        );
        setTimeout(() => {
          if (isInitialConnection.current) {
            initializeWebSocket();
          }
        }, backoffDelay);
      } else {
        onStatusChange("stopped");
        // Only show error if we've exhausted retries during initial connection
        if (
          isInitialConnection.current &&
          connectionAttempts.current >=
            MAX_INITIAL_WEBSOCKET_CONNECTION_ATTEMPTS
        ) {
          errorHandler?.(
            "Failed to connect to the mentor after multiple attempts",
          );
          onStatusChange("error");
          isInitialConnection.current = false;
        }
      }
    });

    return () => {
      if (socket.readyState === WebSocketImpl.OPEN) {
        socket.close();
      }
    };
  };

  const sendMessage = useCallback(
    async (tab: AdvancedTab, text: string, options: SendMessageOptions) => {
      dispatch(chatActions.setShowingSharedChat(false));

      // Allow sending if there's text OR file references
      if (
        !text.trim() &&
        (!options?.fileReferences || options.fileReferences.length === 0)
      ) {
        return;
      }

      onStatusChange("pending");

      isWebSocketPaused.current = false;

      await triggerHapticFeedback();

      // Create file attachments array from file references if present
      const fileAttachments: FileAttachment[] | undefined =
        options?.fileReferences?.map((ref) => ({
          fileName: ref.file_name,
          fileType: ref.content_type,
          fileSize: ref.file_size,
          uploadUrl: ref.upload_url, // Include URL for display
          fileId: ref.file_id, // Include fileId for matching WebSocket updates
        }));

      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content: text,
        timestamp: new Date().toISOString(),
        visible: options?.visible ?? true,
        fileAttachments,
      };

      // Notify parent to add user message
      // onAddUserMessage?.(tab, userMessage);

      dispatch(
        chatActions.addUserMessage({
          tab,
          message: userMessage,
        }),
      );

      let messageData: Record<string, unknown> = {
        flow: flowConfig,
        session_id: sessionId,
        token: wsToken,
        prompt: text || "", // Allow empty prompt when sending files
      };

      if (options?.fileReferences && options.fileReferences.length > 0) {
        messageData = {
          ...messageData,
          file_references: options.fileReferences,
        };
      }

      if (iframeContext.pageContent) {
        messageData = {
          ...messageData,
          page_content: iframeContext.pageContent,
        };
      }

      if (documentFilter) {
        messageData = {
          ...messageData,
          document_filter: documentFilter,
        };
      }

      if (linkToken) {
        messageData = {
          ...messageData,
          token: linkToken,
          token_type: "link",
        };
      }

      let socket = ws.current;
      if (!socket || socket.readyState === WebSocket.CLOSED) {
        console.log("WebSocket not open, re-initializing connection...");
        resetConnection();
        initializeWebSocket();
        socket = ws.current;
      }

      if (socket) {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify(messageData));
        } else {
          messageQueue.current.push(messageData);
        }
      } else {
        console.error("WebSocket connection could not be established.");
        messageQueue.current.push(messageData);
      }

      // Also send to store if provided
      if (store?.sendMessage) {
        await store.sendMessage(text);
      }
    },
    [
      flowConfig,
      sessionId,
      wsToken,
      store,
      triggerHapticFeedback,
      // onAddUserMessage,
    ],
  );

  const _pauseConnection = (): void => {
    if (ws?.current?.readyState === WebSocket.OPEN) {
      isWebSocketPaused.current = true;
      onStreamingChange?.(false);
      onStatusChange("stopped");
    }
  };

  const handleStopGenerationSocketMessage = (event: MessageEvent): void => {
    let response = JSON.parse(event.data);
    onStreamingChange?.(false);
    onStatusChange("stopped");
    _pauseConnection();

    if (response?.detail === "Stopped") {
      stopGenerationSocket?.current?.close();
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
    isWebSocketPaused.current = true;
    stopGenerationSocket.current = new WebSocket(stopGenerationWsUrl);

    stopGenerationSocket.current.onopen = _initiateServerStopGeneration;
    stopGenerationSocket.current.onmessage = handleStopGenerationSocketMessage;
  };

  const stopGenerating = (): void => {
    _handleOpenStopGenerationConnection();
  };

  const resetConnection = (): void => {
    // Close existing connections
    if (ws?.current?.readyState === WebSocket.OPEN) {
      ws?.current?.close();
    }

    if (stopGenerationSocket?.current?.readyState === WebSocket.OPEN) {
      stopGenerationSocket?.current?.close();
    }

    // Reset state
    isConnected.current = false;
    messageQueue.current = [];
    currentStreamingMessage.current = { id: null, content: "" };
    isInitialConnection.current = true;
    connectionAttempts.current = 0;

    // Reset parent state
    onStreamingChange?.(false);
    onStatusChange("idle");
    onStreamingMessageUpdate?.(currentStreamingMessage.current);
  };

  // Initialize WebSocket on mount
  useEffect(() => {
    const cleanup = initializeWebSocket();

    // Close WebSocket connection on unmount
    // Reset connection on unmount
    return (): void => {
      cleanup?.();
      resetConnection();
    };
  }, []);

  useEffect(() => {
    sendMessageToParentWebsite?.({ loaded: true, auth: { ...localStorage } });
  }, []);

  return {
    sendMessage,
    ws,
    isConnected,
    messageQueue,
    stopGenerating,
    resetConnection,
  };
};
