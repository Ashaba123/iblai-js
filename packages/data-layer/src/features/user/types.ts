export interface ProfileImage {
  has_image: boolean;
  image_url_full: string;
  image_url_large: string;
  image_url_medium: string;
  image_url_small: string;
}

export interface UserProfile {
  account_privacy: "private" | "public";
  about: string;
  title: string;
  public_metadata: {
    about: string;
    bio: string;
    language: string;
    name: string;
    profile_image: ProfileImage;
    social_links?: { platform: string; social_link: string }[];
    [key: string]: any;
  };
  profile_image: ProfileImage;
  profile_image_url?: string;
  username: string;
  bio: string | null;
  course_certificates: string | null;
  country: string | null;
  date_joined: string;
  language_proficiencies: string[];
  level_of_education: string | null;
  enable_sidebar_ai_mentor_display: boolean;
  enable_skills_leaderboard_display: boolean;
  social_links: { platform: string; social_link: string }[];
  time_zone: string | null;
  accomplishments_shared: boolean;
  name: string;
  email: string;
  id: number;
  verified_name: string | null;
  extended_profile: unknown[];
  gender: string | null;
  state: string | null;
  goals: string | null;
  is_active: boolean;
  last_login: string;
  mailing_address: string | null;
  requires_parental_consent: boolean;
  secondary_email: string | null;
  secondary_email_enabled: boolean | null;
  year_of_birth: number | null;
  phone_number: string | null;
  activation_key: string | null;
  pending_name_change: boolean | null;
}

export interface GetUserMetadataArgs {
  params: { username: string };
}

export interface UpdateUserAccountRequest {
  username: string;
  name?: string;
  email?: string;
  title?: string;
  about?: string;
  social_links?: { platform: string; social_link: string }[];
  public_metadata?: {
    bio?: string;
    name?: string;
    about?: string;
    language?: string;
    social_links?: { platform: string; social_link: string }[];
    profile_image?: {
      has_image: boolean;
      image_url_full: string;
      image_url_large: string;
      image_url_small: string;
      image_url_medium: string;
    };
    [key: string]: any;
  };
  enable_sidebar_ai_mentor_display?: boolean;
  enable_skills_leaderboard_display?: boolean;
}

export type UpdateUserRoleRequest = {
  active: boolean;
  org: string;
  role: string;
  username: string;
};

export interface UploadProfileImageResponse {
  profile_image_url: string;
}

export interface RemoveProfileImageResponse {
  success: boolean;
}
