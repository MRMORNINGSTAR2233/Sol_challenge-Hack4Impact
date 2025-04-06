import axios from 'axios';
import { toast } from 'sonner';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor for API calls
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle session expiration or auth errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Clear token and user data
      localStorage.removeItem('token');
      
      // Only redirect to login if we're in the browser
      if (typeof window !== 'undefined') {
        // Don't redirect if already on login or register page
        const path = window.location.pathname;
        if (path !== '/login' && path !== '/register') {
          toast.error('Your session has expired. Please log in again.');
          window.location.href = '/login';
        }
      }
      
      return Promise.reject(error);
    }

    // Show error toast for non-401 errors
    if (error.response?.status !== 401) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }

    return Promise.reject(error);
  }
);

// Types
interface User {
  id: string;
  name: string;
  email: string;
  role: 'teacher' | 'student';
  institution: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'teacher' | 'student';
  institution: string;
}

interface LoginData {
  email: string;
  password: string;
  role: 'teacher' | 'student';
}

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  rubric: string;
  teacher: User;
  fileId: string;
  filename: string;
  contentType: string;
  status: 'draft' | 'published' | 'graded' | 'archived';
  submissions: AssignmentSubmission[];
  createdAt: string;
  updatedAt: string;
}

interface AssignmentSubmission {
  id: string;
  student: User;
  fileId: string;
  filename: string;
  contentType: string;
  submittedAt: string;
  grade?: number;
  feedback?: string;
  status: 'submitted' | 'graded' | 'returned';
}

export const auth = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    localStorage.setItem('token', response.data.token);
    return response.data;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    localStorage.setItem('token', response.data.token);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  },

  getMe: async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },
};

export const assignments = {
  create: async (data: FormData): Promise<Assignment> => {
    const response = await apiClient.post<Assignment>('/assignments', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getAll: async (): Promise<Assignment[]> => {
    const response = await apiClient.get<Assignment[]>('/assignments');
    return response.data;
  },

  getById: async (id: string): Promise<Assignment> => {
    const response = await apiClient.get<Assignment>(`/assignments/${id}`);
    return response.data;
  },

  getFile: async (id: string): Promise<Blob> => {
    const response = await apiClient.get<Blob>(`/assignments/${id}/file`, {
      responseType: 'blob',
    });
    return new Blob([response.data], { type: response.headers['content-type'] });
  },

  submit: async (id: string, data: FormData): Promise<AssignmentSubmission> => {
    const response = await apiClient.post<AssignmentSubmission>(
      `/assignments/${id}/submit`,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  getSubmissionFile: async (assignmentId: string, submissionId: string): Promise<Blob> => {
    const response = await apiClient.get<Blob>(
      `/assignments/${assignmentId}/submissions/${submissionId}/file`,
      {
        responseType: 'blob',
      }
    );
    return new Blob([response.data], { type: response.headers['content-type'] });
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/assignments/${id}`);
  },
};

export const ai = {
  grade: async (data: { submission: string; rubric: string }): Promise<{ grade: number; feedback: string }> => {
    const response = await apiClient.post<{ grade: number; feedback: string }>('/ai/grade', data);
    return response.data;
  },

  feedback: async (data: { submission: string; grade: number; studentId: string }): Promise<{ feedback: string }> => {
    const response = await apiClient.post<{ feedback: string }>('/ai/feedback', data);
    return response.data;
  },

  chat: async (message: string, assignmentId?: string): Promise<{ response: string }> => {
    const response = await apiClient.post<{ response: string }>('/ai/chat', { message, assignmentId });
    return response.data;
  },

  getChatHistory: async (assignmentId?: string): Promise<{ messages: Array<{ role: string; content: string }> }> => {
    const response = await apiClient.get<{ messages: Array<{ role: string; content: string }> }>(
      `/ai/chat/${assignmentId || ''}`
    );
    return response.data;
  },
};

export const analytics = {
  getTeacherAnalytics: async (id: string) => {
    const response = await apiClient.get(`/analytics/teacher/${id}`);
    return response.data;
  },

  getStudentAnalytics: async (id: string) => {
    const response = await apiClient.get(`/analytics/student/${id}`);
    return response.data;
  },
};

export default apiClient;