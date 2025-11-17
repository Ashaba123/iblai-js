import type {
  Company,
  Education,
  Experience,
  Institution,
  InstitutionTypeEnum,
} from '@iblai/iblai-api';
import { createApi } from '@reduxjs/toolkit/query/react';

import { iblFakeBaseQuery } from '@data-layer/core';
import Config from '@data-layer/config';
import { SERVICES } from '@data-layer/constants';
import { getHeaders } from '../utils';

type OrgUsernameArg =
  | { org: string; username: string }
  | [string, string]
  | [{ org: string; username: string }];

interface EducationMutationArgs {
  org: string;
  username: string;
  education: Partial<Education> & { institution_id: number };
}

interface EducationUpdateArgs extends EducationMutationArgs {
  education_id: string | number;
}

interface ExperienceMutationArgs {
  org: string;
  username: string;
  experience: Partial<Experience> & { company_id: number };
}

interface ExperienceUpdateArgs extends ExperienceMutationArgs {
  experience_id: string | number;
}

interface InstitutionMutationArgs {
  org: string;
  username: string;
  institution: Partial<Institution> & {
    institution_type: InstitutionTypeEnum | string;
    established_year?: number | string;
  };
}

interface CompanyMutationArgs {
  org: string;
  username: string;
  company: Partial<Company>;
}

interface ResumeMutationArgs {
  org: string;
  username: string;
  resume: FormData;
  method?: 'PUT' | 'POST';
}

const resolveOrgUsername = (arg: OrgUsernameArg): { org: string; username: string } => {
  if (Array.isArray(arg)) {
    if (arg.length === 1 && typeof arg[0] === 'object' && arg[0] !== null) {
      const value = arg[0] as { org: string; username: string };
      return { org: value.org, username: value.username };
    }
    const [org, username] = arg as [string, string];
    return { org: String(org), username: String(username) };
  }
  return { org: arg.org, username: arg.username };
};

const buildCareerUrl = (path: string) => `${Config.dmUrl}${path}`;

const createAuthorizationHeaders = async () => {
  const authHeaders = await getHeaders(SERVICES.DM);
  const headers = new Headers();
  Object.entries(authHeaders ?? {}).forEach(([key, value]) => {
    if (value) {
      headers.set(key, value);
    }
  });
  return headers;
};

const parseResponse = async <T>(response: Response): Promise<T | undefined> => {
  if (response.status === 204) {
    return undefined;
  }

  const text = await response.text();
  if (!text) {
    return undefined;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    return undefined;
  }
};

const createErrorResult = (status: number | string, data: unknown) => ({
  error: {
    status,
    data,
  },
});

const performCareerRequest = async <T>(
  path: string,
  options: {
    method?: string;
    body?: any;
    isFormData?: boolean;
    contentType?: string;
  } = {},
) => {
  try {
    const headers = await createAuthorizationHeaders();
    if (!options.isFormData) {
      const contentType = options.contentType ?? 'application/json';
      headers.set('Content-Type', contentType);
    }

    const response = await fetch(buildCareerUrl(path), {
      method: options.method ?? 'GET',
      body: options.body ?? null,
      headers,
    });

    if (!response.ok) {
      const errorData = await parseResponse<any>(response);
      return createErrorResult(response.status, errorData ?? response.statusText);
    }

    const data = await parseResponse<T>(response);
    return { data };
  } catch (error) {
    return createErrorResult(
      'FETCH_ERROR',
      error instanceof Error ? error.message : 'Failed to execute career request',
    );
  }
};

