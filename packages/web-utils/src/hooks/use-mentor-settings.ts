import {
  useGetMentorPublicSettingsQuery,
  useGetMentorSettingsQuery,
} from "@data-layer/index";

import { ANONYMOUS_USERNAME } from "@web-utils/utils";

type Props = {
  mentorId: string;
  tenantKey: string;
  username: string;
};

export function useMentorSettings({ mentorId, tenantKey, username }: Props) {
  const isLoggedIn = username !== ANONYMOUS_USERNAME;

  const { data: mentorSettings } = useGetMentorSettingsQuery(
    {
      mentor: mentorId,
      org: tenantKey,
      // @ts-ignore
      userId: username ?? "",
    },
    {
      skip: !username || !isLoggedIn,
    },
  );

  const { data: mentorPublicSettings } = useGetMentorPublicSettingsQuery(
    {
      mentor: mentorId,
      org: tenantKey,
    },
    {
      skip: !tenantKey || !mentorId,
    },
  );

  return {
    data: {
      profileImage: isLoggedIn
        ? mentorSettings?.profile_image
        : mentorPublicSettings?.profile_image,

      greetingMethod: isLoggedIn
        ? mentorSettings?.greeting_method
        : mentorPublicSettings?.greeting_method,

      proactiveResponse: isLoggedIn
        ? mentorSettings?.proactive_response
        : mentorPublicSettings?.proactive_response,

      // @ts-ignore
      llmProvider: isLoggedIn ? mentorSettings?.llm_provider : "",

      llmName: isLoggedIn
        ? mentorSettings?.llm_name
        : mentorPublicSettings?.llm_name,

      mentorUniqueId: isLoggedIn
        ? mentorSettings?.mentor_unique_id
        : mentorPublicSettings?.mentor_unique_id,

      mentorName: mentorSettings?.mentor ?? mentorPublicSettings?.mentor,

      enableGuidedPrompts: isLoggedIn
        ? mentorSettings?.enable_guided_prompts
        : mentorPublicSettings?.enable_guided_prompts,

      mentorSlug: isLoggedIn
        ? mentorSettings?.mentor_slug
        : mentorPublicSettings?.mentor_slug,

      safetyDisclaimer: isLoggedIn
        ? mentorSettings?.metadata?.safety_disclaimer
        : mentorPublicSettings?.metadata?.safety_disclaimer,

      mentorTools: isLoggedIn
        ? mentorSettings?.mentor_tools
        : mentorPublicSettings?.mentor_tools,

      allowAnonymous:
        mentorSettings?.allow_anonymous ??
        mentorPublicSettings?.allow_anonymous,
    },
  };
}
