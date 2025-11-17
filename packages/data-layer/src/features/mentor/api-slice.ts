import { AiMentorService, SearchService } from '@iblai/iblai-api';
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';

import { buildEndpointFromAxdService, buildEndpointFromDmService } from '../utils';

export const mentorApiSlice = createApi({
  reducerPath: 'mentorApiSlice',
  baseQuery: fakeBaseQuery(),
  tagTypes: [
    'mentor',
    'mentors',
    'mentorSettings',
    'mentorPublicSettings',
    'shareableLinks',
    'publicMentors',
    'moderationLogs',
  ],
  endpoints: (builder) => ({
    createMentor: builder.mutation({
      ...buildEndpointFromDmService(AiMentorService.aiMentorOrgsUsersMentorWithSettingsCreate),
      invalidatesTags: ['mentors'],
    }),

    getMentors: builder.query({
      ...buildEndpointFromDmService(SearchService.searchOrgsUsersMentorsRetrieve),
      providesTags: ['mentors'],
    }),

    getPublicMentors: builder.query({
      ...buildEndpointFromDmService(SearchService.searchMentorsRetrieve),
      providesTags: ['publicMentors'],
    }),

    // triggers a refresh of a single mentor base on the mentor unique id.
    editMentor: builder.mutation({
      ...buildEndpointFromDmService(AiMentorService.aiMentorOrgsUsersMentorsSettingsUpdate),
      invalidatesTags: (_result, _error, arg) => [
        { type: 'mentor', id: arg.mentor },
        { type: 'mentorSettings', id: arg.mentor },
        { type: 'mentorPublicSettings', id: arg.mentor },
      ],
    }),

    seedMentors: builder.query({
      ...buildEndpointFromDmService(AiMentorService.aiMentorOrgsUsersMentorSeedRetrieve),
    }),

    getMentorDetails: builder.query({
      ...buildEndpointFromDmService(AiMentorService.aiMentorOrgsUsersMentorsRetrieve),
      providesTags: (_result, _error, arg) => [{ type: 'mentor', id: arg.mentor }],
    }),

    getMentorSettings: builder.query({
      ...buildEndpointFromDmService(AiMentorService.aiMentorOrgsUsersMentorsSettingsRetrieve),
      providesTags: (_result, _error, arg) => [{ type: 'mentorSettings', id: arg.mentor }],
    }),

    getMentorPublicSettings: builder.query({
      ...buildEndpointFromDmService(AiMentorService.aiMentorOrgsUsersMentorsPublicSettingsRetrieve),
      providesTags: (_result, _error, arg) => [{ type: 'mentorPublicSettings', id: arg.mentor }],
    }),

    // triggers a refresh of the mentor list.
    updateMentorVisibilityStatus: builder.mutation({
      ...buildEndpointFromAxdService(AiMentorService.aiMentorOrgsUsersMentorsSettingsUpdate),
      onQueryStarted: async (queryArgument, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;

          dispatch(
            mentorApiSlice.util.updateQueryData(
              'getMentors',
              {
                org: queryArgument.org,
                // @ts-expect-error - userId may not match expected API parameter type
                username: queryArgument?.userId,
                // @ts-expect-error - limit may not match expected API parameter type
                limit: queryArgument?.limit,
                // @ts-expect-error - offset may not match expected API parameter type
                offset: queryArgument?.offset,
                // @ts-expect-error - query may not match expected API parameter type
                query: queryArgument?.query,
              },
              (draft) => {
                const indexOfMentor = draft.results.findIndex(
                  (mentor) => mentor.unique_id === queryArgument.mentor,
                );

                if (indexOfMentor !== -1) {
                  // @ts-expect-error - mentor_visibility property may not exist in draft type
                  draft.results[indexOfMentor].mentor_visibility =
                    queryArgument.formData?.mentor_visibility;
                }
              },
            ),
          );
        } catch (error) {
          console.error(JSON.stringify(error));
        }
      },
    }),

    getFreeUsageCount: builder.query({
      ...buildEndpointFromDmService(AiMentorService.aiMentorOrgsUsersFreeUsageCountRetrieve),
    }),
    createShareableLink: builder.mutation({
      ...buildEndpointFromDmService(AiMentorService.aiMentorOrgsUsersMentorsSharableLinkCreate),
      invalidatesTags: (_result, _error, arg) => [
        { type: 'shareableLinks', id: `${arg?.mentor}-${arg?.org}` },
      ],
    }),
    getShareableLink: builder.query({
      ...buildEndpointFromDmService(AiMentorService.aiMentorOrgsUsersMentorsSharableLinkRetrieve),
      providesTags: (_result, _error, arg) => [
        { type: 'shareableLinks', id: `${arg.mentor}-${arg.org}` },
      ],
    }),
    getShareableLinkPublic: builder.query({
      ...buildEndpointFromDmService(
        AiMentorService.aiMentorOrgsUsersMentorsPublicSharableLinkRetrieve,
      ),
      providesTags: (_result, _error, arg) => [
        { type: 'shareableLinks', id: `${arg?.mentor}-${arg?.org}` },
      ],
    }),
    revokeShareableLink: builder.mutation({
      ...buildEndpointFromDmService(AiMentorService.aiMentorOrgsUsersMentorsSharableLinkDestroy),
    }),
    updateShareableLink: builder.mutation({
      ...buildEndpointFromAxdService(AiMentorService.aiMentorOrgsUsersMentorsSharableLinkUpdate),
      async onQueryStarted(updateData, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            mentorApiSlice.util.updateQueryData(
              'getShareableLink',
              {
                mentor: updateData.mentor,
                org: updateData.org,
                // @ts-expect-error - userId may not match expected API parameter type
                userId: updateData.userId,
              },
              (draft) => {
                draft.enabled = updateData.requestBody?.enabled;
              },
            ),
          );
        } catch (err) {
          console.error('Error updating shareable link: ', err);
        }
      },
    }),
    deleteMentor: builder.mutation({
      ...buildEndpointFromDmService(AiMentorService.aiMentorOrgsUsersDestroy),
      invalidatesTags: ['mentors'],
    }),
    forkMentor: builder.mutation({
      ...buildEndpointFromDmService(AiMentorService.aiMentorOrgsUsersMentorsForkCreate),
      invalidatesTags: ['mentors'],
    }),
    getRecentlyAccessedMentors: builder.query({
      ...buildEndpointFromDmService(AiMentorService.aiMentorOrgsUsersRecentlyAccessedMentorsList),
      providesTags: ['mentors'],
    }),
    getModerationLogs: builder.query({
      ...buildEndpointFromDmService(AiMentorService.aiMentorOrgsUsersModerationLogsList),
      providesTags: ['moderationLogs'],
    }),
  }),
});

