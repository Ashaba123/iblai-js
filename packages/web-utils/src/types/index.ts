import { z } from "zod";

export const userDataSchema = z.object({
  user_display_name: z.string(),
  user_email: z.string().email(),
  user_fullname: z.string(),
  user_id: z.number(),
  user_nicename: z.string(),
});

export const tenantSchema = z.object({
  key: z.string(),
  is_admin: z.boolean(),
  org: z.string(),
});

export const tenantKeySchema = z.string().min(1);

export type TenantKeyMentorIdParams = {
  tenantKey: string;
  mentorId: string;
};

export interface TopTrialBannerProps {
  parentContainer: string;
  bannerText?: string;
  onUpgrade?: string;
  loading?: boolean;
  tooltipText?: string;
}

export interface Prompt {
  type: "static" | "human" | "ai";
  icon?: string;
  summary?: string;
  content?: string;
  proactive?: boolean;
  hide?: boolean;
  tag?: string;
}

export interface Tenant {
  key: string;
  is_admin: boolean;
  org: string;
  name?: string;
  platform_name: string;
  is_advertising?: boolean;
}

export * from "./chat";
export * from "./subscription";
export * from "./file-upload";
