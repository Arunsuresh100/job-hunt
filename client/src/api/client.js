import axios from 'axios';

const getBaseURL = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  return '/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchJobs = async (params) => {
  const response = await api.get('/jobs', { params });
  return response.data;
};

export const syncJobs = async () => {
  const response = await api.post('/jobs/sync');
  return response.data;
};

export const fetchExams = async (params) => {
  const response = await api.get('/exams', { params });
  return response.data;
};

export const createExam = async (examData) => {
  const response = await api.post('/exams', examData);
  return response.data;
};

export const updateExam = async (id, examData) => {
  const response = await api.put(`/exams/${id}`, examData);
  return response.data;
};

export const deleteExam = async (id) => {
  const response = await api.delete(`/exams/${id}`);
  return response.data;
};

export const fetchSavedItems = async () => {
  const response = await api.get('/saved');
  return response.data;
};

export const toggleSaveItem = async (itemType, itemId) => {
  const response = await api.post('/saved/toggle', { itemType, itemId });
  return response.data;
};

export const fetchDashboardStats = async () => {
  const response = await api.get('/stats');
  return response.data;
};

export default api;