export const mentorApiReducer: typeof mentorApiSlice.reducer = mentorApiSlice.reducer;
export const {
  useCreateMentorMutation,
  useGetMentorsQuery,
  useLazyGetMentorsQuery,
  useEditMentorMutation,
  useSeedMentorsQuery,
  useLazySeedMentorsQuery,
  useGetMentorDetailsQuery,
  useLazyGetMentorDetailsQuery,
  useGetMentorSettingsQuery,
  useLazyGetMentorSettingsQuery,
  useGetMentorPublicSettingsQuery,
  useLazyGetMentorPublicSettingsQuery,
  useUpdateMentorVisibilityStatusMutation,
  useGetFreeUsageCountQuery,
  useLazyGetFreeUsageCountQuery,
  useCreateShareableLinkMutation,
  useGetShareableLinkQuery,
  useLazyGetShareableLinkQuery,
  useGetShareableLinkPublicQuery,
  useLazyGetShareableLinkPublicQuery,
  useRevokeShareableLinkMutation,
  useUpdateShareableLinkMutation,
  useDeleteMentorMutation,
  useForkMentorMutation,
  useGetPublicMentorsQuery,
  useLazyGetPublicMentorsQuery,
  useGetRecentlyAccessedMentorsQuery,
  useLazyGetRecentlyAccessedMentorsQuery,
  useGetModerationLogsQuery,
  useLazyGetModerationLogsQuery,
} = mentorApiSlice;
