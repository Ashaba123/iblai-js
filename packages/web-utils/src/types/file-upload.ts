/**
 * File reference sent via WebSocket to backend
 * Backend uses this to retrieve file from S3
 */
export interface FileReference {
  /** Unique identifier for the ChatFile record */
  file_id: string;
  /** S3 object key for the uploaded file */
  file_key: string;
  /** Original filename */
  file_name: string;
  /** MIME type of the file */
  content_type: string;
  /** File size in bytes */
  file_size: number;
  /** Presigned URL for displaying the file (optional, for UI) */
  upload_url?: string;
}

/**
 * File upload state for UI tracking
 */
export interface FileUploadState {
  /** Original File object */
  file: File;
  /** Upload/processing status */
  status: "pending" | "uploading" | "processing" | "success" | "error";
  /** Upload progress (0-100) */
  progress: number;
  /** File reference after successful upload */
  fileReference?: FileReference;
  /** Error message if upload failed */
  error?: string;
}

/**
 * File processing event from WebSocket
 */
export type FileProcessingEvent =
  | {
      type: "file_processing_progress";
      file_name: string;
      progress: string;
    }
  | {
      type: "file_processing_success";
      file_name: string;
      file_url: string;
    }
  | {
      type: "file_error";
      file_name?: string;
      error: string;
      developer_error?: string;
    };

/**
 * Upload progress callback
 */
export type UploadProgressCallback = (progress: number) => void;

/**
 * File info extracted from File object
 */
export interface FileInfo {
  fileName: string;
  contentType: string;
  fileSize: number;
}
