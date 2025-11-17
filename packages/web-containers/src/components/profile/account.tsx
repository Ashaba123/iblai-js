'use client';

import { ToastProvider } from '@web-containers/components/ui/toaster';
import { Admin } from './admin';
import { useState, useEffect } from 'react';
import {
  User,
  Briefcase,
  Users,
  KeyRound,
  CreditCardIcon,
  BriefcaseBusiness,
  Settings,
} from 'lucide-react';
import OrganizationTab from './organization';
import IntegrationsTab from './integration';
import BillingTab from './billing';
import AdvancedTab from './advanced/advanced';
import { LOGO_ENDPOINTS } from '@iblai/data-layer';
import Image from 'next/image';
import { Tenant } from '@iblai/web-utils';

interface UserProfileModalProps {
  tenant: string;
  tenants: Tenant[];
  username: string;
  onInviteClick: () => void;
  onClose: () => void;
  billingEnabled?: boolean;
  billingURL?: string;
  topUpEnabled?: boolean;
  topUpURL?: string;
  showUsernameField?: boolean;
  showPlatformName?: boolean;
  useGravatarPicFallback?: boolean;
  isAdmin?: boolean;
  targetTab?: string;
  currentPlan?: string;
  currentSPA?: string;
  authURL: string;
  onTenantUpdate?: (tenant: Tenant) => void;
}

export function Account({
  tenant,
  tenants = [],
  username,
  onInviteClick,
  billingURL = '',
  topUpURL = '',
  showPlatformName = false,
  isAdmin = false,
  targetTab = 'basic',
  currentPlan = '',
  currentSPA = '',
  authURL,
  onTenantUpdate,
}: UserProfileModalProps) {
  const TABS = [
    { id: 'organization', label: 'Organization', icon: Briefcase },
    { id: 'management', label: 'Management', icon: Users },
    { id: 'integrations', label: 'Integrations', icon: KeyRound },
    { id: 'advanced', label: 'Advanced', icon: Settings },
  ];
  const [activeTab, setActiveTab] = useState(targetTab);

  const [organizationLogo, setOrganizationLogo] = useState<string>(
    `${LOGO_ENDPOINTS.light_logo(tenant)}?v=${Date.now()}`,
  );

  useEffect(() => {
    const firstInput = document.getElementById('fullName');
    if (firstInput) {
      firstInput.focus();
    }
  }, []);

  return (
    <div className="flex flex-col lg:flex-row h-full">
      {/* Mobile Header */}
      <div className="lg:hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div
        className="hidden lg:flex bg-white border-r border-gray-200 dark:border-gray-700 flex-col overflow-hidden"
        style={{
          width: '320px',
          height: '100%',
        }}
      >
        {/* Profile Section */}
        <div className="flex flex-col items-center justify-center py-8 px-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          {organizationLogo ? (
            <div className="w-auto h-auto max-w-[140px] max-h-[140px] overflow-hidden">
              <Image
                src={organizationLogo}
                alt="Organization logo"
                width={140}
                height={140}
                className="object-cover w-full h-full group-hover:opacity-80 transition-opacity"
                onError={() => {
                  setOrganizationLogo('');
                }}
              />
            </div>
          ) : (
            <BriefcaseBusiness className="h-20 w-20 mb-6 text-blue-500" />
          )}
          {/* <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-100 text-center mb-4 mt-2">
            {tenant === "main" ? "main" : isAlphaNumeric32(platformInfo?.name || "") ? "" : platformInfo?.name}
          </h2> */}

          <div className="flex justify-center space-x-3 mt-3">
            <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium flex items-center text-sm">
              <User className="h-4 w-4 mr-2" />
              {isAdmin ? 'Admin' : 'Student'}
            </div>
            {showPlatformName && (
              <div className="bg-gray-100 text-gray-600 px-4 py-2 rounded text-xs font-medium">
                {tenant.toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {/* Scrollable Navigation Tabs */}
        <div className="flex-1 overflow-y-auto" style={{ minHeight: 0 }}>
          <div className="p-4">
            <div className="flex flex-col space-y-2">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full justify-start px-4 py-3 text-left rounded-lg transition-all flex items-center text-base ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'hover:bg-gray-50 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  <tab.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                  <span className="truncate">{tab.label}</span>
                </button>
              ))}
              {(billingURL || topUpURL) && (
                <button
                  key={'billing'}
                  onClick={() => setActiveTab('billing')}
                  className={`w-full justify-start px-4 py-3 text-left rounded-lg transition-all flex items-center text-base ${
                    activeTab === 'billing'
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'hover:bg-gray-50 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  <CreditCardIcon className="h-5 w-5 mr-3 flex-shrink-0" />
                  <span className="truncate">Billing</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Tabs */}
      <div className="lg:hidden">
        <div className="w-full justify-start px-6 py-2 bg-white border-b border-gray-200 rounded-none h-auto overflow-x-auto">
          <div className="flex space-x-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap text-sm transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label}</span>
              </button>
            ))}
            {(billingURL || topUpURL) && (
              <button
                key={'billing'}
                onClick={() => setActiveTab('billing')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap text-sm transition-all ${
                  activeTab === 'billing'
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <CreditCardIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Billing</span>
                <span className="sm:hidden">Billing</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden" style={{ height: '100%' }}>
        {/* Fixed Header */}
        <div className="hidden lg:block flex-shrink-0 p-6 border-b border-gray-200 bg-white dark:bg-gray-900">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2 capitalize">
            {activeTab}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {activeTab === 'management' && 'Manage users and their permissions in the system.'}
            {activeTab === 'organization' && 'Manage your organization settings.'}
            {activeTab === 'integrations' && 'Manage your integrations with other services.'}
            {activeTab === 'billing' && 'Manage your billing and subscription.'}
            {activeTab === 'advanced' && 'Configure advanced organization settings.'}
          </p>
        </div>

        {/* Scrollable Content */}
        <div
          className="flex-1 p-6 space-y-6"
          style={{
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          {/* Mobile/Tablet Header - Inside Scrollable Area */}
          <div className="lg:hidden mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2 capitalize">
              {activeTab}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {activeTab === 'basic' && 'Manage your basic account information and preferences.'}
              {activeTab === 'social' && 'Connect and manage your social media accounts.'}
              {activeTab === 'security' && 'Update your security settings and password.'}
              {activeTab === 'management' && 'Manage users and their permissions in the system.'}
              {activeTab === 'organization' && 'Manage your organization settings.'}
              {activeTab === 'advanced' && 'Configure advanced organization settings.'}
            </p>
          </div>

          {activeTab === 'management' && <Admin onInviteClick={onInviteClick} tenant={tenant} />}

          {activeTab === 'organization' && (
            <OrganizationTab
              platformKey={tenant}
              tenant={tenants.find((t) => t.key === tenant)!}
              onTenantUpdate={onTenantUpdate}
              setOrganizationLogoFromOutside={setOrganizationLogo}
            />
          )}

          {activeTab === 'integrations' && (
            <IntegrationsTab tenantKey={tenant} username={username} />
          )}

          {activeTab === 'billing' && (
            <BillingTab billingURL={billingURL} topUpURL={topUpURL} currentPlan={currentPlan} />
          )}

          {activeTab === 'advanced' && (
            <AdvancedTab
              platformKey={tenant}
              currentSPA={currentSPA}
              username={username}
              authURL={authURL}
            />
          )}
        </div>
      </div>
      <ToastProvider />
    </div>
  );
}
