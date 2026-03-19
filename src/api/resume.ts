import { apiClient } from './client';

interface ResumeResponse {
  success: boolean;
  message: string;
  data: {
    url: string;
    publicId: string;
  };
}

export const resumeApi = {
  upload: (file: File, onProgress?: (progress: number) => void) => {
    const formData = new FormData();
    formData.append('resume', file);
    return apiClient.uploadFile<ResumeResponse>('/resume/upload', formData, onProgress);
  },

  delete: () =>
    apiClient.delete('/resume'),

  getApplicantResume: (applicantId: string) =>
    apiClient.get<ResumeResponse>(`/resume/${applicantId}`),
};
