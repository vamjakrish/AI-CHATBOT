import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const signup = (data) => API.post('/auth/signup', data);
export const login = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');

export const getChats = () => API.get('/chat');
export const getChatById = (id) => API.get(`/chat/${id}`);
export const createChat = () => API.post('/chat');
export const sendMessage = (id, message) => API.post(`/chat/${id}/message`, { message });
export const deleteChat = (id) => API.delete(`/chat/${id}`);
export const clearMessages = (id) => API.delete(`/chat/${id}/messages`);

export default API;
