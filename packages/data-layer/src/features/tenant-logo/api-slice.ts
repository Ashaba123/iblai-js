import { createApi } from "@reduxjs/toolkit/query/react";
import { iblFetchBaseQuery } from "@data-layer/features/utils";
import { TENANT_LOGO_ENDPOINTS, TENANT_LOGO_REDUCER_PATH } from "./constants";

export const tenantLogoApiSlice = createApi({
  reducerPath: TENANT_LOGO_REDUCER_PATH,

  baseQuery: iblFetchBaseQuery,

  endpoints: (builder) => ({
    uploadLightLogo: builder.mutation<unknown, {org: string, formData: FormData}>({
      query: ({org, formData}) => ({
        url: TENANT_LOGO_ENDPOINTS.UPLOAD_LIGHT_LOGO.path(org),
        service: TENANT_LOGO_ENDPOINTS.UPLOAD_LIGHT_LOGO.service,
        body: formData,
        method: "POST",
        isJson: false,
      }),
    }),
    uploadDarkLogo: builder.mutation<unknown, {org: string, formData: FormData}>({
      query: ({org, formData}) => ({
        url: TENANT_LOGO_ENDPOINTS.UPLOAD_DARK_LOGO.path(org),
        service: TENANT_LOGO_ENDPOINTS.UPLOAD_DARK_LOGO.service,
        body: formData,
        method: "POST",
        isJson: false,
      }),
    }),
  }),
});

export const {
  useUploadLightLogoMutation,
  useUploadDarkLogoMutation,
} = tenantLogoApiSlice;
