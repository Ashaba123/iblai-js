import { useUpdateUserAccountMutation, useGetUserMetadataQuery } from '@iblai/data-layer';

/**
 * Filters out read-only fields that cause backend validation errors
 */
function filterSafeUserFields(data: any) {
  // Fields that cause validation errors and should not be sent
  const readOnlyFields = [
    'date_joined',
    'profile_image', // This should be in public_metadata only
    'is_active',
    'requires_parental_consent',
    'phone_number', // Causes null validation error
    'secondary_email', // Causes null validation error
    'email', // Only send if actually changing
    'id',
    'verified_name',
    'extended_profile',
    'gender',
    'state',
    'goals',
    'last_login',
    'mailing_address',
    'secondary_email_enabled',
    'year_of_birth',
    'activation_key',
    'pending_name_change',
    'country',
    'level_of_education',
    'language_proficiencies',
    'time_zone',
    'accomplishments_shared',
    'course_certificates',
    'bio', // This should be in public_metadata only
    'account_privacy',
  ];

  const filtered = { ...data };
  readOnlyFields.forEach(field => {
    delete filtered[field];
  });

  return filtered;
}

export interface UserProfileUpdateData {
  name?: string;
  title?: string;
  about?: string;
  social_links?: { platform: string; social_link: string }[];
  public_metadata?: {
    bio?: string;
    name?: string;
    about?: string;
    language?: string;
    social_links?: { platform: string; social_link: string }[];
    [key: string]: any;
  };
  enable_sidebar_ai_mentor_display?: boolean;
  enable_skills_leaderboard_display?: boolean;
}

export interface UseUserProfileUpdateResult {
  updateProfile: (data: UserProfileUpdateData) => Promise<void>;
  isLoading: boolean;
  error: any;
}

export function useUserProfileUpdate(username: string): UseUserProfileUpdateResult {
  const [updateUserAccount, { isLoading, error }] = useUpdateUserAccountMutation();
  const { refetch } = useGetUserMetadataQuery(
    username ? { params: { username } } : { params: { username: '' } },
    { skip: !username }
  );

  const updateProfile = async (data: UserProfileUpdateData) => {
    if (!username) {
      throw new Error('Username is required for profile update');
    }

    try {
      const payload = {
        username,
        ...filterSafeUserFields(data),
      };

      await updateUserAccount(payload).unwrap();

      // Refetch the user metadata to ensure UI is updated
      refetch();
    } catch (error) {
      console.error('Failed to update user profile:', error);
      throw error;
    }
  };

  return {
    updateProfile,
    isLoading,
    error,
  };
}