export const MENTOR_CHAT_DOCUMENTS_EXTENSIONS = [
  // Media types
  "video/*",
  "audio/*",
  "image/*",

  // Document types
  ".docx",
  ".xlsx",
  ".pptx",
  ".csv",
  ".md",
  ".txt",
  ".pdf",
];

export const ANONYMOUS_USERNAME = "anonymous";

export const MAX_INITIAL_WEBSOCKET_CONNECTION_ATTEMPTS = 3;

export const LOCAL_STORAGE_KEYS = {
  CURRENT_TENANT: "current_tenant",
  TENANTS: "tenants",
  REDIRECT_TO: "redirect-to",
  AUTH_TOKEN: "axd_token",
  TOKEN_EXPIRY: "axd_token_expires",
  USER_DATA: "userData",
  USER_TENANTS: "tenants",
  EDX_TOKEN_KEY: "edx_jwt_token",
  DM_TOKEN_KEY: "dm_token_key",
  DM_TOKEN_EXPIRES: "dm_token_expires",
};

export const TOOLS = {
  WEB_SEARCH: "web-search",
  WIKIPEDIA_SEARCH: "wikipedia-search",
  COURSE_CREATION: "course-creation",
  MCP: "mcp",
  IMAGE_GENERATION: "image-generation",
  IBL_PATHWAY_DOCUMENTS_RETRIEVER: "ibl-pathway-documents-retriever",
  TRAINED_DOCUMENTS: "trained-documents",
  IBL_SESSION_DOCUMENTS_RETRIEVER: "ibl-session-documents-retriever",
  PLAYWRIGHT_BROWSER: "playwright-browser",
  HUMAN_SUPPORT: "human-support",
  CODE_INTERPRETER: "code-interpreter",
  DEEP_RESEARCH: "deep-research",
  MEMORY: "memory",
  SCREEN_SHARE: "screen-share",
  POWERPOINT: "powerpoint",
  PROMPT: "prompt",
  QUIZ: "quiz",
  RUBRIC: "rubric",
  RESOURCE: "resource",
  LESSON_PLAN: "lesson-plan",
  SYLLABUS: "syllabus",
  CANVAS: "canvas",
  GOOGLE_SLIDES: "google-slides",
  GOOGLE_DOCUMENT: "google-docs",
} as const;
