'use client';

import { Button } from '@web-containers/components/ui/button';
import { Input } from '@web-containers/components/ui/input';
import { Textarea } from '@web-containers/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@web-containers/components/ui/select';
import { ToastProvider } from '@web-containers/components/ui/toaster';
import { Avatar, AvatarFallback, AvatarImage } from '@web-containers/components/ui/avatar';
import { Checkbox } from '@web-containers/components/ui/checkbox';
import { useProfile } from './use-profile';
import { useState, useEffect, useRef, type ComponentType } from 'react';
import { Security } from './security';
import { Skeleton } from '../ui/skeleton';
import Gravatar from 'react-gravatar';
import { getInitials } from '@iblai/web-utils';
import type { LucideProps } from 'lucide-react';
import {
  User,
  Globe,
  Shield,
  Briefcase,
  FileText,
  BookOpen,
  Plus,
  Edit2,
  Upload,
} from 'lucide-react';
import { EducationTab } from './career/education-tab';
import { ExperienceTab } from './career/experience-tab';
import { ResumeTab } from './career/resume-tab';
import { EducationDialog } from './career/education-dialog';
import { ExperienceDialog } from './career/experience-dialog';

interface UserProfileModalProps {
  tenant: string;
  username: string;
  onClose: () => void;
  customization?: {
    showMentorAIDisplayCheckbox?: boolean;
    showLeaderboardDisplayCheckbox?: boolean;
    showUsernameField?: boolean;
    showPlatformName?: boolean;
    useGravatarPicFallback?: boolean;
  };
  isAdmin?: boolean;
  targetTab?: string;
}

const renderLucideIcon = (Icon: ComponentType<LucideProps>) =>
  function RenderedIcon(props: LucideProps) {
    return <Icon {...props} />;
  };

