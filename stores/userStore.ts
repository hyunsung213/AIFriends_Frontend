import { create } from 'zustand';
import { User } from '@/types';
import { authApi } from '@/lib/api/auth';
import { userApi } from '@/lib/api/user';

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  fetchUser: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  onboarding: (data: any) => Promise<void>;
  logout: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: async (data) => {
    const res = await authApi.login(data);
    localStorage.setItem('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    set({ user: res.user, isAuthenticated: true });
  },

  register: async (data) => {
    const res = await authApi.register(data);
    localStorage.setItem('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    set({ user: res.user, isAuthenticated: true });
  },

  fetchUser: async () => {
    try {
      const user = await userApi.getMe();
      set({ user, isAuthenticated: true });
    } catch (error) {
      set({ user: null, isAuthenticated: false });
    }
  },

  updateUser: async (data) => {
    const updatedUser = await userApi.updateMe(data);
    set({ user: updatedUser });
  },

  onboarding: async (data) => {
    const updatedUser = await userApi.onboarding(data);
    set({ user: updatedUser });
  },

  logout: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      set({ user: null, isAuthenticated: false });
    }
  },
}));
