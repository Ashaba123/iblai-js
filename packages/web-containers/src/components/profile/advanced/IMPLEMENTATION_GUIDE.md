# Auth SPA Customization - Implementation Guide

This guide provides step-by-step instructions for implementing and using the Auth SPA Customization feature.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Integration Steps](#integration-steps)
3. [Configuration Examples](#configuration-examples)
4. [Production Deployment](#production-deployment)
5. [Troubleshooting](#troubleshooting)

## Quick Start

The Auth SPA Customization component is automatically integrated into the Advanced tab of the Profile section. When you navigate to the Advanced tab while on a specific SPA (mentor, skills, or analytics), the component will appear.

### Prerequisites

- User must have admin access to the platform
- Platform must be properly configured with a valid `platformKey`
- The SPA context (`currentSPA`) must be set correctly

## Integration Steps

### 1. Component is Already Integrated

The component has been integrated into `advanced.tsx`:

```tsx
import { AuthSpaCustomizationContent } from './auth-spa-customization';

// In the render method:
<AuthSpaCustomizationContent platformKey={platformKey} currentSPA={currentSPA} />
```

### 2. Accessing the Feature

1. Navigate to Profile Settings
2. Click on the "Advanced" tab
3. The "Auth SPA Customization" section will appear if you're on a supported SPA
4. Click to expand the section

### 3. Supported SPAs

The following SPAs are supported:

| SPA Name | Metadata Key | Display Name |
|----------|--------------|--------------|
| mentor | auth_web_mentorai | Mentor AI |
| skills | auth_web_skillsai | Skills AI |
| analytics | auth_web_analyticsai | Analytics AI |

## Configuration Examples

### Example 1: Basic Configuration (Mentor AI)

```json
{
  "display_title_info": "Create Your Own Mentor",
  "display_description_info": "Supported by personalized mentors. Privacy first.",
  "display_logo": "https://cdn.example.com/mentor-logo.png",
  "privacy_policy_url": "https://example.com/privacy-policy",
  "terms_of_use_url": "https://example.com/terms-of-use",
  "display_images": []
}
```

### Example 2: Full Configuration with Display Images (Skills AI)

```json
{
  "display_title_info": "Build Your Skills with AI",
  "display_description_info": "Train it with custom knowledge. Privacy first.",
  "display_logo": "https://cdn.example.com/skills-logo.png",
  "privacy_policy_url": "https://example.com/privacy-policy",
  "terms_of_use_url": "https://example.com/terms-of-use",
  "display_images": [
    {
      "image": "https://cdn.example.com/slides/skills/personalized-mentors.png",
      "alt": "Learn With Personalized Mentors"
    },
    {
      "image": "https://cdn.example.com/slides/skills/track-skills.png",
      "alt": "Track Skills And Career Advancements"
    },
    {
      "image": "https://cdn.example.com/slides/skills/recommendations.png",
      "alt": "Automated Content Recommendations"
    }
  ]
}
```

### Example 3: Minimal Configuration (Analytics AI)

```json
{
  "display_title_info": "Understand Your Learners with AI",
  "display_description_info": "Deep engagement and performance analytics.",
  "display_logo": "https://cdn.example.com/analytics-logo.png",
  "privacy_policy_url": "https://example.com/privacy",
  "terms_of_use_url": "https://example.com/terms",
  "display_images": []
}
```

## Production Deployment

### Image Storage - Base64 Approach

**Current Implementation**: The component stores all uploaded images as base64-encoded data URLs directly in the tenant metadata. This approach was chosen because image upload endpoints are not yet available.

#### How It Works

When you upload an image file:
1. The file is read using `FileReader.readAsDataURL()`
2. It's converted to a base64-encoded data URL: `data:image/png;base64,iVBORw0KGg...`
3. The data URL is stored directly in the JSON configuration
4. The browser can display the image directly from the base64 string

#### Advantages
- ✅ No separate upload endpoint needed
- ✅ Images are self-contained in configuration
- ✅ Simple implementation
- ✅ Works immediately without infrastructure
- ✅ Images are automatically backed up with metadata

#### Considerations
- Base64 encoding increases size by ~33%
- 5MB file size limit helps keep metadata reasonable
- For production with many/large images, consider CDN approach below

#### Future: CDN Migration (Optional)

When image upload endpoints become available, you can migrate to CDN hosting:

```typescript
// Current: Base64 (works now)
"display_logo": "data:image/png;base64,iVBORw0KGg..."

// Future: CDN hosted (when endpoints are ready)
"display_logo": "https://cdn.example.com/logos/mentor-ai-logo.png"
```

To implement CDN migration:

```typescript
// Example: Custom upload endpoint
POST /api/upload-auth-spa-image
Content-Type: multipart/form-data

Response:
{
  "url": "https://cdn.example.com/uploads/abc123.png"
}
```

#### 3. Image Optimization

Before storing URLs, ensure images are:
- Optimized for web (compressed)
- Properly sized (recommended: logos 200x200px, display images 800x600px)
- In modern formats (WebP preferred, with JPEG/PNG fallback)

### Security Considerations

1. **Validate URLs**: Ensure privacy policy and terms of use URLs are from trusted domains
2. **Image Sanitization**: If allowing uploads, scan for malicious content
3. **HTTPS Only**: All image URLs should use HTTPS
4. **CORS Configuration**: Ensure images can be loaded from your domain

### Performance Optimization

1. **Lazy Loading**: Display images should be lazy-loaded on the auth page
2. **Image Dimensions**: Store and serve appropriately sized images
3. **Caching**: Implement proper cache headers for images
4. **Compression**: Use compressed image formats

### Monitoring

Track these metrics in production:

```typescript
// Example monitoring
{
  "metric": "auth_spa_customization_saves",
  "spa": "mentor",
  "success": true,
  "duration_ms": 234
}
```

## Step-by-Step Configuration Guide

### Step 1: Add Display Title and Description

1. Expand the Auth SPA Customization section
2. Enter a compelling title (e.g., "Create Your Own Mentor")
3. Enter a brief description (2-3 sentences)

### Step 2: Upload Logo

**Option A: Use URL**
1. Paste the URL of your hosted logo in the "Logo URL" field
2. Preview will appear below if URL is valid

**Option B: Upload File**
1. Click the "Upload" button next to the Logo URL field
2. Select an image file (PNG, JPEG, GIF, WebP)
3. File size must be under 5MB
4. Preview will appear automatically

### Step 3: Add Legal Links

1. Enter your Privacy Policy URL (must be a valid HTTPS URL)
2. Enter your Terms of Use URL (must be a valid HTTPS URL)

### Step 4: Add Display Images

1. Click "Add Image" button
2. For each image:
   - Enter URL or upload file
   - Add descriptive alt text (required for accessibility)
3. Repeat for all display images (recommended: 3-4 images)

### Step 5: Save Configuration

1. Review all entered information
2. Click "Save Changes" button
3. Wait for success confirmation
4. Test the auth page to verify changes

## Consuming the Configuration

### Frontend (Auth App)

To use the saved configuration in your auth application:

```typescript
import { useTenantMetadata } from '@iblai/web-utils';

function AuthPage({ currentSPA }: { currentSPA: string }) {
  const { metadata, metadataLoaded } = useTenantMetadata({
    org: platformKey,
    spa: currentSPA,
  });

  // Get the correct metadata key based on SPA
  const getMetadataKey = (spa: string) => {
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

  const metadataKey = getMetadataKey(currentSPA);
  const authConfig = metadataKey && metadata[metadataKey] 
    ? JSON.parse(metadata[metadataKey]) 
    : null;

  if (!metadataLoaded || !authConfig) {
    return <DefaultAuthPage />;
  }

  return (
    <div className="auth-page">
      <img src={authConfig.display_logo} alt="Platform Logo" />
      <h1>{authConfig.display_title_info}</h1>
      <p>{authConfig.display_description_info}</p>
      
      {/* Display images carousel */}
      <div className="slides">
        {authConfig.display_images.map((img, index) => (
          <img 
            key={index} 
            src={img.image} 
            alt={img.alt}
            loading="lazy"
          />
        ))}
      </div>

      {/* Legal links */}
      <footer>
        <a href={authConfig.privacy_policy_url}>Privacy Policy</a>
        <a href={authConfig.terms_of_use_url}>Terms of Use</a>
      </footer>
    </div>
  );
}
```

### Backend (API)

If you need to access the configuration server-side:

```python
# Example Python/Django
from ibl_core.models import TenantMetadata

def get_auth_spa_config(platform_key, spa_type):
    """
    Get auth SPA configuration for a platform
    
    Args:
        platform_key: The platform/organization key
        spa_type: One of 'mentor', 'skills', 'analytics'
    
    Returns:
        dict: Auth SPA configuration
    """
    metadata_key = f"auth_web_{spa_type}ai"
    
    try:
        tenant_metadata = TenantMetadata.objects.get(
            platform__key=platform_key
        )
        config_json = tenant_metadata.metadata.get(metadata_key)
        
        if config_json:
            return json.loads(config_json)
        return None
    except TenantMetadata.DoesNotExist:
        return None
```

## Troubleshooting

### Issue: Component not visible

**Solution:**
- Verify you're on a supported SPA (mentor, skills, or analytics)
- Check that `currentSPA` prop is being passed correctly
- Ensure you have admin permissions

### Issue: Images not uploading

**Solution:**
- Check file size (must be under 5MB)
- Verify file type (must be an image)
- Check browser console for errors
- Try using URL input instead

### Issue: Changes not saving

**Solution:**
- Check network connectivity
- Verify you have proper permissions
- Check browser console for errors
- Ensure platformKey is valid
- Try refreshing and re-entering data

### Issue: Images not displaying on auth page

**Solution:**
- Verify image URLs are accessible
- Check for CORS issues in browser console
- Ensure URLs use HTTPS
- Test URLs in browser directly

### Issue: Alt text missing

**Solution:**
- Alt text is required for accessibility
- Add descriptive alt text for each image
- Alt text should describe what the image shows

## Testing Checklist

Before deploying to production, verify:

- [ ] All SPAs (mentor, skills, analytics) can be configured
- [ ] Logo upload works with both URL and file upload
- [ ] Display images can be added, edited, and removed
- [ ] Alt text is required for all images
- [ ] File size validation works (>5MB rejected)
- [ ] File type validation works (non-images rejected)
- [ ] Privacy policy and terms URLs are validated
- [ ] Save functionality works correctly
- [ ] Discard changes works correctly
- [ ] Configuration persists after page refresh
- [ ] Auth page displays configuration correctly
- [ ] Mobile responsive design works
- [ ] Keyboard navigation works
- [ ] Screen reader compatibility verified
- [ ] Error messages are clear and helpful

## Support

For issues or questions:

1. Check the [detailed documentation](./AUTH_SPA_CUSTOMIZATION.md)
2. Review the [test suite](./__tests__/auth-spa-customization-logic.test.ts)
3. Check browser console for errors
4. Contact platform support with error details

## Version History

- **v1.0.0** (Current) - Initial release
  - Basic configuration support
  - Image upload functionality
  - Multi-image support for display images
  - Accessibility features

