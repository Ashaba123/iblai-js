import { SERVICES } from '@data-layer/constants';

export const EDX_PROCTORING_ENDPOINTS = {
  GET_EXAM_INFO: {
    service: SERVICES.LMS,
    path: (course_id: string): string =>
      `/api/edx_proctoring/v1/proctored_exam/attempt/course_id/${course_id}`,
  },
  UPDATE_EXAM_ATTEMPT: {
    service: SERVICES.LMS,
    path: (attemptID: number): string =>
      `/api/edx_proctoring/v1/proctored_exam/attempt/${attemptID}`,
  },
  START_EXAM: {
    service: SERVICES.LMS,
    path: (): string => `/api/edx_proctoring/v1/proctored_exam/attempt`,
  },
};
