import type React from 'react';
// Define error types and their corresponding data
export interface ErrorData {
  code: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

// Icon components for different error types
export const ErrorIcons = {
  notFound: (
    <svg
      width="250"
      height="250"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="10"
        y="20"
        width="80"
        height="60"
        rx="4"
        stroke="#222222"
        strokeWidth="6"
        fill="none"
      />
      <line x1="10" y1="40" x2="90" y2="40" stroke="#222222" strokeWidth="6" />
      <path d="M30 60 L45 75" stroke="#222222" strokeWidth="6" strokeLinecap="round" />
      <path d="M45 60 L30 75" stroke="#222222" strokeWidth="6" strokeLinecap="round" />
      <path d="M70 60 L85 75" stroke="#222222" strokeWidth="6" strokeLinecap="round" />
      <path d="M85 60 L70 75" stroke="#222222" strokeWidth="6" strokeLinecap="round" />
      <path
        d="M50 85 C 60 75, 65 75, 75 85"
        stroke="#222222"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  ),
  serverError: (
    <svg
      width="250"
      height="250"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="20"
        y="15"
        width="60"
        height="70"
        rx="4"
        stroke="#222222"
        strokeWidth="6"
        fill="none"
      />
      <line x1="20" y1="35" x2="80" y2="35" stroke="#222222" strokeWidth="6" />
      <line x1="20" y1="55" x2="80" y2="55" stroke="#222222" strokeWidth="6" />
      <line
        x1="35"
        y1="25"
        x2="45"
        y2="25"
        stroke="#222222"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <line
        x1="35"
        y1="45"
        x2="45"
        y2="45"
        stroke="#222222"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <line
        x1="35"
        y1="65"
        x2="45"
        y2="65"
        stroke="#222222"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <line
        x1="35"
        y1="75"
        x2="65"
        y2="75"
        stroke="#222222"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  ),
  forbidden: (
    <svg
      width="250"
      height="250"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" r="35" stroke="#222222" strokeWidth="6" fill="none" />
      <line
        x1="25"
        y1="25"
        x2="75"
        y2="75"
        stroke="#222222"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  ),
  unauthorized: (
    <svg
      width="250"
      height="250"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="30"
        y="40"
        width="40"
        height="35"
        rx="4"
        stroke="#222222"
        strokeWidth="6"
        fill="none"
      />
      <path d="M40 40 V30 C40 20, 60 20, 60 30 V40" stroke="#222222" strokeWidth="6" fill="none" />
      <circle cx="50" cy="60" r="5" fill="#222222" />
      <line
        x1="50"
        y1="65"
        x2="50"
        y2="75"
        stroke="#222222"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  ),
  timeout: (
    <svg
      width="250"
      height="250"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" r="35" stroke="#222222" strokeWidth="6" fill="none" />
      <line
        x1="50"
        y1="30"
        x2="50"
        y2="50"
        stroke="#222222"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <line
        x1="50"
        y1="50"
        x2="70"
        y2="60"
        stroke="#222222"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  ),
};

// Get error data based on error code
export function getErrorData(code: string): ErrorData {
  switch (code) {
    case '404':
      return {
        code: '404',
        title: 'Page Not Found',
        description:
          "We're sorry, the page you requested could not be found. Please go back to the home page",
        icon: ErrorIcons.notFound,
      };
    case '500':
      return {
        code: '500',
        title: 'Server Error',
        description:
          "We're sorry, something went wrong on our end. Please try again later or contact our <a class='text-blue-500' href='mailto:support@iblai.zendesk.com'>support team</a>.",
        icon: ErrorIcons.serverError,
      };
    case '403':
      return {
        code: '403',
        title: 'Access Forbidden',
        description:
          "You don't have permission to access this resource. Please contact our <a class='text-blue-500' href='mailto:support@iblai.zendesk.com'>support team</a>.",
        icon: ErrorIcons.forbidden,
      };
    case '401':
      return {
        code: '401',
        title: 'Unauthorized',
        description: 'You need to be logged in to access this page. Please sign in and try again.',
        icon: ErrorIcons.unauthorized,
      };
    case '408':
      return {
        code: '408',
        title: 'Request Timeout',
        description:
          "The server timed out waiting for the request. Please try again later or contact our <a class='text-blue-500' href='mailto:support@iblai.zendesk.com'>support team</a>.",
        icon: ErrorIcons.timeout,
      };
    default:
      return {
        code: code || 'Error',
        title: 'Something Went Wrong',
        description:
          "We encountered an unexpected error. Please try again or contact our <a class='text-blue-500' href='mailto:support@iblai.zendesk.com'>support team</a>.",
        icon: ErrorIcons.serverError,
      };
  }
}