export const careerApiSlice = createApi({
  reducerPath: 'careerApiSlice',

  baseQuery: iblFakeBaseQuery,

  tagTypes: [
    'user-education',
    'user-experience',
    'user-institution',
    'user-company',
    'user-resume',
  ],

  endpoints: (builder) => ({
    getUserEducation: builder.query<Education[] | undefined, OrgUsernameArg>({
      queryFn: async (arg) => {
        const { org, username } = resolveOrgUsername(arg);
        return performCareerRequest<Education[]>(
          `/api/career/orgs/${org}/education/users/${username}/`,
        );
      },
      providesTags: ['user-education'],
    }),
    createUserEducation: builder.mutation<Education | undefined, EducationMutationArgs>({
      queryFn: async ({ org, username, education }) =>
        performCareerRequest<Education>(`/api/career/orgs/${org}/education/users/${username}/`, {
          method: 'POST',
          body: JSON.stringify(education),
        }),
      invalidatesTags: ['user-education'],
    }),
    updateUserEducation: builder.mutation<Education | undefined, EducationUpdateArgs>({
      queryFn: async ({ org, username, education_id, education }) =>
        performCareerRequest<Education>(
          `/api/career/orgs/${org}/education/users/${username}/?id=${education_id}`,
          {
            method: 'PUT',
            body: JSON.stringify(education),
          },
        ),
      invalidatesTags: ['user-education'],
    }),
    deleteUserEducation: builder.mutation<
      undefined,
      { org: string; username: string; education_id: string | number }
    >({
      queryFn: async ({ org, username, education_id }) =>
        performCareerRequest(
          `/api/career/orgs/${org}/education/users/${username}/?id=${education_id}`,
          {
            method: 'DELETE',
          },
        ),
      invalidatesTags: ['user-education'],
    }),
    getUserExperience: builder.query<Experience[] | undefined, OrgUsernameArg>({
      queryFn: async (arg) => {
        const { org, username } = resolveOrgUsername(arg);
        return performCareerRequest<Experience[]>(
          `/api/career/orgs/${org}/experience/users/${username}/`,
        );
      },
      providesTags: ['user-experience'],
    }),
    createUserExperience: builder.mutation<Experience | undefined, ExperienceMutationArgs>({
      queryFn: async ({ org, username, experience }) =>
        performCareerRequest<Experience>(`/api/career/orgs/${org}/experience/users/${username}/`, {
          method: 'POST',
          body: JSON.stringify(experience),
        }),
      invalidatesTags: ['user-experience'],
    }),
    updateUserExperience: builder.mutation<Experience | undefined, ExperienceUpdateArgs>({
      queryFn: async ({ org, username, experience_id, experience }) =>
        performCareerRequest<Experience>(
          `/api/career/orgs/${org}/experience/users/${username}/?id=${experience_id}`,
          {
            method: 'PUT',
            body: JSON.stringify(experience),
          },
        ),
      invalidatesTags: ['user-experience'],
    }),
    deleteUserExperience: builder.mutation<
      undefined,
      { org: string; username: string; experience_id: string | number }
    >({
      queryFn: async ({ org, username, experience_id }) =>
        performCareerRequest(
          `/api/career/orgs/${org}/experience/users/${username}/?id=${experience_id}`,
          {
            method: 'DELETE',
          },
        ),
      invalidatesTags: ['user-experience'],
    }),
    getUserInstitutions: builder.query<Institution[] | undefined, OrgUsernameArg>({
      queryFn: async (arg) => {
        const { org, username } = resolveOrgUsername(arg);
        return performCareerRequest<Institution[]>(
          `/api/career/orgs/${org}/institutions/users/${username}/`,
        );
      },
      providesTags: ['user-institution'],
    }),
    createUserInstitution: builder.mutation<Institution | undefined, InstitutionMutationArgs>({
      queryFn: async ({ org, username, institution }) =>
        performCareerRequest<Institution>(
          `/api/career/orgs/${org}/institutions/users/${username}/`,
          {
            method: 'POST',
            body: JSON.stringify(institution),
          },
        ),
      invalidatesTags: ['user-institution'],
    }),
    getUserCompanies: builder.query<Company[] | undefined, OrgUsernameArg>({
      queryFn: async (arg) => {
        const { org, username } = resolveOrgUsername(arg);
        return performCareerRequest<Company[]>(
          `/api/career/orgs/${org}/companies/users/${username}/`,
        );
      },
      providesTags: ['user-company'],
    }),
    createUserCompany: builder.mutation<Company | undefined, CompanyMutationArgs>({
      queryFn: async ({ org, username, company }) =>
        performCareerRequest<Company>(`/api/career/orgs/${org}/companies/users/${username}/`, {
          method: 'POST',
          body: JSON.stringify(company),
        }),
      invalidatesTags: ['user-company'],
    }),
    getUserResume: builder.query<any, OrgUsernameArg>({
      queryFn: async (arg) => {
        const { org, username } = resolveOrgUsername(arg);
        return performCareerRequest(`/api/career/resume/orgs/${org}/users/${username}/`);
      },
      providesTags: ['user-resume'],
    }),
    createUserResume: builder.mutation<any, ResumeMutationArgs>({
      queryFn: async ({ org, username, resume, method = 'PUT' }) =>
        performCareerRequest(`/api/career/resume/orgs/${org}/users/${username}/`, {
          method,
          body: resume,
          isFormData: true,
        }),
      invalidatesTags: ['user-resume'],
    }),
  }),
});

export const {
  useGetUserEducationQuery,
  useLazyGetUserEducationQuery,
  useCreateUserEducationMutation,
  useUpdateUserEducationMutation,
  useDeleteUserEducationMutation,
  useGetUserExperienceQuery,
  useLazyGetUserExperienceQuery,
  useCreateUserExperienceMutation,
  useUpdateUserExperienceMutation,
  useDeleteUserExperienceMutation,
  useGetUserInstitutionsQuery,
  useLazyGetUserInstitutionsQuery,
  useCreateUserInstitutionMutation,
  useGetUserCompaniesQuery,
  useLazyGetUserCompaniesQuery,
  useCreateUserCompanyMutation,
  useGetUserResumeQuery,
  useLazyGetUserResumeQuery,
  useCreateUserResumeMutation,
} = careerApiSlice;
