const J={title:"Data Layer/RTK Query Patterns",parameters:{layout:"centered",docs:{description:{component:"Production patterns for RTK Query hooks."}}},tags:["autodocs"]},e={render:()=>React.createElement("div",{style:{padding:"20px",fontFamily:"monospace",maxWidth:"800px"}},React.createElement("h3",null,"Query Hook Pattern (Production)"),React.createElement("pre",{style:{background:"#f5f5f5",padding:"15px",borderRadius:"4px",overflow:"auto"}},`import { useGetMentorsQuery } from '@iblai/data-layer';

const {
  data: mentors,              // Destructure with alias
  isLoading: isMentorsLoading,
  isFetching: isMentorsFetching,
  error: mentorsError,
} = useGetMentorsQuery(
  {
    org: tenantKey,
    username: username ?? '',
    ...queryParams,           // Spread pagination, filters
  },
  {
    skip: !tenantKey || !username,        // CRITICAL: Prevent invalid queries
    refetchOnMountOrArgChange: true,      // Always get fresh data
  }
);

// Standard loading/error handling
if (isMentorsLoading) return <Spinner />;
if (mentorsError) return <ErrorMessage />;
if (!mentors) return null;

// Render data
return (
  <div>
    {mentors.results.map(m => <MentorCard key={m.unique_id} mentor={m} />)}
    {isMentorsFetching && <RefreshingIndicator />}
  </div>
);`),React.createElement("h4",null,"Key Points"),React.createElement("ul",{style:{lineHeight:"1.8"}},React.createElement("li",null,React.createElement("strong",null,"Always use skip")," to prevent queries with missing required params"),React.createElement("li",null,React.createElement("strong",null,"Destructure with aliases")," when using multiple queries"),React.createElement("li",null,React.createElement("strong",null,"Check isLoading first"),", then error, then data"),React.createElement("li",null,React.createElement("strong",null,"Use isFetching")," to show refresh indicators")))},n={render:()=>React.createElement("div",{style:{padding:"20px",fontFamily:"monospace",maxWidth:"800px"}},React.createElement("h3",null,"Lazy Query Pattern"),React.createElement("pre",{style:{background:"#f5f5f5",padding:"15px",borderRadius:"4px",overflow:"auto"}},`import { useLazyGetUserEnrolledPathwaysQuery } from '@iblai/data-layer';

const [getUserEnrolledPathways, { isError }] =
  useLazyGetUserEnrolledPathwaysQuery();

// Call in event handler
const handleCheck = async (pathwayUuid: string) => {
  const response = await getUserEnrolledPathways([
    {
      username: getUserName(),
      pathwayUuid: pathwayUuid,
    },
  ]);

  if (response.data) {
    // Use response.data
    console.log('Result:', response.data);
  }
};

// Note: Array with single object parameter
<button onClick={() => handleCheck('uuid-123')}>Check</button>`),React.createElement("h4",null,"Important"),React.createElement("ul",{style:{lineHeight:"1.8"}},React.createElement("li",null,"Lazy queries are called with ",React.createElement("strong",null,"array containing parameter object")),React.createElement("li",null,"Returns ",React.createElement("code",null,"response.data")," not direct data"),React.createElement("li",null,"Can be called multiple times with different parameters")))},r={render:()=>React.createElement("div",{style:{padding:"20px",fontFamily:"monospace",maxWidth:"800px"}},React.createElement("h3",null,"Mutation Pattern - Create"),React.createElement("pre",{style:{background:"#f5f5f5",padding:"15px",borderRadius:"4px",overflow:"auto"}},`import { useCreateMentorMutation } from '@iblai/data-layer';
import { toast } from 'sonner';
import * as Sentry from '@sentry/nextjs';

const [createMentor, { isLoading }] = useCreateMentorMutation();

const handleCreate = async (formData) => {
  try {
    const mentor = await createMentor({
      org: tenantKey ?? '',
      formData: {
        new_mentor_name: formData.name,
        display_name: formData.name,
        uploaded_profile_image: formData.file ?? undefined,
        // ... more fields
      },
      userId: username ?? '',
    }).unwrap();  // CRITICAL: .unwrap() throws on error

    toast.success('Mentor created successfully');
    router.push(\`/platform/\${tenantKey}/\${mentor.unique_id}\`);

  } catch (error: any) {
    // Nested error message extraction
    const errorMessage = error?.error?.error || 'Failed to create mentor';
    toast.error(errorMessage);
    Sentry.captureException(String(error));
  }
};`),React.createElement("h4",null,"Pattern Details"),React.createElement("ul",{style:{lineHeight:"1.8"}},React.createElement("li",null,React.createElement("strong",null,".unwrap()")," - Returns data directly or throws error"),React.createElement("li",null,React.createElement("strong",null,"error?.error?.error")," - Nested error message path"),React.createElement("li",null,React.createElement("strong",null,"toast + Sentry")," - User notification + error tracking"),React.createElement("li",null,React.createElement("strong",null,"Navigate on success")," - Redirect after creation")))},t={render:()=>React.createElement("div",{style:{padding:"20px",fontFamily:"monospace",maxWidth:"800px"}},React.createElement("h3",null,"Mutation Pattern - Update"),React.createElement("pre",{style:{background:"#f5f5f5",padding:"15px",borderRadius:"4px",overflow:"auto"}},`import { useUpdateMentorMutation } from '@iblai/data-layer';

const [updateMentor, { isLoading }] = useUpdateMentorMutation();

const handleUpdate = async (updates: Partial<Mentor>) => {
  try {
    await updateMentor({
      name: mentorId,
      org: tenantKey,
      userId: username ?? '',
      formData: updates,
    }).unwrap();

    toast.success('Updated successfully');

  } catch (error: any) {
    console.error(JSON.stringify(error));  // Log full error
    toast.error(error?.error?.error || 'Failed to update');
    Sentry.captureException(String(error));
  }
};`))},a={render:()=>React.createElement("div",{style:{padding:"20px",fontFamily:"monospace",maxWidth:"800px"}},React.createElement("h3",null,"Mutation Pattern - Delete"),React.createElement("pre",{style:{background:"#f5f5f5",padding:"15px",borderRadius:"4px",overflow:"auto"}},`import { useDeleteMentorMutation } from '@iblai/data-layer';

const [deleteMentor, { isLoading }] = useDeleteMentorMutation();

const handleDelete = async () => {
  try {
    await deleteMentor({
      name: mentorId,
      org: tenantKey,
      userId: username ?? '',
    }).unwrap();

    onClose(); // Close modal
    await new Promise((resolve) => setTimeout(resolve, 10)); // Small delay
    closeEditMentorModal();
    toast.success('Mentor deleted successfully');
    router.replace(\`/platform/\${tenantKey}/explore\`);

  } catch (error) {
    console.error(JSON.stringify(error));
    toast.error('Failed to delete mentor');
    Sentry.captureException(String(error));
  }
};`),React.createElement("h4",null,"Delete Pattern Details"),React.createElement("ul",{style:{lineHeight:"1.8"}},React.createElement("li",null,"Close modals in correct order"),React.createElement("li",null,"Small timeout to avoid race conditions"),React.createElement("li",null,"router.replace() (not push) to prevent back navigation"),React.createElement("li",null,"Navigate to safe page after deletion")))},o={render:()=>React.createElement("div",{style:{padding:"20px",fontFamily:"monospace",maxWidth:"800px"}},React.createElement("h3",null,"File Upload Mutation Pattern"),React.createElement("pre",{style:{background:"#f5f5f5",padding:"15px",borderRadius:"4px",overflow:"auto"}},`import { useAddTrainingDocumentMutation } from '@iblai/data-layer';

const [addTrainingDocument, { isLoading }] = useAddTrainingDocumentMutation();
const [file, setFile] = useState<File | null>(null);

const handleUpload = async () => {
  if (!file) {
    toast.error('File not found');
    return;
  }

  try {
    await addTrainingDocument({
      org: tenantKey,
      formData: {
        file: file,
        pathway: mentorId,
        type: getFileType(file).toLowerCase(),
        // Conditional fields based on file type
        ...(isImageFile(file) && { user_image_description: description }),
      },
      userId: username ?? '',
    }).unwrap();

    setFile(null); // Reset state
    toast.success('Document queued for training');

  } catch (error: unknown) {
    const errorMessage = extractErrorMessage(error, 'Upload failed');
    toast.error(errorMessage);
    Sentry.captureException(String(error));
  }
};`),React.createElement("h4",null,"File Upload Details"),React.createElement("ul",{style:{lineHeight:"1.8"}},React.createElement("li",null,"Validate file exists before upload"),React.createElement("li",null,"Use conditional spread for file-type-specific fields"),React.createElement("li",null,"Reset form state after successful upload"),React.createElement("li",null,"Use extractErrorMessage utility for error parsing")))},s={render:()=>React.createElement("div",{style:{padding:"20px",fontFamily:"monospace",maxWidth:"800px"}},React.createElement("h3",null,"Error Handling Patterns"),React.createElement("h4",null,"Standard Error Handler"),React.createElement("pre",{style:{background:"#f5f5f5",padding:"15px",borderRadius:"4px",overflow:"auto"}},`try {
  await mutation({ ... }).unwrap();
  toast.success('Success!');
} catch (error: any) {
  console.error(JSON.stringify(error));  // Log full error
  const errorMessage = error?.error?.error || 'Operation failed';
  toast.error(errorMessage);
  Sentry.captureException(String(error));
}`),React.createElement("h4",null,"extractErrorMessage Utility"),React.createElement("pre",{style:{background:"#f5f5f5",padding:"15px",borderRadius:"4px",overflow:"auto"}},`function extractErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === 'object' && error !== null) {
    const err = error as any;
    return err?.error?.error || err?.message || fallback;
  }
  return fallback;
}

// Usage
const errorMessage = extractErrorMessage(error, 'Operation failed');
toast.error(errorMessage);`),React.createElement("h4",null,"Custom Error Component"),React.createElement("pre",{style:{background:"#f5f5f5",padding:"15px",borderRadius:"4px",overflow:"auto"}},`function ToastErrorMessage({ message, supportEmail }) {
  return (
    <div>
      <p>{message}</p>
      <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
        Need help? Contact{' '}
        <a href={\`mailto:\${supportEmail}\`}>{supportEmail}</a>
      </p>
    </div>
  );
}

// Usage in errorHandler
errorHandler: async (message) => {
  toast.error(
    <ToastErrorMessage message={message} supportEmail={config.supportEmail()} />,
    { closeButton: true, duration: 5000 }
  );
}`))},i={render:()=>React.createElement("div",{style:{padding:"20px",fontFamily:"monospace",maxWidth:"800px"}},React.createElement("h3",null,"Loading State Patterns"),React.createElement("h4",null,"Query Loading States"),React.createElement("pre",{style:{background:"#f5f5f5",padding:"15px",borderRadius:"4px",overflow:"auto"}},`const { data, isLoading, isFetching, error } = useGetDataQuery(...);

// isLoading: true only on initial load
if (isLoading) return <Spinner />;

// Error state
if (error) return <ErrorMessage error={error} />;

// No data
if (!data) return null;

// Success - render data
return (
  <div>
    {data.results.map(...)}

    {/* isFetching: true on any fetch (including refetch) */}
    {isFetching && <span>Refreshing...</span>}
  </div>
);`),React.createElement("h4",null,"Mutation Loading States"),React.createElement("pre",{style:{background:"#f5f5f5",padding:"15px",borderRadius:"4px",overflow:"auto"}},`const [mutation, { isLoading }] = useMutation();

<button onClick={handleAction} disabled={isLoading}>
  {isLoading ? (
    <>
      <Spinner size="small" /> Processing...
    </>
  ) : (
    'Submit'
  )}
</button>`))};var l,d,u,c,p;e.parameters={...e.parameters,docs:{...(l=e.parameters)==null?void 0:l.docs,source:{originalSource:`{
  render: () => <div style={{
    padding: '20px',
    fontFamily: 'monospace',
    maxWidth: '800px'
  }}>
      <h3>Query Hook Pattern (Production)</h3>

      <pre style={{
      background: '#f5f5f5',
      padding: '15px',
      borderRadius: '4px',
      overflow: 'auto'
    }}>
      {\`import { useGetMentorsQuery } from '@iblai/data-layer';

const {
  data: mentors,              // Destructure with alias
  isLoading: isMentorsLoading,
  isFetching: isMentorsFetching,
  error: mentorsError,
} = useGetMentorsQuery(
  {
    org: tenantKey,
    username: username ?? '',
    ...queryParams,           // Spread pagination, filters
  },
  {
    skip: !tenantKey || !username,        // CRITICAL: Prevent invalid queries
    refetchOnMountOrArgChange: true,      // Always get fresh data
  }
);

// Standard loading/error handling
if (isMentorsLoading) return <Spinner />;
if (mentorsError) return <ErrorMessage />;
if (!mentors) return null;

// Render data
return (
  <div>
    {mentors.results.map(m => <MentorCard key={m.unique_id} mentor={m} />)}
    {isMentorsFetching && <RefreshingIndicator />}
  </div>
);\`}
      </pre>

      <h4>Key Points</h4>
      <ul style={{
      lineHeight: '1.8'
    }}>
        <li><strong>Always use skip</strong> to prevent queries with missing required params</li>
        <li><strong>Destructure with aliases</strong> when using multiple queries</li>
        <li><strong>Check isLoading first</strong>, then error, then data</li>
        <li><strong>Use isFetching</strong> to show refresh indicators</li>
      </ul>
    </div>
}`,...(u=(d=e.parameters)==null?void 0:d.docs)==null?void 0:u.source},description:{story:`## Query Hook Pattern - with Skip

Standard pattern used throughout the apps.

### Example - useGetMentorsQuery
\`\`\`tsx
import { useGetMentorsQuery } from '@iblai/data-layer';

function MentorsList() {
  const {
    data: mentors,
    isLoading: isMentorsLoading,
    isFetching: isMentorsFetching,
    error: mentorsError,
  } = useGetMentorsQuery(
    {
      org: tenantKey,
      username: username ?? '',
      page: currentPage,
      pageSize: 20,
      search: searchQuery,
    },
    {
      skip: !tenantKey || !username,      // Prevent query if missing params
      refetchOnMountOrArgChange: true,    // Always refetch on mount
    }
  );

  if (isMentorsLoading) return <Spinner />;
  if (mentorsError) return <ErrorMessage error={mentorsError} />;
  if (!mentors) return null;

  return (
    <div>
      {mentors.results.map(mentor => (
        <MentorCard key={mentor.unique_id} mentor={mentor} />
      ))}
      {isMentorsFetching && <span>Refreshing...</span>}
    </div>
  );
}
\`\`\``,...(p=(c=e.parameters)==null?void 0:c.docs)==null?void 0:p.description}}};var m,g,f,y,h;n.parameters={...n.parameters,docs:{...(m=n.parameters)==null?void 0:m.docs,source:{originalSource:`{
  render: () => <div style={{
    padding: '20px',
    fontFamily: 'monospace',
    maxWidth: '800px'
  }}>
      <h3>Lazy Query Pattern</h3>

      <pre style={{
      background: '#f5f5f5',
      padding: '15px',
      borderRadius: '4px',
      overflow: 'auto'
    }}>
      {\`import { useLazyGetUserEnrolledPathwaysQuery } from '@iblai/data-layer';

const [getUserEnrolledPathways, { isError }] =
  useLazyGetUserEnrolledPathwaysQuery();

// Call in event handler
const handleCheck = async (pathwayUuid: string) => {
  const response = await getUserEnrolledPathways([
    {
      username: getUserName(),
      pathwayUuid: pathwayUuid,
    },
  ]);

  if (response.data) {
    // Use response.data
    console.log('Result:', response.data);
  }
};

// Note: Array with single object parameter
<button onClick={() => handleCheck('uuid-123')}>Check</button>\`}
      </pre>

      <h4>Important</h4>
      <ul style={{
      lineHeight: '1.8'
    }}>
        <li>Lazy queries are called with <strong>array containing parameter object</strong></li>
        <li>Returns <code>response.data</code> not direct data</li>
        <li>Can be called multiple times with different parameters</li>
      </ul>
    </div>
}`,...(f=(g=n.parameters)==null?void 0:g.docs)==null?void 0:f.source},description:{story:`## Lazy Query Hook Pattern

For queries triggered by user actions or conditionally.

### Example - useLazyGetUserEnrolledPathwaysQuery
\`\`\`tsx
import { useLazyGetUserEnrolledPathwaysQuery } from '@iblai/data-layer';

function PathwayChecker() {
  const [getUserEnrolledPathways, { isError: isEnrolledPathwaysError }] =
    useLazyGetUserEnrolledPathwaysQuery();

  const checkEnrollment = async (pathwayUuid: string) => {
    try {
      const response = await getUserEnrolledPathways([
        {
          username: getUserName(),
          pathwayUuid: pathwayUuid,
        },
      ]);

      if (response.data) {
        console.log('Enrolled:', response.data);
      }
    } catch (error) {
      console.error('Failed to check enrollment:', error);
    }
  };

  return (
    <button onClick={() => checkEnrollment('pathway-123')}>
      Check Enrollment
    </button>
  );
}
\`\`\``,...(h=(y=n.parameters)==null?void 0:y.docs)==null?void 0:h.description}}};var M,E,x,w,b;r.parameters={...r.parameters,docs:{...(M=r.parameters)==null?void 0:M.docs,source:{originalSource:`{
  render: () => <div style={{
    padding: '20px',
    fontFamily: 'monospace',
    maxWidth: '800px'
  }}>
      <h3>Mutation Pattern - Create</h3>

      <pre style={{
      background: '#f5f5f5',
      padding: '15px',
      borderRadius: '4px',
      overflow: 'auto'
    }}>
      {\`import { useCreateMentorMutation } from '@iblai/data-layer';
import { toast } from 'sonner';
import * as Sentry from '@sentry/nextjs';

const [createMentor, { isLoading }] = useCreateMentorMutation();

const handleCreate = async (formData) => {
  try {
    const mentor = await createMentor({
      org: tenantKey ?? '',
      formData: {
        new_mentor_name: formData.name,
        display_name: formData.name,
        uploaded_profile_image: formData.file ?? undefined,
        // ... more fields
      },
      userId: username ?? '',
    }).unwrap();  // CRITICAL: .unwrap() throws on error

    toast.success('Mentor created successfully');
    router.push(\\\`/platform/\\\${tenantKey}/\\\${mentor.unique_id}\\\`);

  } catch (error: any) {
    // Nested error message extraction
    const errorMessage = error?.error?.error || 'Failed to create mentor';
    toast.error(errorMessage);
    Sentry.captureException(String(error));
  }
};\`}
      </pre>

      <h4>Pattern Details</h4>
      <ul style={{
      lineHeight: '1.8'
    }}>
        <li><strong>.unwrap()</strong> - Returns data directly or throws error</li>
        <li><strong>error?.error?.error</strong> - Nested error message path</li>
        <li><strong>toast + Sentry</strong> - User notification + error tracking</li>
        <li><strong>Navigate on success</strong> - Redirect after creation</li>
      </ul>
    </div>
}`,...(x=(E=r.parameters)==null?void 0:E.docs)==null?void 0:x.source},description:{story:`## Mutation Pattern - Create

Standard pattern for create mutations with FormData.

### Example - useCreateMentorMutation
\`\`\`tsx
import { useCreateMentorMutation } from '@iblai/data-layer';
import { toast } from 'sonner';
import * as Sentry from '@sentry/nextjs';

function CreateMentorForm() {
  const [createMentorWithSettings, { isLoading: isLoadingCreateMentor }] =
    useCreateMentorMutation();

  const handleSubmit = async (formData: CreateMentorFormData) => {
    try {
      const mentor = await createMentorWithSettings({
        org: tenantKey ?? '',
        formData: {
          uploaded_profile_image: formData.file ?? undefined,
          new_mentor_name: formData.name,
          display_name: formData.name,
          template_name: formData.base,
          // ... more fields
        },
        userId: username ?? '',
      }).unwrap();  // CRITICAL: Use .unwrap() to throw errors

      toast.success('Mentor created successfully');

      if (mentor?.unique_id) {
        router.push(\\\`/platform/\\\${tenantKey}/\\\${mentor.unique_id}\\\`);
      }
    } catch (error: any) {
      const errorMessage = error?.error?.error || 'Failed to create mentor';
      toast.error(errorMessage);
      Sentry.captureException(String(error));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <!-- form fields -->
      <button type="submit" disabled={isLoadingCreateMentor}>
        {isLoadingCreateMentor ? 'Creating...' : 'Create Mentor'}
      </button>
    </form>
  );
}
\`\`\``,...(b=(w=r.parameters)==null?void 0:w.docs)==null?void 0:b.description}}};var R,S,v,L,C;t.parameters={...t.parameters,docs:{...(R=t.parameters)==null?void 0:R.docs,source:{originalSource:`{
  render: () => <div style={{
    padding: '20px',
    fontFamily: 'monospace',
    maxWidth: '800px'
  }}>
      <h3>Mutation Pattern - Update</h3>

      <pre style={{
      background: '#f5f5f5',
      padding: '15px',
      borderRadius: '4px',
      overflow: 'auto'
    }}>
      {\`import { useUpdateMentorMutation } from '@iblai/data-layer';

const [updateMentor, { isLoading }] = useUpdateMentorMutation();

const handleUpdate = async (updates: Partial<Mentor>) => {
  try {
    await updateMentor({
      name: mentorId,
      org: tenantKey,
      userId: username ?? '',
      formData: updates,
    }).unwrap();

    toast.success('Updated successfully');

  } catch (error: any) {
    console.error(JSON.stringify(error));  // Log full error
    toast.error(error?.error?.error || 'Failed to update');
    Sentry.captureException(String(error));
  }
};\`}
      </pre>
    </div>
}`,...(v=(S=t.parameters)==null?void 0:S.docs)==null?void 0:v.source},description:{story:`## Mutation Pattern - Update

Standard pattern for update mutations.

### Example - useUpdateMentorMutation
\`\`\`tsx
import { useUpdateMentorMutation } from '@iblai/data-layer';

function EditMentorForm({ mentor }: { mentor: Mentor }) {
  const [updateMentor, { isLoading }] = useUpdateMentorMutation();

  const handleUpdate = async (updates: Partial<Mentor>) => {
    try {
      await updateMentor({
        name: mentor.unique_id,
        org: tenantKey,
        userId: username ?? '',
        formData: updates,
      }).unwrap();

      toast.success('Mentor updated');
    } catch (error: any) {
      console.error(JSON.stringify(error));
      toast.error(error?.error?.error || 'Failed to update');
      Sentry.captureException(String(error));
    }
  };

  return (
    <button onClick={() => handleUpdate({ display_name: 'New Name' })} disabled={isLoading}>
      {isLoading ? 'Updating...' : 'Update'}
    </button>
  );
}
\`\`\``,...(C=(L=t.parameters)==null?void 0:L.docs)==null?void 0:C.description}}};var D,F,P,U,k;a.parameters={...a.parameters,docs:{...(D=a.parameters)==null?void 0:D.docs,source:{originalSource:`{
  render: () => <div style={{
    padding: '20px',
    fontFamily: 'monospace',
    maxWidth: '800px'
  }}>
      <h3>Mutation Pattern - Delete</h3>

      <pre style={{
      background: '#f5f5f5',
      padding: '15px',
      borderRadius: '4px',
      overflow: 'auto'
    }}>
      {\`import { useDeleteMentorMutation } from '@iblai/data-layer';

const [deleteMentor, { isLoading }] = useDeleteMentorMutation();

const handleDelete = async () => {
  try {
    await deleteMentor({
      name: mentorId,
      org: tenantKey,
      userId: username ?? '',
    }).unwrap();

    onClose(); // Close modal
    await new Promise((resolve) => setTimeout(resolve, 10)); // Small delay
    closeEditMentorModal();
    toast.success('Mentor deleted successfully');
    router.replace(\\\`/platform/\\\${tenantKey}/explore\\\`);

  } catch (error) {
    console.error(JSON.stringify(error));
    toast.error('Failed to delete mentor');
    Sentry.captureException(String(error));
  }
};\`}
      </pre>

      <h4>Delete Pattern Details</h4>
      <ul style={{
      lineHeight: '1.8'
    }}>
        <li>Close modals in correct order</li>
        <li>Small timeout to avoid race conditions</li>
        <li>router.replace() (not push) to prevent back navigation</li>
        <li>Navigate to safe page after deletion</li>
      </ul>
    </div>
}`,...(P=(F=a.parameters)==null?void 0:F.docs)==null?void 0:P.source},description:{story:`## Mutation Pattern - Delete

Delete pattern with cleanup and navigation.

### Example - useDeleteMentorMutation
\`\`\`tsx
import { useDeleteMentorMutation } from '@iblai/data-layer';

function DeleteMentorButton({ mentorId }: { mentorId: string }) {
  const [deleteMentor, { isLoading }] = useDeleteMentorMutation();

  const handleDelete = async () => {
    try {
      await deleteMentor({
        name: mentorId,
        org: tenantKey,
        userId: username ?? '',
      }).unwrap();

      onClose(); // Close any modals
      await new Promise((resolve) => setTimeout(resolve, 10)); // Avoid race conditions
      closeEditMentorModal();
      toast.success('Mentor deleted successfully');
      router.replace(\\\`/platform/\\\${tenantKey}/explore\\\`);
    } catch (error) {
      console.error(JSON.stringify(error));
      toast.error('Failed to delete mentor');
      Sentry.captureException(String(error));
    }
  };

  return (
    <button onClick={handleDelete} disabled={isLoading} className="danger">
      {isLoading ? 'Deleting...' : 'Delete Mentor'}
    </button>
  );
}
\`\`\``,...(k=(U=a.parameters)==null?void 0:U.docs)==null?void 0:k.description}}};var I,T,Q,_,N;o.parameters={...o.parameters,docs:{...(I=o.parameters)==null?void 0:I.docs,source:{originalSource:`{
  render: () => <div style={{
    padding: '20px',
    fontFamily: 'monospace',
    maxWidth: '800px'
  }}>
      <h3>File Upload Mutation Pattern</h3>

      <pre style={{
      background: '#f5f5f5',
      padding: '15px',
      borderRadius: '4px',
      overflow: 'auto'
    }}>
      {\`import { useAddTrainingDocumentMutation } from '@iblai/data-layer';

const [addTrainingDocument, { isLoading }] = useAddTrainingDocumentMutation();
const [file, setFile] = useState<File | null>(null);

const handleUpload = async () => {
  if (!file) {
    toast.error('File not found');
    return;
  }

  try {
    await addTrainingDocument({
      org: tenantKey,
      formData: {
        file: file,
        pathway: mentorId,
        type: getFileType(file).toLowerCase(),
        // Conditional fields based on file type
        ...(isImageFile(file) && { user_image_description: description }),
      },
      userId: username ?? '',
    }).unwrap();

    setFile(null); // Reset state
    toast.success('Document queued for training');

  } catch (error: unknown) {
    const errorMessage = extractErrorMessage(error, 'Upload failed');
    toast.error(errorMessage);
    Sentry.captureException(String(error));
  }
};\`}
      </pre>

      <h4>File Upload Details</h4>
      <ul style={{
      lineHeight: '1.8'
    }}>
        <li>Validate file exists before upload</li>
        <li>Use conditional spread for file-type-specific fields</li>
        <li>Reset form state after successful upload</li>
        <li>Use extractErrorMessage utility for error parsing</li>
      </ul>
    </div>
}`,...(Q=(T=o.parameters)==null?void 0:T.docs)==null?void 0:Q.source},description:{story:`## File Upload Mutation Pattern

Pattern for mutations that accept FormData with files.

### Example - useAddTrainingDocumentMutation
\`\`\`tsx
import { useAddTrainingDocumentMutation } from '@iblai/data-layer';

function FileUploadForm() {
  const [addTrainingDocument, { isLoading: isAddTrainingDocumentLoading }] =
    useAddTrainingDocumentMutation();
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');

  const handleUploadFile = async () => {
    try {
      if (!file) {
        toast.error('File not found');
        return;
      }

      await addTrainingDocument({
        org: tenantKey,
        formData: {
          file: file,
          pathway: mentorId,
          type: getFileType(file).toLowerCase(),
          ...(isImageFile(file) && { user_image_description: description }),
        },
        userId: username ?? '',
      }).unwrap();

      setFile(null);
      setDescription('');
      toast.success('Document has been queued for training');
    } catch (error: unknown) {
      const errorMessage = extractErrorMessage(error, 'Error adding training document');
      toast.error(errorMessage);
      Sentry.captureException(String(error));
    }
  };

  return (
    <div>
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      {isImageFile(file) && (
        <input
          type="text"
          placeholder="Image description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      )}
      <button onClick={handleUploadFile} disabled={isAddTrainingDocumentLoading || !file}>
        {isAddTrainingDocumentLoading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
}
\`\`\``,...(N=(_=o.parameters)==null?void 0:_.docs)==null?void 0:N.description}}};var A,K,q,H,z;s.parameters={...s.parameters,docs:{...(A=s.parameters)==null?void 0:A.docs,source:{originalSource:`{
  render: () => <div style={{
    padding: '20px',
    fontFamily: 'monospace',
    maxWidth: '800px'
  }}>
      <h3>Error Handling Patterns</h3>

      <h4>Standard Error Handler</h4>
      <pre style={{
      background: '#f5f5f5',
      padding: '15px',
      borderRadius: '4px',
      overflow: 'auto'
    }}>
      {\`try {
  await mutation({ ... }).unwrap();
  toast.success('Success!');
} catch (error: any) {
  console.error(JSON.stringify(error));  // Log full error
  const errorMessage = error?.error?.error || 'Operation failed';
  toast.error(errorMessage);
  Sentry.captureException(String(error));
}\`}
      </pre>

      <h4>extractErrorMessage Utility</h4>
      <pre style={{
      background: '#f5f5f5',
      padding: '15px',
      borderRadius: '4px',
      overflow: 'auto'
    }}>
      {\`function extractErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === 'object' && error !== null) {
    const err = error as any;
    return err?.error?.error || err?.message || fallback;
  }
  return fallback;
}

// Usage
const errorMessage = extractErrorMessage(error, 'Operation failed');
toast.error(errorMessage);\`}
      </pre>

      <h4>Custom Error Component</h4>
      <pre style={{
      background: '#f5f5f5',
      padding: '15px',
      borderRadius: '4px',
      overflow: 'auto'
    }}>
      {\`function ToastErrorMessage({ message, supportEmail }) {
  return (
    <div>
      <p>{message}</p>
      <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
        Need help? Contact{' '}
        <a href={\\\`mailto:\\\${supportEmail}\\\`}>{supportEmail}</a>
      </p>
    </div>
  );
}

// Usage in errorHandler
errorHandler: async (message) => {
  toast.error(
    <ToastErrorMessage message={message} supportEmail={config.supportEmail()} />,
    { closeButton: true, duration: 5000 }
  );
}\`}
      </pre>
    </div>
}`,...(q=(K=s.parameters)==null?void 0:K.docs)==null?void 0:q.source},description:{story:`## Error Handling Utilities

Common error handling patterns and utilities.

### extractErrorMessage
\`\`\`tsx
function extractErrorMessage(error: unknown, defaultMessage: string): string {
  if (typeof error === 'object' && error !== null) {
    const err = error as any;
    return err?.error?.error || err?.message || defaultMessage;
  }
  return defaultMessage;
}
\`\`\`

### Error Display Component
\`\`\`tsx
function ToastErrorMessage({ message, supportEmail }: { message: string; supportEmail: string }) {
  return (
    <div>
      <p>{message}</p>
      <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
        Need help? Contact <a href={\\\`mailto:\\\${supportEmail}\\\`}>{supportEmail}</a>
      </p>
    </div>
  );
}
\`\`\``,...(z=(H=s.parameters)==null?void 0:H.docs)==null?void 0:z.description}}};var O,W,G,$,j;i.parameters={...i.parameters,docs:{...(O=i.parameters)==null?void 0:O.docs,source:{originalSource:`{
  render: () => <div style={{
    padding: '20px',
    fontFamily: 'monospace',
    maxWidth: '800px'
  }}>
      <h3>Loading State Patterns</h3>

      <h4>Query Loading States</h4>
      <pre style={{
      background: '#f5f5f5',
      padding: '15px',
      borderRadius: '4px',
      overflow: 'auto'
    }}>
      {\`const { data, isLoading, isFetching, error } = useGetDataQuery(...);

// isLoading: true only on initial load
if (isLoading) return <Spinner />;

// Error state
if (error) return <ErrorMessage error={error} />;

// No data
if (!data) return null;

// Success - render data
return (
  <div>
    {data.results.map(...)}

    {/* isFetching: true on any fetch (including refetch) */}
    {isFetching && <span>Refreshing...</span>}
  </div>
);\`}
      </pre>

      <h4>Mutation Loading States</h4>
      <pre style={{
      background: '#f5f5f5',
      padding: '15px',
      borderRadius: '4px',
      overflow: 'auto'
    }}>
      {\`const [mutation, { isLoading }] = useMutation();

<button onClick={handleAction} disabled={isLoading}>
  {isLoading ? (
    <>
      <Spinner size="small" /> Processing...
    </>
  ) : (
    'Submit'
  )}
</button>\`}
      </pre>
    </div>
}`,...(G=(W=i.parameters)==null?void 0:W.docs)==null?void 0:G.source},description:{story:`## Loading State Patterns

Standard patterns for handling loading states.

### Query Loading
\`\`\`tsx
const { data, isLoading, isFetching, error } = useGetDataQuery(...);

if (isLoading) return <Spinner />;
if (error) return <ErrorMessage />;
if (!data) return null;

return (
  <div>
    {data.results.map(...)}
    {isFetching && <RefreshIndicator />}
  </div>
);
\`\`\`

### Mutation Loading
\`\`\`tsx
const [mutation, { isLoading }] = useMutation();

<button onClick={handleClick} disabled={isLoading}>
  {isLoading ? 'Processing...' : 'Submit'}
</button>
\`\`\``,...(j=($=i.parameters)==null?void 0:$.docs)==null?void 0:j.description}}};const B=["QueryPattern","LazyQueryPattern","MutationCreatePattern","MutationUpdatePattern","MutationDeletePattern","FileUploadPattern","ErrorHandlingPatterns","LoadingStatePatterns"];export{s as ErrorHandlingPatterns,o as FileUploadPattern,n as LazyQueryPattern,i as LoadingStatePatterns,r as MutationCreatePattern,a as MutationDeletePattern,t as MutationUpdatePattern,e as QueryPattern,B as __namedExportsOrder,J as default};
