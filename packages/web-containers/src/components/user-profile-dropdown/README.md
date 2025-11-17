# UserProfileDropdown Component

A comprehensive, reusable user profile dropdown component that can be used across different applications with highly configurable props.

## Features

- **Flexible Configuration**: Show/hide different sections based on your needs
- **Customizable Styling**: Customize appearance with CSS classes and props
- **Event Handling**: Custom callbacks for all user interactions
- **Modal Integration**: Built-in support for profile modal with configurable tabs
- **Tenant Switching**: Optional tenant switcher functionality
- **Help Integration**: Optional help center link
- **Avatar Support**: Multiple avatar sources (profile image, Gravatar, initials fallback)
- **Loading States**: Skeleton loading for better UX
- **Accessibility**: Full keyboard navigation support

## Basic Usage

```tsx
import { UserProfileDropdown } from "@iblai/web-containers";

function MyComponent() {
  return (
    <UserProfileDropdown
      username="john.doe"
      userIsAdmin={true}
      userMetadata={{
        name: "John Doe",
        email: "john@example.com",
        username: "john.doe"
      }}
      tenantKey="my-tenant"
      onLogout={() => {
        // Handle logout
      }}
    />
  );
}
```

## Props

### User Data
- `username?: string` - User's username
- `userIsAdmin?: boolean` - Whether user is an admin (default: false)
- `userIsStudent?: boolean` - Whether user is a student (default: false)
- `userMetadata?: UserMetadata` - User metadata object
- `userMetadataEdx?: UserMetadata` - EDX user metadata object
- `isUserMetadataLoading?: boolean` - Loading state for user metadata (default: false)
- `isUserMetadataEdxLoading?: boolean` - Loading state for EDX user metadata (default: false)

### Tenant Data
- `tenantKey?: string` - Current tenant key
- `mentorId?: string` - Mentor ID (if applicable)
- `currentTenant?: Tenant` - Current tenant object
- `userTenants?: Tenant[]` - List of user's tenants

### Configuration
- `showProfileTab?: boolean` - Show profile tab (default: true)
- `showAccountTab?: boolean` - Show account tab (default: false)
- `showTenantSwitcher?: boolean` - Show tenant switcher (default: true)
- `showHelpLink?: boolean` - Show help link (default: true)
- `showLogoutButton?: boolean` - Show logout button (default: true)
- `showLearnerModeSwitch?: boolean` - Show learner mode switch (default: false)

### Customization
- `helpCenterUrl?: string` - Help center URL
- `enableGravatarOnProfilePic?: boolean` - Enable Gravatar fallback (default: true)
- `hideTenantSwitcher?: boolean` - Hide tenant switcher (default: false)
- `loadingTenantInfo?: boolean` - Loading state for tenant info (default: false)

### Callbacks
- `onProfileClick?: (tab: string) => void` - Called when profile tab is clicked
- `onLogout?: () => void` - Called when logout is clicked
- `onTenantChange?: (tenantKey: string) => void` - Called when tenant is changed
- `onHelpClick?: (url: string) => void` - Called when help link is clicked

### Modal Props
- `billingEnabled?: boolean` - Enable billing features (default: false)
- `billingURL?: string` - Billing URL
- `topUpEnabled?: boolean` - Enable top-up features (default: false)
- `topUpURL?: string` - Top-up URL
- `currentPlan?: string` - Current subscription plan

### Custom Components
- `LearnerModeSwitchComponent?: React.ComponentType<any>` - Custom learner mode switch component
- `CustomProfileModal?: React.ComponentType<any>` - Custom profile modal component

### Styling
- `className?: string` - Additional CSS classes for the trigger button
- `dropdownClassName?: string` - CSS classes for the dropdown content (default: "mr-4 w-56 px-4")
- `avatarSize?: number` - Avatar size in pixels (default: 32)

### Additional Data
- `metadata?: { help_center_url?: string }` - Additional metadata
- `metadataLoaded?: boolean` - Whether metadata is loaded (default: false)

## Types

