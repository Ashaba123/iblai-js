'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';

interface SsoLoginProps {
  /**
   * Local storage keys for authentication data
   */
  localStorageKeys: {
    CURRENT_TENANT: string;
    USER_DATA: string;
    TENANTS: string;
  };
  /**
   * Local storage key for redirect path
   */
  redirectPathKey?: string;
  /**
   * Default redirect path if none is found
   */
  defaultRedirectPath?: string;
  /**
   * Optional callback after successful login
   */
  onLoginSuccess?: (data: Record<string, string>) => void;
}

/**
 * Get the base domain for cookie sharing
 */
const getBaseDomain = (): string => {
  const hostname = window.location.hostname;

  // For localhost or IP addresses, use as-is
  if (hostname === 'localhost' || /^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
    return hostname;
  }

  // Split the hostname into parts
  const parts = hostname.split('.');

  // If it's already a base domain (e.g., iblai.app), return as-is
  if (parts.length === 2) {
    return hostname;
  }

  // If it's a subdomain (e.g., mentor.iblai.app), return base domain with leading dot
  if (parts.length > 2) {
    return `.${parts.slice(-2).join('.')}`;
  }

  return hostname;
};

/**
 * Set a cookie with the base domain for cross-SPA sharing
 */
const setCookie = (name: string, value: string, days: number = 365): void => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  const baseDomain = getBaseDomain();
  const domainAttr = baseDomain ? `;domain=${baseDomain}` : '';
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=None;Secure${domainAttr}`;
};

/**
 * Sync authentication data to cookies for cross-SPA synchronization
 */
const syncAuthToCookies = (
  data: Record<string, string>,
  localStorageKeys: SsoLoginProps['localStorageKeys'],
) => {
  // Sync current_tenant
  if (data[localStorageKeys.CURRENT_TENANT]) {
    setCookie('ibl_current_tenant', data[localStorageKeys.CURRENT_TENANT]);
  }

  // Sync user_data
  if (data[localStorageKeys.USER_DATA]) {
    setCookie('ibl_user_data', data[localStorageKeys.USER_DATA]);
  }

  // Sync tenants
  if (data[localStorageKeys.TENANTS]) {
    setCookie('ibl_tenant', data[localStorageKeys.TENANTS]);
  }
};

/**
 * Initialize localStorage with authentication data and sync to cookies
 */
export const initializeLocalStorageWithObject = async (
  data: Record<string, string>,
  localStorageKeys: SsoLoginProps['localStorageKeys'],
) => {
  Object.entries(data).forEach(([key, value]) => {
    localStorage.setItem(key, value);
  });

  // Sync to cookies for cross-SPA synchronization
  syncAuthToCookies(data, localStorageKeys);

  // Wait a bit to ensure data is written
  await new Promise((resolve) => setTimeout(resolve, 100));
};

/**
 * Reusable SSO Login component for handling authentication redirects
 *
 * This component:
 * 1. Reads authentication data from URL query parameters
 * 2. Stores the data in localStorage
 * 3. Syncs critical auth data to cookies for cross-SPA synchronization
 * 4. Redirects to the appropriate path after login
 */
export function SsoLogin({
  localStorageKeys,
  redirectPathKey = 'redirect-to',
  defaultRedirectPath = '/',
  onLoginSuccess,
}: SsoLoginProps) {
  const searchParams = useSearchParams();

  React.useEffect(() => {
    const queryParamData = searchParams.get('data');

    console.log('[SsoLogin] SSO login page loaded', {
      hasQueryData: !!queryParamData,
      origin: window.location.origin,
    });

    if (queryParamData) {
      console.log('[SsoLogin] Processing SSO login data', {
        dataLength: queryParamData.length,
      });

      const parsedData = JSON.parse(queryParamData);

      initializeLocalStorageWithObject(parsedData, localStorageKeys).then(() => {
        // Call optional success callback
        onLoginSuccess?.(parsedData);

        // Determine redirect path
        const redirectPath = localStorage.getItem(redirectPathKey) || defaultRedirectPath;

        console.log('[SsoLogin] SSO login redirecting', {
          redirectPath,
          targetUrl: `${window.location.origin}${redirectPath}`,
        });

        // Clean up redirect path from storage
        localStorage.removeItem(redirectPathKey);

        // Redirect to the target path
        window.location.href = `${window.location.origin}${redirectPath}`;
      });
    }
  }, [searchParams, localStorageKeys, redirectPathKey, defaultRedirectPath, onLoginSuccess]);

  return null;
}
