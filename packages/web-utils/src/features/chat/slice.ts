import { createSlice, PayloadAction, Slice } from "@reduxjs/toolkit";

import type { AdvancedTab } from "../../utils";
import type { Message } from "../../hooks/chat/use-chat-v2";
import { advancedTabsProperties } from "../../utils";

export type ChatState = Record<AdvancedTab, Message[]>;

export interface SessionIds extends Record<AdvancedTab, string> {}

export type StreamingMessage = {
  id: string;
  content: string;
};

export const defaultSessionIds: SessionIds = Object.fromEntries(
  Object.keys(advancedTabsProperties).map((key) => [key, ""]),
) as SessionIds;

const defaultChatState: ChatState = Object.fromEntries<Message[]>(
  Object.keys(advancedTabsProperties).map((key) => [key as AdvancedTab, []]),
) as ChatState;

export type ChatStatus = "idle" | "pending" | "streaming" | "stopped" | "error";

type ChatSliceState = {
  chats: ChatState;
  isTyping: boolean;
  streaming: boolean;
  currentStreamingMessage: StreamingMessage;
  activeTab: AdvancedTab;
  sessionId: string;
  sessionIds: SessionIds;
  status: ChatStatus;
  tools: string[];
  token: string | null;
  tokenEnabled: boolean;
  iframeContext: {
    hostInfo: {
      title: string;
      href: string;
    };
    pageContent: string;
  };
  documentFilter: Record<string, unknown> | null;
  shouldStartNewChat: boolean;
  showingSharedChat: boolean;
};

const initialState: ChatSliceState = {
  chats: defaultChatState,
  isTyping: false,
  streaming: false,
  status: "idle",
  currentStreamingMessage: {
    id: "",
    content: "",
  },
  activeTab: "chat",
  sessionId: "",
  sessionIds: defaultSessionIds,
  tools: [],
  iframeContext: {
    hostInfo: {
      title: "",
      href: "",
    },
    pageContent: "",
  },
  documentFilter: null,
  token: null,
  tokenEnabled: false,
  showingSharedChat: false,
  shouldStartNewChat: false,
};

const chatSlice: Slice<ChatSliceState> = createSlice({
  name: "chatSliceShared",
  initialState,
  reducers: {
    setChats: (state, action: PayloadAction<ChatState>) => {
      state.chats = action.payload;
    },

    appendMessageToActiveTab: (state) => {
      const lastMessageInActiveTabMessages =
        state.chats[state.activeTab][state.chats[state.activeTab].length - 1];

      if (
        lastMessageInActiveTabMessages.id !== state.currentStreamingMessage.id
      ) {
        const temp = {
          id: state.currentStreamingMessage.id,
          role: "assistant" as const,
          content: state.currentStreamingMessage.content,
          timestamp: new Date().toISOString(),
          visible: true,
        };

        state.chats = {
          ...state.chats,
          [state.activeTab]: [...state.chats[state.activeTab], temp],
        };
      } else {
        const temp = {
          ...lastMessageInActiveTabMessages,
          content: state.currentStreamingMessage.content,
        };

        state.chats = {
          ...state.chats,
          [state.activeTab]: [
            ...state.chats[state.activeTab].slice(0, -1),
            temp,
          ],
        };
      }
    },

    addUserMessage: (
      state,
      action: PayloadAction<{
        tab: AdvancedTab;
        message: Message;
      }>,
    ) => {
      const { tab, message } = action.payload;
      state.chats = {
        ...state.chats,
        [tab]: [...state.chats[tab], message],
      };
    },
    setNewMessages: (state, action: PayloadAction<Message[]>) => {
      state.chats = {
        ...state.chats,
        [state.activeTab]: action.payload,
      };
    },
    resetChats: (state) => {
      state.chats = defaultChatState;
    },
    setIsTyping: (state, action: PayloadAction<boolean>) => {
      state.isTyping = action.payload;
    },
    resetIsTyping: (state) => {
      state.isTyping = false;
    },
    setStreaming: (state, action: PayloadAction<boolean>) => {
      state.streaming = action.payload;
    },
    setCurrentStreamingMessage: (
      state,
      action: PayloadAction<StreamingMessage>,
    ) => {
      state.currentStreamingMessage = action.payload;
    },
    resetCurrentStreamingMessage: (state) => {
      state.currentStreamingMessage = { id: "", content: "" };
    },
    setActiveTab: (state, action: PayloadAction<AdvancedTab>) => {
      state.activeTab = action.payload;
    },
    resetActiveTab: (state) => {
      state.activeTab = "chat";
    },
    setSessionIds: (state, action: PayloadAction<SessionIds>) => {
      state.sessionIds = action.payload;
    },
    resetSessionIds: (state) => {
      state.sessionIds = defaultSessionIds;
    },
    updateSessionIds: (state, action: PayloadAction<string>) => {
      state.sessionIds[state.activeTab] = action.payload;
    },
    setIframeContext: (
      state,
      action: PayloadAction<{
        hostInfo: {
          title: string;
          href: string;
        };
        pageContent: string;
      }>,
    ) => {
      state.iframeContext = action.payload;
    },
    setDocumentFilter: (
      state,
      action: PayloadAction<Record<string, unknown>>,
    ) => {
      state.documentFilter = action.payload;
    },
    setStatus: (state, action: PayloadAction<ChatStatus>) => {
      state.status = action.payload;
    },
    setTools: (state, action: PayloadAction<string[]>) => {
      state.tools = action.payload;
    },
    updateToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },
    updateTokenEnabled: (state, action: PayloadAction<boolean>) => {
      state.tokenEnabled = action.payload;
    },
    setShouldStartNewChat: (state, action: PayloadAction<boolean>) => {
      state.shouldStartNewChat = action.payload;
    },
    setShowingSharedChat: (state, action: PayloadAction<boolean>) => {
      state.showingSharedChat = action.payload;
    },
    updateFileUrlInMessage: (
      state,
      action: PayloadAction<{
        fileId: string;
        fileName: string;
        fileUrl: string;
      }>,
    ) => {
      const { fileId, fileUrl } = action.payload;
      // Update all tabs' messages that have this file
      Object.keys(state.chats).forEach((tab) => {
        state.chats[tab as AdvancedTab] = state.chats[tab as AdvancedTab].map(
          (message) => {
            if (message.fileAttachments && message.fileAttachments.length > 0) {
              const updatedAttachments = message.fileAttachments.map(
                (attachment) => {
                  // Match by fileId
                  if (attachment.fileId === fileId) {
                    return { ...attachment, uploadUrl: fileUrl };
                  }
                  return attachment;
                },
              );
              return { ...message, fileAttachments: updatedAttachments };
            }
            return message;
          },
        );
      });
    },
  },
});

