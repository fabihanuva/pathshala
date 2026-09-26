import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createLesson } from '../services/courseService';

// Simple "add a lesson" form scoped to one course (courseId comes from the URL)
const LessonForm = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    videoUrl: '',
    duration: 10,
    order: 1,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await createLesson({ ...formData, course: courseId });
      navigate(`/courses/${courseId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add lesson');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <h1 className="font-heading text-2xl font-bold mb-6">Add Lesson</h1>

      {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4 bg-white shadow-sm border border-slate-100 rounded-2xl p-6">
        <div>
          <label className="block text-sm font-medium mb-1">Lesson Title</label>
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
          <label className="block text-sm font-medium mb-1">Video URL</label>
          <input
            type="text"
            name="videoUrl"
            required
            placeholder="https://... (mp4 link, YouTube embed, Cloudinary URL, etc.)"
            value={formData.videoUrl}
            onChange={handleChange}
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
            <input
              type="number"
              name="duration"
              min="0"
              value={formData.duration}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Order</label>
            <input
              type="number"
              name="order"
              min="1"
              value={formData.order}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-2 rounded-xl font-medium disabled:opacity-50"
        >
          {saving ? 'Adding...' : 'Add Lesson'}
        </button>
      </form>
    </div>
  );
};

export default LessonForm;
