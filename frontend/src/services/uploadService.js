import api from './api';

// Uploads an image file to the backend, which streams it to Cloudinary and
// returns the hosted URL. Use the returned url as a course/lesson thumbnail.
export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append('image', file);

  return api.post('/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
