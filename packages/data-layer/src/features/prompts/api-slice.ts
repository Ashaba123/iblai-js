import { AiPromptService, SearchService } from '@iblai/iblai-api';
import { createApi } from '@reduxjs/toolkit/query/react';
import { buildEndpointFromDmService } from '../utils';
import { iblFakeBaseQuery } from '@data-layer/core';

// Define the type for the getPromptCategories query parameters
interface GetPromptCategoriesParams {
  org: string;
  user_id: string;
  filterBy?: string;
}

export const promptsApiSlice = createApi({
  reducerPath: 'promptsApiSlice',
  baseQuery: iblFakeBaseQuery,
  tagTypes: ['prompts', 'promptsSearch', 'promptCategories', 'guidedPrompts'],
  endpoints: (builder) => ({
    getPromptCategories: builder.query<any, GetPromptCategoriesParams>({
      ...buildEndpointFromDmService(AiPromptService.aiPromptOrgsUsersPromptsCategoryRetrieve),
      providesTags: ['promptCategories'],
    }),
    getPrompts: builder.query({
      ...buildEndpointFromDmService(AiPromptService.aiPromptOrgsUsersPromptList),
      providesTags: ['prompts'],
    }),
    getPromptsSearch: builder.query({
      ...buildEndpointFromDmService(SearchService.searchOrgsUsersPromptsRetrieve),
      providesTags: ['promptsSearch'],
    }),
    createPrompt: builder.mutation({
      ...buildEndpointFromDmService(AiPromptService.aiPromptOrgsUsersPromptCreate),
      invalidatesTags: () => [{ type: 'prompts' }, { type: 'promptsSearch' }],
    }),
    updatePrompt: builder.mutation({
      ...buildEndpointFromDmService(AiPromptService.aiPromptOrgsUsersPromptUpdate),
      invalidatesTags: () => [{ type: 'prompts' }, { type: 'promptsSearch' }],
    }),
    deletePrompt: builder.mutation({
      ...buildEndpointFromDmService(AiPromptService.aiPromptOrgsUsersPromptDestroy),
      invalidatesTags: () => [{ type: 'prompts' }, { type: 'promptsSearch' }],
    }),
    getGuidedPrompts: builder.query({
      ...buildEndpointFromDmService(AiPromptService.aiPromptOrgsUsersSessionsGuidedPromptsRetrieve),
      providesTags: ['guidedPrompts'],
    }),
  }),
});

export const {
  useGetPromptCategoriesQuery,
  useLazyGetPromptCategoriesQuery,
  useGetPromptsQuery,
  useLazyGetPromptsQuery,
  useGetPromptsSearchQuery,
  useLazyGetPromptsSearchQuery,
  useCreatePromptMutation,
  useUpdatePromptMutation,
  useDeletePromptMutation,
  useGetGuidedPromptsQuery,
  useLazyGetGuidedPromptsQuery,
} = promptsApiSlice;
