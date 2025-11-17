'use client';

import { useState, useEffect, useMemo, useId } from 'react';
import { Button } from '@web-containers/components/ui/button';
import { Input } from '@web-containers/components/ui/input';
import { Label } from '@web-containers/components/ui/label';
import { Textarea } from '@web-containers/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@web-containers/components/ui/tooltip';
import {
  ChevronDown,
  ChevronUp,
  Save,
  Plus,
  Trash2,
  Upload,
  X,
  Image as ImageIcon,
  Info,
  Loader2,
} from 'lucide-react';
import {
  useUpdateTenantMetadataMutation,
  useCreatePlatformImageAssetMutation,
  useLazyGetPublicPlatformImageAssetFileUrlQuery,
} from '@iblai/data-layer';
import { toast } from 'sonner';
import { useTenantMetadata } from '@iblai/web-utils';

interface DisplayImage {
  image: string;
  alt: string;
}

interface AuthSpaConfig {
  display_title_info: string;
  title: string;
  display_description_info: string;
  display_logo: string;
  favicon: string;
  privacy_policy_url: string;
  terms_of_use_url: string;
  display_images: DisplayImage[];
}

interface AuthSpaCustomizationContentProps {
  platformKey: string;
  currentSPA?: string;
}

const getMetadataKey = (spa?: string): string | null => {
  if (!spa) return null;

  const spaLower = spa.toLowerCase();
  if (spaLower === 'mentor' || spaLower.includes('mentor')) {
    return 'auth_web_mentorai';
  } else if (spaLower === 'skills' || spaLower.includes('skill')) {
    return 'auth_web_skillsai';
  } else if (spaLower === 'analytics' || spaLower.includes('analytic')) {
    return 'auth_web_analyticsai';
  }

  return null;
};

