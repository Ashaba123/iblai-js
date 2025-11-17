import { useCallback, useState } from 'react';
//import * as Sentry from '@sentry/nextjs';

type CopyFn = (text: string) => Promise<void>;

type CopyStatus = 'idle' | 'success' | 'error';

type UseCopyToClipboardReturn = {
  copy: CopyFn;
  status: CopyStatus;
};

export function useCopyToClipboard(timeout: number = 500): UseCopyToClipboardReturn {
  const [status, setStatus] = useState<CopyStatus>('idle');

  const copy: CopyFn = useCallback(
    async (text) => {
      if (!navigator?.clipboard) {
        console.warn('Clipboard not supported');
        return;
      }

      // Try to save to clipboard then save it in the state if worked
      try {
        await navigator.clipboard.writeText(text);
        setStatus('success');

        setTimeout(() => {
          setStatus('idle');
        }, timeout);

        return;
      } catch {
        //Sentry.captureException(String(error));
        setStatus('error');
        return;
      }
    },
    [timeout],
  );

  return { copy, status };
}
