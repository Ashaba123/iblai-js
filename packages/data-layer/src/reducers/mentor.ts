import { platformApiSlice } from '@data-layer/features/platform/api-slice';
import { apiKeysApiSlice } from '@data-layer/features/api-keys/api-slice';
import { mentorApiSlice } from '@data-layer/features/mentor/api-slice';
import { tenantApiSlice } from '@data-layer/features/tenant/api-slice';
import { userApiSlice } from '@data-layer/features/user/api-slice';
import { llmsApiSlice } from '@data-layer/features/llms/api-slice';
import { toolsApiSlice } from '@data-layer/features/tools/api-slice';
import { mentorCategoriesApiSlice } from '@data-layer/features/mentor-categories/api-slice';
import { trainingDocumentsApiSlice } from '@data-layer/features/training-documents/api-slice';
import { chatHistoryApiSlice } from '@data-layer/features/chat-history/api-slice';
import { promptsApiSlice } from '@data-layer/features/prompts/api-slice';
import { credentialsApiSlice } from '@data-layer/features/credentials/api-slice';
import { userInvitationsApiSlice } from '@data-layer/features/user-invitations/api-slice';
import { chatApiSlice } from '@data-layer/features/chat/api-slice';
import { chatFilesApiSlice } from '@data-layer/features/chat-files/api-slice';
import { appApiSlice } from '@data-layer/features/apps/api-slice';
import { billingApiSlice } from '@data-layer/features/billing/api-slice';
import { sessionApiSlice } from '@data-layer/features/sessions/api-slice';
import { datasetsApiSlice } from '@data-layer/features/datasets/api-slice';
import { stripeApiSlice } from '@data-layer/features/stripe/api-slice';
import { tenantLogoApiSlice } from '@data-layer/features/tenant-logo/api-slice';
import { credentialsCustomApiSlice } from '@data-layer/features/credentials/custom-api-slice';
import { notificationsApiSlice } from '@data-layer/features/notifications/api-slice';
import { notificationsCustomApiSlice } from '@data-layer/features/notifications/custom-api-slice';
import { mentorCustomApiSlice } from '@data-layer/features/mentor/custom-api-slice';
import { catalogApiSlice } from '@data-layer/features/catalog/api-slice';
import { searchApiSlice } from '@data-layer/features/search/api-slice';
import { analyticsApiSlice } from '@data-layer/features/analytics/api-slice';
import { reportsApiSlice } from '@data-layer/features/reports/api-slice';
import { platformCustomApiSlice } from '@data-layer/features/platform/custom-api-slice';
import { projectsApiSlice } from '@data-layer/features/projects/api-slice';
import { coreCustomApiSlice } from '@data-layer/features/core/custom-api-slice';
import { memoryApiSlice } from '@data-layer/features/memory/api-slice';
import { disclaimersApiSlice } from '@data-layer/features/disclaimers/api-slice';
import { customDomainApiSlice } from '@data-layer/features/custom-domain/api-slice';
import { careerApiSlice } from '@data-layer/features/career/api-slice';
import { customAiSearchApiSlice } from '@data-layer/features/search/ai-search-api-slice';
import { coreFakeCustomPublicImageAssetApiSlice } from '@data-layer/features/core/custom-public-image-asset-api-slice';

