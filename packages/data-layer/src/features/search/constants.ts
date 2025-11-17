import { SERVICES } from '@data-layer/constants';

export const CUSTOM_AI_SEARCH_REDUCER_PATH = 'customAiSearchApiSlicePath';

export const CUSTOM_AI_SEARCH_ENDPOINTS = {
  GET_RECOMMENDATIONS_AI_SEARCH: {
    service: SERVICES.DM,
    path: () => `/api/ai-search/recommendations/`,
  },
  GET_RECOMMENDED_PROMPTS_LIST: {
    service: SERVICES.DM,
    path: () => `/api/ai-search/prompts/`,
  },
  CREATE_RECOMMENDED_PROMPT: {
    service: SERVICES.DM,
    path: () => `/api/ai-search/prompts/`,
  },
  UPDATE_RECOMMENDED_PROMPT: {
    service: SERVICES.DM,
    path: () => `/api/ai-search/prompts/`,
  },
  DELETE_RECOMMENDED_PROMPT: {
    service: SERVICES.DM,
    path: () => `/api/ai-search/prompts/`,
  },
};

export const CUSTOM_AI_SEARCH_QUERY_KEYS = {
  GET_RECOMMENDATIONS_AI_SEARCH: () => ['GET_RECOMMENDATIONS_AI_SEARCH'],
  GET_PROMPTS_LIST: () => ['GET_PROMPTS_LIST'],
  CREATE_PROMPT: () => ['CREATE_PROMPT'],
  UPDATE_PROMPT: () => ['UPDATE_PROMPT'],
  DELETE_PROMPT: () => ['DELETE_PROMPT'],
};
