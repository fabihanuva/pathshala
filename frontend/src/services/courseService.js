import api from './api';

// Get courses with optional search/filter/pagination params
// params example: { search: 'react', category: 'Programming', minPrice: 0, maxPrice: 50, page: 1 }
export const getCourses = (params = {}) => api.get('/courses', { params });

export const getCourseById = (id) => api.get(`/courses/${id}`);

export const getMyCourses = () => api.get('/courses/my-courses');

export const createCourse = (data) => api.post('/courses', data);

export const updateCourse = (id, data) => api.put(`/courses/${id}`, data);

export const deleteCourse = (id) => api.delete(`/courses/${id}`);

// Lessons (nested under courses)
export const getLessonsByCourse = (courseId) => api.get(`/lessons/course/${courseId}`);

export const getLessonById = (id) => api.get(`/lessons/${id}`);

export const createLesson = (data) => api.post('/lessons', data);

export const updateLesson = (id, data) => api.put(`/lessons/${id}`, data);

export const deleteLesson = (id) => api.delete(`/lessons/${id}`);
