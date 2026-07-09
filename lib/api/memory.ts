import { apiClient } from './client';
import { MemoryItem } from '@/types';

export const memoryApi = {
  getAll: async (): Promise<MemoryItem[]> => {
    const res = await apiClient.get('/api/memories');
    return res.data.memories || [];
  },
  approve: async (conversationId: string, items: MemoryItem[]) => {
    const res = await apiClient.post('/api/memories/approve', { conversationId, items });
    return res.data;
  },
  delete: async (memoryId: string) => {
    const res = await apiClient.delete(`/api/memories/${memoryId}`);
    return res.data;
  }
};
