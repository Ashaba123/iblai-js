'use client';
import React, { useEffect } from 'react';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tenant, isAlphaNumeric32 } from '@iblai/web-utils';

interface TenantSwitcherProps {
  currentTenantKey: string | null;
  tenants: Tenant[];
  visitingTenant?: Tenant;
  onTenantChange: (tenantKey: string, saveRedirect?: boolean) => Promise<void>;
  setHideTenantSwitcher?: (hide: boolean) => void;
  setOpenAccount?: (tab: 'basic' | 'organization') => void;
  setLoadingTenantInfo?: (loading: boolean) => void;
}

export function TenantSwitcher({
  currentTenantKey,
  tenants,
  visitingTenant,
  onTenantChange,
  setHideTenantSwitcher,
  setOpenAccount,
  setLoadingTenantInfo,
}: TenantSwitcherProps) {
  const [selectedTenant, setSelectedTenant] = React.useState<string | null>(currentTenantKey);
  const [selectedTenantName, setSelectedTenantName] = React.useState<string>(
    currentTenantKey || '',
  );

  // Using lazy query to leverage RTK Query caching - subsequent calls with same key will use cached data.
  const [tenantList, setTenantList] = React.useState<Tenant[]>([]);
  const [internallyHideTenantSwitcher, setInternallyHideTenantSwitcher] =
    React.useState<boolean>(false);

  const handleUpdateTenantsList = async () => {
    // We don't want to show the main tenant in the list
    setLoadingTenantInfo?.(true);
    try {
      const updatedList = await Promise.all(
        tenants
          .filter((tenant) => tenant.key !== 'main')
          .map(async (tenant) => {
            try {
              return { ...tenant, name: tenant.platform_name || tenant.key };
            } catch (error) {
              console.warn(`Failed to fetch platform info for tenant ${tenant.key}:`, error);
              // Return tenant with key as fallback name if API call fails
              return { ...tenant, name: tenant.key };
            }
          }),
      );
      if (visitingTenant) {
        handleTenantFilter([visitingTenant, ...updatedList]);
      } else {
        handleTenantFilter([...updatedList]);
      }
    } catch (error) {
      console.error('Error updating tenants list:', error);
      // Fallback to using tenant keys as names
      const fallbackList = tenants
        .filter((tenant) => tenant.key !== 'main')
        .map((tenant) => ({ ...tenant, name: tenant.key }));
      if (visitingTenant) {
        handleTenantFilter([visitingTenant, ...fallbackList]);
      } else {
        handleTenantFilter([...fallbackList]);
      }
    } finally {
      setLoadingTenantInfo?.(false);
    }
  };

  const handleTenantFilter = (updatedTenants: Tenant[]) => {
    setTenantList(updatedTenants);

    // use the visiting tenant key in place of the currentTenantKey to
    // select the tenant if the visiting tenant key exists
    setSelectedTenantName(
      updatedTenants.find((tenant) => tenant.key === (visitingTenant?.key ?? currentTenantKey))
        ?.name || 'Community',
    );
    if (
      updatedTenants?.length === 0 ||
      (updatedTenants?.length === 1 && updatedTenants[0]?.key === 'main')
    ) {
      setHideTenantSwitcher?.(true);
      setInternallyHideTenantSwitcher(true);
    }
  };

  useEffect(() => {
    handleUpdateTenantsList();
  }, [tenants.length]);

  const handleTenantClick = () => {
    if (
      selectedTenant &&
      selectedTenant !== 'main' &&
      tenantList.find((tenant) => tenant.key === selectedTenant)?.is_admin
    ) {
      setOpenAccount?.('organization');
    }
  };

  if (internallyHideTenantSwitcher) {
    return null;
  }

  return (
    <>
      <div className="w-full flex items-center gap-1 justify-between -ml-[20px] min-h-[36px]">
        <div
          onClick={handleTenantClick}
          className="pl-[32px] pt-[8px] pb-[8px] text-sm cursor-pointer"
        >
          {isAlphaNumeric32(selectedTenantName) ? 'Account' : selectedTenantName}
        </div>
        {tenantList.length > 1 && (
          <Select
            //disabled={tenantList?.length <= 1}
            value={''}
            onValueChange={(value: string) => {
              setSelectedTenant(value);
              onTenantChange(value);
            }}
          >
            <SelectTrigger
              className="w-[35px] pr-0 border-none text-black placeholder:text-black [&>svg]:text-black [&>svg]:opacity-100 py-0 -mr-[20px] focus-visible:ring-transparent"
              aria-label="Select a tenant"
            >
              <SelectValue placeholder="" />
            </SelectTrigger>
            <SelectContent>
              {Array.isArray(tenantList) &&
                tenantList.map((tenant) => (
                  <SelectItem key={tenant?.key} value={tenant?.key}>
                    {tenant?.name || tenant?.key}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </>
  );
}
