import { useMutation } from '@tanstack/react-query';
import type { LetterFromUrlRequest, LetterFromTextRequest, LetterResponse, CVUploadRequest, CVUploadResponse } from '@/types/letter';

/**
 * Hook for creating a letter from URL
 */
export const useCreateLetterFromUrl = () => {
  return useMutation<LetterResponse, Error, LetterFromUrlRequest>({
    mutationFn: async (data: LetterFromUrlRequest) => {
      const formData = new FormData();
      formData.append('url', data.url);
      formData.append('source_id', data.source_id.toString());

      if (data.file) {
        formData.append('file', data.file);
      }

      // Since apiRequest expects JSON, we'll make a direct fetch call for FormData
      const response = await fetch(`${import.meta.env.VITE_API_URL}/letter/url`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || 'Failed to create letter from URL');
      }

      return response.json();
    },
    onError: (error) => {
      console.error('Error creating letter from URL:', error);
    },
  });
};

/**
 * Hook for creating a letter from text
 */
export const useCreateLetterFromText = () => {
  return useMutation<LetterResponse, Error, LetterFromTextRequest>({
    mutationFn: async (data: LetterFromTextRequest) => {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('source_id', data.source_id.toString());

      if (data.file) {
        formData.append('file', data.file);
      }

      // Since apiRequest expects JSON, we'll make a direct fetch call for FormData
      const response = await fetch(`${import.meta.env.VITE_API_URL}/letter/text`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || 'Failed to create letter from text');
      }

      return response.json();
    },
    onError: (error) => {
      console.error('Error creating letter from text:', error);
    },
  });
};

/**
 * Hook for uploading CV/resume
 */
export const useUploadCV = () => {
  return useMutation<CVUploadResponse, Error, CVUploadRequest>({
    mutationFn: async (data: CVUploadRequest) => {
      const formData = new FormData();
      formData.append('file', data.file);

      // Generate a unique source_id (you might want to use UUID or similar)
      const sourceId = Date.now(); // Simple approach, you might want to use a proper UUID
      formData.append('source_id', sourceId.toString());

      const response = await fetch(`${import.meta.env.VITE_API_URL}/letter/upload-cv`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || 'Failed to upload CV');
      }

      const result = await response.json();
      // Add the source_id to the response for frontend use
      result.source_id = sourceId;
      return result;
    },
    onError: (error) => {
      console.error('Error uploading CV:', error);
    },
  });
};
