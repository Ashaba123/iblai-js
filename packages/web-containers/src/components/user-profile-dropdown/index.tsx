'use client';

import React, { useState, useRef } from 'react';
import {
  Building2,
  ExternalLink,
  GraduationCap,
  LifeBuoy,
  LogOut,
  User,
  Settings,
} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { UserProfileModal } from '../modals/user-profile-modal';
import { TenantSwitcher } from '../tenant-switch';
import { Tenant, getInitials } from '@iblai/web-utils';
import Gravatar from 'react-gravatar';
import Link from 'next/link';
import { useGetUserMetadataQuery, useGetUserMetadataEdxQuery } from '@iblai/data-layer';
import { cn } from '@web-containers/lib/utils';

// Types for the component props
export interface UserMetadata {
  name?: string;
  username?: string;
  email?: string;
  profile_image?: {
    has_image?: boolean;
    image_url_small?: string;
  };
}

export interface UserProfileDropdownProps {
  // User data
  username?: string;
  userIsAdmin?: boolean;
  userIsStudent?: boolean;
  userIsVisiting?: boolean;

  // Tenant data
  tenantKey?: string;
  visitingTenant?: Tenant;
  mentorId?: string;
  currentTenant?: Tenant;
  userTenants?: Tenant[];

  // Configuration
  showProfileTab?: boolean;
  showAccountTab?: boolean;
  showTenantSwitcher?: boolean;
  showHelpLink?: boolean;
  showLogoutButton?: boolean;
  showLearnerModeSwitch?: boolean;

  // Customization
  helpCenterUrl?: string;
  enableGravatarOnProfilePic?: boolean;

  // Callbacks
  onProfileClick?: (tab: string) => void;
  onLogout?: () => void;
  onTenantChange?: (tenantKey: string) => void;
  onHelpClick?: (url: string) => void;

  // Modal props
  billingEnabled?: boolean;
  billingURL?: string;
  topUpEnabled?: boolean;
  topUpURL?: string;
  currentPlan?: string;
  currentSPA?: string;
  // Custom components
  LearnerModeSwitchComponent?: React.ComponentType<any>;
  CustomProfileModal?: React.ComponentType<any>;

  // Styling
  className?: string;
  dropdownClassName?: string;
  avatarSize?: number;

  // Additional data
  metadata?: {
    help_center_url?: string;
  };
  metadataLoaded?: boolean;
  showMentorAIDisplayCheckbox?: boolean;
  showLeaderboardDisplayCheckbox?: boolean;
  showUsernameField?: boolean;
  showPlatformName?: boolean;
  enableCatalogInvite?: boolean;
  authURL: string;
  onTenantUpdate: (tenant: Tenant) => void;
}

