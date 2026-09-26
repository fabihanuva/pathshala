import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCourseById } from '../services/courseService';
import { enrollInCourse, getEnrollmentForCourse } from '../services/enrollmentService';
import { useAuth } from '../context/AuthContext';
import ProgressBar from '../components/ProgressBar';
import { formatPrice, getCategoryTheme } from '../utils/format';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await getCourseById(id);
      setCourse(data.course);

      if (user?.role === 'student') {
        try {
          const enrollRes = await getEnrollmentForCourse(id);
          setEnrollment(enrollRes.data.enrollment);
        } catch (err) {
          setEnrollment(null);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load course');
    } finally {
      setLoading(false);
    }
  }, [id, user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setEnrolling(true);
    setError('');
    try {
      await enrollInCourse(id);
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to enroll');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return <p className="text-center py-16 text-slate-500">Loading course...</p>;
  if (!course) return <p className="text-center py-16 text-slate-500">Course not found.</p>;

  const theme = getCategoryTheme(course.category);
  const isOwnerOrAdmin = user && (user.id === course.instructor?._id || user.role === 'admin');
  const isEnrolled = !!enrollment;

  return (
    <div>
      {/* Banner */}
      <div className={`relative overflow-hidden ${course.thumbnail ? '' : `bg-gradient-to-br ${theme.gradient}`}`}>
        {course.thumbnail && (
          <img src={course.thumbnail} alt={course.title} className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-ink-900/60" />
        <div className="max-w-5xl mx-auto px-6 py-16 relative">
          <span className="bg-white/90 text-ink-900 text-xs font-semibold px-3 py-1 rounded-full">
            {course.category}
          </span>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-white mt-4 mb-2">{course.title}</h1>
          <p className="text-slate-200">By {course.instructor?.name}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {error && <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">{error}</div>}

          <h2 className="font-heading text-xl font-semibold mb-3">About this course</h2>
          <p className="text-slate-600 mb-8">{course.description}</p>

          <h2 className="font-heading text-xl font-semibold mb-4">
            Lessons ({course.lessons?.length || 0})
          </h2>

          {course.lessons?.length === 0 ? (
            <p className="text-slate-500">No lessons added yet.</p>
          ) : (
            <div className="space-y-2">
              {course.lessons
                ?.slice()
                .sort((a, b) => a.order - b.order)
                .map((lesson, i) => {
                  const lessonProgress = enrollment?.progress?.find(
                    (p) => (p.lesson?._id || p.lesson) === lesson._id
                  );
                  const canAccess = isEnrolled || isOwnerOrAdmin;

                  return (
                    <div
                      key={lesson._id}
                      className="bg-white border border-slate-100 rounded-xl p-4 flex justify-between items-center"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 text-xs font-medium flex items-center justify-center">
                          {i + 1}
                        </span>
                        <div>
                          <p className="font-medium text-slate-800">{lesson.title}</p>
                          <p className="text-xs text-slate-500">{lesson.duration} min</p>
                        </div>
                      </div>

                      {lessonProgress?.completed && (
                        <span className="text-brand-600 text-xs font-medium mr-2">✓ Completed</span>
                      )}

                      {canAccess ? (
                        <Link
                          to={`/lessons/${lesson._id}`}
                          className="text-brand-600 hover:text-brand-700 text-sm font-medium"
                        >
                          {isOwnerOrAdmin && !isEnrolled ? 'Preview' : 'View'}
                        </Link>
                      ) : (
                        <span className="text-slate-400 text-sm">🔒 Enroll to access</span>
                      )}
                    </div>
                  );
                })}
            </div>
          )}

          {isOwnerOrAdmin && (
            <div className="mt-6 flex gap-3">
              <Link
                to={`/instructor/courses/${course._id}/edit`}
                className="border border-slate-200 px-4 py-2 rounded-xl text-sm font-medium hover:bg-cream-50"
              >
                Edit course
              </Link>
              <Link
                to={`/instructor/courses/${course._id}/lessons/new`}
                className="border border-slate-200 px-4 py-2 rounded-xl text-sm font-medium hover:bg-cream-50"
              >
                Add lesson
              </Link>
            </div>
          )}
        </div>

        {/* Sidebar enroll card */}
        <div>
          <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6 sticky top-24">
            <p className="font-heading text-3xl font-bold text-amber-500 mb-4">
              {formatPrice(course.price)}
            </p>

            {user?.role === 'student' && !isEnrolled && (
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="w-full bg-brand-500 hover:bg-brand-600 text-white py-3 rounded-xl font-medium transition-colors disabled:opacity-50"
              >
                {enrolling ? 'Enrolling...' : 'Enroll now'}
              </button>
            )}

            {isEnrolled && (
              <div>
                <p className="text-brand-600 font-medium text-sm mb-3">✓ You're enrolled</p>
                <ProgressBar percent={enrollment.overallProgress} />
              </div>
            )}

            {!user && (
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-brand-500 hover:bg-brand-600 text-white py-3 rounded-xl font-medium transition-colors"
              >
                Log in to enroll
              </button>
            )}

            <div className="mt-5 pt-5 border-t border-slate-100 text-sm text-slate-500 space-y-2">
              <p>{course.lessons?.length || 0} lessons</p>
              <p>Full lifetime access</p>
              <p>Certificate on completion</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
