/**
 * TenantProvider
 *
 * Provider that manages tenant-related state and access control.
 * It handles:
 * - Tenant validation and access control
 * - Tenant switching logic
 * - Tenant metadata retrieval
 * - User-tenant relationship verification
 */

"use client";

import React, { createContext, useContext, useState } from "react";

import {
  TokenResponse,
  useGetAppTokensMutation,
  useJoinTenantMutation,
  useLazyGetTenantMetadataQuery,
  useLazyGetUserTenantsQuery,
  useLazyGetUserAppsQuery,
  useGetCustomDomainsQuery,
} from "@iblai/data-layer";
import { Tenant } from "@web-utils/types";

import { useAuthContext } from "@web-utils/providers/auth-provider";

/**
 * Check if we're running in a web browser environment
 */
const isWeb = (): boolean => {
  return typeof window !== "undefined" && typeof document !== "undefined";
};

/**
 * Type definition for the tenant context
 * Tracks whether the user's path needs to be determined and provides a setter
 */
export type TenantContextType = {
  determineUserPath: boolean;
  setDetermineUserPath: (value: boolean) => void;
  tenantKey: string;
  metadata: Record<string, any>;
  setMetadata: (metadata: Record<string, any>) => void;
};
export const TenantContext = createContext<TenantContextType | undefined>(
  undefined,
);

/**
 * Context Provider component that wraps children with tenant context
 */
export const TenantContextProvider: React.FC<{
  value: TenantContextType;
  children: React.ReactNode;
}> = ({ value, children }) => (
  <TenantContext.Provider value={value}>{children}</TenantContext.Provider>
);

/**
 * Hook to access the tenant context
 * @returns TenantContextType
 */
export const useTenantContext = (): TenantContextType =>
  useContext(TenantContext) as TenantContextType;

/**
 * Props for the TenantProvider component
 */
type Props = {
  children?: React.ReactNode;
  fallback?: React.ReactNode; // Component to show during tenant determination
  onAuthSuccess?: () => void; // Callback for successful tenant validation
  onAuthFailure?: (reason: string) => void; // Callback for failed tenant validation
  currentTenant: string; // Currently active tenant
  requestedTenant: string; // Tenant being requested by the user
  handleTenantSwitch: (tenant: string, saveRedirect: boolean) => Promise<void>; // Function to switch tenants
  saveCurrentTenant: (tenant: Tenant) => void; // Function to save current tenant
  saveUserTenants: (tenants: Tenant[]) => void; // Function to save user's tenants
  saveVisitingTenant?: (tenant: Tenant) => void;
  removeVisitingTenant?: () => void;
  saveUserTokens?: (tokens: TokenResponse) => void;
  saveTenant?: (tenant: string) => void;
  onAutoJoinUserToTenant?: (platformName: string) => void;
  redirectToAuthSpa?: (
    redirectTo?: string,
    platformKey?: string,
    logout?: boolean,
    saveRedirect?: boolean,
  ) => void; // Function to redirect to auth SPA
};

/**
 * TenantProvider Component
 *
 * Main tenant provider that:
 * 1. Validates user's access to requested tenant
 * 2. Manages tenant switching
 * 3. Retrieves and validates tenant metadata
 * 4. Handles tenant-specific domain redirects
 * 5. Maintains tenant access state
 */