export function UserProfileDropdown({
  // User data
  username,
  userIsAdmin = false,
  userIsStudent = false,
  userIsVisiting = false,

  // Tenant data
  tenantKey,
  visitingTenant,
  mentorId,
  userTenants = [],

  // Configuration
  showProfileTab = true,
  showAccountTab = false,
  showTenantSwitcher = true,
  showHelpLink = true,
  showLogoutButton = true,
  showLearnerModeSwitch = false,

  // Customization
  helpCenterUrl = '',
  enableGravatarOnProfilePic = true,

  // Callbacks
  onProfileClick,
  onLogout,
  onTenantChange,
  onHelpClick,

  // Modal props
  billingURL = '',
  topUpURL = '',
  currentPlan = '',

  // Custom components
  LearnerModeSwitchComponent,
  CustomProfileModal,

  // Styling
  className = '',
  dropdownClassName = 'mr-4 w-56 bg-white border border-gray-200 shadow-lg rounded-md',
  avatarSize = 32,

  // Additional data
  metadata,
  metadataLoaded = false,

  // Customization
  currentSPA = '',
  showMentorAIDisplayCheckbox = false,
  showLeaderboardDisplayCheckbox = false,
  showUsernameField = false,
  showPlatformName = false,
  enableCatalogInvite = false,
  authURL,
  onTenantUpdate,
}: UserProfileDropdownProps) {
  // Use hooks to fetch user metadata
  const { data: userMetadata } = useGetUserMetadataQuery({
    params: { username: username ?? '' },
  });
  const { data: userMetadataEdx, isLoading: isUserMetadataEdxLoading } = useGetUserMetadataEdxQuery(
    {
      params: { username: username ?? '' },
    },
  );

  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('basic');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [hideTenantSwitcher, setHideTenantSwitcher] = useState<boolean>(false);
  const [loadingTenantInfo, setLoadingTenantInfo] = useState<boolean>(false);
  const tenantSelectRef = useRef<HTMLDivElement>(null);

  const handleProfileClick = (tab: string) => {
    setActiveTab(tab);
    setIsUserProfileOpen(true);
    setIsOpen(false);
    onProfileClick?.(tab);
  };

  const handleLogout = () => {
    onLogout?.();
  };

  const handleTenantSwitch = (newTenantKey: string) => {
    onTenantChange?.(newTenantKey);
  };

  const handleHelpClick = (url: string) => {
    onHelpClick?.(url);
  };

  const addProtocolToUrl = (url: string): string => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url}`;
  };

  const getHelpUrl = (): string => {
    return addProtocolToUrl(metadata?.help_center_url || helpCenterUrl);
  };

  const renderAvatar = () => {
    if (isUserMetadataEdxLoading) {
      return <Skeleton className="h-8 w-8 rounded-full" />;
    }

    return (
      <Avatar className="h-8 w-8">
        {userMetadataEdx?.profile_image?.has_image ? (
          <AvatarImage src={userMetadataEdx.profile_image.image_url_small} />
        ) : enableGravatarOnProfilePic && userMetadata?.email ? (
          <Gravatar email={userMetadata.email} size={avatarSize} />
        ) : null}
        <AvatarFallback className="bg-gray-100 text-gray-600 text-sm font-medium">
          {getInitials(userMetadata?.name || userMetadata?.username || userMetadata?.email || '')}
        </AvatarFallback>
      </Avatar>
    );
  };

  const renderProfileMenuItem = () => {
    if (!showProfileTab) return null;

    return (
      <>
        <DropdownMenuItem
          onClick={() => handleProfileClick('basic')}
          className="flex cursor-pointer items-center rounded-md px-2 h-10 text-sm text-gray-700 hover:bg-gray-100"
        >
          <User className="mr-2 h-4 w-4 text-gray-600" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuSeparator className={`h-px bg-gray-200`} />
      </>
    );
  };

  const renderAccountMenuItem = () => {
    if (!showAccountTab || !userIsAdmin) return null;

    return (
      <>
        <DropdownMenuItem
          onClick={() => handleProfileClick('organization')}
          className="flex cursor-pointer items-center rounded-md px-2 h-10 text-sm text-gray-700 hover:bg-gray-100"
        >
          <Settings className="mr-2 h-4 w-4 text-gray-600" />
          Account
        </DropdownMenuItem>
        <DropdownMenuSeparator
          className={`h-px bg-gray-200 ${loadingTenantInfo ? 'hidden' : ''}`}
        />
      </>
    );
  };

  const renderLearnerModeSwitch = () => {
    if (
      !showLearnerModeSwitch ||
      !userIsAdmin ||
      tenantKey === 'main' ||
      !LearnerModeSwitchComponent ||
      userIsVisiting
    ) {
      return null;
    }

    return (
      <>
        <DropdownMenuItem
          className="flex w-full items-center justify-between xl:hidden rounded-md px-2 h-10 text-sm text-gray-700 hover:bg-gray-100"
          onClick={(clickEvent: React.MouseEvent) => {
            clickEvent.preventDefault();
            clickEvent.stopPropagation();
          }}
        >
          <div className="flex items-center gap-2">
            <GraduationCap className="mr-2 h-4 w-4 text-gray-600" />
            <span className="text-sm">{userIsStudent ? 'Learner' : 'Instructor'}</span>
          </div>
          <LearnerModeSwitchComponent />
        </DropdownMenuItem>
        <DropdownMenuSeparator className={`h-px xl:hidden bg-gray-200`} />
      </>
    );
  };

  const renderTenantSwitcher = () => {
    if (!showTenantSwitcher || hideTenantSwitcher) {
      return null;
    }

    return (
      <>
        <DropdownMenuItem
          className={`gap-0 py-0 rounded-md px-2 h-10 text-sm text-gray-700 hover:bg-gray-100`}
          onClick={(clickEvent: React.MouseEvent) => {
            clickEvent.preventDefault();
            clickEvent.stopPropagation();
          }}
          onKeyDown={(keyEvent: React.KeyboardEvent) => {
            if (keyEvent.key === 'Enter' || keyEvent.key === ' ') {
              keyEvent.preventDefault();
              keyEvent.stopPropagation();
              const selectTrigger = tenantSelectRef.current?.querySelector(
                '[role="combobox"]',
              ) as HTMLElement;
              if (selectTrigger) {
                selectTrigger.click();
              }
            }
          }}
        >
          <Building2 className="mr-1 h-4 w-4 text-gray-600" />
          <div ref={tenantSelectRef} className="w-full">
            <TenantSwitcher
              currentTenantKey={tenantKey || null}
              tenants={userTenants}
              visitingTenant={visitingTenant}
              // @ts-expect-error investigate
              onTenantChange={handleTenantSwitch}
              setHideTenantSwitcher={setHideTenantSwitcher}
              setOpenAccount={handleProfileClick}
              setLoadingTenantInfo={setLoadingTenantInfo}
            />
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator
          className={`h-px bg-gray-200 ${loadingTenantInfo ? 'hidden' : ''}`}
        />
      </>
    );
  };

  const renderHelpLink = () => {
    if (!showHelpLink || !metadataLoaded) {
      return null;
    }

    const helpUrl = getHelpUrl();
    if (!helpUrl) return null;

    return (
      <>
        <DropdownMenuItem
          className="flex cursor-pointer items-center rounded-md px-2 h-10 text-sm text-gray-700 hover:bg-gray-100"
          onKeyDown={(keyEvent: React.KeyboardEvent) => {
            if (keyEvent.key === 'Enter' || keyEvent.key === ' ') {
              keyEvent.preventDefault();
              handleHelpClick(helpUrl);
            }
          }}
        >
          <Link
            href={helpUrl}
            target="_blank"
            className="flex items-center justify-between w-full"
            onClick={() => handleHelpClick(helpUrl)}
          >
            <span className="flex items-center gap-2">
              <LifeBuoy className="mr-2 h-4 w-4 text-gray-600" />
              <span>Help</span>
            </span>
            <ExternalLink className="h-4 w-4 text-gray-600" />
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className={`h-px bg-gray-200`} />
      </>
    );
  };

  const renderLogoutButton = () => {
    if (!showLogoutButton) return null;

    return (
      <>
        <DropdownMenuItem
          onClick={handleLogout}
          className="flex cursor-pointer items-center rounded-md px-2 h-10 text-sm text-gray-700 hover:bg-gray-100"
        >
          <LogOut className="mr-2 h-4 w-4 text-gray-600" />
          Log Out
        </DropdownMenuItem>
      </>
    );
  };

  const renderProfileModal = () => {
    if (!isUserProfileOpen) return null;

    let modalProps = {
      isOpen: isUserProfileOpen,
      onClose: () => setIsUserProfileOpen(false),
      params: {
        tenantKey: tenantKey || '',
        mentorId: mentorId || '',
        isAdmin: userIsAdmin,
      },
      billingEnabled: !!billingURL,
      billingURL,
      topUpEnabled: !!topUpURL,
      topUpURL,
      useGravatarPicFallback: enableGravatarOnProfilePic,
      targetTab: activeTab,
      currentPlan,
      currentSPA,
      showMentorAIDisplayCheckbox,
      showLeaderboardDisplayCheckbox,
      showUsernameField,
      showPlatformName,
      enableCatalogInvite,
      authURL,
      tenants: userTenants,
      onTenantUpdate,
    };

    if (CustomProfileModal) {
      return <CustomProfileModal {...modalProps} />;
    }

    return <UserProfileModal {...modalProps} />;
  };

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={`cursor-pointer rounded-full hover:bg-gray-100 ${className}`}
            aria-label="More options"
          >
            {renderAvatar()}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className={cn(dropdownClassName, 'w-auto', 'min-w-[200px]')}>
          <div className="px-2 space-y-1">
            {renderProfileMenuItem()}
            {renderAccountMenuItem()}
            {renderLearnerModeSwitch()}
            {renderTenantSwitcher()}
            {renderHelpLink()}
            {renderLogoutButton()}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {renderProfileModal()}
    </>
  );
}