### UserMetadata
```typescript
interface UserMetadata {
  name?: string;
  username?: string;
  email?: string;
  profile_image?: {
    has_image?: boolean;
    image_url_small?: string;
  };
}
```

### Tenant
```typescript
interface Tenant {
  key: string;
  is_admin: boolean;
  org: string;
  name?: string;
}
```

## Advanced Usage Examples

### Minimal Configuration
```tsx
<UserProfileDropdown
  username="user123"
  onLogout={handleLogout}
/>
```

### Full Configuration with Custom Components
```tsx
<UserProfileDropdown
  username="admin"
  userIsAdmin={true}
  userIsStudent={false}
  userMetadata={userData}
  userMetadataEdx={edxUserData}
  tenantKey="main"
  currentTenant={currentTenant}
  userTenants={userTenants}
  
  // Configuration
  showProfileTab={true}
  showAccountTab={true}
  showTenantSwitcher={true}
  showHelpLink={true}
  showLogoutButton={true}
  showLearnerModeSwitch={true}
  
  // Customization
  helpCenterUrl="https://help.example.com"
  enableGravatarOnProfilePic={true}
  
  // Callbacks
  onProfileClick={(tab) => console.log('Profile tab clicked:', tab)}
  onLogout={handleLogout}
  onTenantChange={handleTenantChange}
  onHelpClick={(url) => window.open(url, '_blank')}
  
  // Modal props
  billingEnabled={true}
  billingURL="https://billing.example.com"
  topUpEnabled={true}
  topUpURL="https://topup.example.com"
  currentPlan="premium"
  
  // Custom components
  LearnerModeSwitchComponent={CustomLearnerSwitch}
  CustomProfileModal={CustomModal}
  
  // Styling
  className="custom-profile-button"
  dropdownClassName="custom-dropdown"
  avatarSize={40}
  
  // Additional data
  metadata={{ help_center_url: "https://help.example.com" }}
  metadataLoaded={true}
/>
```

### Skills App Example
```tsx
<UserProfileDropdown
  username={username}
  userIsAdmin={isAdmin}
  userMetadata={userMetadata}
  tenantKey={getTenant()}
  showProfileTab={true}
  showAccountTab={false}
  showTenantSwitcher={false}
  showHelpLink={true}
  showLogoutButton={true}
  showLearnerModeSwitch={false}
  helpCenterUrl={config.settings.helpCenterUrl()}
  enableGravatarOnProfilePic={config.settings.enableGravatarOnProfilePic() !== "false"}
  onLogout={handleLogout}
  onProfileClick={(tab) => setActiveTab(tab)}
/>
```

### Mobile App Example
```tsx
<UserProfileDropdown
  username={username}
  userIsAdmin={false}
  userMetadata={userData}
  showProfileTab={true}
  showAccountTab={false}
  showTenantSwitcher={false}
  showHelpLink={false}
  showLogoutButton={true}
  showLearnerModeSwitch={false}
  onLogout={handleLogout}
  className="mobile-profile-button"
  dropdownClassName="mobile-dropdown"
/>
```

## Integration with Existing Apps

### Mentor App Integration
The existing UserProfile component in the mentor app can be gradually migrated to use this new component by passing the appropriate props and callbacks.

### Skills App Integration
The skills app can use this component with minimal configuration, focusing on profile management and help features.

### Mobile App Integration
Mobile apps can use this component with simplified configuration, hiding tenant switching and other desktop-specific features.

## Migration Guide

To migrate from the existing UserProfile component:

1. **Replace imports**: Change from local component to `@iblai/web-containers`
2. **Map props**: Convert existing state and props to the new interface
3. **Update callbacks**: Ensure all event handlers are properly mapped
4. **Test functionality**: Verify all features work as expected
5. **Remove old component**: Once migration is complete, remove the old component

## Dependencies

This component depends on:
- `@iblai/web-containers` UI components
- `react-gravatar` for Gravatar support
- `lucide-react` for icons
- `next/link` for navigation (if using Next.js)

## Browser Support

This component supports all modern browsers and includes proper accessibility features for screen readers and keyboard navigation. 