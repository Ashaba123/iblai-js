import { useForm, ReactFormExtendedApi } from '@tanstack/react-form';
import { z } from 'zod';

import {
  useGetUserMetadataEdxQuery,
  useGetUserMetadataQuery,
  UserProfile,
  useUpdateUserMetadataMutation,
  useUploadProfileImageMutation,
  useUpdateUserMetadataEdxMutation,
} from '@iblai/data-layer';
import { useEffect } from 'react';
//import { useToast } from "../hooks/use-toast";
import { toast } from 'sonner';

export interface ProfileBasicFormValues {
  fullName: string;
  email: string;
  username: string;
  title: string;
  about: string;
  language: string;
  displayMentor: boolean;
  displayLeaderBoard: boolean;
}

export interface ProfileSocialFormValues {
  facebook: string;
  linkedIn: string;
  x: string;
}

// Define URL prefixes as constants outside the function
const FACEBOOK_URL_PREFIX = 'https://facebook.com/';
const X_URL_PREFIX = 'https://x.com/';
const LINKEDIN_URL_PREFIX = 'https://linkedin.com/in/';

const socialFormSchema = z.object({
  facebook: z.string().refine(
    (val) => {
      if (!val || val === '') return true;
      // Extract username from full URL and validate
      const username = val.replace(FACEBOOK_URL_PREFIX, '');
      return /^[a-zA-Z0-9.-]+$/.test(username);
    },
    {
      message: 'Username can only contain letters, numbers, hyphens, and periods',
    },
  ),
  linkedIn: z.string().refine(
    (val) => {
      if (!val || val === '') return true;
      // Extract username from full URL and validate
      const username = val.replace(LINKEDIN_URL_PREFIX, '');
      return /^[a-zA-Z0-9.-]{5,}$/.test(username);
    },
    {
      message:
        'Username must be at least 5 characters long and can only contain letters, numbers, and periods.',
    },
  ),
  x: z.string().refine(
    (val) => {
      if (!val || val === '') return true;
      // Extract username from full URL and validate
      const username = val.replace(X_URL_PREFIX, '');
      return /^[a-zA-Z0-9_]{4,15}$/.test(username);
    },
    {
      message:
        'Username must be 4 to 15 characters long and can only contain letters, numbers, and underscores.',
    },
  ),
});

