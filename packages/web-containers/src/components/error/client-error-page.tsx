'use client';

import { useEffect, useState } from 'react';

import { ErrorPage } from './error-page';
import { getErrorData } from '../../lib/error-utils';

type Props = {
  header?: string;
  message?: string;
  errorCode?: string;
  showHomeButton?: boolean;
  supportEmail?: string;
  handleError: (error: any) => void;
};

export const ClientErrorPage = ({
  header,
  message,
  supportEmail,
  errorCode = '500',
  showHomeButton = true,
  handleError,
}: Props) => {
  const [errorData, setErrorData] = useState({
    header: '',
    message: '',
    code: errorCode,
  });

  useEffect(() => {
    // Simulate fetching error data or any async operation
    const defaults = getErrorData(errorCode?.toString() || '500');
    const fetchErrorData = async () => {
      // Ensure that the values are strings
      const fetchedData = {
        header: header || defaults.title, // Provide a default value
        message: message || defaults.description, // Provide a default value
        code: errorCode?.toString(), // Convert to string and provide a default
      };
      setErrorData(fetchedData);
      handleError(fetchErrorData);
    };

    fetchErrorData();
  }, [header, message, errorCode]);

  return (
    <ErrorPage
      errorCode={errorCode?.toString()}
      customTitle={errorData.header}
      customDescription={errorData.message}
      showHomeButton={showHomeButton}
      supportEmail={supportEmail}
    />
  );
};
