import axios from "axios";
import type {
  FileInfo,
  FileReference,
  UploadProgressCallback,
} from "../types/file-upload";
import type { FileUploadURLResponse } from "@iblai/data-layer";

/**
 * Extract file information from File object
 */
export function getFileInfo(file: File): FileInfo {
  const fileName = file.name;
  const contentType = file.type || "application/octet-stream";
  const fileSize = file.size;

  return {
    fileName,
    contentType,
    fileSize,
  };
}

/**
 * Request presigned S3 URL from backend
 * Note: This function should be called via the RTK Query mutation hook
 * This is a helper to show the data flow
 */
export async function requestPresignedUrl(
  sessionId: string,
  file: File,
  getUploadUrlFn: (params: {
    org: string;
    userId: string;
    requestBody: {
      session_id: string;
      file_name: string;
      content_type: string;
      file_size: number;
    };
  }) => Promise<FileUploadURLResponse>,
  org: string,
  userId: string,
): Promise<FileUploadURLResponse> {
  const { fileName, contentType, fileSize } = getFileInfo(file);

  return await getUploadUrlFn({
    org,
    userId,
    requestBody: {
      session_id: sessionId,
      file_name: fileName,
      content_type: contentType,
      file_size: fileSize,
    },
  });
}

/**
 * Upload file directly to S3 using presigned URL
 * Uses axios for cross-platform support (web + React Native)
 */
export async function uploadToS3(
  presignedUrl: string,
  file: File,
  contentType: string,
  onProgress?: UploadProgressCallback,
): Promise<void> {
  await axios.put(presignedUrl, file, {
    headers: {
      "Content-Type": contentType,
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const progress = Math.round(
          (progressEvent.loaded / progressEvent.total) * 100,
        );
        onProgress(progress);
      }
    },
  });
}

/**
 * Complete file upload flow:
 * 1. Request presigned URL
 * 2. Upload to S3
 * 3. Return file reference
 */
export async function createFileReference(
  file: File,
  sessionId: string,
  getUploadUrlFn: (params: {
    org: string;
    userId: string;
    requestBody: {
      session_id: string;
      file_name: string;
      content_type: string;
      file_size: number;
    };
  }) => Promise<FileUploadURLResponse>,
  org: string,
  userId: string,
  onProgress?: UploadProgressCallback,
): Promise<FileReference> {
  // Step 1: Get presigned URL
  const presignedResponse = await requestPresignedUrl(
    sessionId,
    file,
    getUploadUrlFn,
    org,
    userId,
  );

  // Step 2: Upload to S3
  const { fileName, contentType, fileSize } = getFileInfo(file);
  await uploadToS3(presignedResponse.upload_url, file, contentType, onProgress);

  // Step 3: Return file reference
  return {
    file_id: presignedResponse.file_id,
    file_key: presignedResponse.file_key,
    file_name: fileName,
    content_type: contentType,
    file_size: fileSize,
  };
}

/**
 * Upload multiple files and return their references
 */
export async function createMultipleFileReferences(
  files: File[],
  sessionId: string,
  getUploadUrlFn: (params: {
    org: string;
    userId: string;
    requestBody: {
      session_id: string;
      file_name: string;
      content_type: string;
      file_size: number;
    };
  }) => Promise<FileUploadURLResponse>,
  org: string,
  userId: string,
  onFileProgress?: (fileIndex: number, progress: number) => void,
): Promise<FileReference[]> {
  const fileReferences: FileReference[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const onProgress = onFileProgress
      ? (progress: number) => onFileProgress(i, progress)
      : undefined;

    const fileReference = await createFileReference(
      file,
      sessionId,
      getUploadUrlFn,
      org,
      userId,
      onProgress,
    );

    fileReferences.push(fileReference);
  }

  return fileReferences;
}

/**
 * Validate file before upload
 * Returns error message if invalid, null if valid
 */
export function validateFile(
  file: File,
  maxSizeBytes?: number,
  allowedTypes?: string[],
): string | null {
  // Check file size
  if (maxSizeBytes && file.size > maxSizeBytes) {
    const maxSizeMB = (maxSizeBytes / (1024 * 1024)).toFixed(2);
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
    return `File size (${fileSizeMB}MB) exceeds maximum allowed size (${maxSizeMB}MB)`;
  }

  // Check file type
  if (allowedTypes && allowedTypes.length > 0) {
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    const fileType = file.type.toLowerCase();

    const isTypeAllowed = allowedTypes.some(
      (allowed) =>
        fileType.includes(allowed.toLowerCase()) ||
        fileExtension === allowed.toLowerCase().replace(".", ""),
    );

    if (!isTypeAllowed) {
      return `File type not allowed. Allowed types: ${allowedTypes.join(", ")}`;
    }
  }

  return null;
}
