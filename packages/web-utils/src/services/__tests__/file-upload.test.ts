import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getFileInfo,
  uploadToS3,
  validateFile,
  createFileReference,
} from "../file-upload";
import type { FileUploadURLResponse } from "@iblai/data-layer";
import axios from "axios";

// Mock axios
vi.mock("axios");

describe("file-upload service", () => {
  describe("getFileInfo", () => {
    it("should extract file information correctly", () => {
      const file = new File(["test content"], "test.pdf", {
        type: "application/pdf",
      });

      const info = getFileInfo(file);

      expect(info.fileName).toBe("test.pdf");
      expect(info.contentType).toBe("application/pdf");
      expect(info.fileSize).toBeGreaterThan(0);
    });

    it("should use default content type for unknown file types", () => {
      const file = new File(["test"], "test.xyz", { type: "" });

      const info = getFileInfo(file);

      expect(info.contentType).toBe("application/octet-stream");
    });
  });

  describe("validateFile", () => {
    it("should return null for valid file", () => {
      const file = new File(["test"], "test.txt", { type: "text/plain" });

      const error = validateFile(file);

      expect(error).toBeNull();
    });

    it("should reject file exceeding max size", () => {
      const file = new File(["x".repeat(1000000)], "large.txt", {
        type: "text/plain",
      });
      const maxSize = 500000; // 500KB

      const error = validateFile(file, maxSize);

      expect(error).toContain("exceeds maximum allowed size");
    });

    it("should reject file with disallowed type", () => {
      const file = new File(["test"], "test.exe", {
        type: "application/x-msdownload",
      });
      const allowedTypes = [".pdf", ".txt", ".jpg"];

      const error = validateFile(file, undefined, allowedTypes);

      expect(error).toContain("File type not allowed");
    });

    it("should allow file with allowed type by extension", () => {
      const file = new File(["test"], "test.pdf", { type: "" });
      const allowedTypes = [".pdf", ".txt"];

      const error = validateFile(file, undefined, allowedTypes);

      expect(error).toBeNull();
    });

    it("should allow file with allowed MIME type", () => {
      const file = new File(["test"], "test.jpg", { type: "image/jpeg" });
      const allowedTypes = ["image/jpeg", "image/png"];

      const error = validateFile(file, undefined, allowedTypes);

      expect(error).toBeNull();
    });
  });

  describe("uploadToS3", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("should call axios.put with correct parameters", async () => {
      const file = new File(["test"], "test.txt", { type: "text/plain" });
      const url = "https://s3.amazonaws.com/bucket/key";

      vi.mocked(axios.put).mockResolvedValue({ status: 200 });

      await uploadToS3(url, file, "text/plain");

      expect(axios.put).toHaveBeenCalledWith(url, file, {
        headers: {
          "Content-Type": "text/plain",
        },
        onUploadProgress: expect.any(Function),
      });
    });

    it("should resolve on successful upload", async () => {
      const file = new File(["test"], "test.txt", { type: "text/plain" });
      const url = "https://s3.amazonaws.com/bucket/key";

      vi.mocked(axios.put).mockResolvedValue({ status: 200 });

      await expect(
        uploadToS3(url, file, "text/plain"),
      ).resolves.toBeUndefined();
    });

    it("should reject on upload error", async () => {
      const file = new File(["test"], "test.txt", { type: "text/plain" });
      const url = "https://s3.amazonaws.com/bucket/key";

      vi.mocked(axios.put).mockRejectedValue(new Error("Network error"));

      await expect(uploadToS3(url, file, "text/plain")).rejects.toThrow(
        "Network error",
      );
    });

    it("should track upload progress", async () => {
      const file = new File(["test"], "test.txt", { type: "text/plain" });
      const url = "https://s3.amazonaws.com/bucket/key";
      const onProgress = vi.fn();

      vi.mocked(axios.put).mockImplementation((_url, _data, config) => {
        // Simulate progress callback
        if (config?.onUploadProgress) {
          config.onUploadProgress({
            loaded: 50,
            total: 100,
            bytes: 50,
            lengthComputable: true,
          } as any);
        }
        return Promise.resolve({ status: 200 });
      });

      await uploadToS3(url, file, "text/plain", onProgress);

      expect(onProgress).toHaveBeenCalledWith(50);
    });
  });

  describe("createFileReference", () => {
    it("should complete full upload flow", async () => {
      const file = new File(["test content"], "test.pdf", {
        type: "application/pdf",
      });
      const sessionId = "session-123";
      const org = "test-org";
      const userId = "user-123";

      const mockResponse: FileUploadURLResponse = {
        upload_url: "https://s3.amazonaws.com/bucket/key",
        file_key: "files/123/test.pdf",
        file_id: "file-456",
        expires_in: 3600,
      };

      const mockGetUploadUrl = vi.fn().mockResolvedValue(mockResponse);

      // Mock axios for S3 upload
      vi.mocked(axios.put).mockResolvedValue({ status: 200 });

      const result = await createFileReference(
        file,
        sessionId,
        mockGetUploadUrl,
        org,
        userId,
      );

      // Verify API was called correctly
      expect(mockGetUploadUrl).toHaveBeenCalledWith({
        org,
        userId,
        requestBody: {
          session_id: sessionId,
          file_name: "test.pdf",
          content_type: "application/pdf",
          file_size: file.size,
        },
      });

      // Verify axios was called for S3 upload
      expect(axios.put).toHaveBeenCalledWith(
        "https://s3.amazonaws.com/bucket/key",
        file,
        expect.objectContaining({
          headers: {
            "Content-Type": "application/pdf",
          },
        }),
      );

      // Verify result
      expect(result).toEqual({
        file_id: "file-456",
        file_key: "files/123/test.pdf",
        file_name: "test.pdf",
        content_type: "application/pdf",
        file_size: file.size,
      });
    });
  });
});
