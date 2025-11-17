import { CatalogService, OpenAPI, PaginatedProgramInvitation } from '@iblai/iblai-api';
import { createApi } from '@reduxjs/toolkit/query/react';

import {
  buildEndpointFromDmService,
  buildEndpointFromDmServiceLegacy,
  buildEndpointFromService,
} from '../utils';
import { iblFakeBaseQuery } from '@data-layer/core';
import { SERVICES } from '@data-layer/constants';

export const catalogApiSlice = createApi({
  // TODO: replace to catalogSlice
  reducerPath: 'catalogApiSlice',

  baseQuery: iblFakeBaseQuery,

  tagTypes: [
    'catalog',
    'reported-skills',
    'desired-skills',
    'skills-points',
    'user-assigned-pathways',
    'user-enrolled-pathways',
    'user-enrolled-programs',
    'user-catalog-pathways',
    'catalog-roles',
    'catalog-invitations-course',
    'catalog-invitations-program',
  ],

  endpoints: (builder) => ({
    getUserReportedSkills: builder.query({
      ...buildEndpointFromDmServiceLegacy(CatalogService.catalogSkillsReportedRetrieve),
      providesTags: ['reported-skills'],
    }),
    getUserSkillsPoints: builder.query({
      ...buildEndpointFromDmServiceLegacy(CatalogService.catalogMilestonesSkillPointsUserRetrieve),
      providesTags: ['skills-points'],
    }),
    getUserDesiredSkills: builder.query({
      ...buildEndpointFromDmServiceLegacy(CatalogService.catalogSkillsDesiredRetrieve),
      providesTags: ['desired-skills'],
    }),
    createOrUpdateUserReportedSkill: builder.mutation({
      ...buildEndpointFromDmServiceLegacy(CatalogService.catalogSkillsReportedCreate),
      invalidatesTags: ['reported-skills'],
    }),
    createOrUpdateUserDesiredSkill: builder.mutation({
      ...buildEndpointFromDmServiceLegacy(CatalogService.catalogSkillsDesiredCreate),
      invalidatesTags: ['desired-skills'],
    }),
    getUserAssignedPathways: builder.query({
      ...buildEndpointFromDmServiceLegacy(CatalogService.catalogSuggestionsPathwayUserRetrieve),
      providesTags: ['user-assigned-pathways'],
    }),
    getUserEnrolledPathways: builder.query({
      ...buildEndpointFromDmServiceLegacy(CatalogService.catalogEnrollmentPathwaysRetrieve),
      providesTags: ['user-enrolled-pathways'],
    }),
    getUserEnrolledPrograms: builder.query({
      ...buildEndpointFromDmServiceLegacy(CatalogService.catalogEnrollmentProgramsRetrieve),
      providesTags: ['user-enrolled-programs'],
    }),
    getEnrollmentCourseSearch: builder.query({
      ...buildEndpointFromDmServiceLegacy(CatalogService.catalogEnrollmentCoursesSearchRetrieve),
    }),
    getResourceSearch: builder.query({
      ...buildEndpointFromDmServiceLegacy(CatalogService.catalogResourcesList),
    }),
    createCatalogPathway: builder.mutation({
      ...buildEndpointFromDmServiceLegacy(CatalogService.catalogPathwaysCreate),
      invalidatesTags: ['user-catalog-pathways'],
    }),
    createCatalogRole: builder.mutation({
      ...buildEndpointFromDmServiceLegacy(CatalogService.catalogRolesDesiredCreate),
      invalidatesTags: ['catalog-roles'],
    }),
    getPathwayCompletion: builder.query({
      ...buildEndpointFromDmServiceLegacy(
        CatalogService.catalogMilestonesCompletionsPathwayQueryRetrieve,
      ),
    }),
    getProgramCompletion: builder.query({
      ...buildEndpointFromDmServiceLegacy(
        CatalogService.catalogMilestonesCompletionsProgramQueryRetrieve,
      ),
    }),
    createCatalogPathwayEnrollment: builder.mutation({
      ...buildEndpointFromDmServiceLegacy(CatalogService.catalogEnrollmentPathwaysCreate),
      invalidatesTags: ['user-enrolled-pathways'],
    }),
    createCatalogPathwaySelfEnrollment: builder.mutation({
      ...buildEndpointFromDmServiceLegacy(CatalogService.catalogEnrollmentPathwaysSelfCreate),
      invalidatesTags: ['user-enrolled-pathways'],
    }),
    createCatalogProgramSelfEnrollment: builder.mutation({
      ...buildEndpointFromDmServiceLegacy(CatalogService.catalogEnrollmentProgramsSelfCreate),
      invalidatesTags: ['user-enrolled-programs'],
    }),

    getPathwayList: builder.query({
      ...buildEndpointFromDmServiceLegacy(CatalogService.catalogPathwaysList),
    }),
    getProgramList: builder.query({
      ...buildEndpointFromDmServiceLegacy(CatalogService.catalogProgramsList),
    }),
    createCatalogInvitationBulk: builder.mutation({
      ...buildEndpointFromDmService(CatalogService.catalogInvitationsPlatformBulkCreate),
    }),
    createCatalogInvitationProgram: builder.mutation({
      ...buildEndpointFromDmService(CatalogService.catalogInvitationsProgramCreate),
    }),
    createCatalogInvitationCourse: builder.mutation({
      ...buildEndpointFromDmService(CatalogService.catalogInvitationsCourseCreate),
    }),
    createCatalogInvitationCourseBulk: builder.mutation({
      ...buildEndpointFromDmService(CatalogService.catalogInvitationsCourseBulkCreate),
      invalidatesTags: ['catalog-invitations-course'],
    }),
    createCatalogInvitationProgramBulk: builder.mutation({
      ...buildEndpointFromDmService(CatalogService.catalogInvitationsProgramBulkCreate),
      invalidatesTags: ['catalog-invitations-program'],
    }),
    getCatalogInvitationsCourse: builder.query({
      ...buildEndpointFromDmService(CatalogService.catalogInvitationsCourseRetrieve),
      providesTags: ['catalog-invitations-course'],
    }),
    getCatalogInvitationsProgram: builder.query({
      ...buildEndpointFromService(
        SERVICES.DM,
        async (args: {
          platform_key: string;
          page?: number;
          page_size?: number;
          program_key?: string;
          email?: string;
          active?: boolean;
          sort?: string;
          source?: string;
          username?: string;
          verbose?: boolean;
        }) => {
          const queryParams = new URLSearchParams({ ...args } as unknown as Record<string, string>);
          const queryString = queryParams.toString();
          const url = `${OpenAPI.BASE}/api/catalog/invitations/program/${queryString ? `?${queryString}` : ''}`;

          const response = await fetch(url, {
            method: 'GET',
            headers: OpenAPI.HEADERS as Record<string, string>,
          });

          if (!response.ok) {
            const error: any = new Error('Failed to fetch program invitations');
            error.status = response.status;
            error.body = await response.text();
            throw error;
          }

          return response.json() as unknown as PaginatedProgramInvitation;
        },
      ),
      providesTags: ['catalog-invitations-program'],
    }),
  }),
});