export function Profile({
  tenant,
  username,
  onClose,
  customization = {},
  isAdmin = false,
  targetTab = 'basic',
}: UserProfileModalProps) {
  const TABS = [
    { id: 'basic', label: 'Basic', renderIcon: renderLucideIcon(User) },
    { id: 'social', label: 'Social', renderIcon: renderLucideIcon(Globe) },
    { id: 'education', label: 'Education', renderIcon: renderLucideIcon(BookOpen) },
    { id: 'experience', label: 'Experience', renderIcon: renderLucideIcon(Briefcase) },
    { id: 'resume', label: 'Resume', renderIcon: renderLucideIcon(FileText) },
    { id: 'security', label: 'Security', renderIcon: renderLucideIcon(Shield) },
  ];
  const RoleIcon = renderLucideIcon(User);
  const [activeTab, setActiveTab] = useState(targetTab);
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dialog states for education and experience
  const [isEducationDialogOpen, setIsEducationDialogOpen] = useState(false);
  const [isExperienceDialogOpen, setIsExperienceDialogOpen] = useState(false);
  const {
    basicForm,
    socialForm,
    isUserMetadataLoading,
    userMetadata,
    handleProfileImageUpload,
    isUploadingProfileImage,
    userMetadataEdx,
    isUserMetadataEdxLoading,
    FACEBOOK_URL_PREFIX,
    X_URL_PREFIX,
    LINKEDIN_URL_PREFIX,
    handleSocialLinkChange,
    socialValidators,
  } = useProfile(username);

  useEffect(() => {
    const firstInput = document.getElementById('fullName');
    if (firstInput) {
      firstInput.focus();
    }
  }, []);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log('File selected:', file);
    if (file) {
      handleProfileImageUpload(file);
    }
  };

  const handleAddEducation = () => {
    setIsEducationDialogOpen(true);
  };

  const handleAddExperience = () => {
    setIsExperienceDialogOpen(true);
  };

  const handleAddResume = () => {
    // For resume, we'll trigger the file input click
    // We need to access the resume tab's file input ref
    // This will be handled by the ResumeTab component itself
    const fileInput = document.querySelector(
      'input[type="file"][accept="application/pdf"]',
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

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
          {isUserMetadataEdxLoading || isUploadingProfileImage ? (
            <Skeleton className="h-20 w-20 mb-6 rounded-full" />
          ) : (
            <div
              className="relative w-20 h-20 mb-6 cursor-pointer group"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              onClick={handleAvatarClick}
            >
              <Avatar className="h-20 w-20">
                {userMetadataEdx?.profile_image?.has_image ? (
                  <AvatarImage
                    src={userMetadataEdx?.profile_image?.image_url_full}
                    alt="Profile picture"
                    className="rounded-full object-cover w-full h-full group-hover:opacity-80 transition-opacity"
                  />
                ) : customization.useGravatarPicFallback ? (
                  <Gravatar
                    className="w-full h-full rounded-full object-cover group-hover:opacity-80 transition-opacity"
                    email={userMetadata?.email}
                    size={80}
                  />
                ) : (
                  <></>
                )}

                <AvatarFallback className="bg-blue-800 text-white text-xl rounded-full">
                  {getInitials(
                    userMetadata?.name || userMetadata?.username || userMetadata?.email || '',
                  )}
                </AvatarFallback>
              </Avatar>

              {/* Upload overlay */}
              {isHovering && (
                <div className="absolute inset-0 flex items-center justify-center bg-blue-800 rounded-full border-4 border-white/20">
                  <span className="text-white text-xs font-medium text-center px-2">Upload</span>
                </div>
              )}

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          )}

          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 text-center mb-4">
            {userMetadata?.name}
            {customization.showUsernameField && `, ${userMetadata?.username}`}
          </h2>

          <div className="flex justify-center space-x-3">
            <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium flex items-center text-sm">
              <RoleIcon className="h-4 w-4 mr-2" />
              {isAdmin ? 'Admin' : 'Student'}
            </div>
            {customization.showPlatformName && (
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
                  <tab.renderIcon className="h-5 w-5 mr-3 flex-shrink-0" />
                  <span className="truncate">{tab.label}</span>
                </button>
              ))}
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
                <tab.renderIcon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden" style={{ height: '100%' }}>
        {/* Fixed Header */}
        <div className="hidden lg:block flex-shrink-0 p-6 border-b border-gray-200 bg-white dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2 capitalize">
                {activeTab}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {activeTab === 'basic' && 'Manage your basic account information and preferences.'}
                {activeTab === 'social' && 'Connect and manage your social media accounts.'}
                {activeTab === 'education' && 'Review and update your academic achievements.'}
                {activeTab === 'experience' && 'Keep your professional journey up to date.'}
                {activeTab === 'resume' && 'Upload and preview your most recent resume.'}
                {activeTab === 'security' && 'Update your security settings and password.'}
              </p>
            </div>
            {(activeTab === 'education' ||
              activeTab === 'experience' ||
              activeTab === 'resume') && (
              <Button
                size="icon"
                onClick={
                  activeTab === 'education'
                    ? handleAddEducation
                    : activeTab === 'experience'
                      ? handleAddExperience
                      : handleAddResume
                }
                className="text-gray-700 bg-gradient-to-r from-[#2563EB] to-[#93C5FD] hover:opacity-90 text-white mr-4"
                aria-label={`Add ${activeTab}`}
              >
                {activeTab === 'resume' ? (
                  <Upload className="h-4 w-4" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
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
            <div className="flex flex-row items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2 capitalize">
                  {activeTab}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {activeTab === 'basic' &&
                    'Manage your basic account information and preferences.'}
                  {activeTab === 'social' && 'Connect and manage your social media accounts.'}
                  {activeTab === 'education' && 'Review and update your academic achievements.'}
                  {activeTab === 'experience' && 'Keep your professional journey up to date.'}
                  {activeTab === 'resume' && 'Upload and preview your most recent resume.'}
                  {activeTab === 'security' && 'Update your security settings and password.'}
                </p>
              </div>
              {(activeTab === 'education' ||
                activeTab === 'experience' ||
                activeTab === 'resume') && (
                <Button
                  //variant="outline"
                  size="icon"
                  onClick={
                    activeTab === 'education'
                      ? handleAddEducation
                      : activeTab === 'experience'
                        ? handleAddExperience
                        : handleAddResume
                  }
                  className="text-gray-700 bg-gradient-to-r from-[#2563EB] to-[#93C5FD] hover:opacity-90 text-white"
                  aria-label={`Add ${activeTab}`}
                >
                  {activeTab === 'resume' ? (
                    <Edit2 className="h-4 w-4" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
          </div>

          {activeTab === 'basic' && (
            <div className="max-w-2xl space-y-6">
              <form
                onSubmit={(formEvent) => {
                  formEvent.preventDefault();
                  formEvent.stopPropagation();
                  basicForm.handleSubmit();
                }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label htmlFor="fullName" className="text-gray-500 dark:text-gray-400 text-base">
                    Full Name
                  </label>
                  {basicForm.Field({
                    name: 'fullName',
                    children: (field) => (
                      <Input
                        id="fullName"
                        className="w-full bg-gray-50 border-gray-200 focus:ring-blue-500 focus:border-blue-500 text-base py-3"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        disabled={basicForm.state.isSubmitting || isUserMetadataLoading}
                      />
                    ),
                  })}
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-gray-500 dark:text-gray-400 text-base">
                    Email
                  </label>
                  {basicForm.Field({
                    name: 'email',
                    children: (field) => (
                      <Input
                        id="email"
                        type="email"
                        className="w-full bg-gray-50 border-gray-200 focus:ring-blue-500 focus:border-blue-500 text-base py-3"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        disabled={basicForm.state.isSubmitting || isUserMetadataLoading}
                      />
                    ),
                  })}
                </div>
                {customization.showUsernameField && (
                  <div className="space-y-2">
                    <label
                      htmlFor="username"
                      className="text-gray-500 dark:text-gray-400 text-base"
                    >
                      Username
                    </label>
                    {basicForm.Field({
                      name: 'username',
                      children: (field) => (
                        <Input
                          id="username"
                          className="w-full bg-gray-50 border-gray-200 focus:ring-blue-500 focus:border-blue-500 text-base py-3"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          disabled={basicForm.state.isSubmitting || isUserMetadataLoading}
                        />
                      ),
                    })}
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="title" className="text-gray-500 dark:text-gray-400 text-base">
                    Title
                  </label>
                  {basicForm.Field({
                    name: 'title',
                    children: (field) => (
                      <Input
                        id="title"
                        className="w-full bg-gray-50 border-gray-200 focus:ring-blue-500 focus:border-blue-500 text-base py-3"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        disabled={basicForm.state.isSubmitting || isUserMetadataLoading}
                      />
                    ),
                  })}
                </div>

                <div className="space-y-2">
                  <label htmlFor="about" className="text-gray-500 dark:text-gray-400 text-base">
                    About
                  </label>
                  {basicForm.Field({
                    name: 'about',
                    children: (field) => (
                      <Textarea
                        id="about"
                        placeholder="Tell us about yourself"
                        className="w-full bg-gray-50 border-gray-200 focus:ring-blue-500 focus:border-blue-500 text-base resize-none"
                        rows={4}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        disabled={basicForm.state.isSubmitting || isUserMetadataLoading}
                      />
                    ),
                  })}
                </div>

                <div className="space-y-2">
                  <label htmlFor="language" className="text-gray-500 dark:text-gray-400 text-base">
                    Language
                  </label>
                  {basicForm.Field({
                    name: 'language',
                    children: (field) => (
                      <Select
                        defaultValue={field.state.value}
                        onValueChange={(value: string) => field.handleChange(value)}
                        disabled={basicForm.state.isSubmitting || isUserMetadataLoading}
                      >
                        <SelectTrigger
                          className="w-full bg-gray-50 border-gray-200 focus:ring-blue-500 focus:border-blue-500 text-base py-3 text-sm"
                          aria-label="Select a language"
                        >
                          <SelectValue placeholder="Select a language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                        </SelectContent>
                      </Select>
                    ),
                  })}
                </div>
                {(customization.showLeaderboardDisplayCheckbox ||
                  customization.showMentorAIDisplayCheckbox) && (
                  <div className="grid grid-cols-2 gap-6 pt-4">
                    {customization.showMentorAIDisplayCheckbox && (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          {basicForm.Field({
                            name: 'displayMentor',
                            children: (field) => (
                              <Checkbox
                                onCheckedChange={(checked: boolean) => field.handleChange(checked)}
                                checked={field.state.value}
                                disabled={basicForm.state.isSubmitting || isUserMetadataLoading}
                                id="display-mentor"
                              />
                            ),
                          })}

                          <label
                            htmlFor="display-mentor"
                            className="text-sm leading-none font-medium text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Display Mentor AI
                          </label>
                        </div>
                      </div>
                    )}
                    {customization.showLeaderboardDisplayCheckbox && (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          {basicForm.Field({
                            name: 'displayLeaderBoard',
                            children: (field) => (
                              <Checkbox
                                onCheckedChange={(checked: boolean) => field.handleChange(checked)}
                                checked={field.state.value}
                                disabled={basicForm.state.isSubmitting || isUserMetadataLoading}
                                id="display-leaderboard"
                              />
                            ),
                          })}
                          <label
                            htmlFor="display-leaderboard"
                            className="text-sm leading-none font-medium text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Display Leaderboard
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </form>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="max-w-2xl space-y-6">
              <form
                className="space-y-6"
                onSubmit={(formEvent) => {
                  formEvent.preventDefault();
                  formEvent.stopPropagation();
                  socialForm.handleSubmit();
                }}
              >
                <div className="space-y-2">
                  <label className="text-gray-500 dark:text-gray-400 text-base">Facebook</label>
                  {socialForm.Field({
                    name: 'facebook',
                    validators: {
                      onChange: socialValidators.facebook,
                    },
                    children: (field) => (
                      <>
                        <div className="relative mb-0">
                          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <div className="bg-[#1877F2] text-white rounded w-8 h-8 flex items-center justify-center">
                              <span className="font-bold text-sm">f</span>
                            </div>
                          </div>
                          <Input
                            id="facebook"
                            className="w-full bg-gray-50 border-gray-200 focus:ring-blue-500 focus:border-blue-500 text-base py-3 pl-16 h-10"
                            placeholder="Facebook"
                            value={field.state.value}
                            onChange={(e) =>
                              handleSocialLinkChange(
                                e.target.value,
                                field.handleChange,
                                FACEBOOK_URL_PREFIX,
                              )
                            }
                            disabled={socialForm.state.isSubmitting}
                          />
                        </div>
                        <p className="text-red-500 dark:text-gray-400 text-sm">
                          {field.state.meta.errors}
                        </p>
                      </>
                    ),
                  })}
                </div>

                <div className="space-y-2">
                  <label className="text-gray-500 dark:text-gray-400 text-base">LinkedIn</label>
                  {socialForm.Field({
                    name: 'linkedIn',
                    validators: {
                      onChange: socialValidators.linkedIn,
                    },
                    children: (field) => (
                      <>
                        <div className="relative mb-0">
                          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <div className="bg-[#0A66C2] text-white rounded w-8 h-8 flex items-center justify-center">
                              <span className="font-bold text-xs">in</span>
                            </div>
                          </div>
                          <Input
                            id="linkedin"
                            className="w-full bg-gray-50 border-gray-200 focus:ring-blue-500 focus:border-blue-500 text-base py-3 pl-16 h-10"
                            placeholder="LinkedIn"
                            value={field.state.value}
                            onChange={(e) =>
                              handleSocialLinkChange(
                                e.target.value,
                                field.handleChange,
                                LINKEDIN_URL_PREFIX,
                              )
                            }
                            disabled={socialForm.state.isSubmitting}
                          />
                        </div>
                        <p className="text-red-500 dark:text-gray-400 text-sm">
                          {field.state.meta.errors}
                        </p>
                      </>
                    ),
                  })}
                </div>

                <div className="space-y-2">
                  <label className="text-gray-500 dark:text-gray-400 text-base">X</label>
                  {socialForm.Field({
                    name: 'x',
                    validators: {
                      onChange: socialValidators.x,
                    },
                    children: (field) => (
                      <>
                        <div className="relative mb-0">
                          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <div className="bg-black text-white rounded w-8 h-8 flex items-center justify-center">
                              <span className="font-bold text-sm">X</span>
                            </div>
                          </div>
                          <Input
                            id="x"
                            className="w-full bg-gray-50 border-gray-200 focus:ring-blue-500 focus:border-blue-500 text-base py-3 pl-16 h-10"
                            placeholder="X"
                            value={field.state.value}
                            onChange={(e) =>
                              handleSocialLinkChange(
                                e.target.value,
                                field.handleChange,
                                X_URL_PREFIX,
                              )
                            }
                            disabled={socialForm.state.isSubmitting}
                          />
                        </div>
                        <p className="text-red-500 dark:text-gray-400 text-sm">
                          {field.state.meta.errors}
                        </p>
                      </>
                    ),
                  })}
                </div>
              </form>
            </div>
          )}

          {activeTab === 'education' && <EducationTab org={tenant} username={username} />}
          {activeTab === 'experience' && <ExperienceTab org={tenant} username={username} />}
          {activeTab === 'resume' && <ResumeTab org={tenant} username={username} />}
          {activeTab === 'security' && <Security email={userMetadata?.email} />}
        </div>

        {/* Fixed Bottom Buttons */}
        {['basic', 'social'].includes(activeTab) && (
          <div className="flex-shrink-0 border-t border-gray-200 p-6 bg-white dark:bg-gray-900">
            <div className="flex justify-end gap-3">
              <Button onClick={onClose} variant="outline">
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (activeTab === 'basic') {
                    basicForm.handleSubmit();
                  } else if (activeTab === 'social') {
                    socialForm.handleSubmit();
                  }
                }}
                className="bg-gradient-to-r from-[#2563EB] to-[#93C5FD] hover:opacity-90 text-white"
                disabled={
                  (activeTab === 'basic' &&
                    (basicForm.state.isSubmitting || isUserMetadataLoading)) ||
                  (activeTab === 'social' && socialForm.state.isSubmitting)
                }
              >
                {(activeTab === 'basic' && basicForm.state.isSubmitting) ||
                (activeTab === 'social' && socialForm.state.isSubmitting)
                  ? 'Saving...'
                  : 'Save Changes'}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <EducationDialog
        open={isEducationDialogOpen}
        onOpenChange={setIsEducationDialogOpen}
        education={undefined}
        org={tenant}
        username={username}
        onComplete={() => {
          // The education tab will handle refetching
        }}
      />

      <ExperienceDialog
        open={isExperienceDialogOpen}
        onOpenChange={setIsExperienceDialogOpen}
        experience={undefined}
        org={tenant}
        username={username}
        onComplete={() => {
          // The experience tab will handle refetching
        }}
      />

      <ToastProvider />
    </div>
  );
}

export { Account } from './account';
