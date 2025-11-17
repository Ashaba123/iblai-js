# Alerts Tab Integration

## Overview
The Alerts tab has been successfully integrated into the NotificationDisplay component, allowing users to manage notification templates directly within the notification interface.

## What Was Integrated

### 1. **notification-display.tsx**
Added the Alerts tab as a second tab alongside the Inbox tab:
- Imported `AlertsTab` component and required hooks from `@iblai/data-layer`
- Added state management for templates and notification settings
- Integrated `useGetTemplatesQuery` to fetch templates from the API
- Integrated `useUpdateTemplateMutation` to update template settings
- Added handlers for toggling templates and notifications
- Added TabsContent for the alerts view with loading/error states

### 2. **alerts-tab.tsx**
Created a presentational component that displays:
- List of notification templates
- Toggle switches for each template (Active/Inactive)
- Edit buttons for each template
- Global notifications enable/disable toggle
- Clean, modern UI matching the design requirements

### 3. **API Integration**
The component uses the following from `@iblai/data-layer`:
- `useGetTemplatesQuery({ platformKey })` - Fetches all notification templates
- `useUpdateTemplateMutation()` - Updates template settings (enable/disable)
- `NotificationTemplate` type - TypeScript interface for templates

### 4. **Data Layer Updates**
- **types.ts**: Defined `NotificationTemplate` interface with all required fields
- **constants.ts**: Defined API endpoints for template operations
- **custom-api-slice.ts**: Created RTK Query endpoints for templates
- **index.ts**: Exported the new types and hooks
- **reducers (mentor.ts, skills.ts)**: Added custom API slice to store

## Features

✅ **Tab Navigation**: Users can switch between "Inbox" and "Alerts" tabs
✅ **Template List**: Displays all notification templates from the API
✅ **Toggle Templates**: Individual templates can be enabled/disabled
✅ **Global Toggle**: Master switch for all notifications
✅ **Edit Templates**: Each template has an edit button (handler can be customized)
✅ **Loading States**: Shows loading indicator while fetching templates
✅ **Error Handling**: Displays error message if template fetch fails
✅ **Type Safety**: Full TypeScript support throughout
✅ **Responsive Design**: Works on all screen sizes

## API Endpoints Used

```typescript
GET  /api/notification/v1/platforms/{platformKey}/templates/
PATCH /api/notification/v1/platforms/{platformKey}/templates/{notificationType}/
```

## Usage

The integration is automatic. The NotificationDisplay component now includes the Alerts tab:

```tsx
<NotificationDisplay
  org="your-platform-key"
  userId="user-id"
  isAdmin={true}
/>
```

Users can click the "Alerts" tab to view and manage notification templates.

## Template Structure

Each template has the following properties:
- `id`: Unique identifier
- `type`: Notification type
- `name`: Display name
- `description`: Template description
- `is_enabled`: Whether the template is active
- `message_title`: Title for the notification
- `email_subject`: Email subject line
- And more...

## Customization

To customize the edit functionality, modify the `handleEditTemplate` function in `notification-display.tsx`:

```typescript
const handleEditTemplate = (template: NotificationTemplate) => {
  // Add your custom logic here
  // e.g., open a modal, navigate to edit page, etc.
};
```

## Testing

The component includes proper data-testid attributes for testing:
- `notification-alerts-tab` - The alerts tab trigger
- `alerts-tab-content` - The alerts tab content area

