export const SUBSCRIPTION_V2_TRIGGERS = {
  PRICING_MODAL: "TRIGGER_PRICING_MODAL",
  //SUBSCRIBE_USER: "TRIGGER_SUBSCRIBE_USER",
  TOP_UP_CREDIT: "TRIGGER_TOP_UP_CREDIT",
  CONTACT_ADMIN: "TRIGGER_CONTACT_ADMIN",
  BILLING_PAGE: "TRIGGER_BILLING_PAGE",
};

export const SUBSCRIPTION_MESSAGES = {
  CREDIT_EXHAUSTED: {
    FREE_PACKAGE: ({ expiryDate }: { expiryDate: string }) => {
      return `You've run out of credits on the Free plan${expiryDate ? `, but they'll be automatically reset on ${expiryDate}`: ""}. If you'd like to continue to use the platform now, please upgrade your plan.`;
    },
    STARTER_PACKAGE: ({ expiryDate }: { expiryDate: string }) => {
      return `You've run out of credits on the Starter plan${expiryDate ? `, but they'll be automatically reset on ${expiryDate}`: ""}. If you'd like to continue to use the platform now, please upgrade your plan.`;
    },
    PRO_PACKAGE: ({ expiryDate }: { expiryDate: string }) => {
      return `You've run out of credits on the Pro plan${expiryDate ? `, but they'll be automatically reset on ${expiryDate}`: ""}. If you'd like to continue to use the platform, please add credits.`;
    },
    STUDENT_UNDER_PAID_PACKAGE_EMAIL_BODY: ({
      currentTenantOrg,
      userEmail,
    }: {
      currentTenantOrg: string;
      userEmail: string;
    }) => {
      return `Hey team,

This is an auto-generated message.

I'm contacting you because ${currentTenantOrg} has run out of credits.

Have a great day!

Best,

${userEmail}`;
    },
    STUDENT_UNDER_PAID_PACKAGE_EMAIL_SUBJECT: ({
      currentTenantOrg,
    }: {
      currentTenantOrg: string;
    }) => {
      return `Out of credits: ${currentTenantOrg}`;
    },
    ADMIN: "You’ve used all your credits.",
    STUDENT:
      "Your organization has run out of credits. Please contact your administrator to continue to use the platform.",
    FREE_TRIAL_LIMIT: "Upgrade to create your own mentors.",
    NO_APP: "Upgrade to create your own mentors.",
  },
  ACTION_BUTTONS: {
    FREE_PACKAGE: "Upgrade Plan 😎",
    STARTER_PACKAGE: "Upgrade Plan 😎",
    PRO_PACKAGE: "Add Credits 😎",
    UPGRADE: "Upgrade Plan 😎",
    TOP_UP: "Add Credits 😎",
    CONTACT_ADMIN: "Contact Now 🫶",
    ADD_CREDITS: "Add Credits 😎",
  },
  TOAST_MESSAGES: {
    PRICING_PAGE_LOAD_ERROR:
      "Error loading pricing page data. Please try again later.",
    TOP_UP_CREDIT_TRIGGER_LOAD_ERROR:
      "Error loading top up credit trigger data. Please try again later.",
    REDIRECTING_BILLING_PAGE: "Redirecting to billing page...",
    BILLING_PAGE_TRIGGER_LOAD_ERROR:
      "Error loading billing page data. Please try again later.",
  },
};

export const SUBSCRIPTION_PACKAGES = {
  PRE_FREE_PACKAGE: "pre_free",
  FREE_PACKAGE: (productName: string) => (`${productName}-ai-free`),
  STARTER_PACKAGE: (productName: string) => (`${productName}-ai-starter`),
  PRO_PACKAGE: (productName: string) => (`${productName}-ai-pro`),
};
