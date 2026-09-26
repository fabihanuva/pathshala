import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createCourse, updateCourse, getCourseById, deleteCourse } from '../services/courseService';
import { uploadImage } from '../services/uploadService';

const CATEGORIES = ['Programming', 'Design', 'Marketing', 'Business', 'Other'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

// Handles both "create" (no :id in URL) and "edit" (has :id) via the same form
const CourseForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Programming',
    level: 'Beginner',
    price: 0,
    thumbnail: '',
  });
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      getCourseById(id)
        .then(({ data }) => {
          const { title, description, category, level, price, thumbnail } = data.course;
          setFormData({ title, description, category, level: level || 'Beginner', price, thumbnail: thumbnail || '' });
        })
        .catch(() => setError('Failed to load course'))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setUploading(true);
    try {
      const { data } = await uploadImage(file);
      setFormData((prev) => ({ ...prev, thumbnail: data.url }));
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Image upload failed. Make sure CLOUDINARY_* is set in the backend .env.'
      );
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      if (isEdit) {
        await updateCourse(id, formData);
        navigate(`/courses/${id}`);
      } else {
        const { data } = await createCourse(formData);
        navigate(`/courses/${data.course._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save course');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this course? This also removes its lessons and enrollments.')) return;
    try {
      await deleteCourse(id);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete course');
    }
  };

  if (loading) return <p className="text-center py-12 text-slate-500">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <h1 className="font-heading text-2xl font-bold mb-6">{isEdit ? 'Edit Course' : 'Create New Course'}</h1>

      {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4 bg-white shadow-sm border border-slate-100 rounded-2xl p-6">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            required
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Level</label>
            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>{lvl}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Price (৳ Taka, 0 = free)</label>
            <input
              type="number"
              name="price"
              min="0"
              step="1"
              value={formData.price}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Course thumbnail</label>

          <div className="flex items-center gap-3 mb-2">
            <label className="cursor-pointer bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl text-sm font-medium transition-colors">
              {uploading ? 'Uploading...' : '📷 Upload image'}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
                className="hidden"
              />
            </label>
            <span className="text-xs text-slate-400">or paste an image URL below</span>
          </div>

          <input
            type="text"
            name="thumbnail"
            value={formData.thumbnail}
            onChange={handleChange}
            placeholder="https://..."
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <p className="text-xs text-slate-400 mt-1">
            Leave blank to use a generated cover based on the course category.
          </p>
          {formData.thumbnail && (
            <img
              src={formData.thumbnail}
              alt="Thumbnail preview"
              className="mt-2 h-32 w-full object-cover rounded-lg border"
              onError={(e) => (e.target.style.display = 'none')}
            />
          )}
        </div>

        <div className="flex justify-between items-center pt-2">
          <button
            type="submit"
            disabled={saving || uploading}
            className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-2 rounded-xl font-medium disabled:opacity-50"
          >
            {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Course'}
          </button>

          {isEdit && (
            <button
              type="button"
              onClick={handleDelete}
              className="text-red-600 hover:underline text-sm font-medium"
            >
              Delete Course
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CourseForm;
