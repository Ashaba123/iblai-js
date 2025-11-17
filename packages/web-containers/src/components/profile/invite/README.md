# Invite Components

This folder contains **self-contained** tab components for the user invitation feature. Each component manages its own state, API calls, and business logic.

## Structure

- **`users-tab.tsx`** (431 lines) - Platform user invitations with CSV editor
- **`courses-tab.tsx`** (729 lines) - Course invitation with multi-user, course selector, and CSV editor
- **`programs-tab.tsx`** (758 lines) - Program invitation with multi-user, program selector, and CSV editor
- **`index.ts`** - Barrel export for clean imports

## Architecture

Each tab component is **fully self-contained** and includes:
- ✅ Own state management (email, validation, loading states)
- ✅ Direct API calls via RTK Query hooks
- ✅ Business logic (validation, form handling)
- ✅ UI rendering (forms, tables, loading skeletons)
- ✅ Error handling and toast notifications

## Usage

```tsx
import { UsersTab, CoursesTab, ProgramsTab } from './invite';

// Minimal props - components handle their own logic
<TabsContent value="users">
  <UsersTab
    tenant={tenant}
    currentPage={currentPage}
    itemsPerPage={itemsPerPage}
    enableCatalogInvite={enableCatalogInvite}
    onInviteSuccess={handleInviteSuccess}
  />
</TabsContent>

<TabsContent value="courses">
  <CoursesTab
    tenant={tenant}
    currentPage={currentPage}
    itemsPerPage={itemsPerPage}
  />
</TabsContent>
```

## Component Details

### Users Tab (431 lines)
**Endpoints Used:**
- `useInviteUserMutation` - Send individual invitations
- `usePlatformInvitationsQuery` - Fetch invitation list

**Features:**
- Individual email invitations with validation
- **CSV bulk upload with editor** (email,platform_key format)
- Interactive CSV editor for reviewing and editing data
- Real-time invitation status display
- Platform-wide user management
- CSV template download
- Email validation for CSV uploads
- **Empty state message** when no invitations exist

**State Management:**
- Email input and validation
- Loading states (invitation, data fetch)
- CSV parsing state
- CSV editor open/close state
- Parsed CSV data storage
- Invite sent confirmation

### Courses Tab (729 lines)
**Endpoints Used:**
- `useGetCatalogInvitationsCourseQuery` - Fetch course invitations
- `useCreateCatalogInvitationCourseBulkMutation` - Send bulk course invitations
- `useGetPersonnalizedSearchQuery` - Search for courses
- `usePlatformUsersQuery` - Fetch and search platform users

**Features:**
- **Multi-user selector dropdown** with search functionality
- **Inline course selector dropdown** with search functionality
- **CSV bulk upload with interactive editor** (email,course_id format)
- Multi-user and multi-course selection with visual tags
- Debounced search for better performance (users and courses)
- Direct course invitation (no external modal needed)
- Sends invitations to all selected user-course combinations
- CSV template download with proper format
- **Interactive CSV editor** for reviewing/editing before sending
- Real-time CSV parsing and validation
- Bulk invitation via single API call (efficient)
- Displays course invitation history with course names
- Status indicators (Pending, Accepted, Expired)
- Blue-themed user tags, Green-themed course tags
- BookOpen icons for courses
- **Empty state message** when no course invitations exist

**State Management:**
- Selected users array
- Selected courses array
- User search term with debouncing
- Course search term with debouncing
- User dropdown open/close state
- Course dropdown open/close state
- CSV parsing state (loading indicator)
- CSV editor open/close state
- Parsed CSV data storage
- Loading states for data fetch and search
- Invite sent confirmation

### Programs Tab (758 lines)
**Endpoints Used:**
- `useGetCatalogInvitationsProgramQuery` - Fetch program invitations
- `useCreateCatalogInvitationProgramMutation` - Send program invitations
- `useGetPersonnalizedSearchQuery` - Search for programs
- `usePlatformUsersQuery` - Fetch and search platform users

**Features:**
- **Multi-user selector dropdown** with search functionality
- **Inline program selector dropdown** with search functionality
- **CSV bulk upload with interactive editor** (email,program_key format)
- Multi-user and multi-program selection with visual tags
- Debounced search for better performance (users and programs)
- Direct program invitation (no external modal needed)
- Sends invitations to all selected user-program combinations
- CSV template download with proper format
- **Interactive CSV editor** for reviewing/editing before sending
- Real-time CSV parsing and validation
- Displays program invitation history with program names
- Status indicators (Pending, Accepted, Expired)
- Blue-themed user tags, Purple-themed program tags
- GraduationCap icons for programs
- **Empty state message** when no program invitations exist

**State Management:**
- Selected users array
- Selected programs array
- User search term with debouncing
- Program search term with debouncing
- User dropdown open/close state
- Program dropdown open/close state
- CSV parsing state (loading indicator)
- CSV editor open/close state
- Parsed CSV data storage
- Loading states for data fetch and search
- Invite sent confirmation

## Parent Component Responsibilities

The `invite-user.tsx` parent component now only handles:
- Tab state management (with conditional rendering based on `enableCatalogInvite`)
- Pagination state coordination (resets to page 1 on tab switch)
- Dialog open/close state
- Common data fetching for pagination counts (with skip optimization)
- Dynamic header content based on active tab
- Conditional tab visibility (shows only Users tab when `enableCatalogInvite=false`)

## Benefits

1. **Encapsulation**: Each tab owns its logic and state
2. **Independence**: Tabs can be tested/modified without affecting others
3. **Maintainability**: Clear separation of concerns
4. **Scalability**: Easy to add new tabs or features
5. **Reusability**: Components can be used in different contexts
6. **Performance**: Only active tab logic runs

