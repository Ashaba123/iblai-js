# Auth SPA Customization

This component allows administrators to customize the authentication page display for different SPAs (Single Page Applications).

## Overview

The `AuthSpaCustomizationContent` component provides a comprehensive UI for editing authentication page customization data that is stored in tenant metadata. Each SPA (Mentor AI, Skills AI, Analytics AI) has its own customization settings.

## Features

- **SPA-specific Configuration**: Automatically determines which metadata key to update based on current SPA
  - `mentor` SPA → `auth_web_mentorai` metadata key
  - `skills` SPA → `auth_web_skillsai` metadata key
  - `analytics` SPA → `auth_web_analyticsai` metadata key

- **Comprehensive Customization Options**:
  - Display title and description
  - Logo upload (URL or file upload)
  - Privacy policy URL
  - Terms of use URL
  - Multiple display images with alt text

- **Image Upload**: 
  - Support for both URL input and file upload
  - Image preview functionality
  - File validation (type and size)
  - Maximum file size: 5MB
  - Supported formats: All image types (png, jpg, jpeg, gif, webp, etc.)

- **Change Tracking**:
  - Detects unsaved changes
  - Provides discard changes functionality
  - Visual feedback for save state

- **Accessibility**:
  - ARIA labels on all interactive elements
  - Keyboard navigation support
  - Alt text requirement for all images
  - Screen reader friendly

## Usage

```tsx
import { AuthSpaCustomizationContent } from './auth-spa-customization';

<AuthSpaCustomizationContent 
  platformKey={platformKey} 
  currentSPA={currentSPA} 
/>
```

## Props

- `platformKey: string` - The organization/platform key
- `currentSPA?: string` - The current SPA identifier (mentor, skills, or analytics)

## Data Structure

The component manages the following JSON structure:

```json
{
  "display_title_info": "Create Your Own Mentor",
  "display_description_info": "Supported by personalized mentors. Privacy first.",
  "display_logo": "https://example.com/logo.png",
  "privacy_policy_url": "https://example.com/privacy-policy",
  "terms_of_use_url": "https://example.com/terms-of-use",
  "display_images": [
    {
      "image": "https://example.com/image1.png",
      "alt": "LLM Providers Selection"
    },
    {
      "image": "https://example.com/image2.png",
      "alt": "Cited Sources"
    }
  ]
}
```

## Storage

The configuration is stored in tenant metadata under one of the following keys:
- `auth_web_mentorai` - For Mentor AI SPA
- `auth_web_skillsai` - For Skills AI SPA
- `auth_web_analyticsai` - For Analytics AI SPA

The data is serialized as a JSON string before storage.

## Image Upload

### URL Input
Users can directly enter image URLs in the input fields. The component will display a preview if the URL is valid.

### File Upload (Base64 Storage)
Users can upload image files using the upload button. The component:
1. Validates file type (must be an image)
2. Validates file size (must be under 5MB)
3. Converts the image to a **base64-encoded data URL**
4. Displays a preview
5. Stores the base64 data URL directly in tenant metadata

**Base64 Format**: `data:image/png;base64,iVBORw0KGg...`

**Current Implementation**: All uploaded images are stored as base64 data URLs directly in the tenant metadata JSON. This approach was chosen because:
- No separate image upload endpoint is required
- Images are self-contained within the configuration
- Simple to implement and manage
- Works immediately without additional infrastructure

**Considerations**:
- Base64 encoding increases data size by ~33%
- Large images (close to 5MB) will create large metadata entries
- For high-traffic production use, consider implementing a separate image upload service
- Current 5MB file size limit helps keep metadata reasonable

## Display Images

The component supports multiple display images:
- Add new images using the "Add Image" button
- Remove images using the trash icon
- Each image requires:
  - Image URL or file upload
  - Alt text (for accessibility)
- Images display a preview when a valid URL or file is provided

## Validation

- Image files must be valid image types
- Image files must be under 5MB
- All fields are optional but recommended for complete customization
- Alt text is highly recommended for accessibility compliance

## API Integration

The component integrates with the data-layer package through:
- `useUpdateTenantMetadataMutation` - Updates tenant metadata with the configuration
- `useTenantMetadata` - Retrieves existing configuration from tenant metadata

## UI Components Used

- Card, CardContent, CardDescription, CardHeader, CardTitle
- Button
- Input
- Textarea
- Label
- lucide-react icons (ChevronDown, ChevronUp, Save, Plus, Trash2, Upload, X, Image)

## Accessibility Features

- All form fields have proper labels
- ARIA labels on buttons and interactive elements
- Keyboard navigation support for collapsible sections
- Alt text requirement for all images
- Visual feedback for loading states
- Error messages via toast notifications

## Error Handling

- JSON parsing errors are caught and logged
- Failed save operations show error toasts
- Invalid image uploads show appropriate error messages
- File input is reset after invalid file selection

## State Management

The component manages the following states:
- `isCollapsed` - Controls section collapse/expand
- `formData` - Current form values
- `isSaving` - Loading state during save operation
- `hasChanges` - Tracks unsaved changes

## Best Practices

1. **Always provide alt text for images** - Required for accessibility
2. **Use descriptive titles and descriptions** - Helps users understand the SPA
3. **Test image URLs** - Ensure URLs are accessible and won't break
4. **Keep image file sizes reasonable** - Even though 5MB is allowed, smaller is better
5. **Provide privacy policy and terms of use** - Important for compliance
6. **Save changes regularly** - Unsaved changes will be lost on navigation

## Testing

Unit tests are available in `__tests__/auth-spa-customization-logic.test.ts` covering:
- Metadata key mapping logic
- Default config structure
- Display images array operations
- JSON serialization/deserialization
- Image validation logic
- SPA title generation
- Form change detection

## Future Enhancements

Potential improvements for future versions:
1. Server-side image upload with proper URL storage
2. Image cropping and resizing functionality
3. Drag-and-drop for display images ordering
4. Preview of how the auth page will look
5. Bulk import/export of configurations
6. Template library for quick setup
7. Image optimization before upload
8. CDN integration for image hosting

## Troubleshooting

### Images not displaying
- Check if the URL is accessible
- Verify the URL is a valid image format
- Check browser console for CORS errors

### Save failing
- Verify platformKey is valid
- Check network connectivity
- Ensure user has proper permissions
- Check browser console for errors

### Changes not persisting
- Ensure you clicked "Save Changes" before navigating away
- Check if there are any error toasts
- Verify the metadata is being properly updated

## Integration Example

```tsx
// In apps/mentor/app/profile/page.tsx or similar
import { AuthSpaCustomizationContent } from '@web-containers/components/profile/advanced/auth-spa-customization';

function ProfilePage() {
  return (
    <AdvancedTab 
      platformKey="your-platform-key"
      currentSPA="mentor"
      // ... other props
    >
      <AuthSpaCustomizationContent 
        platformKey="your-platform-key" 
        currentSPA="mentor" 
      />
    </AdvancedTab>
  );
}
```

## Related Components

- `AdvancedTab` - Parent component that renders this component
- `RecommendationSystemPromptsContent` - Similar pattern for recommendation prompts
- `CustomDomainsContent` - Similar pattern for custom domain configuration

