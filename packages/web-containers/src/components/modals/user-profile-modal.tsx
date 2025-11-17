'use client';

import * as React from 'react';

import { Profile, InviteUserDialog, InvitedUsersDialog } from '@web-containers/components';
import { getUserName } from '@web-containers/utils';
import { Dialog, DialogTitle, DialogContent } from '../ui/dialog';
import { Account } from '../profile/account';
import { Tenant } from '@iblai/web-utils';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  params: {
    tenantKey: string;
    mentorId?: string;
    isAdmin?: boolean;
  };
  tenants?: Tenant[];
  billingEnabled?: boolean;
  billingURL?: string;
  topUpEnabled?: boolean;
  topUpURL?: string;
  showMentorAIDisplayCheckbox?: boolean;
  showLeaderboardDisplayCheckbox?: boolean;
  showUsernameField?: boolean;
  showPlatformName?: boolean;
  useGravatarPicFallback?: boolean;
  targetTab?: string;
  currentPlan?: string;
  currentSPA?: string;
  enableCatalogInvite?: boolean;
  authURL: string;
  onTenantUpdate?: (tenant: Tenant) => void;
}

export function UserProfileModal({
  isOpen,
  onClose,
  params,
  billingEnabled = false,
  billingURL = '',
  topUpEnabled = false,
  topUpURL = '',
  showMentorAIDisplayCheckbox = false,
  showLeaderboardDisplayCheckbox = false,
  showUsernameField = false,
  showPlatformName = false,
  useGravatarPicFallback = true,
  enableCatalogInvite = false,
  targetTab = 'basic',
  currentPlan = '',
  currentSPA = '',
  authURL,
  tenants = [],
  onTenantUpdate,
}: UserProfileModalProps) {
  const [isInviteUserDialogOpen, setIsInviteUserDialogOpen] = React.useState(false);
  const [isInvitedUsersDialogOpen, setIsInvitedUsersDialogOpen] = React.useState(false);
  React.useEffect(() => {
    if (!isOpen) {
      const active = document.activeElement;
      if (active instanceof HTMLElement) {
        active.blur();
      }
    }
  }, [isOpen]);

  const [stripeBillingURL, setStripeBillingURL] = React.useState<string>('');

  React.useEffect(() => {
    if (billingURL && billingEnabled) {
      setStripeBillingURL(billingURL);
    }
  }, [billingURL, billingEnabled]);

  const [stripeTopUpURL, setStripeTopUpURL] = React.useState<string>('');

  React.useEffect(() => {
    if (topUpURL && topUpEnabled) {
      setStripeTopUpURL(topUpURL);
    }
  }, [topUpURL, topUpEnabled]);
  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={() => {
          if (!isInviteUserDialogOpen) {
            onClose();
          }
        }}
      >
        <DialogTitle></DialogTitle>
        <DialogContent
          autoFocus={false}
          forceMount={true}
          aria-label="User Profile Modal"
          aria-describedby="user-profile-modal"
          className="max-w-5xl w-[85vw] p-0 gap-0 overflow-hidden bg-white"
          style={{ height: '75vh', display: 'flex', flexDirection: 'column' }}
        >
          {['basic', 'social', 'security', 'education', 'experience', 'resume'].includes(
            targetTab,
          ) && (
            <Profile
              tenant={params.tenantKey}
              username={getUserName()}
              customization={{
                showMentorAIDisplayCheckbox: showMentorAIDisplayCheckbox,
                showLeaderboardDisplayCheckbox: showLeaderboardDisplayCheckbox,
                showUsernameField: showUsernameField,
                showPlatformName: showPlatformName,
                useGravatarPicFallback: useGravatarPicFallback,
              }}
              isAdmin={params.isAdmin}
              targetTab={targetTab}
              onClose={onClose}
            />
          )}
          {['organization', 'management', 'integrations', 'billing'].includes(targetTab) && (
            <>
              <Account
                onInviteClick={() => setIsInviteUserDialogOpen(true)}
                tenant={params.tenantKey}
                tenants={tenants}
                username={getUserName()}
                billingEnabled={!!stripeBillingURL}
                billingURL={stripeBillingURL}
                topUpEnabled={!!stripeTopUpURL}
                topUpURL={stripeTopUpURL}
                showUsernameField={showUsernameField}
                showPlatformName={showPlatformName}
                useGravatarPicFallback={useGravatarPicFallback}
                onClose={onClose}
                isAdmin={params.isAdmin}
                targetTab={targetTab}
                currentPlan={currentPlan}
                currentSPA={currentSPA}
                authURL={authURL}
                onTenantUpdate={onTenantUpdate}
              />
              {isInviteUserDialogOpen && (
                <InviteUserDialog
                  tenant={params.tenantKey}
                  onClose={() => setIsInviteUserDialogOpen(false)}
                  isOpen={isInviteUserDialogOpen}
                  enableCatalogInvite={enableCatalogInvite}
                  /* onSeeAllInvitedUsersClick={() =>
                    setIsInvitedUsersDialogOpen(true)
                  } */
                />
              )}
              {isInvitedUsersDialogOpen && (
                <InvitedUsersDialog
                  onClose={() => setIsInvitedUsersDialogOpen(false)}
                  tenant={params.tenantKey}
                />
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
