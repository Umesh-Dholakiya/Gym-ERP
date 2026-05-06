import axios from 'axios';

// Create axios instance with base configuration
// Use relative path when in development (Vite proxy handles it)
// Use full URL in production
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.DEV ? '/api' : 'https://gym-erp-backend-cvlk.onrender.com/api');

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // Reduced timeout to 10 seconds for better responsiveness
  headers: {
    'Content-Type': 'application/json',
  },
  // Retry configuration
  retry: 2,
  retryDelay: 1000
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Enhanced response interceptor with retry logic
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Network error handling
    if (!error.response) {
      console.error('Network Error:', error.message);
      
      // Add retry logic for network errors
      if (!originalRequest._retry && (originalRequest.retry || 0) < 2) {
        originalRequest._retry = true;
        originalRequest.retry = (originalRequest.retry || 0) + 1;
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000 * originalRequest.retry));
        
        console.log(`Retrying request (${originalRequest.retry}/2)`);
        return api.request(originalRequest);
      }
      
      return Promise.reject({
        response: {
          status: 0,
          data: {
            status: 'error',
            message: 'Network error. Please check your connection and try again.'
          }
        }
      });
    }

    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      // Clear auth data and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/admin/login';
      return Promise.reject(error);
    }
    
    // Handle 5xx server errors
    if (error.response?.status >= 500) {
      console.error('Server Error:', error.response.status, error.response.data);
      return Promise.reject({
        response: {
          status: error.response.status,
          data: {
            status: 'error',
            message: 'Server temporarily unavailable. Please try again later.'
          }
        }
      });
    }
    
    return Promise.reject(error);
  }
);


// AUTH API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  updatePassword: (data) => api.put('/auth/password', data),
};

// INQUIRY API
export const inquiryAPI = {
  create: (data) => api.post('/inquiries', data),
  getAll: (params) => api.get('/inquiries', { params }),
  getById: (id) => api.get(`/inquiries/${id}`),
  update: (id, data) => api.put(`/inquiries/${id}`, data),
  delete: (id) => api.delete(`/inquiries/${id}`),
  getStats: () => api.get('/inquiries/stats'),
  getPendingFollowUps: () => api.get('/inquiries/pending-followups'),
};

// Service caching mechanism
let serviceCache = {
  activeServices: null,
  lastFetch: 0,
  cacheTimeout: 5 * 60 * 1000 // 5 minutes cache
};

// SERVICE API
export const serviceAPI = {
  getAll: (params) => api.get('/services', { params }),
  getActive: async () => {
    const now = Date.now();
    
    // Return cached data if still valid
    if (serviceCache.activeServices && 
        (now - serviceCache.lastFetch) < serviceCache.cacheTimeout) {
      return serviceCache.activeServices;
    }
    
    try {
      const response = await api.get('/services/active');
      // Cache the response
      serviceCache.activeServices = response;
      serviceCache.lastFetch = now;
      return response;
    } catch (error) {
      // Clear cache on error
      serviceCache.activeServices = null;
      serviceCache.lastFetch = 0;
      throw error;
    }
  },
  getById: (id) => api.get(`/services/${id}`),
  create: (data) => api.post('/services', data),
  update: (id, data) => api.put(`/services/${id}`, data),
  delete: (id) => api.delete(`/services/${id}`),
  getStats: () => api.get('/services/stats'),
  // Method to manually clear cache
  clearCache: () => {
    serviceCache.activeServices = null;
    serviceCache.lastFetch = 0;
  }
};

// NOTIFICATION API
export const notificationAPI = {
  getAll: (params) => api.get('/notifications', { params }),
  getById: (id) => api.get(`/notifications/${id}`),
  markAsRead: (id) => api.put(`/notifications/${id}/read`), // Back to original with /read
  markAllAsRead: () => api.put('/notifications/mark-all-read'),
  delete: (id) => api.delete(`/notifications/${id}`),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  sendEmail: (data) => api.post('/notifications/send-email', data),
};

// MEMBER API
export const memberAPI = {
  getAll: (params) => api.get('/members', { params }),
  getById: (id) => api.get(`/members/${id}`),
  create: (data) => api.post('/members', data),
  update: (id, data) => api.put(`/members/${id}`, data),
  delete: (id) => api.delete(`/members/${id}`),
  getStats: () => api.get('/members/stats')
};

// MEMBERSHIP PLAN API
export const planAPI = {
  getAll: () => api.get('/plans'),
  getById: (id) => api.get(`/plans/${id}`),
  create: (data) => api.post('/plans', data),
  update: (id, data) => api.put(`/plans/${id}`, data),
  delete: (id) => api.delete(`/plans/${id}`),
  getStats: () => api.get('/plans/stats'),
  createDefault: () => api.post('/plans/default')
};

// ATTENDANCE API
export const attendanceAPI = {
  checkIn: (data) => api.post('/attendance/checkin', data),
  checkOut: (data) => api.post('/attendance/checkout', data),
  getRecords: (params) => api.get('/attendance', { params }),
  getMemberHistory: (memberId, params) => api.get(`/attendance/member/${memberId}`, { params }),
  getDailyStats: (params) => api.get('/attendance/stats/daily', { params }),
  getMonthlyReport: (params) => api.get('/attendance/stats/monthly', { params })
};

// TRAINER API
export const trainerAPI = {
  getAll: (params) => api.get('/trainers', { params }),
  getById: (id) => api.get(`/trainers/${id}`),
  create: (data) => api.post('/trainers', data),
  update: (id, data) => api.put(`/trainers/${id}`, data),
  delete: (id) => api.delete(`/trainers/${id}`),
  getStats: () => api.get('/trainers/stats'),
  getAvailability: (id) => api.get(`/trainers/${id}/availability`),
  // Method for creating trainer with photo
  createWithPhoto: (trainerData, photoFile) => {
    const formData = new FormData();
    
    // Append trainer data as JSON string
    formData.append('data', JSON.stringify(trainerData));
    
    // Append photo file
    if (photoFile) {
      formData.append('photo', photoFile);
    }
    
    return api.post('/trainers', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
  },
  // Method for updating trainer with photo
  updateWithPhoto: (id, trainerData, photoFile) => {
    const formData = new FormData();
    
    // Append trainer data as JSON string
    formData.append('data', JSON.stringify(trainerData));
    
    // Append photo file
    if (photoFile) {
      formData.append('photo', photoFile);
    }
    
    return api.put(`/trainers/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
  }
};

// CLASS SCHEDULE API
export const classAPI = {
  getAll: (params) => api.get('/classes', { params }),
  getById: (id) => api.get(`/classes/${id}`),
  create: (data) => api.post('/classes', data),
  update: (id, data) => api.put(`/classes/${id}`, data),
  delete: (id) => api.delete(`/classes/${id}`),
  enrollMember: (classId, data) => api.post(`/classes/${classId}/enroll`, data),
  getStats: () => api.get('/classes/stats')
};

export default api;