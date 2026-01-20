import axios from 'axios';
import { CONFIG } from '../config/config';

export const apiClient = axios.create({
  baseURL: CONFIG.API_BASE_URL,
  timeout: CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.params || '', config.data || '');
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response Interceptor for cleaner error handling and logging
apiClient.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.error || error.response?.data?.message || error.message || 'An unexpected error occurred';
    
    console.error(`[API Error] ${status || 'NET'} ${error.config?.url}: ${message}`);
    
    const friendlyError = new Error(message);
    (friendlyError as any).status = status;
    
    return Promise.reject(friendlyError);
  }
);
