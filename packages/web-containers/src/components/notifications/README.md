# AlertsTab Component

The AlertsTab component provides a UI for managing notification templates with the ability to toggle them on/off and edit their content.

## Components

### AlertsTab
The main UI component that displays the alerts interface.

**Props:**
- `templates: NotificationTemplate[]` - Array of notification templates
- `notificationsEnabled: boolean` - Whether notifications are globally enabled
- `onToggleNotifications: (enabled: boolean) => void` - Callback for toggling global notifications
- `onToggleTemplate: (id: string) => void` - Callback for toggling individual templates
- `onEditTemplate: (template: NotificationTemplate) => void` - Callback for editing templates

### AlertsTabContainer
A container component that integrates the AlertsTab with the API.

**Props:**
- `platformKey: string` - The platform key for API calls
- `onEditTemplate?: (template: NotificationTemplate) => void` - Optional callback for editing templates

### AlertsTabDemo
A demo component showing how to use the AlertsTabContainer.

## Usage

```tsx
import { AlertsTabContainer } from '@web-containers/components/notifications'

function MyComponent() {
  return (
    <AlertsTabContainer 
      platformKey="your-platform-key"
      onEditTemplate={(template) => {
        // Handle template editing
        console.log('Edit template:', template)
      }}
    />
  )
}
```

## API Integration

The component uses the following API endpoints from `@data-layer`:

- `useGetTemplatesQuery({ platformKey })` - Fetches notification templates
- `useUpdateTemplateMutation()` - Updates template status

## Types

The component uses the following types from `@data-layer`:

```typescript
interface NotificationTemplate {
  id: string
  name: string
  preview: string
  body: string
  active: boolean
  notificationType: string
  platformKey: string
}
```

## Features

- ✅ Display list of notification templates
- ✅ Toggle individual templates on/off
- ✅ Toggle global notifications on/off
- ✅ Expandable template preview
- ✅ Edit template functionality
- ✅ Loading and error states
- ✅ Responsive design
- ✅ Accessibility features