const getDefaultConfig = (): AuthSpaConfig => ({
  display_title_info: '',
  title: '',
  display_description_info: '',
  display_logo: '',
  favicon: '',
  privacy_policy_url: '',
  terms_of_use_url: '',
  display_images: [],
});

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export const AuthSpaCustomizationContent = ({
  platformKey,
  currentSPA,
}: AuthSpaCustomizationContentProps) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [formData, setFormData] = useState<AuthSpaConfig>(getDefaultConfig());
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingFavicon, setIsUploadingFavicon] = useState(false);
  const [uploadingImageIndex, setUploadingImageIndex] = useState<number | null>(null);
  const [getPublicPlatformImageAssetFileUrlQuery] =
    useLazyGetPublicPlatformImageAssetFileUrlQuery();

  const headerId = useId();
  const contentRegionId = useId();

  const { metadataLoaded, metadata } = useTenantMetadata({
    org: platformKey,
    spa: currentSPA,
  });

  const [updateTenantMetadata] = useUpdateTenantMetadataMutation();
  const [createPlatformImageAsset] = useCreatePlatformImageAssetMutation();

  const metadataKey = useMemo(() => getMetadataKey(currentSPA), [currentSPA]);

  const getPublicPlatformImageAssetFileUrl = async (platformKey: string, assetId: number) => {
    const result = await getPublicPlatformImageAssetFileUrlQuery({
      platform_key: platformKey,
      asset_id: assetId,
    }).unwrap();
    return result;
  };

  // Load existing data from metadata
  useEffect(() => {
    if (metadataLoaded && metadata && metadataKey) {
      const existingData = metadata[metadataKey];
      if (existingData && typeof existingData === 'object') {
        setFormData({
          ...getDefaultConfig(),
          ...existingData,
          display_images: Array.isArray(existingData.display_images)
            ? existingData.display_images
            : [],
        });
      }
    }
  }, [metadataLoaded, metadata, metadataKey]);

  const handleSave = async () => {
    if (!metadataKey) {
      toast.error('Unable to determine SPA type');
      return;
    }

    setIsSaving(true);
    try {
      // Save the entire configuration including public image URLs
      // All images are stored as public URLs from the platform image assets endpoint
      await updateTenantMetadata([
        {
          org: platformKey,
          // @ts-expect-error requestBody is not part of the useUpdateTenantMetadataMutation Query Definition
          requestBody: {
            metadata: {
              ...metadata,
              [metadataKey]: formData,
            },
          },
        },
      ]).unwrap();

      toast.success('Auth SPA customization saved successfully');
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving auth spa customization:', error);
      toast.error('Failed to save auth SPA customization');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFieldChange = (field: keyof AuthSpaConfig, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleAddDisplayImage = () => {
    setFormData((prev) => ({
      ...prev,
      display_images: [{ image: '', alt: '' }, ...prev.display_images],
    }));
    setHasChanges(true);
  };

  const handleRemoveDisplayImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      display_images: prev.display_images.filter((_, i) => i !== index),
    }));
    setHasChanges(true);
  };

  const handleDisplayImageChange = (index: number, field: keyof DisplayImage, value: string) => {
    setFormData((prev) => ({
      ...prev,
      display_images: prev.display_images.map((img, i) =>
        i === index ? { ...img, [field]: value } : img,
      ),
    }));
    setHasChanges(true);
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file');
      event.target.value = '';
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error('Image size should be under 5MB');
      event.target.value = '';
      return;
    }

    setIsUploadingLogo(true);

    try {
      // Create FormData with the image file
      const formData = new FormData();
      formData.append('image', file);
      formData.append('category', 'auth_spa_logo');

      // Upload the image
      const result = await createPlatformImageAsset({
        platform_key: platformKey,
        request: formData,
      }).unwrap();

      handleFieldChange(
        'display_logo',
        await getPublicPlatformImageAssetFileUrl(platformKey, result.id),
      );
      toast.success('Logo uploaded successfully');
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error('Failed to upload logo');
    } finally {
      setIsUploadingLogo(false);
      event.target.value = '';
    }
  };

  const handleDisplayImageUpload = async (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file');
      event.target.value = '';
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error('Image size should be under 5MB');
      event.target.value = '';
      return;
    }

    setUploadingImageIndex(index);

    try {
      // Create FormData with the image file
      const formData = new FormData();
      formData.append('image', file);
      formData.append('category', 'auth_spa_display_image');

      // Upload the image
      const result = await createPlatformImageAsset({
        platform_key: platformKey,
        request: formData,
      }).unwrap();

      // Construct the public URL
      handleDisplayImageChange(
        index,
        'image',
        await getPublicPlatformImageAssetFileUrl(platformKey, result.id),
      );
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading display image:', error);
      toast.error('Failed to upload display image');
    } finally {
      setUploadingImageIndex(null);
      event.target.value = '';
    }
  };

  const handleFaviconUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file');
      event.target.value = '';
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error('Image size should be under 5MB');
      event.target.value = '';
      return;
    }

    setIsUploadingFavicon(true);

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('category', 'auth_spa_favicon');

      const result = await createPlatformImageAsset({
        platform_key: platformKey,
        request: formData,
      }).unwrap();

      handleFieldChange(
        'favicon',
        await getPublicPlatformImageAssetFileUrl(platformKey, result.id),
      );
      toast.success('Favicon uploaded successfully');
    } catch (error) {
      console.error('Error uploading favicon:', error);
      toast.error('Failed to upload favicon');
    } finally {
      setIsUploadingFavicon(false);
      event.target.value = '';
    }
  };

  const handleReset = () => {
    if (metadataLoaded && metadata && metadataKey) {
      const existingData = metadata[metadataKey];
      if (existingData) {
        setFormData({
          ...getDefaultConfig(),
          ...existingData,
          display_images: Array.isArray(existingData.display_images)
            ? existingData.display_images
            : [],
        });
      } else {
        setFormData(getDefaultConfig());
      }
    }
    setHasChanges(false);
    toast.info('Changes discarded');
  };

  if (!currentSPA || !metadataKey) {
    return null;
  }

  if (!metadataLoaded) {
    return (
      <div
        className="rounded-lg px-6 py-5 border border-gray-200 dark:border-gray-700"
        style={{ borderColor: 'oklch(.922 0 0)' }}
      >
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-lg px-6 py-5 border border-gray-200 dark:border-gray-700"
      style={{ borderColor: 'oklch(.922 0 0)' }}
      role="region"
      aria-label="Authentication Interface"
    >
      {/* Header */}
      <div className="flex sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <span id={headerId} className="text-sm font-medium text-[#646464]">
            Authentication Interface
          </span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                aria-label="More info about Auth SPA customization"
                className="hidden sm:block"
              >
                <Info className="h-4 w-4 text-gray-400" aria-hidden="true" />
              </TooltipTrigger>
              <TooltipContent className="rounded-lg bg-gray-700 px-3 py-2 text-sm font-medium whitespace-nowrap text-white shadow-sm transition-opacity duration-300 z-50">
                <p>Customize the authentication interface display</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {isSaving && (
            <Loader2
              className="h-4 w-4 animate-spin text-blue-500"
              role="status"
              aria-label="Saving authentication customization"
            />
          )}
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => setIsCollapsed((previous) => !previous)}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            aria-label={
              isCollapsed ? 'Expand Auth SPA customization' : 'Collapse Auth SPA customization'
            }
            aria-expanded={!isCollapsed}
            aria-controls={contentRegionId}
            type="button"
          >
            {isCollapsed ? (
              <ChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
            ) : (
              <ChevronUp className="h-5 w-5 text-gray-400" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Collapsible Content */}
      {!isCollapsed && (
        <div
          id={contentRegionId}
          role="region"
          aria-labelledby={headerId}
          className="mt-4 space-y-6"
        >
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700">Basic Information</h3>

            <div className="space-y-2">
              <Label htmlFor="display_title_info" className="text-sm font-medium text-[#646464]">
                Display Title
              </Label>
              <Input
                id="display_title_info"
                value={formData.display_title_info}
                onChange={(e) => handleFieldChange('display_title_info', e.target.value)}
                className="font-medium text-[#646464]"
                aria-label="Display title for auth page"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium text-[#646464]">
                Display Meta Title
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                className="font-medium text-[#646464]"
                aria-label="Display meta title for auth page"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="display_description_info"
                className="text-sm font-medium text-[#646464]"
              >
                Display Description
              </Label>
              <Textarea
                id="display_description_info"
                value={formData.display_description_info}
                onChange={(e) => handleFieldChange('display_description_info', e.target.value)}
                rows={3}
                className="font-medium text-[#646464]"
                aria-label="Display description for auth page"
              />
            </div>
          </div>

          {/* Logo */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700">Display Logo</h3>

            <div className="space-y-2">
              <Label htmlFor="display_logo" className="text-sm font-medium text-[#646464]">
                Logo URL or Upload
              </Label>
              <div className="flex gap-2">
                <Input
                  id="display_logo"
                  value={formData.display_logo}
                  onChange={(e) => handleFieldChange('display_logo', e.target.value)}
                  placeholder="https://example.com/logo.png"
                  className="flex-1 font-medium text-[#646464]"
                  aria-label="Logo URL"
                />
                <div>
                  <input
                    type="file"
                    id="logo-upload"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    aria-label="Upload logo file"
                    aria-hidden="true"
                    disabled={isUploadingLogo}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('logo-upload')?.click()}
                    className="whitespace-nowrap"
                    aria-label="Upload logo"
                    disabled={isUploadingLogo}
                  >
                    {isUploadingLogo ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" aria-hidden="true" />
                        Upload
                      </>
                    )}
                  </Button>
                </div>
              </div>
              {formData.display_logo && (
                <div className="mt-2 p-2 border rounded-lg bg-gray-50">
                  <img
                    src={formData.display_logo}
                    alt="Display logo preview"
                    className="h-16 w-auto object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Favicon */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700">Display Favicon</h3>

            <div className="space-y-2">
              <Label htmlFor="favicon" className="text-sm font-medium text-[#646464]">
                Favicon URL or Upload
              </Label>
              <div className="flex gap-2">
                <Input
                  id="favicon"
                  value={formData.favicon}
                  onChange={(e) => handleFieldChange('favicon', e.target.value)}
                  placeholder="https://example.com/favicon.ico"
                  className="flex-1 font-medium text-[#646464]"
                  aria-label="Favicon URL"
                />
                <div>
                  <input
                    type="file"
                    id="favicon-upload"
                    accept="image/*"
                    onChange={handleFaviconUpload}
                    className="hidden"
                    aria-label="Upload favicon file"
                    aria-hidden="true"
                    disabled={isUploadingFavicon}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('favicon-upload')?.click()}
                    className="whitespace-nowrap"
                    aria-label="Upload favicon"
                    disabled={isUploadingFavicon}
                  >
                    {isUploadingFavicon ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" aria-hidden="true" />
                        Upload
                      </>
                    )}
                  </Button>
                </div>
              </div>
              {formData.favicon && (
                <div className="mt-2 p-2 border rounded-lg bg-gray-50">
                  <img
                    src={formData.favicon}
                    alt="Display favicon preview"
                    className="h-12 w-12 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* URLs */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700">Legal Links</h3>

            <div className="space-y-2">
              <Label htmlFor="privacy_policy_url" className="text-sm font-medium text-[#646464]">
                Privacy Policy URL
              </Label>
              <Input
                id="privacy_policy_url"
                value={formData.privacy_policy_url}
                onChange={(e) => handleFieldChange('privacy_policy_url', e.target.value)}
                placeholder="https://example.com/privacy-policy"
                className="font-medium text-[#646464]"
                aria-label="Privacy policy URL"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="terms_of_use_url" className="text-sm font-medium text-[#646464]">
                Terms of Use URL
              </Label>
              <Input
                id="terms_of_use_url"
                value={formData.terms_of_use_url}
                onChange={(e) => handleFieldChange('terms_of_use_url', e.target.value)}
                placeholder="https://example.com/terms-of-use"
                className="font-medium text-[#646464]"
                aria-label="Terms of use URL"
              />
            </div>
          </div>

          {/* Display Images */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">Display Images</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddDisplayImage}
                aria-label="Add display image"
              >
                <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
                Add Image
              </Button>
            </div>

            {formData.display_images.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed rounded-lg text-gray-500">
                <ImageIcon className="h-12 w-12 mx-auto mb-2 text-gray-400" aria-hidden="true" />
                <p className="text-sm">No display images added yet</p>
                <Button
                  type="button"
                  variant="link"
                  onClick={handleAddDisplayImage}
                  className="mt-2"
                  aria-label="Add first display image"
                >
                  Add your first image
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.display_images.map((img, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-3 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium text-[#646464]">
                        Display Image {index + 1}
                      </Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveDisplayImage(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        aria-label={`Remove display image ${index + 1}`}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`image-url-${index}`} className="text-xs text-gray-600">
                        Image URL or Upload
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id={`image-url-${index}`}
                          value={img.image}
                          onChange={(e) => handleDisplayImageChange(index, 'image', e.target.value)}
                          placeholder="https://example.com/image.png"
                          className="flex-1 font-medium text-[#646464]"
                          aria-label={`Image ${index + 1} URL`}
                        />
                        <div>
                          <input
                            type="file"
                            id={`image-upload-${index}`}
                            accept="image/*"
                            onChange={(e) => handleDisplayImageUpload(index, e)}
                            className="hidden"
                            aria-label={`Upload image ${index + 1}`}
                            aria-hidden="true"
                            disabled={uploadingImageIndex === index}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              document.getElementById(`image-upload-${index}`)?.click()
                            }
                            aria-label={`Upload image ${index + 1}`}
                            disabled={uploadingImageIndex === index}
                          >
                            {uploadingImageIndex === index ? (
                              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                            ) : (
                              <Upload className="h-4 w-4" aria-hidden="true" />
                            )}
                          </Button>
                        </div>
                      </div>
                      {img.image && (
                        <div className="mt-2 p-2 border rounded-lg bg-white">
                          <img
                            src={img.image}
                            alt={img.alt || `Display image ${index + 1}`}
                            className="h-24 w-auto object-contain mx-auto"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`image-alt-${index}`} className="text-xs text-gray-600">
                        Alt Text (for accessibility)
                      </Label>
                      <Input
                        id={`image-alt-${index}`}
                        value={img.alt}
                        onChange={(e) => handleDisplayImageChange(index, 'alt', e.target.value)}
                        className="font-medium text-[#646464]"
                        aria-label={`Image ${index + 1} alt text`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            {hasChanges && (
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={isSaving}
                aria-label="Discard changes"
              >
                <X className="h-4 w-4 mr-2" />
                Discard
              </Button>
            )}
            <Button
              type="button"
              onClick={handleSave}
              disabled={isSaving || !hasChanges}
              className="bg-blue-500 hover:bg-blue-600"
              aria-label="Save auth SPA customization"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
