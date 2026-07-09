import { apiClient } from './client';
import { User } from '@/types';

export const userApi = {
  getMe: async (): Promise<User> => {
    const res = await apiClient.get('/api/users/me');
    return res.data;
  },
  updateMe: async (data: Partial<User>): Promise<User> => {
    const res = await apiClient.patch('/api/users/me', data);
    return res.data;
  },
  onboarding: async (data: Record<string, unknown>): Promise<User> => {
    const res = await apiClient.post('/api/onboarding', data);
    return res.data;
  }
};