export const useProfile = (
  username: string,
): {
  basicForm: ReactFormExtendedApi<
    ProfileBasicFormValues,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >;
  socialForm: ReactFormExtendedApi<
    ProfileSocialFormValues,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >;
  userMetadata: UserProfile | undefined;
  isUserMetadataLoading: boolean;
  handleProfileImageUpload: (file: File) => void;
  isUploadingProfileImage: boolean;
  userMetadataEdx: Partial<UserProfile> | undefined;
  isUserMetadataEdxLoading: boolean;
  FACEBOOK_URL_PREFIX: string;
  X_URL_PREFIX: string;
  LINKEDIN_URL_PREFIX: string;
  handleSocialLinkChange: (
    value: string,
    callback: (value: string) => void,
    prefix: string,
  ) => void;
  socialFormSchema: z.ZodSchema<ProfileSocialFormValues>;
  socialValidators: {
    facebook: ({ value }: { value: string }) => string | undefined;
    linkedIn: ({ value }: { value: string }) => string | undefined;
    x: ({ value }: { value: string }) => string | undefined;
  };
} => {
  //const toast = useToast();
  const {
    data: userMetadata,
    isLoading: isUserMetadataLoading,
    refetch,
  } = useGetUserMetadataQuery({
    params: { username },
  });
  const {
    data: userMetadataEdx,
    isLoading: isUserMetadataEdxLoading,
    refetch: refetchUserMetadataEdx,
  } = useGetUserMetadataEdxQuery({
    params: { username },
  });
  const [updateUserMetadata] = useUpdateUserMetadataMutation();
  const [updateUserMetadataEdx] = useUpdateUserMetadataEdxMutation();
  const [uploadProfileImage, { isLoading: isUploadingProfileImage }] =
    useUploadProfileImageMutation();
  const basicForm = useForm({
    defaultValues: {
      fullName: userMetadata?.name || '',
      email: userMetadata?.email || '',
      username: userMetadata?.username || '',
      title: userMetadata?.title ?? '',
      about: userMetadata?.about || '',
      language: userMetadata?.public_metadata?.language || '',
      displayMentor: userMetadata?.enable_sidebar_ai_mentor_display !== false,
      displayLeaderBoard: userMetadata?.enable_skills_leaderboard_display !== false,
    },
    onSubmit: async ({ value }) => {
      try {
        const payload: Record<string, any> = {
          name: value.fullName,
          username: value.username,
          title: value.title,
          about: value.about,
          public_metadata: {
            ...(userMetadata?.public_metadata || {}),
            language: value.language,
          },
          enable_sidebar_ai_mentor_display: value.displayMentor,
          enable_skills_leaderboard_display: value.displayLeaderBoard,
        };
        if (value.email !== userMetadata?.email) {
          payload['email'] = value.email;
          toast.success('An email has been sent to your email');
        }
        await updateUserMetadata(payload as UserProfile);
        payload['email'] = value.email;
        toast.success('Profile updated successfully');
        refetch();
      } catch (error) {
        console.error(JSON.stringify(error));
      }
    },
  });

  const handleSocialLinkChange = (
    value: string,
    callback: (value: string) => void,
    prefix: string,
  ) => {
    if (!value.startsWith(prefix)) {
      callback(prefix);
    } else {
      callback(value);
    }
  };

  const socialForm = useForm({
    defaultValues: {
      facebook:
        FACEBOOK_URL_PREFIX +
        (userMetadata?.social_links.find((social: any) => social?.platform === 'facebook')
          ?.social_link ?? ''),
      x:
        X_URL_PREFIX +
        (userMetadata?.social_links.find((social: any) => social?.platform === 'twitter')
          ?.social_link ?? ''),
      linkedIn:
        LINKEDIN_URL_PREFIX +
        (userMetadata?.social_links.find((social: any) => social?.platform === 'linkedin')
          ?.social_link ?? ''),
    },
    /* validators: {
      onChange: socialFormSchema,
    }, */
    onSubmit: async ({ value }) => {
      try {
        if (!userMetadata) return;
        const socialLinks = [
          {
            platform: 'facebook',
            social_link: String(value.facebook).replace(FACEBOOK_URL_PREFIX, ''),
          },
          {
            platform: 'twitter',
            social_link: String(value.x).replace(X_URL_PREFIX, ''),
          },
          {
            platform: 'linkedin',
            social_link: String(value.linkedIn).replace(LINKEDIN_URL_PREFIX, ''),
          },
        ];
        const updatedData = {
          social_links: socialLinks,
          username: userMetadata?.username,
        } as UserProfile;
        //const {email, ...rest} = userMetadata as UserProfile;
        await updateUserMetadata({
          //...rest as UserProfile,
          ...updatedData,
        });
        toast.success('Social platforms updated successfully');
        refetch();
      } catch (error) {
        console.error(JSON.stringify(error));
      }
    },
  });

  useEffect(() => {
    let userProfile = userMetadata as UserProfile;
    if (userProfile) {
      basicForm.reset({
        fullName: userProfile.name,
        email: userProfile.email,
        username: userProfile.username,
        title: userProfile.title,
        about: userProfile.about,
        language: userProfile?.public_metadata?.language,
        displayMentor: !!userProfile?.enable_sidebar_ai_mentor_display,
        displayLeaderBoard: !!userProfile?.enable_skills_leaderboard_display,
      });
      const facebook = userProfile.social_links.find(
        (social) => social.platform === 'facebook',
      )?.social_link;
      const twitter = userProfile.social_links.find(
        (social) => social.platform === 'twitter',
      )?.social_link;
      const linkedin = userProfile.social_links.find(
        (social) => social.platform === 'linkedin',
      )?.social_link;
      socialForm.reset({
        facebook: FACEBOOK_URL_PREFIX + (facebook ? facebook : ''),
        x: X_URL_PREFIX + (twitter ? twitter : ''),
        linkedIn: LINKEDIN_URL_PREFIX + (linkedin ? linkedin : ''),
      });
    }
  }, [userMetadata]);

  const handleProfileImageUpload = async (file: File) => {
    try {
      if (!userMetadata?.year_of_birth) {
        const DEFAULT_YEAR_OF_BIRTH = 1996;
        await updateUserMetadataEdx({
          username: userMetadata?.username || '',
          body: JSON.stringify({
            year_of_birth: DEFAULT_YEAR_OF_BIRTH,
          }),
          method: 'PATCH',
          contentType: 'application/merge-patch+json',
        }).unwrap();
      }
      const formData = new FormData();
      formData.append('file', file);
      await uploadProfileImage({
        file: file,
        filename: file.name,
        username: userMetadata?.username || '',
      }).unwrap();
      toast.success('Profile image uploaded successfully');
      refetchUserMetadataEdx();
    } catch {
      toast.error('Profile image upload failed');
    }
  };

  // Social field validators
  const socialValidators = {
    facebook: ({ value }: { value: string }) => {
      if (!value || value === '') return undefined;
      const username = value.replace(FACEBOOK_URL_PREFIX, '');
      if (!username || username === '') return undefined;
      return /^[a-zA-Z0-9.-]+$/.test(username)
        ? undefined
        : 'Username can only contain letters, numbers, hyphens, and periods';
    },
    linkedIn: ({ value }: { value: string }) => {
      if (!value || value === '') return undefined;
      const username = value.replace(LINKEDIN_URL_PREFIX, '');
      if (!username || username === '') return undefined;
      return /^[a-zA-Z0-9.-]{5,}$/.test(username)
        ? undefined
        : 'Username must be at least 5 characters long and can only contain letters, numbers, and periods.';
    },
    x: ({ value }: { value: string }) => {
      if (!value || value === '') return undefined;
      const username = value.replace(X_URL_PREFIX, '');
      if (!username || username === '') return undefined;
      return /^[a-zA-Z0-9_]{4,15}$/.test(username)
        ? undefined
        : 'Username must be 4 to 15 characters long and can only contain letters, numbers, and underscores.';
    },
  };

  return {
    basicForm,
    socialForm,
    userMetadata: userMetadata as UserProfile | undefined,
    isUserMetadataLoading,
    handleProfileImageUpload,
    isUploadingProfileImage,
    userMetadataEdx,
    isUserMetadataEdxLoading,
    FACEBOOK_URL_PREFIX,
    X_URL_PREFIX,
    LINKEDIN_URL_PREFIX,
    handleSocialLinkChange,
    socialFormSchema,
    socialValidators,
  };
};
