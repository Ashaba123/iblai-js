// Provider field mappings for external provider credentials
export const providerFields: Record<string, string[]> = {
  google: ["private_key", "type", "auth_uri", "client_id", "token_uri", "project_id", "client_email", "developer_key", "private_key_id", "universe_domain", "client_x509_cert_url", "auth_provider_x509_cert_url"],
  serper: ["key"],
  dropbox: ["appKey"],
  openai: ["key"],
  azure_openai: ["key", "host", "version", "deployment"],
  //"gemini-flash": ["key"],
  groq: ["key"],
  github: ["key", "token", "username"],
  xai: ["key"]
};

export const providerRealNames: Record<string, string> = {
  google: "Google",
  serper: "Serper",
  dropbox: "Dropbox",
  openai: "OpenAI",
  azure_openai: "Azure OpenAI",
  groq: "Groq",
  onedrive: "One Drive",
  drive: "Drive",
  gemini_google_api_key: "Gemini",
  github: "GitHub",
  xai: "xAI",
  nvidia: "NVIDIA",
  perplexity: "Perplexity",
  anthropic: "Anthropic",
  deepseek: "DeepSeek",
  microsoft: "Microsoft",
};