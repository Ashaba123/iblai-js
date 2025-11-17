"use client";

import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import {
  useCreateSessionIdMutation,
  useGetSessionIdQuery,
  useLazyGetSessionIdQuery,
} from "@iblai/data-layer";

import type { ChatMode } from "../../types";
import {
  advancedTabsProperties,
  ANONYMOUS_USERNAME,
  type AdvancedTab,
} from "../../utils";
import { useChat, Message } from "./use-chat-v2";
import {
  chatActions,
  selectActiveTab,
  selectChats,
  selectCurrentStreamingMessage,
  selectStreaming,
  selectSessionIds,
  selectSessionId,
  selectStatus,
  selectIsPending,
  selectIsStopped,
  selectIsError,
  ChatStatus,
  selectShouldStartNewChat,
  selectShowingSharedChat,
} from "../../features/chat/slice";
import { clearFiles } from "../../features";
import { useMentorSettings } from "../use-mentor-settings";
import { resourceLimits } from "worker_threads";

type Props = {
  mode?: ChatMode;
  tenantKey: string;
  mentorId: string;
  username: string;
  token: string;
  wsUrl: string;
  redirectToAuthSpa: (
    redirectTo?: string,
    platformKey?: string,
    logout?: boolean,
  ) => void;
  stopGenerationWsUrl: string;
  sendMessageToParentWebsite?: (payload: unknown) => void;
  errorHandler?: (message: string, error?: any) => void;
  isPreviewMode?: boolean;
  mentorShareableToken?: string | null;
  on402Error?: (message: Record<string, unknown>) => void;
  cachedSessionId?: string;
  onStartNewChat?: (sessionId: string) => void;
};

