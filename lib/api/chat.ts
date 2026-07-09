import { apiClient } from './client';
import { SummaryResult, MemoryItem } from '@/types';

export const chatApi = {
  start: async (mood: string) => {
    const res = await apiClient.post('/api/conversations', { mood });
    return res.data; // { conversationId, mood, status }
  },
  sendMessage: async (conversationId: string, message: string) => {
    const res = await apiClient.post(`/api/conversations/${conversationId}/messages`, { message });
    return res.data; // { reply, riskLevel, usedMemories }
  },
  sendAudio: async (conversationId: string, audioBlob: Blob, durationMs: number) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'voice.webm');
    formData.append('durationMs', String(durationMs));
    
    // axios handles FormData boundaries automatically when Content-Type is multipart/form-data
    // Setting it to undefined allows the browser to set the boundary
    const res = await apiClient.post(`/api/conversations/${conversationId}/audio`, formData, {
      headers: {
        'Content-Type': undefined
      }
    });
    return res.data; // { transcript, reply, riskLevel, usedMemories }
  },
  end: async (conversationId: string): Promise<{ summary: SummaryResult, memoryCandidates: MemoryItem[] }> => {
    const res = await apiClient.post(`/api/conversations/${conversationId}/end`);
    return res.data; 
  }
};
