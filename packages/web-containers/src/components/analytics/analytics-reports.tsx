'use client';

import { useMemo } from 'react';
import { Download, Loader2 } from 'lucide-react';

import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { EmptyStats } from './empty-stats';
import { useReports } from './use-reports';

const toTitleCase = (value: string | undefined) => {
  if (!value) return '';
  return value
    .split('-')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
};

interface AnalyticsReportsProps {
  tenantKey: string;
  selectedMentorId: string;
  disabledReports?: string[];
}

export function AnalyticsReports({
  tenantKey,
  selectedMentorId,
  disabledReports = [],
}: AnalyticsReportsProps) {
  const { reports, isLoading, error, initializeReportDownload, activeReportName, isGenerating } =
    useReports({
      tenantKey,
      selectedMentorId,
    });

  // Filter out disabled reports based on display name containing disabled report names as substrings
  const filteredReports = useMemo(() => {
    if (!disabledReports.length) return reports;

    return reports.filter((report) => {
      const displayName = (
        report.display_name ||
        toTitleCase(report.report_name) ||
        ''
      ).toLowerCase();
      return !disabledReports.some((disabledReport) =>
        displayName.includes(disabledReport.toLowerCase()),
      );
    });
  }, [reports, disabledReports]);

  const content = useMemo(() => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 items-stretch">
          {Array.from({ length: 12 }).map((_, key) => (
            <Card key={key} className="bg-white border-gray-200 h-full flex flex-col">
              <CardContent className="p-6 flex-1 flex flex-col">
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <Skeleton className="h-5 w-32 flex-1 mr-2" />
                    <Skeleton className="h-8 w-8 flex-shrink-0" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (!filteredReports.length) {
      return (
        <div className="flex flex-col items-center justify-center space-y-4">
          <EmptyStats title={'No reports available yet.'} />
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 items-stretch">
        {filteredReports.map((report, index) => {
          const reportKey = report.report_name ?? `report-${index}`;
          const hasIdentifier = Boolean(report.report_name);
          const isActive = isGenerating && hasIdentifier && activeReportName === reportKey;
          const isDisabled = (isGenerating && activeReportName !== reportKey) || !hasIdentifier;

          const handleGenerateReport = () => {
            initializeReportDownload({ report });
          };

          return (
            <Card
              aria-label={`${report.display_name || toTitleCase(report.report_name)} report card`}
              key={reportKey}
              className="bg-white border-gray-200 h-full flex flex-col"
            >
              <CardContent className="p-6 flex-1 flex flex-col">
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-base font-medium text-gray-700 flex-1 pr-2">
                      {(() => {
                        const displayName = report.display_name || toTitleCase(report.report_name);
                        return displayName === 'All Mentor Chat History'
                          ? 'Chat History'
                          : displayName;
                      })()}
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 bg-transparent hover:bg-[#155dfc] hover:text-white border-[#155dfc] text-[#155dfc] flex-shrink-0"
                      onClick={handleGenerateReport}
                      disabled={isDisabled}
                      aria-label="Download report"
                    >
                      {isActive ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600">
                    {report.description || 'Generate and download this report'}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  }, [activeReportName, initializeReportDownload, isGenerating, isLoading, error, filteredReports]);

  return <div className="space-y-6">{content}</div>;
}
