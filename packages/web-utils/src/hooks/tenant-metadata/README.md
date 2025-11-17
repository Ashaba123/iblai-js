# Tenant Metadata Configuration System

This directory contains the configuration system for tenant metadata settings across different SPAs (Single Page Applications).

## Structure

```
tenant-metadata/
├── config/
│   ├── base.yml          # General settings for all SPAs
│   ├── skillsAI.yml      # Skills platform specific settings
│   └── mentorAI.yml      # Mentor platform specific settings
├── config-loader.ts      # Configuration loader and utilities
├── types.ts             # TypeScript type definitions
├── constants.ts         # Legacy constants (deprecated)
├── use-tenant-metadata.ts # React hook for metadata
└── README.md           # This file
```

## Configuration Files

### Base Configuration (`config/base.yml`)
Contains general settings that apply across all SPAs:
- `enable_public_profile_toggle_display`
- `support_email`

### SPA-Specific Configurations

#### SkillsAI (`config/skillsAI.yml`)
Settings specific to the skills platform:
- `enable_sidebar_ai_mentor_display`
- `enable_skills_leaderboard_display`
- `enable_start_screen_roles_skills_tenant_based`
- `enable_content_assignment_on_skills_profile_page`
- `enable_resume_upload_on_skills`

#### MentorAI (`config/mentorAI.yml`)
Settings specific to the mentor platform:
- `show_help`
- `show_faq`
- `help_center_url`

## Usage

### In React Components

```typescript
import { useTenantMetadata } from '@iblai/web-utils';

function MyComponent() {
  // For specific SPA (supports partial matching)
  const { metadataLoaded, getAllMetadatas } = useTenantMetadata({
    org: 'tenant-key',
    spa: 'mentorAI' // or 'mentor', 'skillsAI', 'skills'
  });

  // For all SPAs (when no spa parameter is provided)
  const { metadataLoaded, getAllMetadatas } = useTenantMetadata({
    org: 'tenant-key'
    // No spa parameter - returns all settings from all SPAs
  });

  const metadatas = getAllMetadatas();
  // Returns settings for the specified SPA + base settings
  // Or all settings from all SPAs if no SPA is specified
}
```

### Configuration Loader

```typescript
import { loadMetadataConfig, getAvailableSPAs } from '@iblai/web-utils';

// Load all settings for a specific SPA (supports partial matching)
const settings = loadMetadataConfig('mentorAI'); // or 'mentor'
const skillsSettings = loadMetadataConfig('skillsAI'); // or 'skills'

// Load all settings from all SPAs
const allSettings = loadMetadataConfig(); // No parameter

// Get all available SPAs
const spas = getAvailableSPAs(); // ['skillsAI', 'mentorAI']
```

## Adding New Settings

1. **For General Settings**: Add to `config/base.yml`
2. **For SPA-Specific Settings**: Add to the appropriate SPA config file
3. **For New SPAs**: Create a new YAML file in the `config/` directory

### Example: Adding a New Setting

```yaml
# In config/mentorAI.yml
settings:
  - slug: "enable_voice_chat"
    label: "Enable Voice Chat"
    defaultValue: false
    description: "Allow voice interaction with mentors"
    type: "boolean"
```

## Migration from Legacy System

The old `METADATAS` constant is still available for backward compatibility but is deprecated. New code should use the configuration loader system.

## New Behavior: All SPAs Display

When no SPA is specified in the configuration, the system will display settings from all available SPAs, grouped by their respective platforms. This allows administrators to manage settings across all platforms from a single interface.

### Flexible SPA Matching

The system supports flexible, case-insensitive partial matching for SPA names:
- `'mentor'` matches `'mentorAI'`
- `'skills'` matches `'skillsAI'`
- `'mentorAI'` matches `'mentorAI'`
- `'skillsAI'` matches `'skillsAI'`

### UI Behavior
- **With SPA specified**: Shows settings in a simple list format
- **Without SPA specified**: Groups settings by SPA with clear section headers

## Type Safety

All configuration is type-safe with TypeScript interfaces:
- `TenantMetadata` - Individual setting interface
- `ConfigSetting` - Configuration setting interface
- `ConfigFile` - SPA configuration file interface 