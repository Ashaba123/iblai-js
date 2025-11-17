import { createApi } from '@reduxjs/toolkit/query/react';
import { iblFetchBaseQuery } from '../utils';
import {
  CUSTOM_AI_SEARCH_ENDPOINTS,
  CUSTOM_AI_SEARCH_QUERY_KEYS,
  CUSTOM_AI_SEARCH_REDUCER_PATH,
} from './constants';
import {
  CreateRecommendedPromptArgs,
  DeleteRecommendedPromptArgs,
  GetRecommendedPromptsListArgs,
  GetRecommendationsAiSearchArgs,
  GetRecommendationsAiSearchResponse,
  RecommendedPromptDetailResponse,
  UpdateRecommendedPromptArgs,
} from './types';

export const customAiSearchApiSlice = createApi({
  reducerPath: CUSTOM_AI_SEARCH_REDUCER_PATH,
  baseQuery: iblFetchBaseQuery,
  tagTypes: [
    ...CUSTOM_AI_SEARCH_QUERY_KEYS.GET_RECOMMENDATIONS_AI_SEARCH(),
    ...CUSTOM_AI_SEARCH_QUERY_KEYS.GET_PROMPTS_LIST(),
    ...CUSTOM_AI_SEARCH_QUERY_KEYS.CREATE_PROMPT(),
    ...CUSTOM_AI_SEARCH_QUERY_KEYS.UPDATE_PROMPT(),
    ...CUSTOM_AI_SEARCH_QUERY_KEYS.DELETE_PROMPT(),
  ],
  endpoints: (builder) => ({
    getRecommendationsAiSearch: builder.query<
      GetRecommendationsAiSearchResponse,
      GetRecommendationsAiSearchArgs
    >({
      query: (args) => {
        return {
          url: CUSTOM_AI_SEARCH_ENDPOINTS.GET_RECOMMENDATIONS_AI_SEARCH.path(),
          params: args.params,
          service: CUSTOM_AI_SEARCH_ENDPOINTS.GET_RECOMMENDATIONS_AI_SEARCH.service,
          method: 'GET',
        };
      },
      providesTags: CUSTOM_AI_SEARCH_QUERY_KEYS.GET_RECOMMENDATIONS_AI_SEARCH(),
    }),
    getRecommendedPromptsList: builder.query<
      RecommendedPromptDetailResponse,
      GetRecommendedPromptsListArgs
    >({
      query: (args) => {
        return {
          url: CUSTOM_AI_SEARCH_ENDPOINTS.GET_RECOMMENDED_PROMPTS_LIST.path(),
          params: args.params,
          service: CUSTOM_AI_SEARCH_ENDPOINTS.GET_RECOMMENDED_PROMPTS_LIST.service,
          method: 'GET',
        };
      },
    }),
    createRecommendedPrompt: builder.mutation<
      RecommendedPromptDetailResponse,
      CreateRecommendedPromptArgs
    >({
      query: (args) => {
        return {
          url: CUSTOM_AI_SEARCH_ENDPOINTS.CREATE_RECOMMENDED_PROMPT.path(),
          body: args.requestBody,
          service: CUSTOM_AI_SEARCH_ENDPOINTS.CREATE_RECOMMENDED_PROMPT.service,
          method: 'POST',
        };
      },
      invalidatesTags: CUSTOM_AI_SEARCH_QUERY_KEYS.GET_PROMPTS_LIST(),
    }),
    updateRecommendedPrompt: builder.mutation<unknown, UpdateRecommendedPromptArgs>({
      query: (args) => {
        return {
          url: CUSTOM_AI_SEARCH_ENDPOINTS.UPDATE_RECOMMENDED_PROMPT.path(),
          body: args.requestBody,
          method: 'PUT',
          params: {
            prompt_id: args.prompt_id,
            platform_key: args.platform_key,
          },
          service: CUSTOM_AI_SEARCH_ENDPOINTS.UPDATE_RECOMMENDED_PROMPT.service,
        };
      },
      invalidatesTags: CUSTOM_AI_SEARCH_QUERY_KEYS.GET_PROMPTS_LIST(),
    }),
    deleteRecommendedPrompt: builder.mutation<unknown, DeleteRecommendedPromptArgs>({
      query: (args) => {
        return {
          url: CUSTOM_AI_SEARCH_ENDPOINTS.DELETE_RECOMMENDED_PROMPT.path(),
          params: args.params,
          method: 'DELETE',
          service: CUSTOM_AI_SEARCH_ENDPOINTS.DELETE_RECOMMENDED_PROMPT.service,
        };
      },
      invalidatesTags: CUSTOM_AI_SEARCH_QUERY_KEYS.GET_PROMPTS_LIST(),
    }),
  }),
});

export const {
  useGetRecommendationsAiSearchQuery,
  useLazyGetRecommendationsAiSearchQuery,
  useGetRecommendedPromptsListQuery,
  useLazyGetRecommendedPromptsListQuery,
  useCreateRecommendedPromptMutation,
  useUpdateRecommendedPromptMutation,
  useDeleteRecommendedPromptMutation,
} = customAiSearchApiSlice;