export function TenantProvider({
  children,
  fallback,
  onAuthSuccess,
  onAuthFailure,
  currentTenant,
  requestedTenant,
  saveCurrentTenant,
  saveUserTenants,
  handleTenantSwitch,
  saveVisitingTenant,
  removeVisitingTenant,
  saveUserTokens,
  saveTenant,
  onAutoJoinUserToTenant,
  redirectToAuthSpa,
}: Props) {
  const { userIsAccessingPublicRoute, setUserIsAccessingPublicRoute } =
    useAuthContext();
  const [determineUserPath, setDetermineUserPath] = useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [fetchUserTenants] = useLazyGetUserTenantsQuery();
  const [getUserApps] = useLazyGetUserAppsQuery();
  const [joinTenant] = useJoinTenantMutation();
  const [fetchTenantMetadata] = useLazyGetTenantMetadataQuery();
  const [getAppToken] = useGetAppTokensMutation();
  const [tenantKey, setTenantKey] = useState(currentTenant);
  const [metadata, setMetadata] = useState<Record<string, any>>({});

  // Fetch custom domain to get platform_key
  const currentDomain =
    typeof window !== "undefined" ? window.location.hostname : "";
  const {
    data: customDomainData,
    isLoading: isLoadingCustomDomain,
    isError: isCustomDomainError,
  } = useGetCustomDomainsQuery(
    { params: { domain: currentDomain } },
    { skip: !isWeb() || !currentDomain },
  );

  // Extract platform_key from custom domain response to use as requestedTenant
  const customDomainPlatformKey = React.useMemo(() => {
    if (
      customDomainData &&
      typeof customDomainData === "object" &&
      "custom_domains" in customDomainData
    ) {
      const domains = customDomainData.custom_domains;
      if (
        Array.isArray(domains) &&
        domains.length > 0 &&
        domains[0].platform_key
      ) {
        console.log(
          "[TenantProvider] Using platform_key from custom domain:",
          domains[0].platform_key,
        );
        return domains[0].platform_key;
      }
    }
    return undefined;
  }, [customDomainData]);

  // Use custom domain platform_key as requested tenant if available, otherwise use provided requestedTenant
  const effectiveRequestedTenant = customDomainPlatformKey || requestedTenant;
  /**
   * Helper function to enhance tenants with platform metadata from user apps
   */
  const enhanceTenants = async (
    tenants: Tenant[] | undefined,
    tenantMetadata?: any,
  ) => {
    if (!tenants || tenants.length === 0) return tenants || [];

    try {
      const { data: userApps } = await getUserApps({});

      if (userApps?.results) {
        return tenants.map((tenant) => {
          const userApp = userApps.results.find(
            (app: any) => app.platform?.key === tenant.key,
          );
          if (userApp?.platform) {
            return {
              ...tenant,
              is_advertising: !!(userApp.platform as any).is_advertising,
            };
          } else if (tenantMetadata?.platform_key === tenant.key) {
            return {
              ...tenant,
              is_advertising: !!tenantMetadata.platform_key,
            };
          }
          return tenant;
        });
      }
    } catch (error) {
      console.error("Error enhancing tenants:", error);
    }

    return tenants;
  };

  /**
   * Determines which tenant the user should access by:
   * 1. Fetching user's available tenants
   * 2. Validating requested tenant access
   * 3. Retrieving tenant metadata
   * 4. Handling tenant-specific redirects
   * 5. Managing tenant switching
   */
  async function determineWhichTenantToUse() {
    setIsLoading(true);
    try {
      // Fetch user's available tenants
      const { data: tenants } = await fetchUserTenants();

      /**
       * Patch a bug on the auth side for
       *  use case: user joins through public registration enabled tenant
       *          : user will come to the app with just main tenant
       *          : user will in the tenant provider will see the main tenant and the join tenant
       *  we want to triger a tenant switch to the tenant when there are just two tenants and the other is main
       * */

      const MAIN_TENANT_KEY = "main";

      if (tenants && tenants.length === 2) {
        const mainTenant = tenants.find((t) => t.key === MAIN_TENANT_KEY);
        const otherTenant = tenants.find((t) => t.key !== MAIN_TENANT_KEY);
        if (
          mainTenant &&
          otherTenant &&
          effectiveRequestedTenant &&
          effectiveRequestedTenant !== otherTenant.key
        ) {
          handleTenantSwitch(otherTenant.key, true);
          console.log(
            "TenantProvider: Triggering tenant switch to newly joined tenant:",
            otherTenant.key,
          );
        }
      }

      // Enhance tenants with platform metadatax
      let enhancedTenants = await enhanceTenants(tenants);

      // if there is customDomainPlatformKey and user doesn't belong to that tenant, trigger logout
      if (customDomainPlatformKey) {
        if (
          !enhancedTenants?.find(
            (tenant) => tenant.key === customDomainPlatformKey,
          )
        ) {
          redirectToAuthSpa?.(undefined, undefined, true);
          return;
        }
      }
      saveUserTenants(enhancedTenants);

      // Find requested tenant or fallback to current tenant
      console.log(
        "checking requested tenant",
        JSON.stringify({
          requestedTenant: effectiveRequestedTenant,
          customDomainPlatformKey,
        }),
      );
      let tenant = enhancedTenants?.find(
        (tenant) => tenant.key === effectiveRequestedTenant,
      );
      console.log("requested tenant", tenant);
      if (!tenant && !userIsAccessingPublicRoute) {
        setDetermineUserPath(true);
        console.log(
          "no requested tenant, checking current tenant",
          currentTenant,
        );
        tenant = enhancedTenants?.find(
          (tenant) => tenant.key === currentTenant,
        );
        console.log("current tenant", { tenant });
      }

      if (!tenant && enhancedTenants?.length && !userIsAccessingPublicRoute) {
        setDetermineUserPath(true);
        console.log("no requested tenant, checking first tenant", {
          tenants: enhancedTenants,
        });
        tenant = enhancedTenants[0];
      }

      // Fetch and validate tenant metadata
      console.log("fetching tenant metadata", JSON.stringify(tenant));
      const { data: tenantMetadata } = await fetchTenantMetadata([
        {
          org: tenant?.key || currentTenant,
        },
      ]);
      setMetadata(tenantMetadata?.metadata || {});
      // re-save the user tenants this time around ensuring that
      // is_advertising has been added
      saveUserTenants(
        enhancedTenants.map((tenant) => {
          if (tenant.key === tenantMetadata?.platform_key) {
            return {
              ...tenant,
              is_advertising: !!tenantMetadata?.metadata?.is_advertising,
            };
          }
          return tenant;
        }),
      );

      // Handle tenant switching if needed
      if (tenant && currentTenant.length && tenant.key !== currentTenant) {
        handleTenantSwitch(tenant.key, true);
        return;
      }

      // Check if tenant has active mentor domain and redirect if needed
      if (tenantMetadata?.metadata?.spa_domains?.mentor?.active) {
        console.log("tenant has active mentor domain", { tenantMetadata });
        onAuthSuccess?.();
        return;
      }

      // Save current tenant if valid
      if (
        tenant &&
        (tenant.key === currentTenant || currentTenant.length === 0)
      ) {
        setTenantKey(tenant.key);
        saveCurrentTenant({
          key: tenant.key,
          is_admin: tenant.is_admin,
          org: tenant.org,
          platform_name: tenant.platform_name,
          is_advertising: !!tenantMetadata?.metadata?.is_advertising,
        });
      }
    } catch (error) {
      console.log("error determineWhichTenantToUse", { error });
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      onAuthFailure?.(`Unexpected error: ${errorMessage}`);
    } finally {
      console.log(
        "determineWhichTenantToUse finally setting isLoading to false",
      );
      setIsLoading(false);
    }
  }

  async function handleLoadTenantMetadata(tenantKey: string) {
    setIsLoading(true);
    try {
      const data = await fetchTenantMetadata([
        {
          org: tenantKey || currentTenant,
        },
      ]).unwrap();
      setMetadata(data?.metadata || {});
      const newCurrentTenant = {
        key: data.platform_key,
        is_admin: false,
        org: data.platform_key,
        name: data.platform_name,
        platform_name: data.platform_name,
        is_advertising: data.metadata?.is_advertising,
      };
      const { data: tenants } = await fetchUserTenants();
      const enhancedTenants = await enhanceTenants(tenants, data);
      saveUserTenants(enhancedTenants);
      if (currentTenant && currentTenant !== tenantKey) {
        setTenantKey(data.platform_key);

        const userAlreadyInTenant = enhancedTenants?.find(
          (t) => t.key === tenantKey,
        );
        if (userAlreadyInTenant) {
          const formData = new FormData();
          formData.append("platform_key", tenantKey);
          const { data: tokenResponse } = await getAppToken(formData).unwrap();
          saveUserTokens?.(tokenResponse);
          saveCurrentTenant(userAlreadyInTenant);
          setUserIsAccessingPublicRoute(false);
          saveTenant?.(userAlreadyInTenant.key);
          return;
        }

        try {
          await joinTenant({
            platform_key: tenantKey,
          }).unwrap();
          try {
            // succesfully joined tenant at this point
            // we want to fetch tokens for this new tenant
            const formData = new FormData();
            formData.append("platform_key", tenantKey);
            const { data: newTenants } = await fetchUserTenants();
            const enhancedNewTenants = await enhanceTenants(newTenants, data);
            const { data: tokenResponse } =
              await getAppToken(formData).unwrap();
            saveUserTokens?.(tokenResponse);
            saveCurrentTenant(newCurrentTenant);
            if (enhancedNewTenants && enhancedNewTenants.length) {
              saveUserTenants(enhancedNewTenants);
            } else {
              // TODO: What happense when if for any reason we fetch tenants and it's an empty list
            }
            onAutoJoinUserToTenant?.(
              data.platform_name ?? data?.platform_key.toUpperCase(),
            );
            saveTenant?.(tenantKey);
            setUserIsAccessingPublicRoute(false);
            removeVisitingTenant?.();
          } catch (e) {
            throw e;
          }
        } catch (e) {
          // failed to join the visiting tenant so save the visiting tenant
          saveVisitingTenant?.(newCurrentTenant);
        }
      } else {
        if (!currentTenant) {
          saveVisitingTenant?.(newCurrentTenant);
        } else {
          removeVisitingTenant?.();
        }
      }
    } catch (error) {
      console.log("error handleLoadTenantMetadata", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      onAuthFailure?.(`Unexpected error: ${errorMessage}`);
    } finally {
      console.log(
        "handleLoadTenantMetadata setting finally isLoading to false",
      );
      setIsLoading(false);
    }
  }

  // Effect to handle tenant determination when auth state changes
  React.useEffect(() => {
    // Wait for custom domain query to complete (unless skipped or error)
    const customDomainQuerySkipped = !isWeb() || !currentDomain;
    if (!customDomainQuerySkipped && isLoadingCustomDomain) {
      console.log(
        "[TenantProvider] Waiting for custom domain query to complete...",
      );
      return;
    }

    if (isCustomDomainError) {
      console.warn(
        "[TenantProvider] Custom domain query failed, proceeding without custom domain platform_key",
      );
    }

    // NOTE: currentTenant comes from local storage.
    // it's the tenant the user is currently signed into.
    console.log("determineWhichTenantToUse", {
      userIsAccessingPublicRoute,
      currentTenant,
      requestedTenant,
      effectiveRequestedTenant,
      customDomainPlatformKey,
    });

    if (userIsAccessingPublicRoute && effectiveRequestedTenant.length === 0) {
      setIsLoading(false);
      return;
    }

    if (userIsAccessingPublicRoute && effectiveRequestedTenant.length > 0) {
      setIsLoading(true);
      setTenantKey(effectiveRequestedTenant);
      handleLoadTenantMetadata(effectiveRequestedTenant);
    } else {
      setIsLoading(true);
      removeVisitingTenant?.();
      determineWhichTenantToUse();
    }
  }, [
    userIsAccessingPublicRoute,
    effectiveRequestedTenant,
    isLoadingCustomDomain,
    isCustomDomainError,
  ]);

  // Show fallback component during tenant determination
  if (isLoading) {
    return fallback;
  }

  return (
    <TenantContextProvider
      value={{
        determineUserPath,
        setDetermineUserPath,
        tenantKey,
        metadata,
        setMetadata,
      }}
    >
      {children}
    </TenantContextProvider>
  );
}
