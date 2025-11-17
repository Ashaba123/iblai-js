'use client';

import { useEffect, useState } from 'react';
import { Switch } from '@web-containers/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@web-containers/components/ui/select';
import { Input } from '@web-containers/components/ui/input';
import { Info } from 'lucide-react';
import { useUpdateTenantMetadataMutation } from '@iblai/data-layer';
import { useGetCustomMentorsQuery } from '@iblai/data-layer';
import { toast } from 'sonner';
import { TenantMetadata, useTenantMetadata } from '@iblai/web-utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@web-containers/components/ui/tooltip';
import { SmtpContent } from './smtp';
import { PlatformMembershipContent } from './platform-membership';
import { CustomDomainsContent } from './custom-domain';
import { StudentMentorCreationContent } from './student-mentor-creation';
import { RecommendationSystemPromptsContent } from './recommendation-system-prompts';
import { AuthSpaCustomizationContent } from './auth-spa-customization';
import { ChatAreaWidth } from './chat-area-width';
import { ContentViewWrapper } from '@web-containers/components/content-view-wrapper';

export default function AdvancedTab({
  platformKey,
  username,
  currentSPA,
  authURL,
}: {
  platformKey: string;
  username: string;
  currentSPA?: string;
  authURL: string;
}) {
  const [updateTenantMetadata, { isLoading: isUpdatingTenantMetadata }] =
    useUpdateTenantMetadataMutation();

  // Mentor search state
  const [mentorSearchQuery, setMentorSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  const { metadataLoaded, metadata, getAllMetadatas } = useTenantMetadata({
    org: platformKey,
    spa: currentSPA,
  });

  // Debounce effect for search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(mentorSearchQuery);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [mentorSearchQuery]);

  // Mentor search query
  const { data: mentorsData, isLoading: isMentorsLoading } = useGetCustomMentorsQuery({
    tenantKey: platformKey,
    username: username,
    params: {
      query: debouncedSearchQuery,
      limit: 20,
    },
  });

  const [flagTenantMetadatas, setFlagTenantMetadatas] = useState<TenantMetadata[]>([]);

  useEffect(() => {
    if (metadataLoaded) {
      const allMetadatas = getAllMetadatas();
      // Include both boolean and string settings
      const configurableMetadatas = allMetadatas.filter(
        (metadata) =>
          typeof metadata.defaultValue === 'boolean' ||
          (typeof metadata.defaultValue === 'string' &&
            metadata.slug === 'skills_embedded_mentor_name'),
      );

      if (currentSPA) {
        // Filter by current SPA if specified (case-insensitive partial matching)
        setFlagTenantMetadatas(
          configurableMetadatas.filter((metadata) => {
            const spaName = String(metadata.SPA || '').toLowerCase();
            const searchTerm = String(currentSPA).toLowerCase();
            return spaName.includes(searchTerm) || searchTerm.includes(spaName);
          }),
        );
      } else {
        // Show all configurable settings when no SPA is specified
        setFlagTenantMetadatas(configurableMetadatas);
      }
    }
  }, [metadataLoaded, currentSPA]);

  const updateOrganizationMetadata = async (key: string, value: any, callback: () => void) => {
    try {
      await updateTenantMetadata([
        {
          org: platformKey,
          // @ts-expect-error requestBody is not part of the useUpdateTenantMetadataMutation Query Definition
          requestBody: {
            metadata: { ...metadata, [key]: value },
          },
        },
      ]).unwrap();
      callback();
    } catch (error) {
      console.error(JSON.stringify(error));
      toast.error('Failed to update setting');
    }
  };

  const updateMultipleOrganizationMetadata = async (
    updatedMetadata: Record<string, any>,
    callback: () => void,
  ) => {
    try {
      await updateTenantMetadata([
        {
          org: platformKey,
          // @ts-expect-error requestBody is not part of the useUpdateTenantMetadataMutation Query Definition
          requestBody: {
            metadata: { ...metadata, ...updatedMetadata },
          },
        },
      ]).unwrap();
      callback();
    } catch (error) {
      console.error(JSON.stringify(error));
      toast.error('Failed to update setting');
    }
  };

  const handleToggleSetting = async (slug: string, currentValue: boolean) => {
    const newValue = !currentValue;
    updateOrganizationMetadata(slug, newValue, () => {
      toast.success('Setting updated successfully');
      // Update local state by refreshing the metadata
      setFlagTenantMetadatas(
        getAllMetadatas().filter(
          (metadata) =>
            String(metadata.SPA).toLowerCase().includes(String(currentSPA).toLowerCase()) &&
            typeof metadata.defaultValue === 'boolean',
        ),
      );
    });
  };

  const handleMentorSelection = async (slug: string, mentorUniqueId: string) => {
    // Handle "None" selection
    if (mentorUniqueId === 'none') {
      const updatedMetadata = {
        [slug]: null,
        enable_sidebar_ai_mentor_display: false,
      };
      // Set mentor to null and disable sidebar display
      await updateMultipleOrganizationMetadata(updatedMetadata, () => {
        toast.success('Mentor setting updated successfully');
      });
      return;
    }

    // @ts-ignore
    const mentor = mentorsData?.results?.find((m) => m.unique_id === mentorUniqueId);
    const mentorObject = mentor
      ? {
          name: mentor.name,
          unique_id: mentor.unique_id,
          id: mentor.id,
        }
      : null;

    // Stringify the object as JSON before saving
    const mentorJson = mentorObject ? JSON.stringify(mentorObject) : null;
    const updatedMetadata = {
      [slug]: mentorJson,
      enable_sidebar_ai_mentor_display: true,
    };
    await updateMultipleOrganizationMetadata(updatedMetadata, () => {
      toast.success('Mentor setting updated successfully');
    });
  };

  const handleMentorSearch = (query: string) => {
    setMentorSearchQuery(query);
  };

  const handleChatAreaSizeUpdate = (size: number) => {
    updateOrganizationMetadata('chat_area_size', size, () => {
      toast.success('Chat area size updated successfully');
    });
  };

  const handleChatAreaSizeError = (message: string) => {
    toast.error(message);
  };

  // Helper function to get mentor name from JSON string, object, or unique_id
  const getMentorName = (mentorValue: any) => {
    // Handle JSON string format
    if (typeof mentorValue === 'string') {
      try {
        const parsed = JSON.parse(mentorValue);
        if (parsed && typeof parsed === 'object' && parsed.name) {
          return parsed.name;
        }
      } catch (e) {
        // If JSON parsing fails, treat as legacy string format
        const mentor = mentorsData?.results?.find((m) => m.unique_id === mentorValue);
        return mentor?.name || mentorValue;
      }
    }

    // Handle object format
    if (typeof mentorValue === 'object' && mentorValue?.name) {
      return mentorValue.name;
    }

    return mentorValue || '';
  };

  if (!metadataLoaded) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-6 w-11 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl !mt-0">
      <div className="space-y-6">
        {currentSPA ? (
          // Show settings in a simple list when SPA is specified
          <div className="space-y-4">
            {flagTenantMetadatas.map((metadataItem) => {
              const currentValue =
                metadataItem.value === null
                  ? 'None'
                  : (metadataItem.value ?? metadataItem.defaultValue);
              const isMentorSetting = metadataItem.slug === 'skills_embedded_mentor_name';

              return (
                <div
                  className={`flex items-center justify-between rounded-lg border px-6 ${isMentorSetting ? 'py-4' : 'py-6'}`}
                  style={{ borderColor: 'oklch(.922 0 0)' }}
                  key={metadataItem.slug}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[#646464]">{metadataItem.label}</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger
                          aria-label={`More info about ${metadataItem.label}`}
                          className="hidden sm:block"
                        >
                          <Info className="h-4 w-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent className="rounded-lg bg-gray-700 px-3 py-2 text-sm font-medium whitespace-nowrap text-white shadow-sm transition-opacity duration-300 z-50">
                          <p>{(metadataItem as any).description || 'No description available'}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="flex items-center gap-2">
                    {isMentorSetting ? (
                      <div className="flex items-center gap-2">
                        <Select
                          value={currentValue || ''}
                          onValueChange={(value) => handleMentorSelection(metadataItem.slug, value)}
                          disabled={isUpdatingTenantMetadata}
                        >
                          <SelectTrigger className="max-w-[240px] w-[110px] sm:w-[230px] font-medium text-[#646464]">
                            <SelectValue placeholder="Select mentor">
                              {currentValue ? getMentorName(currentValue) : ''}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent className="font-medium text-[#646464]">
                            <div className="p-2">
                              <Input
                                placeholder="Search mentors..."
                                value={mentorSearchQuery}
                                onChange={(e) => handleMentorSearch(e.target.value)}
                                className="mb-2 font-medium text-[#646464]"
                              />
                            </div>
                            <SelectItem value="none">None</SelectItem>
                            {isMentorsLoading ? (
                              <SelectItem value="loading" disabled>
                                Loading mentors...
                              </SelectItem>
                            ) : mentorsData?.results?.length ? (
                              mentorsData.results.map((mentor) => (
                                <SelectItem key={mentor.unique_id} value={mentor.unique_id}>
                                  {mentor.name}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="no-results" disabled>
                                No mentors found
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                        {isUpdatingTenantMetadata && (
                          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        )}
                      </div>
                    ) : (
                      <>
                        <Switch
                          checked={currentValue}
                          onCheckedChange={async () => {
                            await handleToggleSetting(metadataItem.slug, currentValue);
                          }}
                          disabled={isUpdatingTenantMetadata}
                          aria-label={`${metadataItem.label} ${currentValue ? 'enabled' : 'disabled'}`}
                          className="cursor-pointer data-[state=checked]:bg-blue-500"
                        />
                        {isUpdatingTenantMetadata && (
                          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // Group settings by SPA when showing all settings
          (() => {
            const groupedSettings = flagTenantMetadatas.reduce(
              (acc, metadataItem) => {
                const spa = metadataItem.SPA || 'General';
                if (!acc[spa]) {
                  acc[spa] = [];
                }
                acc[spa].push(metadataItem);
                return acc;
              },
              {} as Record<string, typeof flagTenantMetadatas>,
            );

            return Object.entries(groupedSettings).map(([spa, settings]) => (
              <div key={spa} className="space-y-4">
                <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 tracking-wide">
                    {spa} Settings
                  </h4>
                </div>
                <div className="space-y-3">
                  {settings.map((metadataItem) => {
                    const currentValue = metadataItem.value ?? metadataItem.defaultValue;
                    const isMentorSetting = metadataItem.slug === 'skills_embedded_mentor_name';

                    return (
                      <div
                        className={`flex items-center justify-between rounded-lg border px-6 ${isMentorSetting ? 'py-4' : 'py-6'}`}
                        style={{ borderColor: 'oklch(.922 0 0)' }}
                        key={metadataItem.slug}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-[#646464]">
                            {metadataItem.label}
                          </span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger
                                aria-label={`More info about ${metadataItem.label}`}
                                className="hidden sm:block"
                              >
                                <Info className="h-4 w-4 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent className="ibl-tooltip-content">
                                <p>
                                  {(metadataItem as any).description || 'No description available'}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <div className="flex items-center gap-2">
                          {isMentorSetting ? (
                            <div className="flex items-center gap-2">
                              <Select
                                value={currentValue || ''}
                                onValueChange={(value) =>
                                  handleMentorSelection(metadataItem.slug, value)
                                }
                                disabled={isUpdatingTenantMetadata}
                              >
                                <SelectTrigger className="max-w-[240px] w-[230px] sm:w-[150px] font-medium text-[#646464]">
                                  <SelectValue placeholder="Select mentor">
                                    {currentValue ? getMentorName(currentValue) : ''}
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent className="font-medium text-[#646464]">
                                  <div className="p-2">
                                    <Input
                                      placeholder="Search mentors..."
                                      value={mentorSearchQuery}
                                      onChange={(e) => handleMentorSearch(e.target.value)}
                                      className="mb-2 font-medium text-[#646464]"
                                    />
                                  </div>
                                  <SelectItem value="none">None</SelectItem>
                                  {isMentorsLoading ? (
                                    <SelectItem value="loading" disabled>
                                      Loading mentors...
                                    </SelectItem>
                                  ) : mentorsData?.results?.length ? (
                                    mentorsData.results.map((mentor) => (
                                      <SelectItem key={mentor.unique_id} value={mentor.unique_id}>
                                        {mentor.name}
                                      </SelectItem>
                                    ))
                                  ) : (
                                    <SelectItem value="no-results" disabled>
                                      No mentors found
                                    </SelectItem>
                                  )}
                                </SelectContent>
                              </Select>
                              {isUpdatingTenantMetadata && (
                                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                              )}
                            </div>
                          ) : (
                            <>
                              <Switch
                                checked={currentValue}
                                onCheckedChange={async () => {
                                  await handleToggleSetting(metadataItem.slug, currentValue);
                                }}
                                disabled={isUpdatingTenantMetadata}
                                aria-label={`${metadataItem.label} ${currentValue ? 'enabled' : 'disabled'}`}
                                className="cursor-pointer data-[state=checked]:bg-blue-500"
                              />
                              {isUpdatingTenantMetadata && (
                                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ));
          })()
        )}

        <ContentViewWrapper currentSPA={currentSPA} spas={['mentor']}>
          <ChatAreaWidth
            chatAreaSize={metadata?.chat_area_size as number}
            isUpdating={isUpdatingTenantMetadata}
            onUpdate={handleChatAreaSizeUpdate}
            onError={handleChatAreaSizeError}
          />
        </ContentViewWrapper>

        <AuthSpaCustomizationContent platformKey={platformKey} currentSPA={currentSPA} />
        <RecommendationSystemPromptsContent platformKey={platformKey} currentSPA={currentSPA} />
        <StudentMentorCreationContent platformKey={platformKey} />
        <PlatformMembershipContent platformKey={platformKey} authURL={authURL} />
        <CustomDomainsContent platformKey={platformKey} currentSPA={currentSPA || ''} />
        <SmtpContent platformKey={platformKey} />
      </div>
    </div>
  );
}
