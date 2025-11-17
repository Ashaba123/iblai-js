'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@web-containers/components/ui/button';
import { Skeleton } from '@web-containers/components/ui/skeleton';
import {
  Upload,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import { toast } from 'sonner';
import { useCreateUserResumeMutation, useGetUserResumeQuery } from '@iblai/data-layer';

interface ResumeTabProps {
  org: string;
  username: string;
}

interface UploadedFile {
  name: string;
  url: string;
  type: string;
}

try {
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
} catch (error) {
  console.warn('Unable to set PDF worker source', error);
}

export const ResumeTab = ({ org, username }: ResumeTabProps) => {
  const { data, isLoading, isError, refetch } = useGetUserResumeQuery({ org, username });
  const [createResume, { isLoading: isUploading }] = useCreateUserResumeMutation();
  const [resumeUrl, setResumeUrl] = useState<string | undefined>(undefined);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const files = Array.isArray(data?.files) ? (data?.files as UploadedFile[]) : [];
    const resume = files.find(
      (file) => file.type === 'resume' || file.name?.toLowerCase().includes('resume'),
    );
    setResumeUrl(resume?.url);
    setPageNumber(1);
    setScale(1.0);
    setRotation(0);
  }, [data]);

  const handleDocumentLoad = ({ numPages: totalPages }: { numPages: number }) => {
    setNumPages(totalPages);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) {
      return;
    }

    if (file.type !== 'application/pdf') {
      toast.error('Only PDF resumes are supported');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      toast.error('File size should be under 25MB');
      return;
    }

    const formData = new FormData();
    formData.append('user', username);
    formData.append('platform', org);
    formData.append('resume', file);

    try {
      await createResume({
        org,
        username,
        resume: formData,
        method: 'POST',
      }).unwrap();
      toast.success('Resume uploaded successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to upload resume');
    }
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-end">
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {!isLoading && (isError || !resumeUrl) && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
          <h3 className="text-base font-semibold text-gray-700">No resume added yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Upload your resume to share with mentors and administrators.
          </p>
          <Button
            className="mt-4 bg-gradient-to-r from-[#2563EB] to-[#93C5FD] hover:opacity-90 text-white"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-4 w-4 mr-2" /> {isUploading ? 'Uploading...' : 'Upload resume'}
          </Button>
        </div>
      )}
      {isLoading && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      )}

      {!isLoading && resumeUrl && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-gray-50 px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPageNumber((prev) => Math.max(1, prev - 1))}
                  disabled={pageNumber <= 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Prev
                </Button>
                <span>
                  Page {pageNumber} of {numPages || '—'}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPageNumber((prev) => Math.min(numPages, prev + 1))}
                  disabled={pageNumber >= numPages}
                >
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setScale((current) => Math.max(0.5, Number((current - 0.2).toFixed(1))))
                  }
                  disabled={scale <= 0.5}
                >
                  <ZoomOut className="h-4 w-4 mr-1" />
                </Button>
                <span>{Math.round(scale * 100)}%</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setScale((current) => Number((current + 0.2).toFixed(1)))}
                >
                  <ZoomIn className="h-4 w-4 mr-1" />
                </Button>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRotation((current) => current - 90)}
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRotation((current) => current + 90)}
                >
                  <RotateCw className="h-4 w-4 mr-1" />
                </Button>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                <Document
                  file={resumeUrl}
                  onLoadSuccess={handleDocumentLoad}
                  onLoadError={() => toast.error('Unable to load resume preview')}
                  loading={<Skeleton className="h-[480px] w-[360px]" />}
                >
                  <Page pageNumber={pageNumber} scale={scale} rotate={rotation} width={720} />
                </Document>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
