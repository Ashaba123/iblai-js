import { AiMentorService } from '@iblai/iblai-api';
import { createApi } from '@reduxjs/toolkit/query/react';

import { buildEndpointFromDmService } from '../utils';
import { iblFakeBaseQuery } from '@data-layer/core';

export const mentorCategoriesApiSlice = createApi({
  reducerPath: 'mentorCategoriesApiSlice',
  baseQuery: iblFakeBaseQuery,
  endpoints: (builder) => ({
    getMentorCategories: builder.query({
      ...buildEndpointFromDmService(AiMentorService.aiMentorOrgsUsersMentorCategoriesList),
    }),
    getMentorCategoryGroups: builder.query({
      ...buildEndpointFromDmService(AiMentorService.aiMentorOrgsUsersCategoryGroupsList),
    }),
  }),
});

export const {
  useGetMentorCategoriesQuery,
  useLazyGetMentorCategoriesQuery,
  useGetMentorCategoryGroupsQuery,
  useLazyGetMentorCategoryGroupsQuery
} = mentorCategoriesApiSlice;
