import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor (Insert Access Token)
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  }
  return config;
}, (error) => Promise.reject(error));

// Response Interceptor (Refresh Token)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // JWT Expired or Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');
        
        const res = await axios.post(`${baseURL}/api/auth/refresh`, { refreshToken });
        // NOTE: Depending on response structure, adapt below:
        // assuming res.data.accessToken exists if your backend returns new tokens
        const { accessToken, refreshToken: newRefreshToken } = res.data;
        
        if (accessToken) {
          localStorage.setItem('accessToken', accessToken);
          if (newRefreshToken) localStorage.setItem('refreshToken', newRefreshToken);
          
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest); // retry
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        if (typeof window !== 'undefined') {
          window.location.href = '/'; // redirect to login
        }
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);
