import { createApi } from "@reduxjs/toolkit/query/react";
import { iblFetchBaseQuery } from "@data-layer/features/utils";
import { PROJECTS_CUSTOM_ENDPOINTS, PROJECTS_CUSTOM_REDUCER_PATH, PROJECTS_QUERY_KEYS } from "./constants";
import { 
  Project, 
  ProjectsFetchResponse, 
  GetProjectsArgs, 
  GetProjectDetailsArgs,
  CreateProjectArgs,
  UpdateProjectArgs,
  DeleteProjectArgs
} from "./types";

export const projectsApiSlice = createApi({
  reducerPath: PROJECTS_CUSTOM_REDUCER_PATH,

  tagTypes: [...PROJECTS_QUERY_KEYS.GET_PROJECTS(), ...PROJECTS_QUERY_KEYS.GET_PROJECT_DETAILS()],

  baseQuery: iblFetchBaseQuery,

  endpoints: (builder) => ({
    // User routes
    getUserProjects: builder.query<ProjectsFetchResponse, GetProjectsArgs>({
      query: (args) => {
        return {
          url: PROJECTS_CUSTOM_ENDPOINTS.GET_USER_PROJECTS.path(args.tenantKey, args.username!),
          params: args.params,
          service: PROJECTS_CUSTOM_ENDPOINTS.GET_USER_PROJECTS.service,
        };
      },
      providesTags: PROJECTS_QUERY_KEYS.GET_PROJECTS(),
    }),

    getUserProjectDetails: builder.query<Project, GetProjectDetailsArgs>({
      query: (args) => {
        return {
          url: PROJECTS_CUSTOM_ENDPOINTS.GET_USER_PROJECT_DETAILS.path(args.tenantKey, args.username!, args.id),
          service: PROJECTS_CUSTOM_ENDPOINTS.GET_USER_PROJECT_DETAILS.service,
        };
      },
      providesTags: PROJECTS_QUERY_KEYS.GET_PROJECT_DETAILS(),
    }),

    createUserProject: builder.mutation<Project, CreateProjectArgs>({
      query: (args) => {
        return {
          url: PROJECTS_CUSTOM_ENDPOINTS.CREATE_USER_PROJECT.path(args.tenantKey, args.username!),
          method: 'POST',
          body: args.data,
          service: PROJECTS_CUSTOM_ENDPOINTS.CREATE_USER_PROJECT.service,
        };
      },
      invalidatesTags: PROJECTS_QUERY_KEYS.GET_PROJECTS(),
    }),

    updateUserProject: builder.mutation<Project, UpdateProjectArgs>({
      query: (args) => {
        return {
          url: PROJECTS_CUSTOM_ENDPOINTS.UPDATE_USER_PROJECT.path(args.tenantKey, args.username!, args.id),
          method: 'PATCH',
          body: args.data,
          service: PROJECTS_CUSTOM_ENDPOINTS.UPDATE_USER_PROJECT.service,
        };
      },
      invalidatesTags: [...PROJECTS_QUERY_KEYS.GET_PROJECTS(), ...PROJECTS_QUERY_KEYS.GET_PROJECT_DETAILS()],
    }),

    deleteUserProject: builder.mutation<void, DeleteProjectArgs>({
      query: (args) => {
        return {
          url: PROJECTS_CUSTOM_ENDPOINTS.DELETE_USER_PROJECT.path(args.tenantKey, args.username!, args.id),
          method: 'DELETE',
          service: PROJECTS_CUSTOM_ENDPOINTS.DELETE_USER_PROJECT.service,
        };
      },
      invalidatesTags: PROJECTS_QUERY_KEYS.GET_PROJECTS(),
    }),

    // Admin routes
    getAdminProjects: builder.query<ProjectsFetchResponse, GetProjectsArgs>({
      query: (args) => {
        return {
          url: PROJECTS_CUSTOM_ENDPOINTS.GET_ADMIN_PROJECTS.path(args.tenantKey),
          params: args.params,
          service: PROJECTS_CUSTOM_ENDPOINTS.GET_ADMIN_PROJECTS.service,
        };
      },
      providesTags: PROJECTS_QUERY_KEYS.GET_PROJECTS(),
    }),

    getAdminProjectDetails: builder.query<Project, GetProjectDetailsArgs>({
      query: (args) => {
        return {
          url: PROJECTS_CUSTOM_ENDPOINTS.GET_ADMIN_PROJECT_DETAILS.path(args.tenantKey, args.id),
          service: PROJECTS_CUSTOM_ENDPOINTS.GET_ADMIN_PROJECT_DETAILS.service,
        };
      },
      providesTags: PROJECTS_QUERY_KEYS.GET_PROJECT_DETAILS(),
    }),

    createAdminProject: builder.mutation<Project, CreateProjectArgs>({
      query: (args) => {
        return {
          url: PROJECTS_CUSTOM_ENDPOINTS.CREATE_ADMIN_PROJECT.path(args.tenantKey),
          method: 'POST',
          body: args.data,
          service: PROJECTS_CUSTOM_ENDPOINTS.CREATE_ADMIN_PROJECT.service,
        };
      },
      invalidatesTags: PROJECTS_QUERY_KEYS.GET_PROJECTS(),
    }),

    updateAdminProject: builder.mutation<Project, UpdateProjectArgs>({
      query: (args) => {
        return {
          url: PROJECTS_CUSTOM_ENDPOINTS.UPDATE_ADMIN_PROJECT.path(args.tenantKey, args.id),
          method: 'PATCH',
          body: args.data,
          service: PROJECTS_CUSTOM_ENDPOINTS.UPDATE_ADMIN_PROJECT.service,
        };
      },
      invalidatesTags: [...PROJECTS_QUERY_KEYS.GET_PROJECTS(), ...PROJECTS_QUERY_KEYS.GET_PROJECT_DETAILS()],
    }),

    deleteAdminProject: builder.mutation<void, DeleteProjectArgs>({
      query: (args) => {
        return {
          url: PROJECTS_CUSTOM_ENDPOINTS.DELETE_ADMIN_PROJECT.path(args.tenantKey, args.id),
          method: 'DELETE',
          service: PROJECTS_CUSTOM_ENDPOINTS.DELETE_ADMIN_PROJECT.service,
        };
      },
      invalidatesTags: PROJECTS_QUERY_KEYS.GET_PROJECTS(),
    }),
  }),
});

export const {
  // User routes
  useGetUserProjectsQuery,
  useLazyGetUserProjectsQuery,
  useGetUserProjectDetailsQuery,
  useLazyGetUserProjectDetailsQuery,
  useCreateUserProjectMutation,
  useUpdateUserProjectMutation,
  useDeleteUserProjectMutation,
  
  // Admin routes
  useGetAdminProjectsQuery,
  useLazyGetAdminProjectsQuery,
  useGetAdminProjectDetailsQuery,
  useLazyGetAdminProjectDetailsQuery,
  useCreateAdminProjectMutation,
  useUpdateAdminProjectMutation,
  useDeleteAdminProjectMutation,
} = projectsApiSlice;
