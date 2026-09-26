import api from './api';

export const enrollInCourse = (courseId) => api.post('/enrollments', { courseId });

export const getMyEnrollments = () => api.get('/enrollments/my-courses');

export const getEnrollmentForCourse = (courseId) => api.get(`/enrollments/${courseId}`);

export const updateProgress = (courseId, lessonId, completed) =>
  api.put(`/enrollments/${courseId}/progress`, { lessonId, completed });

export const getCourseEnrollments = (courseId) => api.get(`/enrollments/course/${courseId}/students`);

export const getRecentActivity = () => api.get('/enrollments/recent-activity');
