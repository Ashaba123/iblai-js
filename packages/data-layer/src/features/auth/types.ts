export interface Provider {
  name: string;
  loginUrl: string;
  iconClass: string;
}

type ContextData = {
  providers: Provider[];
};

export interface MfeContextResponse {
  context_data?: ContextData;
  contextData?: ContextData;
}

export interface AppleTokenRequest {
  access_token: string;
  redirect_uri: string;
  client_id: string;
  code: string;
}

export interface TokenResponse {
  axd_token: {
    token: string;
    expires: string;
  };
  dm_token: {
    token: string;
    expires: string;
  };
  user: any;
}

export interface JwtTokenResponse {
  jwt_token: string;
}
