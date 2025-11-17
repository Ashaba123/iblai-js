'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { skipToken } from '@reduxjs/toolkit/query';

import {
  useCreateReportMutation,
  useGetReportDetailQuery,
  useGetReportsQuery,
} from '@iblai/data-layer';
import type { ReportData } from '@iblai/iblai-api';
import { StateEnum } from '@iblai/iblai-api';

const POLL_INTERVAL = 3000;
const MAX_ATTEMPTS = 20;

type ReportStatusMap = Record<string, StateEnum | ''>;

type UseReportsArgs = {
  tenantKey: string;
  selectedMentorId: string;
};

type InitializeDownloadArgs = {
  report: ReportData;
};

type UseReportsReturn = {
  reports: ReportData[];
  isLoading: boolean;
  error: unknown;
  initializeReportDownload: (args: InitializeDownloadArgs) => Promise<void>;
  statusMap: ReportStatusMap;
  activeReportName: string | null;
  isGenerating: boolean;
  refetchReports: () => unknown;
};

export const useReports = ({ tenantKey, selectedMentorId }: UseReportsArgs): UseReportsReturn => {
  const {
    data: reportsResponse,
    isLoading,
    error,
    refetch,
  } = useGetReportsQuery({ key: tenantKey });

  const reports = useMemo<ReportData[]>(() => reportsResponse?.data ?? [], [reportsResponse?.data]);

  const [statusMap, setStatusMap] = useState<ReportStatusMap>({});
  const [activeReportName, setActiveReportName] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const attemptsRef = useRef(0);
  const pollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [pollArgs, setPollArgs] = useState<{ key: string; reportName: string } | null>(null);

  const { refetch: fetchReportDetail } = useGetReportDetailQuery(pollArgs ?? skipToken, {
    skip: !pollArgs,
    refetchOnMountOrArgChange: false,
  });
  const [createReport, { isLoading: isCreating }] = useCreateReportMutation();

  const clearPollingTimeout = useCallback(() => {
    if (pollTimeoutRef.current) {
      clearTimeout(pollTimeoutRef.current);
      pollTimeoutRef.current = null;
    }
  }, []);

  const stopPolling = useCallback(() => {
    clearPollingTimeout();
    attemptsRef.current = 0;
    setIsGenerating(false);
    setActiveReportName(null);
    setPollArgs(null);
  }, [clearPollingTimeout]);

  useEffect(() => {
    return () => {
      clearPollingTimeout();
    };
  }, [clearPollingTimeout]);

  useEffect(() => {
    if (!reports.length) {
      setStatusMap({});
      return;
    }

    setStatusMap((previous) => {
      const nextStatuses: ReportStatusMap = {};
      for (const report of reports) {
        const name = report.report_name;
        if (!name) continue;
        if (isGenerating && name === activeReportName) {
          nextStatuses[name] = previous[name] ?? '';
          continue;
        }
        const state = report.status?.state;
        nextStatuses[name] = (state as StateEnum) ?? '';
      }
      return nextStatuses;
    });
  }, [reports, isGenerating, activeReportName]);

  const pollReportStatusRef = useRef<(() => Promise<void>) | null>(null);

  const pollReportStatus = useCallback(async () => {
    if (!activeReportName) return;

    attemptsRef.current += 1;

    let shouldContinue = true;

    try {
      if (!pollArgs) {
        return;
      }

      const detail = await fetchReportDetail().unwrap();
      const state = detail?.data?.status?.state as StateEnum | undefined;
      const url = detail?.data?.status?.url;

      if (state) {
        setStatusMap((prev) => ({ ...prev, [activeReportName]: state }));
      }

      if (state === StateEnum.COMPLETED && url) {
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Report downloaded successfully');
        shouldContinue = false;
        stopPolling();
        refetch();
        return;
      }

      if (!state || [StateEnum.ERROR, StateEnum.CANCELLED, StateEnum.EXPIRED].includes(state)) {
        toast.error('Error occurred while retrieving report.');
        shouldContinue = false;
        stopPolling();
        refetch();
        return;
      }
    } catch (error) {
      console.error('Failed to poll report status', error);
      toast.error('Error occurred while retrieving report.');
      shouldContinue = false;
      stopPolling();
      return;
    }

    if (attemptsRef.current >= MAX_ATTEMPTS) {
      toast.error('Report generation is taking longer than expected. Please try again later.');
      shouldContinue = false;
      stopPolling();
      return;
    }

    if (shouldContinue) {
      clearPollingTimeout();
      pollTimeoutRef.current = setTimeout(() => {
        void pollReportStatusRef.current?.();
      }, POLL_INTERVAL);
    }
  }, [activeReportName, clearPollingTimeout, fetchReportDetail, pollArgs, refetch, stopPolling]);

  useEffect(() => {
    pollReportStatusRef.current = pollReportStatus;
  }, [pollReportStatus]);

  const startPolling = useCallback(() => {
    clearPollingTimeout();
    attemptsRef.current = 0;
    pollTimeoutRef.current = setTimeout(() => {
      void pollReportStatusRef.current?.();
    }, POLL_INTERVAL);
  }, [clearPollingTimeout]);

  const initializeReportDownload = useCallback(
    async ({ report }: InitializeDownloadArgs) => {
      const reportName = report.report_name;

      if (!reportName) {
        toast.error('Unable to download report. Missing report identifier.');
        return;
      }

      if (isGenerating && activeReportName && activeReportName !== reportName) {
        toast.error('Another report is currently being generated. Please wait for it to finish.');
        return;
      }

      setActiveReportName(reportName);
      setIsGenerating(true);
      setStatusMap((prev) => ({ ...prev, [reportName]: StateEnum.PENDING }));
      setPollArgs({ key: tenantKey, reportName });

      try {
        const response = await createReport({
          key: tenantKey,
          requestBody: {
            report_name: reportName,
            ...(selectedMentorId ? { mentor: selectedMentorId } : {}),
          },
        }).unwrap();

        const state = response?.data?.state as StateEnum | undefined;
        const url = response?.data?.url;

        if (state) {
          setStatusMap((prev) => ({ ...prev, [reportName]: state }));
        }

        if (state === StateEnum.COMPLETED && url) {
          const link = document.createElement('a');
          link.href = url;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          toast.success('Report downloaded successfully');
          stopPolling();
          refetch();
          return;
        }

        if (!state || [StateEnum.ERROR, StateEnum.CANCELLED, StateEnum.EXPIRED].includes(state)) {
          toast.error('Failed to create report.');
          stopPolling();
          refetch();
          return;
        }

        startPolling();
      } catch (error) {
        console.error('Failed to create report', error);
        toast.error('Failed to create report.');
        stopPolling();
      }
    },
    [
      activeReportName,
      createReport,
      selectedMentorId,
      isGenerating,
      fetchReportDetail,
      refetch,
      startPolling,
      stopPolling,
      tenantKey,
    ],
  );

  // Determine if we should show loading state
  const shouldShowLoading = isLoading || (!reportsResponse && !error);

  return {
    reports,
    isLoading: shouldShowLoading,
    error,
    initializeReportDownload,
    statusMap,
    activeReportName,
    isGenerating: isGenerating || isCreating,
    refetchReports: refetch,
  };
};
