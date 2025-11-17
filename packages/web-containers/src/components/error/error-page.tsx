'use client';

import type React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/button';
import { getErrorData, type ErrorData } from '../../lib/error-utils';
import { sanitizeHtml } from '../../lib/utils';

interface ErrorPageProps {
  errorCode: string;
  supportEmail?: string;
  showSupportButton?: boolean;
  supportButtonText?: string;
  customTitle?: string;
  customDescription?: string;
  customIcon?: React.ReactNode;
  showHomeButton?: boolean;
  homeButtonText?: string;
  homeButtonHref?: string;
  showReset?: boolean;
  resetButtonText?: string;
  reset?: () => void;
}

export function ErrorPage({
  errorCode,
  customTitle,
  customDescription,
  customIcon,
  supportEmail,
  showSupportButton = true,
  supportButtonText = 'Contact Support',
  showReset = false,
  showHomeButton = true,
  homeButtonText = 'Back to Home',
  homeButtonHref = '/',
  resetButtonText = 'Reset',
  reset,
}: ErrorPageProps) {
  // Get default error data based on error code
  const defaultErrorData: ErrorData = getErrorData(errorCode);

  // Use custom values if provided, otherwise use defaults
  const title = customTitle || defaultErrorData.title;
  const description = customDescription || defaultErrorData.description;
  const icon = customIcon || defaultErrorData.icon;

  console.error(`Error page shown to user: title --> ${title}, description --> ${description}`);

  return (
    <div className="flex h-screen flex-col p-4">
      {/* Main content - centered */}
      <div className="flex flex-1 items-center justify-center">
        <div className="flex w-full max-w-4xl flex-col items-center justify-center gap-4 md:flex-row md:gap-8">
          {/* Left side - Icon */}
          <div className="flex h-48 w-48 md:h-64 md:w-64 items-center justify-center rounded-full bg-gray-100">
            {icon}
          </div>

          {/* Right side - Error content */}
          <div className="flex flex-col items-center">
            <h1 className="text-6xl md:text-8xl font-bold text-blue-5000 text-center">
              {errorCode}
            </h1>
            <h2 className="mt-4 text-2xl md:text-3xl font-medium text-gray-500 text-center">
              {title}
            </h2>
            <p
              className="mt-4 max-w-md text-center text-gray-600 text-sm"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(description) }}
            />

            <div className="flex items-center gap-2 md:gap-4">
              {showHomeButton && (
                <Link href={homeButtonHref} className="mt-4">
                  <Button className="bg-blue-500 hover:bg-blue-600 text-sm px-4 py-2">
                    {homeButtonText}
                  </Button>
                </Link>
              )}
              {showReset && (
                <div className="mt-4">
                  <Button
                    className="bg-blue-500 hover:bg-blue-600 text-sm px-4 py-2"
                    onClick={reset}
                  >
                    {resetButtonText}
                  </Button>
                </div>
              )}
              {showSupportButton && (
                <Link href={`mailto:${supportEmail}`} className="mt-4">
                  <Button className="border border-blue-500 bg-white text-blue-500 hover:bg-blue-100 text-sm px-4 py-2">
                    {supportButtonText}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer with logo */}
      <div className="flex items-center justify-center pb-4">
        <div className="flex items-end justify-center text-sm text-gray-500">
          <span className="flex items-end h-6 text-xs">
            Powered by
            <Image
              src="/iblai-logo.png"
              alt="ibl.ai"
              width={43}
              height={19}
              className="h-4 w-auto mx-2 mb-1"
            />
            in New York
          </span>
        </div>
      </div>
    </div>
  );
}
