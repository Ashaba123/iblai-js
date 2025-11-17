export const isJSON = (text: string): boolean => {
  if (typeof text !== "string") {
    return false;
  }
  try {
    JSON.parse(text);
    return true;
  } catch {
    return false;
  }
};

export const getInitials = (fullName: string) => {
  const names = fullName.split(" ");
  if (names.length === 1) {
    return names[0].substring(0, 2).toUpperCase();
  }
  return names
    .slice(0, 2)
    .map((name) => name.charAt(0).toUpperCase())
    .join("");
};

export const ALPHANUMERIC_32_REGEX = /^[a-zA-Z0-9]{32}$/;

export const isAlphaNumeric32 = (text: string) => {
  return ALPHANUMERIC_32_REGEX.test(text);
};

export const addProtocolToUrl = (url: string) => {
  if (!url.startsWith("http")) {
    return `https://${url}`;
  }
  return url;
};

export function getTimeAgo(createdAt: string) {
  const now = new Date();
  const created = new Date(createdAt);
  const diffInMilliseconds = now.getTime() - created.getTime();
  const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
  const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 60) {
    return `${diffInMinutes} min ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hrs ago`;
  } else {
    return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
  }
}

// Utility function to format relative time
export const formatRelativeTime = (timestamp: string): string => {
  const now = new Date();
  const date = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "Just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks === 1 ? "" : "s"} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths === 1 ? "" : "s"} ago`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} year${diffInYears === 1 ? "" : "s"} ago`;
};