export function useAdvancedChat({
  tenantKey,
  mentorId,
  username = ANONYMOUS_USERNAME,
  token,
  wsUrl,
  stopGenerationWsUrl,
  redirectToAuthSpa,
  errorHandler,
  sendMessageToParentWebsite,
  isPreviewMode,
  mentorShareableToken,
  on402Error,
  cachedSessionId,
  onStartNewChat,
}: Props) {
  const dispatch = useDispatch();
  const [createSessionId, { isLoading: isLoadingSessionIds }] =
    useCreateSessionIdMutation();

  const chats = useSelector(selectChats);
  const streaming = useSelector(selectStreaming);
  const currentStreamingMessage = useSelector(selectCurrentStreamingMessage);
  const activeTab = useSelector(selectActiveTab);
  const sessionIds = useSelector(selectSessionIds);
  const sessionId = useSelector(selectSessionId);
  const status = useSelector(selectStatus);
  const isPending = useSelector(selectIsPending);
  const isStopped = useSelector(selectIsStopped);
  const isError = useSelector(selectIsError);
  const shouldStartNewChat = useSelector(selectShouldStartNewChat);
  const showingSharedChat = useSelector(selectShowingSharedChat);

  const { data: mentorSettings } = useMentorSettings({
    mentorId,
    tenantKey,
    username,
  });

  const onStreamingChange = (streamingState: boolean) => {
    dispatch(chatActions.setStreaming(streamingState));
  };

  const onStatusChange = (status: ChatStatus) => {
    dispatch(chatActions.setStatus(status));
  };

  const onStreamingMessageUpdate = (message: {
    id: string | null;
    content: string;
  }) => {
    dispatch(chatActions.setCurrentStreamingMessage(message));
  };

  const {
    sendMessage,
    stopGenerating,
    ws,
    isConnected,
    messageQueue,
    resetConnection,
  } = useChat({
    wsUrl,
    stopGenerationWsUrl,
    flowConfig: {
      name: mentorId,
      tenant: tenantKey,
      username,
      pathway: mentorId,
    },
    sessionId: cachedSessionId ?? sessionIds[activeTab],
    activeTab,
    wsToken: token,
    errorHandler,
    onStreamingChange,
    onStreamingMessageUpdate,
    redirectToAuthSpa,
    sendMessageToParentWebsite,
    onStatusChange,
    on402Error,
  });

  const [getSessionChats, { isError: isErrorGettingSessionChats }] =
    useLazyGetSessionIdQuery();

  useEffect(() => {
    const getChats: () => void = async () => {
      try {
        const { data } = await getSessionChats({
          sessionId: cachedSessionId ?? "",
          org: tenantKey,
          share: true,
        });
        let previousChats: any[] = [];
        try {
          previousChats =
            data?.results
              ?.map((result: any) => {
                return {
                  ...result,
                  role: result.type === "human" ? "user" : "assistant",
                  visible: true,
                  id: new Date().getTime(),
                  content:
                    typeof result.content === "object" &&
                    result.content.length > 0
                      ? result.content[0].text
                      : result.content,
                };
              })
              .reverse() || [];
        } catch (error) {
          console.error(JSON.stringify(error));
        }
        dispatch(chatActions.setNewMessages(previousChats));
      } catch (error) {
        console.error(JSON.stringify(error));
      }
    };
    if (cachedSessionId) {
      dispatch(chatActions.updateSessionIds(cachedSessionId));
      getChats();
    }
  }, [cachedSessionId]);

  useEffect(() => {
    if (isErrorGettingSessionChats) {
      // startNewChat();
    }
  }, [isErrorGettingSessionChats]);

  useEffect(() => {}, []);

  const startNewChat = React.useCallback(async () => {
    // Reset all chat state
    if (!showingSharedChat) {
      dispatch(chatActions.resetChats(undefined));
    }
    dispatch(chatActions.resetIsTyping(undefined));
    dispatch(chatActions.setStreaming(false));
    dispatch(chatActions.resetCurrentStreamingMessage(undefined));
    dispatch(chatActions.setTools([]));
    dispatch(clearFiles(undefined));

    if (isPreviewMode) {
      return;
    }

    // Fetch new session IDs
    try {
      const requestBody = { mentor: mentorId };
      if (mentorShareableToken) {
        // @ts-ignore
        requestBody["shareable_link_token"] = mentorShareableToken;
      }
      console.log(
        "[startNewChat] requestBody",
        tenantKey,
        username,
        JSON.stringify(requestBody),
      );
      const response = await createSessionId({
        org: tenantKey,
        // @ts-ignore
        userId: username,
        requestBody,
      }).unwrap();
      dispatch(chatActions.updateSessionIds(response.session_id));
      onStartNewChat?.(response.session_id);
    } catch (error) {
      errorHandler?.(`Failed to start new chat: ${JSON.stringify(error)}`);
      console.log(
        "[auth-redirect] Failed to start new chat",
        JSON.stringify({ error }),
      );
      redirectToAuthSpa(undefined, undefined, true);
    }
  }, [
    isPreviewMode,
    mentorId,
    tenantKey,
    username,
    token,
    createSessionId,
    dispatch,
    errorHandler,
  ]);

  React.useEffect(() => {
    if (!showingSharedChat || mentorSettings.allowAnonymous) {
      if (mentorSettings.allowAnonymous !== undefined && !cachedSessionId) {
        startNewChat();
      }
    }
  }, [shouldStartNewChat, showingSharedChat, mentorSettings.allowAnonymous]);

  React.useEffect(() => {
    if (sessionIds[activeTab] && sessionIds[activeTab] !== sessionId) {
      dispatch(chatActions.setSessionId(sessionIds[activeTab]));
      // Reset WebSocket connection when session ID changes
      resetConnection();
    }
  }, [sessionIds, activeTab, sessionId, resetConnection]);

  async function changeTab(tab: AdvancedTab) {
    // while responding to a message, do not change the tab
    if (streaming) {
      errorHandler?.("Cannot change tab while streaming");
      return;
    }

    dispatch(chatActions.setActiveTab(tab));

    if (isPreviewMode) return;

    // check if there's an active session id for the tab.
    const activeSessionId = sessionIds[tab];

    if (activeSessionId) return;

    try {
      const requestBody = { mentor: mentorId };
      if (mentorShareableToken) {
        // @ts-ignore
        requestBody["shareable_link_token"] = mentorShareableToken;
      }
      const response = await createSessionId({
        org: tenantKey,
        // @ts-ignore
        userId: username,
        requestBody,
      }).unwrap();

      dispatch(chatActions.updateSessionIds(response.session_id));

      // if the tab we are going to activate has no session Id (this is the first time we are creating the session for this tag)
      // we need to send a proactive prompt if the advanced tabs properties has no tag.
      // (presence of tag indicates an ACTIONABLE UI)
      if (!advancedTabsProperties[tab]?.tag) {
        for (const prompt of advancedTabsProperties[tab]?.prompts ?? []) {
          // @ts-ignore
          if (prompt.type === "human" && prompt?.proactive) {
            sendMessage(tab, prompt.content ?? "", { visible: false });
          }
        }
      }
    } catch (error) {
      errorHandler?.(`Failed to start new chat: ${error}`);
      return;
    }
  }

  const setMessage = (message: Message) => {
    dispatch(
      chatActions.addUserMessage({
        tab: activeTab,
        message,
      }),
    );
  };

  return {
    messages: chats[activeTab],
    isStreaming: streaming,
    status,
    isPending,
    isStopped,
    isError,
    currentStreamingMessage,
    activeTab,
    uniqueMentorId: mentorId,
    mentorName: mentorSettings?.mentorName ?? "",
    profileImage: mentorSettings?.profileImage ?? "",
    enabledGuidedPrompts: mentorSettings?.enableGuidedPrompts ?? true,
    sendMessage,
    stopGenerating,
    setMessage,
    changeTab,
    sessionId,
    startNewChat,
    isLoadingSessionIds,
    ws,
    isConnected,
    messageQueue,
    sessionIds,
    enableSafetyDisclaimer: mentorSettings?.safetyDisclaimer ?? false,
    resetConnection,
  };
}
