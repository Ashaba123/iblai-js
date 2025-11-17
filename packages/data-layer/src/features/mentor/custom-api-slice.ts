import { createApi } from "@reduxjs/toolkit/query/react";
import { iblFetchBaseQuery } from "@data-layer/features/utils";
import { MENTOR_CUSTOM_ENDPOINTS, MENTOR_CUSTOM_REDUCER_PATH, MENTORS_QUERY_KEYS } from "./constants";
import { MentorsFetchResponse, GetMentorsArgs, MentorSummariesResponse, GetMentorSummariesArgs, ConversationMemoryResponse, GetConversationMemoriesArgs } from "./types";

export const mentorCustomApiSlice = createApi({
  reducerPath: MENTOR_CUSTOM_REDUCER_PATH,

  tagTypes: MENTORS_QUERY_KEYS.GET_MENTORS(),

  baseQuery: iblFetchBaseQuery,

  endpoints: (builder) => ({
    getCustomMentors: builder.query<MentorsFetchResponse, GetMentorsArgs>({
        query: (args) => {
          return {
            url: MENTOR_CUSTOM_ENDPOINTS.GET_MENTORS.path(args.tenantKey, args.username),
            params: args.params,
            service: MENTOR_CUSTOM_ENDPOINTS.GET_MENTORS.service,
          };
        },
        providesTags: MENTORS_QUERY_KEYS.GET_MENTORS(),
      }),

      getMentorSummaries: builder.query<MentorSummariesResponse, GetMentorSummariesArgs>({
        query: (args) => {
          return {
            url: MENTOR_CUSTOM_ENDPOINTS.GET_MENTOR_SUMMARIES.path(args.tenantKey, args.username, args.mentorId, args.summary_type),
            service: MENTOR_CUSTOM_ENDPOINTS.GET_MENTOR_SUMMARIES.service,
          };
        },
      }),
      getConversationMemories: builder.query<ConversationMemoryResponse, GetConversationMemoriesArgs>({
        query: (args) => {
          return {
            url: MENTOR_CUSTOM_ENDPOINTS.GET_CONVERSATION_MEMORIES.path(args.tenantKey, args.username, args.memory_unique_id),
            service: MENTOR_CUSTOM_ENDPOINTS.GET_CONVERSATION_MEMORIES.service,
          };
        },
      }),
  }),
});

export const {
  useGetCustomMentorsQuery,
  useLazyGetCustomMentorsQuery,
  useGetMentorSummariesQuery,
  useLazyGetMentorSummariesQuery,
  useGetConversationMemoriesQuery,
  useLazyGetConversationMemoriesQuery,
} = mentorCustomApiSlice;
