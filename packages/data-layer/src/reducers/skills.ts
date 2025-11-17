import { perLearnerApiSlice } from '@data-layer/features/per-learner/api-slice';
import { catalogApiSlice } from '@data-layer/features/catalog/api-slice';
import { skillsApiSlice } from '@data-layer/features/skills/api-slice';
import { credentialsApiSlice } from '@data-layer/features/credentials/api-slice';
import { searchApiSlice } from '@data-layer/features/search/api-slice';
import { careerApiSlice } from '@data-layer/features/career/api-slice';
import { userApiSlice } from '@data-layer/features/user/api-slice';
import { tenantApiSlice } from '@data-layer/features/tenant/api-slice';
import { platformApiSlice } from '@data-layer/features/platform/api-slice';
import { mentorApiSlice } from '@data-layer/features/mentor/api-slice';
import { tenantLogoApiSlice } from '@data-layer/features/tenant-logo/api-slice';
import { coreApiSlice } from '@data-layer/features/core/api-slice';
import { llmsApiSlice } from '@data-layer/features/llms/api-slice';
import { apiKeysApiSlice } from '@data-layer/features/api-keys/api-slice';
import { credentialsCustomApiSlice } from '@data-layer/features/credentials/custom-api-slice';
import { notificationsApiSlice } from '@data-layer/features/notifications/api-slice';
import { notificationsCustomApiSlice } from '@data-layer/features/notifications/custom-api-slice';
import { mentorCustomApiSlice } from '@data-layer/features/mentor/custom-api-slice';
import { platformCustomApiSlice } from '@data-layer/features/platform/custom-api-slice';
import { coreCustomApiSlice } from '@data-layer/features/core/custom-api-slice';
import { edxProctoringApiSlice } from '@data-layer/features/edx-proctoring/api-slice';
import { stripeApiSlice } from '@data-layer/features/stripe/api-slice';
import { analyticsApiSlice } from '@data-layer/features/analytics/api-slice';
import { reportsApiSlice } from '@data-layer/features/reports/api-slice';
import { customDomainApiSlice } from '@data-layer/features/custom-domain/api-slice';
import { appApiSlice } from '@data-layer/features/apps/api-slice';
import { customAiSearchApiSlice } from '@data-layer/features/search/ai-search-api-slice';
import { coreFakeCustomPublicImageAssetApiSlice } from '@data-layer/features/core/custom-public-image-asset-api-slice';

export const skillsReducer: Record<string, any> = {
  [perLearnerApiSlice.reducerPath]: perLearnerApiSlice.reducer,
  [catalogApiSlice.reducerPath]: catalogApiSlice.reducer,
  [skillsApiSlice.reducerPath]: skillsApiSlice.reducer,
  [credentialsApiSlice.reducerPath]: credentialsApiSlice.reducer,
  [searchApiSlice.reducerPath]: searchApiSlice.reducer,
  [careerApiSlice.reducerPath]: careerApiSlice.reducer,
  [userApiSlice.reducerPath]: userApiSlice.reducer,
  [tenantApiSlice.reducerPath]: tenantApiSlice.reducer,
  [platformApiSlice.reducerPath]: platformApiSlice.reducer,
  [mentorApiSlice.reducerPath]: mentorApiSlice.reducer,
  [tenantLogoApiSlice.reducerPath]: tenantLogoApiSlice.reducer,
  [coreApiSlice.reducerPath]: coreApiSlice.reducer,
  [llmsApiSlice.reducerPath]: llmsApiSlice.reducer,
  [apiKeysApiSlice.reducerPath]: apiKeysApiSlice.reducer,
  [credentialsCustomApiSlice.reducerPath]: credentialsCustomApiSlice.reducer,
  [notificationsApiSlice.reducerPath]: notificationsApiSlice.reducer,
  [notificationsCustomApiSlice.reducerPath]: notificationsCustomApiSlice.reducer,
  [mentorCustomApiSlice.reducerPath]: mentorCustomApiSlice.reducer,
  [platformCustomApiSlice.reducerPath]: platformCustomApiSlice.reducer,
  [coreCustomApiSlice.reducerPath]: coreCustomApiSlice.reducer,
  [edxProctoringApiSlice.reducerPath]: edxProctoringApiSlice.reducer,
  [stripeApiSlice.reducerPath]: stripeApiSlice.reducer,
  [analyticsApiSlice.reducerPath]: analyticsApiSlice.reducer,
  [reportsApiSlice.reducerPath]: reportsApiSlice.reducer,
  [customDomainApiSlice.reducerPath]: customDomainApiSlice.reducer,
  [appApiSlice.reducerPath]: appApiSlice.reducer,
  [customAiSearchApiSlice.reducerPath]: customAiSearchApiSlice.reducer,
  [coreFakeCustomPublicImageAssetApiSlice.reducerPath]:
    coreFakeCustomPublicImageAssetApiSlice.reducer,
};

export const skillsMiddleware: any[] = [
  perLearnerApiSlice.middleware,
  catalogApiSlice.middleware,
  skillsApiSlice.middleware,
  credentialsApiSlice.middleware,
  searchApiSlice.middleware,
  careerApiSlice.middleware,
  userApiSlice.middleware,
  tenantApiSlice.middleware,
  platformApiSlice.middleware,
  mentorApiSlice.middleware,
  tenantLogoApiSlice.middleware,
  coreApiSlice.middleware,
  llmsApiSlice.middleware,
  apiKeysApiSlice.middleware,
  credentialsCustomApiSlice.middleware,
  notificationsApiSlice.middleware,
  notificationsCustomApiSlice.middleware,
  mentorCustomApiSlice.middleware,
  platformCustomApiSlice.middleware,
  coreCustomApiSlice.middleware,
  edxProctoringApiSlice.middleware,
  stripeApiSlice.middleware,
  analyticsApiSlice.middleware,
  reportsApiSlice.middleware,
  customDomainApiSlice.middleware,
  appApiSlice.middleware,
  customAiSearchApiSlice.middleware,
  coreFakeCustomPublicImageAssetApiSlice.middleware,
];
