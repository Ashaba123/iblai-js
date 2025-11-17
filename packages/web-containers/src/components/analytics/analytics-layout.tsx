'use client';

import type React from 'react';
import { useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { cn } from '@web-containers/lib/utils';

interface AnalyticsLayoutProps {
  children: React.ReactNode;
  currentPath: string;
  basePath: string;
  onTabChange: (tabValue: string) => void;
  tabs?: Array<{
    label: string;
    value: string;
  }>;
  activeTabClassName?: string;
}

const defaultTabs = [
  {
    label: 'Overview',
    value: '',
  },
  {
    label: 'Users',
    value: 'users',
  },
  {
    label: 'Topics',
    value: 'topics',
  },
  {
    label: 'Transcripts',
    value: 'transcripts',
  },
  {
    label: 'Financial',
    value: 'financial',
  },
];

const className =
  'inline-flex items-center justify-center whitespace-nowrap rounded-[5px] px-2 sm:px-2.5 pt-1 pb-0.5 sm:text-sm text-gray-500 ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-blue-600 data-[state=active]:font-semibold text-sm font-medium data-[state=active]:bg-[#f5f7fb] data-[state=active]:shadow-none cursor-pointer';

export function AnalyticsLayout({
  children,
  currentPath,
  basePath,
  onTabChange,
  tabs = defaultTabs,
  activeTabClassName = '',
}: AnalyticsLayoutProps) {
  useEffect(() => {
    const mainContentContainer = document.getElementById('main-content-container');
    if (mainContentContainer) {
      mainContentContainer.classList.add('-mt-4');
    }

    return () => {
      const mainContentContainer = document.getElementById('main-content-container');
      if (mainContentContainer) {
        mainContentContainer.classList.remove('-mt-4');
      }
    };
  }, []);

  const getTabValue = (path: string) => {
    if (path === `${basePath}/users`) return 'users';
    if (path === `${basePath}/topics`) return 'topics';
    if (path === `${basePath}/transcripts`) return 'transcripts';
    if (path === `${basePath}/financial`) return 'financial';
    if (path === `${basePath}/reports`) return 'reports';
    return '';
  };

  const handleTabClick = (tabValue: string) => {
    onTabChange(tabValue);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden overscroll-none bg-[#f5f7fb]">
      <div className="p-6 pb-0">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center justify-between w-full overflow-x-auto">
            <Tabs className="mb-6 bg-[#f5f7fb]" value={getTabValue(currentPath)}>
              <TabsList className="bg-[#f5f7fb]">
                {tabs.map((tab) => {
                  const isActive = getTabValue(currentPath) === tab.value;
                  return (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className={cn(className, isActive && activeTabClassName)}
                      onClick={() => handleTabClick(tab.value)}
                    >
                      {tab.label}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </Tabs>
            <Tabs className="mb-6 bg-[#f5f7fb]" value={getTabValue(currentPath)}>
              <TabsList className="bg-[#f5f7fb]">
                <TabsTrigger
                  value="reports"
                  className={cn(
                    className,
                    getTabValue(currentPath) === 'reports' && activeTabClassName,
                  )}
                  onClick={() => handleTabClick('reports')}
                >
                  Data Reports
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto overscroll-contain scrollbar-none px-6 pb-6 pt-0">
        {children}
      </div>
    </div>
  );
}
