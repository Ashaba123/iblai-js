export interface Disclaimer {
  id: string;
  content: string;
  scope: string;
  mentorId?: string;
  created_at: string;
  updated_at: string;
  has_agreed: boolean;
  active: boolean;
}

export type DisclaimersFetchResponse = {
  results: Disclaimer[];
  count: number;
  next: string | null;
  previous: string | null;
};

export type GetDisclaimersParams = {
  scope?: string;
  mentor_id?: string;
};

export type GetDisclaimersArgs = {
  org: string;
  userId: string;
  params?: GetDisclaimersParams;
};

export type CreateDisclaimerRequest = {
  content: string;
  scope: string;
  mentors?: string[];
  active?: boolean;
};

export type CreateDisclaimerArgs = {
  org: string;
  userId: string;
  formData: CreateDisclaimerRequest;
};

export type UpdateDisclaimerRequest = {
  content?: string;
  scope?: string;
  mentorId?: string;
  active?: boolean;
};

export type UpdateDisclaimerArgs = {
  id: string;
  org: string;
  userId: string;
  formData: UpdateDisclaimerRequest;
};

export type DeleteDisclaimerArgs = {
  id: string;
  org: string;
  userId: string;
};

export type DisclaimerAgreement = {
  id: string;
  disclaimer_id: string;
  user_id: string;
  agreed_at: string;
};

export type AgreeToDisclaimerRequest = {
  disclaimer: string;
};

export type AgreeToDisclaimerArgs = {
  org: string;
  userId: string;
  formData: AgreeToDisclaimerRequest;
};
