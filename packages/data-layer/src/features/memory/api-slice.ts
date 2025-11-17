import { createApi } from '@reduxjs/toolkit/query/react';
import { iblFetchBaseQuery } from '@data-layer/features/utils';
import { MEMORY_ENDPOINTS, MEMORY_REDUCER_PATH, MEMORY_QUERY_KEYS } from './constants';
import {
  MemoriesFetchResponse,
  GetMemoriesArgs,
  MemoryCategoriesResponse,
  GetMemoryCategoriesArgs,
  MentorUserSettings,
  GetMentorUserSettingsArgs,
  UpdateMentorUserSettingsArgs,
  DeleteMemoryArgs,
  DeleteMemoryByCategoryArgs,
  UpdateMemoryEntryArgs,
  MemoryEntry,
  CreateMemoryArgs,
  Memory,
  MemoryFiltersResponse,
  GetMemoryFiltersArgs,
  GetFilteredMemoriesArgs,
} from './types';

export const memoryApiSlice = createApi({
  reducerPath: MEMORY_REDUCER_PATH,

  tagTypes: [
    ...MEMORY_QUERY_KEYS.GET_MEMORIES(),
    ...MEMORY_QUERY_KEYS.GET_MEMORY_CATEGORIES(),
    ...MEMORY_QUERY_KEYS.GET_MENTOR_USER_SETTINGS(),
    ...MEMORY_QUERY_KEYS.GET_FILTERED_MEMORIES(),
  ],

  baseQuery: iblFetchBaseQuery,

  endpoints: (builder) => ({
    getMemories: builder.query<MemoriesFetchResponse, GetMemoriesArgs>({
      query: (args) => {
        return {
          url: MEMORY_ENDPOINTS.GET_MEMORIES.path(args.tenantKey, args.username),
          params: args.params,
          service: MEMORY_ENDPOINTS.GET_MEMORIES.service,
        };
      },
      providesTags: MEMORY_QUERY_KEYS.GET_MEMORIES(),
    }),

    getMemoryCategories: builder.query<MemoryCategoriesResponse, GetMemoryCategoriesArgs>({
      query: (args) => {
        return {
          url: MEMORY_ENDPOINTS.GET_MEMORY_CATEGORIES.path(args.tenantKey, args.username),
          service: MEMORY_ENDPOINTS.GET_MEMORY_CATEGORIES.service,
        };
      },
      providesTags: MEMORY_QUERY_KEYS.GET_MEMORY_CATEGORIES(),
    }),

    getMentorUserSettings: builder.query<MentorUserSettings, GetMentorUserSettingsArgs>({
      query: (args) => {
        return {
          url: MEMORY_ENDPOINTS.GET_MENTOR_USER_SETTINGS.path(
            args.tenantKey,
            args.username,
            args.mentorId,
          ),
          service: MEMORY_ENDPOINTS.GET_MENTOR_USER_SETTINGS.service,
        };
      },
      providesTags: MEMORY_QUERY_KEYS.GET_MENTOR_USER_SETTINGS(),
    }),

    updateMentorUserSettings: builder.mutation<MentorUserSettings, UpdateMentorUserSettingsArgs>({
      query: (args) => {
        return {
          url: MEMORY_ENDPOINTS.UPDATE_MENTOR_USER_SETTINGS.path(
            args.tenantKey,
            args.username,
            args.mentorId,
          ),
          method: 'POST',
          body: args.settings,
          service: MEMORY_ENDPOINTS.UPDATE_MENTOR_USER_SETTINGS.service,
        };
      },
      invalidatesTags: MEMORY_QUERY_KEYS.GET_MENTOR_USER_SETTINGS(),
    }),

    deleteMemory: builder.mutation<void, DeleteMemoryArgs>({
      query: (args) => {
        return {
          url: MEMORY_ENDPOINTS.DELETE_MEMORY.path(args.tenantKey, args.username, args.memoryId),
          method: 'DELETE',
          service: MEMORY_ENDPOINTS.DELETE_MEMORY.service,
        };
      },
      invalidatesTags: MEMORY_QUERY_KEYS.GET_MEMORIES(),
    }),

    deleteMemoryByCategory: builder.mutation<void, DeleteMemoryByCategoryArgs>({
      query: (args) => {
        return {
          url: MEMORY_ENDPOINTS.DELETE_MEMORY_BY_CATEGORY.path(
            args.tenantKey,
            args.username,
            args.category,
          ),
          method: 'DELETE',
          service: MEMORY_ENDPOINTS.DELETE_MEMORY_BY_CATEGORY.service,
        };
      },
      invalidatesTags: MEMORY_QUERY_KEYS.GET_MEMORIES(),
    }),

    updateMemoryEntry: builder.mutation<MemoryEntry, UpdateMemoryEntryArgs>({
      query: (args) => {
        return {
          url: MEMORY_ENDPOINTS.UPDATE_MEMORY_ENTRY.path(
            args.tenantKey,
            args.username,
            args.entryId,
          ),
          method: 'POST',
          body: args.data,
          service: MEMORY_ENDPOINTS.UPDATE_MEMORY_ENTRY.service,
        };
      },
      invalidatesTags: MEMORY_QUERY_KEYS.GET_MEMORIES(),
    }),

    createMemory: builder.mutation<Memory, CreateMemoryArgs>({
      query: (args) => {
        return {
          url: MEMORY_ENDPOINTS.CREATE_MEMORY.path(args.tenantKey, args.username),
          method: 'POST',
          body: args.data,
          service: MEMORY_ENDPOINTS.CREATE_MEMORY.service,
        };
      },
      invalidatesTags: MEMORY_QUERY_KEYS.GET_MEMORIES(),
    }),

    getMemoryFilters: builder.query<MemoryFiltersResponse, GetMemoryFiltersArgs>({
      query: (args) => {
        return {
          url: MEMORY_ENDPOINTS.GET_MEMORY_FILTERS.path(args.tenantKey, args.username),
          service: MEMORY_ENDPOINTS.GET_MEMORY_FILTERS.service,
        };
      },
    }),

    getFilteredMemories: builder.query<MemoriesFetchResponse, GetFilteredMemoriesArgs>({
      query: (args) => {
        return {
          url: MEMORY_ENDPOINTS.GET_FILTERED_MEMORIES.path(args.tenantKey, args.username),
          params: args.params,
          service: MEMORY_ENDPOINTS.GET_FILTERED_MEMORIES.service,
        };
      },
      providesTags: MEMORY_QUERY_KEYS.GET_FILTERED_MEMORIES(),
    }),
  }),
});

export const {
  useGetMemoriesQuery,
  useLazyGetMemoriesQuery,
  useGetMemoryCategoriesQuery,
  useLazyGetMemoryCategoriesQuery,
  useGetMentorUserSettingsQuery,
  useLazyGetMentorUserSettingsQuery,
  useUpdateMentorUserSettingsMutation,
  useDeleteMemoryMutation,
  useDeleteMemoryByCategoryMutation,
  useUpdateMemoryEntryMutation,
  useCreateMemoryMutation,
  useGetMemoryFiltersQuery,
  useLazyGetMemoryFiltersQuery,
  useGetFilteredMemoriesQuery,
  useLazyGetFilteredMemoriesQuery,
} = memoryApiSlice;
