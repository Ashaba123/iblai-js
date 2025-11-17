import { createApi } from '@reduxjs/toolkit/query/react';
import { buildEndpointFromDmService } from '../utils';
import { AiMentorService } from '@iblai/iblai-api';
import { iblFakeBaseQuery } from '@data-layer/core';

export const chatApiSlice = createApi({
  reducerPath: 'chatApiSlice',
  baseQuery: iblFakeBaseQuery,
  tagTypes: ['pinnedMessages', 'recentMessages', 'messageFeedback'],
  endpoints: (builder) => ({
    getPinnedMessages: builder.query({
      ...buildEndpointFromDmService(AiMentorService.aiMentorOrgsUsersPinMessageList),
      providesTags: ['pinnedMessages'],
    }),
    unPinMessage: builder.mutation({
      ...buildEndpointFromDmService(AiMentorService.aiMentorOrgsUsersPinMessageDestroy),
    }),
    addPinnedMessage: builder.mutation({
      ...buildEndpointFromDmService(AiMentorService.aiMentorOrgsUsersPinMessageCreate),
      invalidatesTags: ['pinnedMessages'],
    }),
    getVectorDocuments: builder.query({
      ...buildEndpointFromDmService(AiMentorService.aiMentorOrgsUsersCleanVectorResultsList),
    }),
    getRecentMessage: builder.query({
      ...buildEndpointFromDmService(AiMentorService.aiMentorOrgsUsersRecentMessagesRetrieve),
    }),
    deleteMessage: builder.mutation({
      ...buildEndpointFromDmService(AiMentorService.aiMentorOrgsUsersSessionsDestroy),
    }),
    updateMessageFeedback: builder.mutation({
      ...buildEndpointFromDmService(AiMentorService.aiMentorOrgsUsersMentorFeedbackCreateCreate),
      invalidatesTags: (_result, _error, args) => [
        { type: 'messageFeedback', id: args?.requestBody.id },
      ],
    }),
    audioToText: builder.mutation({
      ...buildEndpointFromDmService(AiMentorService.aiMentorOrgsUsersAudioToTextCreate),
    }),
  }),
});

export const {
  useLazyGetPinnedMessagesQuery,
  useUnPinMessageMutation,
  useDeleteMessageMutation,
  useGetPinnedMessagesQuery,
  useAddPinnedMessageMutation,
  useGetVectorDocumentsQuery,
  useLazyGetVectorDocumentsQuery,
  useGetRecentMessageQuery,
  useLazyGetRecentMessageQuery,
  useUpdateMessageFeedbackMutation,
  useAudioToTextMutation,
} = chatApiSlice;
