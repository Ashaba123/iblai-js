import { useUploadProfileImageMutation, useRemoveProfileImageMutation, UploadProfileImageResponse, RemoveProfileImageResponse } from '@iblai/data-layer';

export interface UseProfileImageUploadOptions {
  onSuccess?: (imageUrl: string) => void;
  onError?: (error: any) => void;
}

export interface UseProfileImageUploadReturn {
  uploadImage: (file: File, username: string) => Promise<UploadProfileImageResponse>;
  removeImage: (username: string) => Promise<RemoveProfileImageResponse>;
  isLoading: boolean;
  isRemoving: boolean;
  error: any;
}

export function useProfileImageUpload(options: UseProfileImageUploadOptions = {}): UseProfileImageUploadReturn {
  const [uploadProfileImage, { isLoading, error }] = useUploadProfileImageMutation();
  const [removeProfileImage, { isLoading: isRemoving }] = useRemoveProfileImageMutation();

  const uploadImage = async (file: File, username: string): Promise<UploadProfileImageResponse> => {
    try {
      const result = await uploadProfileImage({ file, filename: file.name, username }).unwrap();

      if (options.onSuccess) {
        options.onSuccess(result.profile_image_url);
      }

      return result;
    } catch (err) {
      if (options.onError) {
        options.onError(err);
      }
      throw err;
    }
  };

  const removeImage = async (username: string): Promise<RemoveProfileImageResponse> => {
    try {
      const result = await removeProfileImage({ username }).unwrap();

      if (options.onSuccess) {
        options.onSuccess(''); // Empty string indicates image was removed
      }

      return result;
    } catch (err) {
      if (options.onError) {
        options.onError(err);
      }
      throw err;
    }
  };

  return {
    uploadImage,
    removeImage,
    isLoading,
    isRemoving,
    error,
  };
}