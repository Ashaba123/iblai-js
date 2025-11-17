import { TenantMetadata } from "./types";

// Base configuration for general settings
const BASE_CONFIG: ConfigFile = {
  settings: [
    {
      slug: "support_email",
      label: "Support Email Address",
      defaultValue: "support@iblai.zendesk.com",
      description: "Default support email address",
      type: "string",
    },
  ],
};

// SkillsAI platform configuration
const SKILLS_AI_CONFIG: ConfigFile = {
  spa: "skillsAI",
  settings: [
    {
      slug: "enable_public_profile_toggle_display",
      label: "Public Profile",
      defaultValue: false,
      description: "Allow users to toggle their profile visibility",
      type: "boolean",
    },
    {
      slug: "enable_start_screen_display",
      label: "Start Screen",
      defaultValue: true,
      description: "Allow users to access the start screen page",
      type: "boolean",
    },

    {
      slug: "skills_embedded_mentor_name",
      label: "Default Mentor",
      defaultValue: "mentorAI",
      description: "Default mentor to embed on the skills platform",
      type: "string",
    },
    {
      slug: "skills_include_community_courses",
      label: "Community Courses",
      defaultValue: false,
      description: "Allow users to access courses from the community.",
      type: "boolean",
    },

    /* {
      slug: "enable_sidebar_ai_mentor_display",
      label: "Sidebar mentorAI Display",
      defaultValue: true,
      description: "Show mentorAI in the sidebar of the skills platform",
      type: "boolean",
    },

    {
      slug: "enable_skills_leaderboard_display",
      label: "Skills Leaderboard Display",
      defaultValue: true,
      description: "Show the skills leaderboard on the platform",
      type: "boolean",
    },
    {
      slug: "enable_start_screen_roles_skills_tenant_based",
      label: "Tenant-Based Roles on Start Page",
      defaultValue: false,
      description: "Show tenant-specific roles and skills on the start page",
      type: "boolean",
    },
    {
      slug: "enable_content_assignment_on_skills_profile_page",
      label: "Content Assignment on Profile",
      defaultValue: true,
      description: "Allow content assignment on the skills profile page (Courses, Pathways, Programs)",
      type: "boolean",
    },
    {
      slug: "enable_resume_upload_on_skills",
      label: "Resume Upload Feature",
      defaultValue: true,
      description: "Allow users to upload resumes on the skills platform",
      type: "boolean",
    }, */
  ],
};

// MentorAI platform configuration
const MENTOR_AI_CONFIG: ConfigFile = {
  spa: "mentorAI",
  settings: [
    {
      slug: "show_help",
      label: "Help Menu",
      defaultValue: true,
      description:
        "Display the link to the help center documentation across the platform.",
      type: "boolean",
    },
    {
      slug: "accessibility_menu",
      label: "Accessibility Menu",
      defaultValue: false,
      description: "Display the accessibility menu in the mentor platform.",
      type: "boolean",
    },
    {
      slug: "mentor_include_community_mentors",
      label: "Community Mentors",
      defaultValue: true,
      description: "Allow users to access the mentors from the community.",
      type: "boolean",
    },
    {
      slug: "help_center_url",
      label: "Help Center URL",
      defaultValue: "https://docs.ibl.ai",
      description: "URL for the help center documentation",
      type: "string",
    },
  ],
};

// Configuration map
const CONFIG_MAP = {
  base: BASE_CONFIG,
  skillsAI: SKILLS_AI_CONFIG,
  mentorAI: MENTOR_AI_CONFIG,
};

export interface ConfigSetting {
  slug: string;
  label: string;
  defaultValue: any;
  description: string;
  type: "boolean" | "string" | "number";
  SPA?: string;
}

export interface ConfigFile {
  spa?: string;
  settings: ConfigSetting[];
}

/**
 * Loads all metadata configurations for a given SPA
 * @param spa - The SPA identifier (e.g., 'mentorAI', 'skillsAI', 'mentor', 'skills'). If not provided, returns all SPAs
 * @returns Array of TenantMetadata objects
 */
export function loadMetadataConfig(spa?: string): TenantMetadata[] {
  const allSettings: TenantMetadata[] = [];

  // Add base settings (general settings)
  const baseSettings = BASE_CONFIG.settings.map((setting) => ({
    ...setting,
    SPA: undefined, // Base settings don't belong to a specific SPA
  }));
  allSettings.push(...baseSettings);

  if (spa) {
    // Find matching SPA configuration (case-insensitive partial matching)
    const matchingSpaKey = Object.keys(CONFIG_MAP).find((spaKey) => {
      if (spaKey === "base") return false;
      const spaConfig = CONFIG_MAP[spaKey as keyof typeof CONFIG_MAP];
      const spaName = spaConfig.spa?.toLowerCase() || "";
      const searchTerm = spa.toLowerCase();
      return spaName.includes(searchTerm) || searchTerm.includes(spaName);
    });

    if (matchingSpaKey) {
      const spaConfig = CONFIG_MAP[matchingSpaKey as keyof typeof CONFIG_MAP];
      const spaSettings = spaConfig.settings.map((setting) => ({
        ...setting,
        SPA: spaConfig.spa,
      }));
      allSettings.push(...spaSettings);
    }
  } else {
    // If no SPA is provided, add all SPA-specific settings
    Object.keys(CONFIG_MAP).forEach((spaKey) => {
      if (spaKey !== "base") {
        const spaConfig = CONFIG_MAP[spaKey as keyof typeof CONFIG_MAP];
        const spaSettings = spaConfig.settings.map((setting) => ({
          ...setting,
          SPA: spaConfig.spa,
        }));
        allSettings.push(...spaSettings);
      }
    });
  }

  return allSettings;
}

/**
 * Gets all available SPAs from the configuration
 * @returns Array of SPA identifiers
 */
export function getAvailableSPAs(): string[] {
  return Object.keys(CONFIG_MAP).filter((key) => key !== "base");
}

/**
 * Gets configuration for a specific SPA
 * @param spa - The SPA identifier
 * @returns ConfigFile object or null if not found
 */
export function getSPAConfig(spa: string): ConfigFile | null {
  return CONFIG_MAP[spa as keyof typeof CONFIG_MAP] || null;
}

/**
 * Gets all configurations
 * @returns Object with all configurations
 */
export function getAllConfigs(): typeof CONFIG_MAP {
  return CONFIG_MAP;
}
