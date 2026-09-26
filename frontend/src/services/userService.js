import api from './api';

// Admin-only: list every registered user
export const getAllUsers = () => api.get('/users');
