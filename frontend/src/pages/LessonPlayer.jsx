import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getLessonById, getLessonsByCourse } from '../services/courseService';
import { updateProgress, getEnrollmentForCourse } from '../services/enrollmentService';
import { useAuth } from '../context/AuthContext';

const LessonPlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [lesson, setLesson] = useState(null);
  const [allLessons, setAllLessons] = useState([]);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [marking, setMarking] = useState(false);

  const fetchLesson = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await getLessonById(id);
      setLesson(data.lesson);

      const courseId = data.lesson.course._id || data.lesson.course;

      const [lessonsRes] = await Promise.all([getLessonsByCourse(courseId)]);
      setAllLessons(lessonsRes.data.lessons);

      if (user?.role === 'student') {
        try {
          const enrollRes = await getEnrollmentForCourse(courseId);
          setEnrollment(enrollRes.data.enrollment);
        } catch (err) {
          setEnrollment(null);
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to load lesson. You may need to enroll first.'
      );
    } finally {
      setLoading(false);
    }
  }, [id, user]);

  useEffect(() => {
    fetchLesson();
  }, [fetchLesson]);

  const isCompleted = enrollment?.progress?.some(
    (p) => (p.lesson?._id || p.lesson) === id && p.completed
  );

  const handleToggleComplete = async () => {
    if (!lesson) return;
    setMarking(true);
    try {
      const courseId = lesson.course._id || lesson.course;
      const { data } = await updateProgress(courseId, id, !isCompleted);
      setEnrollment(data.enrollment);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update progress');
    } finally {
      setMarking(false);
    }
  };

  if (loading) return <p className="text-center py-12 text-slate-500">Loading lesson...</p>;

  if (error && !lesson) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={() => navigate(-1)} className="text-brand-600 hover:text-brand-700">
          ← Go back
        </button>
      </div>
    );
  }

  const currentIndex = allLessons.findIndex((l) => l._id === id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <Link
        to={`/courses/${lesson.course._id || lesson.course}`}
        className="text-brand-600 hover:text-brand-700 text-sm"
      >
        ← Back to course
      </Link>

      <h1 className="font-heading text-2xl font-bold mt-3 mb-4">{lesson.title}</h1>

      {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">{error}</div>}

      <div className="bg-black rounded-lg overflow-hidden mb-4 aspect-video">
        <video
          key={lesson._id}
          controls
          className="w-full h-full"
          src={lesson.videoUrl}
        >
          Your browser does not support video playback.
        </video>
      </div>

      {lesson.resources?.length > 0 && (
        <div className="bg-white shadow-sm border rounded-lg p-4 mb-4">
          <h3 className="font-medium mb-2">Resources</h3>
          <ul className="list-disc list-inside text-sm text-brand-600">
            {lesson.resources.map((r, i) => (
              <li key={i}>
                <a href={r} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {r}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {user?.role === 'student' && (
        <button
          onClick={handleToggleComplete}
          disabled={marking}
          className={`px-6 py-2 rounded-xl font-medium mb-6 ${
            isCompleted
              ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              : 'bg-green-600 text-white hover:bg-green-700'
          } disabled:opacity-50`}
        >
          {marking ? 'Saving...' : isCompleted ? '✓ Completed — click to undo' : 'Mark as Complete'}
        </button>
      )}

      <div className="flex justify-between border-t pt-4">
        {prevLesson ? (
          <Link to={`/lessons/${prevLesson._id}`} className="text-brand-600 hover:text-brand-700 text-sm">
            ← {prevLesson.title}
          </Link>
        ) : (
          <span />
        )}
        {nextLesson ? (
          <Link to={`/lessons/${nextLesson._id}`} className="text-brand-600 hover:text-brand-700 text-sm">
            {nextLesson.title} →
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
};

export default LessonPlayer;