export const {
  useGetUserReportedSkillsQuery,
  useLazyGetUserReportedSkillsQuery,
  useGetUserSkillsPointsQuery,
  useLazyGetUserSkillsPointsQuery,
  useGetUserDesiredSkillsQuery,
  useLazyGetUserDesiredSkillsQuery,
  useCreateOrUpdateUserReportedSkillMutation,
  useCreateOrUpdateUserDesiredSkillMutation,
  useGetUserAssignedPathwaysQuery,
  useGetUserEnrolledPathwaysQuery,
  useLazyGetUserAssignedPathwaysQuery,
  useLazyGetUserEnrolledPathwaysQuery,
  useGetUserEnrolledProgramsQuery,
  useLazyGetUserEnrolledProgramsQuery,
  useGetEnrollmentCourseSearchQuery,
  useLazyGetEnrollmentCourseSearchQuery,
  useCreateCatalogPathwayMutation,
  useCreateCatalogRoleMutation,
  useGetResourceSearchQuery,
  useLazyGetResourceSearchQuery,
  useGetPathwayCompletionQuery,
  useGetProgramCompletionQuery,
  useLazyGetPathwayCompletionQuery,
  useLazyGetProgramCompletionQuery,
  useCreateCatalogPathwayEnrollmentMutation,
  useCreateCatalogPathwaySelfEnrollmentMutation,
  useCreateCatalogProgramSelfEnrollmentMutation,
  useGetPathwayListQuery,
  useLazyGetPathwayListQuery,
  useGetProgramListQuery,
  useLazyGetProgramListQuery,
  useCreateCatalogInvitationBulkMutation,
  useCreateCatalogInvitationProgramMutation,
  useCreateCatalogInvitationCourseMutation,
  useGetCatalogInvitationsCourseQuery,
  useLazyGetCatalogInvitationsCourseQuery,
  useGetCatalogInvitationsProgramQuery,
  useLazyGetCatalogInvitationsProgramQuery,
  useCreateCatalogInvitationCourseBulkMutation,
  useCreateCatalogInvitationProgramBulkMutation,
} = catalogApiSlice;
