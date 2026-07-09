import { apiClient } from './client';
import { User } from '@/types';

interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export const authApi = {
  register: async (data: Record<string, unknown>): Promise<AuthResponse> => {
    const res = await apiClient.post('/api/auth/register', data);
    return res.data;
  },
  login: async (data: Record<string, unknown>): Promise<AuthResponse> => {
    const res = await apiClient.post('/api/auth/login', data);
    return res.data;
  },
  logout: async (refreshToken: string) => {
    const res = await apiClient.post('/api/auth/logout', { refreshToken });
    return res.data;
  }
};
