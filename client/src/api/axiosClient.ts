import axios from 'axios';

export const axiosClient = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});


axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('drive_auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR: Handle global structural errors (e.g., automatic logout on token expiry)
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Security handshake expired. Evicting session states.');
      localStorage.removeItem('drive_auth_token');
      window.location.reload(); // Force system state purge
    }
    return Promise.reject(error);
  }
);