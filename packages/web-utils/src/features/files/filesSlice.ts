import { createSlice, type PayloadAction, Slice } from "@reduxjs/toolkit";

export interface AttachedFile {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadUrl: string;
  uploadProgress: number;
  uploadStatus: "pending" | "uploading" | "processing" | "success" | "error";
  fileKey?: string;
  fileId?: string;
  retryCount?: number;
  fileUrl?: string; // Presigned download URL from file_processing_success
}

export interface FilesState {
  attachedFiles: AttachedFile[];
}

const initialState: FilesState = {
  attachedFiles: [],
};

export const filesSlice: Slice<FilesState> = createSlice({
  name: "files",
  initialState,
  reducers: {
    addFiles: (state, action: PayloadAction<AttachedFile[]>) => {
      state.attachedFiles = [...state.attachedFiles, ...action.payload];
    },
    updateFileProgress: (
      state,
      action: PayloadAction<{ id: string; progress: number }>,
    ) => {
      state.attachedFiles = state.attachedFiles.map((file) =>
        file.id === action.payload.id
          ? { ...file, uploadProgress: action.payload.progress }
          : file,
      );
    },
    updateFileStatus: (
      state,
      action: PayloadAction<{
        id: string;
        status: "pending" | "uploading" | "processing" | "success" | "error";
      }>,
    ) => {
      state.attachedFiles = state.attachedFiles.map((file) =>
        file.id === action.payload.id
          ? { ...file, uploadStatus: action.payload.status }
          : file,
      );
    },
    updateFileUrl: (
      state,
      action: PayloadAction<{ id: string; uploadUrl: string }>,
    ) => {
      state.attachedFiles = state.attachedFiles.map((file) =>
        file.id === action.payload.id
          ? { ...file, uploadUrl: action.payload.uploadUrl }
          : file,
      );
    },
    updateFileMetadata: (
      state,
      action: PayloadAction<{ id: string; fileKey: string; fileId: string }>,
    ) => {
      state.attachedFiles = state.attachedFiles.map((file) =>
        file.id === action.payload.id
          ? {
              ...file,
              fileKey: action.payload.fileKey,
              fileId: action.payload.fileId,
            }
          : file,
      );
    },
    updateFileRetryCount: (
      state,
      action: PayloadAction<{ id: string; retryCount: number }>,
    ) => {
      state.attachedFiles = state.attachedFiles.map((file) =>
        file.id === action.payload.id
          ? { ...file, retryCount: action.payload.retryCount }
          : file,
      );
    },
    updateFileUrlFromWebSocket: (
      state,
      action: PayloadAction<{ fileId: string; fileUrl: string }>,
    ) => {
      state.attachedFiles = state.attachedFiles.map((file) =>
        file.fileId === action.payload.fileId
          ? { ...file, fileUrl: action.payload.fileUrl }
          : file,
      );
    },
    removeFile: (state, action: PayloadAction<string>) => {
      state.attachedFiles = state.attachedFiles.filter(
        (file) => file.id !== action.payload,
      );
    },
    clearFiles: (state) => {
      state.attachedFiles = [];
    },
  },
});

export const {
  addFiles,
  removeFile,
  clearFiles,
  updateFileProgress,
  updateFileStatus,
  updateFileUrl,
  updateFileMetadata,
  updateFileRetryCount,
  updateFileUrlFromWebSocket,
} = filesSlice.actions;
export const filesReducer = filesSlice.reducer;
