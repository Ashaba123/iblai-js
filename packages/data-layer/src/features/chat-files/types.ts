/**
 * Local type definitions for file upload API
 * These mirror the backend API types
 */

/**
 * Request for generating presigned upload URL
 */
export interface FileUploadURLRequest {
  /** Chat session ID */
  session_id: string;
  /** Original filename */
  file_name: string;
  /** MIME type of the file */
  content_type: string;
  /** File size in bytes */
  file_size: number;
}

/**
 * Response with presigned upload URL
 */
export interface FileUploadURLResponse {
  /** Presigned S3 upload URL */
  upload_url: string;
  /** S3 object key for the uploaded file */
  file_key: string;
  /** Unique identifier for the ChatFile record */
  file_id: string;
  /** URL expiration time in seconds */
  expires_in: number;
  /** HTTP method to use for upload (PUT or POST) */
  upload_method?: string;
}