export const mentorReducer: Record<string, any> = {
  [mentorApiSlice.reducerPath]: mentorApiSlice.reducer,
  [tenantApiSlice.reducerPath]: tenantApiSlice.reducer,
  [userApiSlice.reducerPath]: userApiSlice.reducer,
  [platformApiSlice.reducerPath]: platformApiSlice.reducer,
  [chatApiSlice.reducerPath]: chatApiSlice.reducer,
  [chatFilesApiSlice.reducerPath]: chatFilesApiSlice.reducer,
  [apiKeysApiSlice.reducerPath]: apiKeysApiSlice.reducer,
  [llmsApiSlice.reducerPath]: llmsApiSlice.reducer,
  [toolsApiSlice.reducerPath]: toolsApiSlice.reducer,
  [mentorCategoriesApiSlice.reducerPath]: mentorCategoriesApiSlice.reducer,
  [trainingDocumentsApiSlice.reducerPath]: trainingDocumentsApiSlice.reducer,
  [chatHistoryApiSlice.reducerPath]: chatHistoryApiSlice.reducer,
  [promptsApiSlice.reducerPath]: promptsApiSlice.reducer,
  [credentialsApiSlice.reducerPath]: credentialsApiSlice.reducer,
  [userInvitationsApiSlice.reducerPath]: userInvitationsApiSlice.reducer,
  [appApiSlice.reducerPath]: appApiSlice.reducer,
  [billingApiSlice.reducerPath]: billingApiSlice.reducer,
  [stripeApiSlice.reducerPath]: stripeApiSlice.reducer,
  [sessionApiSlice.reducerPath]: sessionApiSlice.reducer,
  [datasetsApiSlice.reducerPath]: datasetsApiSlice.reducer,
  [tenantLogoApiSlice.reducerPath]: tenantLogoApiSlice.reducer,
  [credentialsCustomApiSlice.reducerPath]: credentialsCustomApiSlice.reducer,
  [notificationsApiSlice.reducerPath]: notificationsApiSlice.reducer,
  [notificationsCustomApiSlice.reducerPath]: notificationsCustomApiSlice.reducer,
  [mentorCustomApiSlice.reducerPath]: mentorCustomApiSlice.reducer,
  [catalogApiSlice.reducerPath]: catalogApiSlice.reducer,
  [searchApiSlice.reducerPath]: searchApiSlice.reducer,
  [analyticsApiSlice.reducerPath]: analyticsApiSlice.reducer,
  [reportsApiSlice.reducerPath]: reportsApiSlice.reducer,
  [platformCustomApiSlice.reducerPath]: platformCustomApiSlice.reducer,
  [projectsApiSlice.reducerPath]: projectsApiSlice.reducer,
  [coreCustomApiSlice.reducerPath]: coreCustomApiSlice.reducer,
  [memoryApiSlice.reducerPath]: memoryApiSlice.reducer,
  [disclaimersApiSlice.reducerPath]: disclaimersApiSlice.reducer,
  [customDomainApiSlice.reducerPath]: customDomainApiSlice.reducer,
  [careerApiSlice.reducerPath]: careerApiSlice.reducer,
  [customAiSearchApiSlice.reducerPath]: customAiSearchApiSlice.reducer,
  [coreFakeCustomPublicImageAssetApiSlice.reducerPath]:
    coreFakeCustomPublicImageAssetApiSlice.reducer,
};

export const mentorMiddleware: any[] = [
  mentorApiSlice.middleware,
  tenantApiSlice.middleware,
  userApiSlice.middleware,
  platformApiSlice.middleware,
  apiKeysApiSlice.middleware,
  llmsApiSlice.middleware,
  toolsApiSlice.middleware,
  mentorCategoriesApiSlice.middleware,
  trainingDocumentsApiSlice.middleware,
  chatHistoryApiSlice.middleware,
  promptsApiSlice.middleware,
  credentialsApiSlice.middleware,
  userInvitationsApiSlice.middleware,
  chatApiSlice.middleware,
  chatFilesApiSlice.middleware,
  appApiSlice.middleware,
  billingApiSlice.middleware,
  stripeApiSlice.middleware,
  sessionApiSlice.middleware,
  datasetsApiSlice.middleware,
  tenantLogoApiSlice.middleware,
  credentialsCustomApiSlice.middleware,
  notificationsApiSlice.middleware,
  notificationsCustomApiSlice.middleware,
  mentorCustomApiSlice.middleware,
  catalogApiSlice.middleware,
  searchApiSlice.middleware,
  analyticsApiSlice.middleware,
  reportsApiSlice.middleware,
  platformCustomApiSlice.middleware,
  projectsApiSlice.middleware,
  coreCustomApiSlice.middleware,
  memoryApiSlice.middleware,
  disclaimersApiSlice.middleware,
  customDomainApiSlice.middleware,
  careerApiSlice.middleware,
  customAiSearchApiSlice.middleware,
  coreFakeCustomPublicImageAssetApiSlice.middleware,
];
