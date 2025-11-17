# Advanced Tab Components

This directory contains components for the advanced settings tab in the profile section.

## Auth SPA Customization

The `AuthSpaCustomizationContent` component allows administrators to customize the authentication page display for different SPAs. This includes title, description, logo, legal links, and display images.

**[View detailed documentation →](./AUTH_SPA_CUSTOMIZATION.md)**

## Recommendation System Prompts

The `RecommendationSystemPromptsContent` component allows administrators to manage recommendation system prompts for different SPAs (Single Page Applications).

### Features

- **CRUD Operations**: Create, read, update, and delete recommendation prompts
- **SPA-based Configuration**: Automatically determines recommendation type based on current SPA
  - `skills` SPA → `courses` recommendation type
  - `mentor` SPA → `mentors` recommendation type
- **Active/Inactive Toggle**: Enable or disable prompts without deleting them
- **Ordering**: Set custom order for prompt display
- **Search and Filter**: Built-in search functionality for managing multiple prompts

### Usage

```tsx
import { RecommendationSystemPromptsContent } from './recommendation-system-prompts';

<RecommendationSystemPromptsContent 
  platformKey={platformKey} 
  currentSPA={currentSPA} 
/>
```

### Props

- `platformKey: string` - The organization/platform key
- `currentSPA?: string` - The current SPA (optional, defaults to 'default')

### Data Storage

The component uses the AI Search API endpoints to store and manage recommendation system prompts. The prompts are stored in the backend and can be filtered by:
- `platform_key` - The organization/platform identifier
- `recommendation_type` - Either 'courses' or 'mentors'
- `spa_url` - Optional SPA context (e.g., 'skills', 'mentor')

### API Integration

The component integrates with the data-layer package through the `customAiSearchApiSlice` which provides:
- `useGetPromptsListQuery` - Fetch prompts filtered by platform and recommendation type
- `useCreatePromptMutation` - Create new prompts
- `useUpdatePromptMutation` - Update existing prompts (prompt text and active status)
- `useDeletePromptMutation` - Delete prompts

### UI Components Used

- Card, CardContent, CardDescription, CardHeader, CardTitle
- Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
- Button, Input, Textarea, Switch, Select
- Badge, Tooltip
- Icons from lucide-react

### Styling

The component follows the existing design patterns in the advanced tab with:
- Consistent border colors using `oklch(.922 0 0)`
- Gray text colors `#646464`
- Blue accent colors for active states
- Responsive design with proper spacing
