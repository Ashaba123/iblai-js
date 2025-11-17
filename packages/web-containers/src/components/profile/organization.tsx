'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@web-containers/components/ui/button';
import { Input } from '@web-containers/components/ui/input';
import { Label } from '@web-containers/components/ui/label';
import { Edit, Check, X } from 'lucide-react';
import Image from 'next/image';
import {
  LOGO_ENDPOINTS,
  useUpdatePlatformInfoMutation,
  useUpdateTenantMetadataMutation,
  useUploadLightLogoMutation,
  useUploadDarkLogoMutation,
} from '@iblai/data-layer';
import { toast } from 'sonner';
import { isAlphaNumeric32, useTenantContext, useTenantMetadata, Tenant } from '@iblai/web-utils';

export default function OrganizationTab({
  platformKey,
  setOrganizationLogoFromOutside,
  tenant,
  onTenantUpdate,
}: {
  platformKey: string;
  tenant: Tenant;
  setOrganizationLogoFromOutside: (logo: string) => void;
  onTenantUpdate?: (tenant: Tenant) => void;
}) {
  const { setMetadata } = useTenantContext();

  const [uploadPlatformLogo] = useUploadLightLogoMutation();
  const [uploadPlatformDarkLogo] = useUploadDarkLogoMutation();
  const [updatePlatformInfo, { isLoading: isUpdatingPlatformInfo }] =
    useUpdatePlatformInfoMutation();

  const [updateTenantMetadata, { isLoading: isUpdatingTenantMetadata }] =
    useUpdateTenantMetadataMutation();

  const { metadataLoaded, metadata } = useTenantMetadata({
    org: platformKey,
  });

  const [organizationName, setOrganizationName] = useState('');
  const [isEditingOrg, setIsEditingOrg] = useState(false);
  const [tempOrgName, setTempOrgName] = useState('');

  const [supportEmail, setSupportEmail] = useState('');
  const [isEditingSupportEmail, setIsEditingSupportEmail] = useState(false);
  const [tempSupportEmail, setTempSupportEmail] = useState('');

  const [helpCenterUrl, setHelpCenterUrl] = useState('');
  const [isEditingHelpCenterUrl, setIsEditingHelpCenterUrl] = useState(false);
  const [tempHelpCenterUrl, setTempHelpCenterUrl] = useState('');

  const [organizationLogo, setOrganizationLogo] = useState<string | File>(
    `${LOGO_ENDPOINTS.light_logo(platformKey)}?v=${Date.now()}`,
  );
  const [organizationDarkLogo, setOrganizationDarkLogo] = useState<string | File>(
    `${LOGO_ENDPOINTS.dark_logo(platformKey)}?v=${Date.now()}`,
  );
  const lightLogoInputRef = useRef<HTMLInputElement>(null);
  const darkLogoInputRef = useRef<HTMLInputElement>(null);

  const DEFAULT_HELP_CENTER_URL = 'https://docs.ibl.ai';

  useEffect(() => {
    if (tenant) {
      setOrganizationName(
        (isAlphaNumeric32(tenant?.platform_name || '') ? '' : tenant?.platform_name) || '',
      );
      setTempOrgName(
        (isAlphaNumeric32(tenant?.platform_name || '') ? '' : tenant?.platform_name) || '',
      );
    }
  }, []);

  const stripProtocol = (url: string) => {
    return url.replace(/^https?:\/\//, '');
  };

  useEffect(() => {
    if (metadataLoaded) {
      const defaultSupportEmail = 'support@iblai.zendesk.com';
      setSupportEmail(metadata?.support_email || defaultSupportEmail);
      setTempSupportEmail(metadata?.support_email || defaultSupportEmail);
      const strippedHelpCenterUrl = stripProtocol(
        metadata?.help_center_url || DEFAULT_HELP_CENTER_URL,
      );
      setHelpCenterUrl(strippedHelpCenterUrl);
      setTempHelpCenterUrl(strippedHelpCenterUrl);
    }
  }, [metadataLoaded]);

  const handleUploadLogo = async (logo: File, darkLogo = false) => {
    try {
      const formData = new FormData();
      formData.append('file', logo, logo.name);
      if (darkLogo) {
        await uploadPlatformDarkLogo({
          org: platformKey,
          formData: formData,
        }).unwrap();
        toast.success('Dark logo uploaded successfully');
      } else {
        await uploadPlatformLogo({
          org: platformKey,
          formData: formData,
        }).unwrap();
        setOrganizationLogoFromOutside(`${LOGO_ENDPOINTS.light_logo(platformKey)}?v=${Date.now()}`);
        toast.success('Light logo uploaded successfully');
      }
    } catch (error) {
      if (darkLogo) {
        setOrganizationDarkLogo('');
      } else {
        setOrganizationLogo('');
        setOrganizationLogoFromOutside(`${LOGO_ENDPOINTS.light_logo(platformKey)}?v=${Date.now()}`);
      }
      toast.error('Failed to upload logo');
    }
  };
  const handleEditOrg = () => {
    setTempOrgName(organizationName);
    setIsEditingOrg(true);
  };

  const handleSaveOrg = async () => {
    try {
      await updatePlatformInfo({
        //@ts-ignore
        requestBody: {
          name: tempOrgName,
          key: platformKey,
          //user_id: 1,
        },
      }).unwrap();
      toast.success('Organization name updated successfully');
      onTenantUpdate?.({ ...tenant, platform_name: tempOrgName });
      setOrganizationName(tempOrgName);
      setIsEditingOrg(false);
    } catch (error) {
      console.error(JSON.stringify(error));
      toast.error('Failed to update organization name');
    }
  };

  const handleCancelOrg = () => {
    setTempOrgName(organizationName);
    setIsEditingOrg(false);
  };

  const handleEditSupportEmail = () => {
    setTempSupportEmail(supportEmail);
    setIsEditingSupportEmail(true);
  };
  const updateOrganizationMetadata = async (key: string, value: any, callback: () => void) => {
    try {
      const newMetadata = { ...metadata, [key]: value };
      await updateTenantMetadata([
        {
          org: platformKey,
          //@ts-ignore
          requestBody: {
            metadata: newMetadata,
          },
        },
      ]).unwrap();
      setMetadata(newMetadata);
      callback();
    } catch (error) {
      console.error(JSON.stringify(error));
      toast.error('Failed to update');
    }
  };

  const handleSaveSupportEmail = async () => {
    updateOrganizationMetadata('support_email', tempSupportEmail, () => {
      toast.success('Support updated successfully');
      setSupportEmail(tempSupportEmail);
      setIsEditingSupportEmail(false);
    });
  };

  const handleCancelSupportEmail = () => {
    setTempSupportEmail(supportEmail);
    setIsEditingSupportEmail(false);
  };

  const handleEditHelpCenterUrl = () => {
    setTempHelpCenterUrl(helpCenterUrl);
    setIsEditingHelpCenterUrl(true);
  };
  const handleSaveHelpCenterUrl = async () => {
    const strippedHelpCenterUrl = stripProtocol(tempHelpCenterUrl);
    updateOrganizationMetadata('help_center_url', tempHelpCenterUrl, () => {
      toast.success('Help Center updated successfully');
      setHelpCenterUrl(strippedHelpCenterUrl);
      setIsEditingHelpCenterUrl(false);
    });
  };

  const handleCancelHelpCenterUrl = () => {
    setTempHelpCenterUrl(helpCenterUrl);
    setIsEditingHelpCenterUrl(false);
  };

  return (
    <div className="container mx-auto max-w-7xl !mt-0">
      <div className="mb-6">
        <Label htmlFor="orgName" className="text-gray-500 dark:text-gray-400 text-base">
          ID
        </Label>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm text-gray-600 font-semibold">{platformKey}</span>
        </div>
      </div>
      <div className="mb-6">
        <Label htmlFor="orgName" className="text-gray-500 dark:text-gray-400 text-base">
          Name
        </Label>
        {isEditingOrg ? (
          <div className="flex items-center gap-2 mt-1">
            <Input
              id="orgName"
              value={tempOrgName}
              onChange={(e) => setTempOrgName(e.target.value)}
              className="max-w-md text-sm text-gray-600 font-semibold"
              placeholder="Enter organization name"
              autoFocus
            />
            <Button
              onClick={handleSaveOrg}
              size="sm"
              disabled={!tempOrgName.trim() || isUpdatingPlatformInfo}
              className="h-9 bg-gradient-to-r from-[#2563EB] to-[#93C5FD] hover:opacity-90 text-white"
            >
              <Check className="w-4 h-4 mr-1" />
              {isUpdatingPlatformInfo ? 'Saving...' : 'Save'}
            </Button>
            <Button
              onClick={handleCancelOrg}
              variant="outline"
              size="sm"
              className="h-9 bg-transparent"
            >
              <X className="w-4 h-4 mr-1" />
              Cancel
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-gray-600 font-semibold">
              {organizationName || 'Default'}
            </span>
            <Button
              onClick={handleEditOrg}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            >
              <Edit className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>
      <div className="mb-6">
        <Label htmlFor="orgName" className="text-gray-500 dark:text-gray-400 text-base">
          Support
        </Label>
        {isEditingSupportEmail ? (
          <div className="flex items-center gap-2 mt-1">
            <Input
              id="supportEmail"
              value={tempSupportEmail}
              onChange={(e) => setTempSupportEmail(e.target.value)}
              className="max-w-md text-sm text-gray-600 font-semibold"
              placeholder="Enter organization support address"
              autoFocus
            />
            <Button
              onClick={handleSaveSupportEmail}
              size="sm"
              disabled={!tempSupportEmail.trim() || isUpdatingTenantMetadata}
              className="h-9 bg-gradient-to-r from-[#2563EB] to-[#93C5FD] hover:opacity-90 text-white"
            >
              <Check className="w-4 h-4 mr-1" />
              Save
            </Button>
            <Button
              onClick={handleCancelSupportEmail}
              variant="outline"
              size="sm"
              className="h-9 bg-transparent"
            >
              <X className="w-4 h-4 mr-1" />
              Cancel
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-gray-600 font-semibold">{supportEmail}</span>
            <Button
              onClick={handleEditSupportEmail}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            >
              <Edit className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>
      <div className="mb-6">
        <Label htmlFor="orgName" className="text-gray-500 dark:text-gray-400 text-base">
          Help Center
        </Label>
        {isEditingHelpCenterUrl ? (
          <div className="flex items-center gap-2 mt-1">
            <Input
              id="helpCenterUrl"
              value={tempHelpCenterUrl}
              onChange={(e) => setTempHelpCenterUrl(e.target.value)}
              className="max-w-md text-sm font-semibold"
              placeholder="Enter help center URL"
              autoFocus
            />
            <Button
              onClick={handleSaveHelpCenterUrl}
              size="sm"
              //disabled={!tempCustomFaqUrl.trim()}
              className="h-9 bg-gradient-to-r from-[#2563EB] to-[#93C5FD] hover:opacity-90 text-white"
            >
              <Check className="w-4 h-4 mr-1" />
              Save
            </Button>
            <Button
              onClick={handleCancelHelpCenterUrl}
              variant="outline"
              size="sm"
              className="h-9 bg-transparent"
            >
              <X className="w-4 h-4 mr-1" />
              Cancel
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-gray-600 font-semibold">{helpCenterUrl}</span>
            <Button
              onClick={handleEditHelpCenterUrl}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            >
              <Edit className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <Label htmlFor="orgName" className="text-gray-500 dark:text-gray-400 text-base">
            Light Logo
          </Label>
          <div
            className="flex h-[200px] w-full sm:w-[200px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 mt-3 hover:bg-gray-50 cursor-pointer"
            onClick={(event) => {
              event.stopPropagation();
              if (lightLogoInputRef.current) {
                lightLogoInputRef.current.click();
              }
            }}
          >
            {organizationLogo ? (
              <div className="relative h-full w-full">
                <Image
                  src={
                    typeof organizationLogo === 'string'
                      ? organizationLogo
                      : URL.createObjectURL(organizationLogo)
                  }
                  alt="Mentor"
                  className="h-full w-full rounded-lg object-contain"
                  height={200}
                  width={200}
                  onClick={(event) => {
                    event.stopPropagation();
                  }}
                  onError={(event) => {
                    event.stopPropagation();
                    setOrganizationLogo('');
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2 h-7 w-7 cursor-pointer rounded-full"
                  onClick={(event) => {
                    event.stopPropagation();
                    if (lightLogoInputRef.current) {
                      setOrganizationLogo('');
                      setOrganizationLogoFromOutside(
                        `${LOGO_ENDPOINTS.light_logo(platformKey)}?v=${Date.now()}`,
                      );
                      lightLogoInputRef.current.value = '';
                    }
                  }}
                  aria-label="Remove image"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <span className="text-sm text-gray-500">+ Upload</span>
            )}
            <input
              type="file"
              accept="image/*"
              ref={lightLogoInputRef}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  handleUploadLogo(file);
                  setOrganizationLogo(file);
                }
              }}
              className="hidden"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="orgName" className="text-gray-500 dark:text-gray-400 text-base">
            Dark Logo
          </Label>
          <div
            className="flex h-[200px] w-full sm:w-[200px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 mt-3 hover:bg-gray-600 cursor-pointer bg-gray-800"
            onClick={(event) => {
              event.stopPropagation();
              if (darkLogoInputRef.current) {
                darkLogoInputRef.current.click();
              }
            }}
          >
            {organizationDarkLogo ? (
              <div className="relative h-full w-full">
                <Image
                  src={
                    typeof organizationDarkLogo === 'string'
                      ? organizationDarkLogo
                      : URL.createObjectURL(organizationDarkLogo)
                  }
                  alt="Mentor"
                  className="h-full w-full rounded-lg object-contain"
                  height={200}
                  width={200}
                  onClick={(event) => {
                    event.stopPropagation();
                  }}
                  onError={(event) => {
                    event.stopPropagation();
                    setOrganizationDarkLogo('');
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2 h-7 w-7 cursor-pointer rounded-full"
                  onClick={(event) => {
                    event.stopPropagation();
                    if (darkLogoInputRef.current) {
                      setOrganizationDarkLogo('');
                      darkLogoInputRef.current.value = '';
                    }
                  }}
                  aria-label="Remove image"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <span className="text-sm text-gray-500">+ Upload</span>
            )}
            <input
              type="file"
              accept="image/*"
              ref={darkLogoInputRef}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  handleUploadLogo(file, true);
                  setOrganizationDarkLogo(file);
                }
              }}
              className="hidden"
            />
          </div>
        </div>
      </div>
      {/* <div className="flex-shrink-0 p-6 bg-white dark:bg-gray-900">
        <div className="flex justify-end gap-3">
          <Button className="bg-gradient-to-r from-[#2563EB] to-[#93C5FD] hover:opacity-90 text-white">
            Save Changes
          </Button>
        </div>
      </div> */}
    </div>
  );
}