export const chatActions = chatSlice.actions;

export const chatSliceReducerShared = chatSlice.reducer;

export const selectChats = (state: { chatSliceShared: ChatSliceState }) =>
  state.chatSliceShared.chats;

export const selectIsTyping = (state: { chatSliceShared: ChatSliceState }) =>
  state.chatSliceShared.isTyping;

export const selectStreaming = (state: { chatSliceShared: ChatSliceState }) =>
  state.chatSliceShared.status === "streaming";

export const selectStatus = (state: { chatSliceShared: ChatSliceState }) =>
  state.chatSliceShared.status;

export const selectIsPending = (state: { chatSliceShared: ChatSliceState }) =>
  state.chatSliceShared.status === "pending";

export const selectIsStopped = (state: { chatSliceShared: ChatSliceState }) =>
  state.chatSliceShared.status === "stopped";

export const selectIsError = (state: { chatSliceShared: ChatSliceState }) =>
  state.chatSliceShared.status === "error";

export const selectCurrentStreamingMessage = (state: {
  chatSliceShared: ChatSliceState;
}) => state.chatSliceShared.currentStreamingMessage;

export const selectActiveTab = (state: { chatSliceShared: ChatSliceState }) =>
  state.chatSliceShared.activeTab;

export const selectSessionId = (state: { chatSliceShared: ChatSliceState }) =>
  state.chatSliceShared.sessionIds[state.chatSliceShared.activeTab];

export const selectSessionIds = (state: { chatSliceShared: ChatSliceState }) =>
  state.chatSliceShared.sessionIds;

export const selectIframeContext = (state: {
  chatSliceShared: ChatSliceState;
}) => state.chatSliceShared.iframeContext;

export const selectDocumentFilter = (state: {
  chatSliceShared: ChatSliceState;
}) => state.chatSliceShared.documentFilter;

export const selectTools = (state: { chatSliceShared: ChatSliceState }) =>
  state.chatSliceShared.tools;

export const selectToken = (state: { chatSliceShared: ChatSliceState }) =>
  state.chatSliceShared.token;
export const selectTokenEnabled = (state: {
  chatSliceShared: ChatSliceState;
}) => state.chatSliceShared.tokenEnabled;
export const selectActiveChatMessages = (state: {
  chatSliceShared: ChatSliceState;
}) => state.chatSliceShared.chats[state.chatSliceShared.activeTab];

export const selectNumberOfActiveChatMessages = (state: {
  chatSliceShared: ChatSliceState;
}) => state.chatSliceShared.chats[state.chatSliceShared.activeTab].length;

export const selectShouldStartNewChat = (state: {
  chatSliceShared: ChatSliceState;
}) => state.chatSliceShared.shouldStartNewChat;

export const selectShowingSharedChat = (state: {
  chatSliceShared: ChatSliceState;
}) => state.chatSliceShared.showingSharedChat;
