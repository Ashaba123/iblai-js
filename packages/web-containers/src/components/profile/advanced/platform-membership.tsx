'use client';
import { Switch } from '@web-containers/components/ui/switch';
import { Info, Copy } from 'lucide-react';
import {
  useGetPlatformMembershipQuery,
  useUpdatePlatformMembershipMutation,
} from '@iblai/data-layer';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@web-containers/components/ui/tooltip';

interface PlatformMembershipContentProps {
  platformKey: string;
  authURL: string;
}

export const PlatformMembershipContent = ({
  platformKey,
  authURL,
}: PlatformMembershipContentProps) => {
  const [updatePlatformMembership, { isLoading: isUpdating }] =
    useUpdatePlatformMembershipMutation();

  const { data: membershipData, isLoading: isLoadingMembership } = useGetPlatformMembershipQuery({
    platform_key: platformKey,
  });

  const handleToggleMembership = async (checked: boolean) => {
    try {
      await updatePlatformMembership({
        platform_key: platformKey,
        allow_self_linking: checked,
      }).unwrap();
      toast.success('Public registration setting updated successfully');
    } catch (error) {
      console.error(JSON.stringify(error));
      toast.error('Failed to update public registration setting');
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      const currentSPA = window.location.origin;
      const joinUrl = `${authURL}/join?tenant=${platformKey}&redirect-to=${currentSPA}`;
      await navigator.clipboard.writeText(joinUrl);
      toast.success('Public registration link copied to clipboard');
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      toast.error('Failed to copy public registration link to clipboard');
    }
  };

  if (isLoadingMembership) {
    return (
      <div className="rounded-lg border px-6 py-6" style={{ borderColor: 'oklch(.922 0 0)' }}>
        <div className="animate-pulse">
          <div className="flex items-center justify-between">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-6 w-11 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-between rounded-lg border px-6 py-6"
      style={{ borderColor: 'oklch(.922 0 0)' }}
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-[#646464]">Public Registration</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              aria-label="More info about public registration"
              className="hidden sm:block"
            >
              <Info className="h-4 w-4 text-gray-400" />
            </TooltipTrigger>
            <TooltipContent className="rounded-lg bg-gray-700 px-3 py-2 text-sm font-medium whitespace-nowrap text-white shadow-sm transition-opacity duration-300 z-50">
              <p>Allow public registration functionality</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {membershipData?.allow_self_linking && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                onClick={handleCopyToClipboard}
                aria-label="Copy public registration link to clipboard"
                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 p-1 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
              >
                <Copy className="h-4 w-4 text-gray-400 hover:text-blue-500" />
              </TooltipTrigger>
              <TooltipContent className="rounded-lg bg-gray-700 px-3 py-2 text-sm font-medium whitespace-nowrap text-white shadow-sm transition-opacity duration-300 z-50">
                <p>Copy public registration link to clipboard</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Switch
          checked={membershipData?.allow_self_linking}
          onCheckedChange={handleToggleMembership}
          disabled={isUpdating}
          aria-label={`Public registration ${membershipData?.allow_self_linking ? 'enabled' : 'disabled'}`}
          className="cursor-pointer data-[state=checked]:bg-blue-500"
        />
        {isUpdating && (
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        )}
      </div>
    </div>
  );
};
