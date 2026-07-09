import { apiClient } from './client';
import { WeeklyReport } from '@/types';

export const reportApi = {
  getWeekly: async (): Promise<WeeklyReport> => {
    const res = await apiClient.get('/api/reports/weekly');
    return res.data;
  },
  generateWeekly: async (): Promise<WeeklyReport> => {
    const res = await apiClient.post('/api/reports/weekly/generate');
    return res.data;
  }
};
