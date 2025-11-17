import { SkillsService } from '@iblai/iblai-api';
import { createApi } from '@reduxjs/toolkit/query/react';

import { buildEndpointFromDmServiceLegacy } from '../utils';
import { iblFakeBaseQuery } from '@data-layer/core';

export const skillsApiSlice = createApi({
  // TODO: replace to catalogSlice
  reducerPath: 'skillsApiSlice',

  baseQuery: iblFakeBaseQuery,

  tagTypes: ['skills'],

  endpoints: (builder) => ({
    getReportedSkills: builder.query({
      ...buildEndpointFromDmServiceLegacy(
        SkillsService.skillsOrgsSkillsUsersReportedSkillsRetrieve,
      ),
    }),
    getSkillsPointsPercentile: builder.query({
      ...buildEndpointFromDmServiceLegacy(
        SkillsService.skillsOrgsSkillsUsersPointPercentileRetrieve,
      ),
    }),
    getDesiredSkills: builder.query({
      ...buildEndpointFromDmServiceLegacy(SkillsService.skillsOrgsSkillsUsersDesiredSkillsRetrieve),
    }),
    getUserEarnedSkills: builder.query({
      ...buildEndpointFromDmServiceLegacy(SkillsService.skillsOrgsSkillsUsersRetrieve),
    }),
  }),
});

export const {
  useGetReportedSkillsQuery,
  useLazyGetReportedSkillsQuery,
  useGetSkillsPointsPercentileQuery,
  useLazyGetSkillsPointsPercentileQuery,
  useGetDesiredSkillsQuery,
  useLazyGetDesiredSkillsQuery,
  useGetUserEarnedSkillsQuery,
  useLazyGetUserEarnedSkillsQuery,
} = skillsApiSlice;
