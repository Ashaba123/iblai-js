import { useGetTenantMetadataQuery } from "@iblai/data-layer";
import { loadMetadataConfig } from "./config-loader";
import { isJSON } from "@web-utils/utils";

export const useTenantMetadata = ({
  org,
  spa,
}: {
  org: string;
  spa?: string;
}) => {
  const { data, isLoading, isError } = useGetTenantMetadataQuery([{ org }]);

  const isSkillsAssignmentsFeatureHidden = () => {
    return data?.metadata?.hide_skills_profile_assignment_feature === true;
  };

  const isSkillsResumeFeatureHidden = () => {
    return data?.metadata?.hide_skills_resume_feature === true;
  };

  const isMentorAIEnabled = () => {
    return data?.metadata?.enable_sidebar_ai_mentor_display !== false;
  };

  const getEmbeddedMentorToUse = () => {
    return isJSON(data?.metadata?.skills_embedded_mentor_name)
      ? JSON.parse(data?.metadata?.skills_embedded_mentor_name)
      : null;
  };

  const isSkillsLeaderBoardEnabled = () => {
    return data?.metadata?.enable_skills_leaderboard_display !== false;
  };

  const getSupportEmail = () => {
    return data?.metadata?.support_email;
  };

  const getAllMetadatas = () => {
    const metadatas = loadMetadataConfig(spa);
    return metadatas.map((_metadata) => {
      return {
        ..._metadata,
        value: data?.metadata?.[_metadata.slug],
      };
    });
  };

  return {
    metadata: data?.metadata,
    platformName: data?.platform_name,
    isLoading,
    isError,
    isSkillsAssignmentsFeatureHidden,
    isSkillsResumeFeatureHidden,
    isMentorAIEnabled,
    isSkillsLeaderBoardEnabled,
    getEmbeddedMentorToUse,
    metadataLoaded: !isLoading && data?.metadata,
    getAllMetadatas,
    getSupportEmail,
  };
};
