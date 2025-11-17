import { useMemo } from "react";

import { useDispatch, useSelector } from "react-redux";
import {
  useGetToolsQuery,
  useEditSessionMutation,
  useGetPromptsSearchQuery,
} from "@iblai/data-layer";

import { ANONYMOUS_USERNAME, TOOLS } from "../../utils";
import {
  chatActions,
  selectTools,
  selectSessionId,
} from "../../features/chat/slice";
import { useMentorSettings } from "../use-mentor-settings";

function hasTool(tools: any, mentorSettings: any, toolSlug: string): boolean {
  // Early return if no tools or settings
  if (!tools || !mentorSettings?.mentorTools) {
    return false;
  }

  // Get enabled tool slugs once
  const enabledToolSlugs = new Set(
    mentorSettings.mentorTools.map((tool: { slug: string }) => tool.slug),
  );

  // Check if the specific tool exists in both available tools and enabled tools
  return tools.some(
    (tool: any) => tool.slug === toolSlug && enabledToolSlugs.has(tool.slug),
  );
}

type Props = {
  tenantKey: string;
  mentorId: string;
  username: string;
  errorHandler?: (message: string, error?: any) => void;
};

export function useMentorTools({
  tenantKey,
  mentorId,
  username = ANONYMOUS_USERNAME,
  errorHandler,
}: Props): {
  tools: any;
  activeTools: string[];
  updateSessionTools: (tool: string) => Promise<void>;
  setSessionTools: (tools: string[]) => Promise<void>;
  enableWebBrowsing: boolean;
  screenSharing: boolean;
  deepResearch: boolean;
  imageGeneration: boolean;
  codeInterpreter: boolean;
  promptsIsEnabled: boolean;
  googleSlidesIsEnabled: boolean;
  googleDocumentIsEnabled: boolean;
} {
  const dispatch = useDispatch();
  const activeTools = useSelector(selectTools);
  const sessionId = useSelector(selectSessionId);
  const [editSession] = useEditSessionMutation();

  const { data: tools } = useGetToolsQuery(
    {
      mentor: mentorId,
      org: tenantKey,
      // @ts-ignore
      userId: username ?? "",
    },
    {
      skip: !username || username === ANONYMOUS_USERNAME,
    },
  );

  const { data: mentorSettings } = useMentorSettings({
    mentorId,
    tenantKey,
    username,
  });

  const { data: prompts } = useGetPromptsSearchQuery(
    {
      org: tenantKey,
      username: username ?? "",
      category: "",
      limit: 10,
      offset: 0,
      mentor: mentorId,
      orderDirection: "asc",
    },
    {
      skip: !tenantKey || !username || !mentorId,
    },
  );

  const updateSessionTools = async (tool: string) => {
    const toolsToAdd = activeTools.includes(tool)
      ? activeTools.filter((t) => t !== tool)
      : [...activeTools, tool];

    try {
      await editSession({
        org: tenantKey,
        sessionId,
        // @ts-ignore
        userId: username,
        requestBody: { tools: toolsToAdd },
      }).unwrap();
      dispatch(chatActions.setTools(toolsToAdd));
    } catch (error) {
      errorHandler?.("Failed to update session", error);
    }
  };

  const setSessionTools = async (tools: string[]) => {
    try {
      await editSession({
        org: tenantKey,
        sessionId,
        // @ts-ignore
        userId: username,
        requestBody: { tools },
      }).unwrap();
      dispatch(chatActions.setTools(tools));
    } catch (error) {
      errorHandler?.("Failed to update session", error);
    }
  };

  const webBrowsingIsEnabled = useMemo(
    () => hasTool(tools, mentorSettings, TOOLS.WEB_SEARCH),
    [tools, mentorSettings],
  );

  const screenSharingIsEnabled = useMemo(
    () => hasTool(tools, mentorSettings, TOOLS.SCREEN_SHARE),
    [tools, mentorSettings],
  );

  const deepSearchIsEnabled = useMemo(
    () => hasTool(tools, mentorSettings, TOOLS.DEEP_RESEARCH),
    [tools, mentorSettings],
  );

  const imageGenerationIsEnabled = useMemo(
    () => hasTool(tools, mentorSettings, TOOLS.IMAGE_GENERATION),
    [tools, mentorSettings],
  );

  const codeInterpreterIsEnabled = useMemo(
    () => hasTool(tools, mentorSettings, TOOLS.CODE_INTERPRETER),
    [tools, mentorSettings],
  );

  const promptsIsEnabled = useMemo(
    () => !!(prompts?.results?.length && prompts?.results?.length > 0),
    [prompts?.results?.length],
  );

  const googleSlidesIsEnabled = useMemo(
    () => hasTool(tools, mentorSettings, TOOLS.GOOGLE_SLIDES),
    [tools, mentorSettings],
  );

  const googleDocumentIsEnabled = useMemo(
    () => hasTool(tools, mentorSettings, TOOLS.GOOGLE_DOCUMENT),
    [tools, mentorSettings],
  );

  return {
    tools,
    activeTools,
    updateSessionTools,
    setSessionTools,
    enableWebBrowsing: webBrowsingIsEnabled,
    screenSharing: screenSharingIsEnabled,
    deepResearch: deepSearchIsEnabled,
    imageGeneration: imageGenerationIsEnabled,
    codeInterpreter: codeInterpreterIsEnabled,
    promptsIsEnabled,
    googleSlidesIsEnabled,
    googleDocumentIsEnabled,
  };
}
