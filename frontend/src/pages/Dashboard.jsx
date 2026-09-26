import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyCourses, getCourses } from '../services/courseService';
import { getMyEnrollments, getRecentActivity } from '../services/enrollmentService';
import CourseCard from '../components/CourseCard';
import ProgressBar from '../components/ProgressBar';
import { formatPrice, getCategoryTheme } from '../utils/format';

const greeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

const StatCard = ({ label, value, sub, icon }) => (
  <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5">
    <div className="flex items-start justify-between mb-3">
      <span className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center text-lg">
        {icon}
      </span>
    </div>
    <p className="font-heading text-2xl font-bold text-slate-900">{value}</p>
    <p className="text-sm text-slate-500 mt-0.5">{label}</p>
    {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
  </div>
);

const StudentDashboard = ({ user }) => {
  const [enrollments, setEnrollments] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [enrollRes, recRes] = await Promise.all([
          getMyEnrollments(),
          getCourses({ limit: 3 }),
        ]);
        setEnrollments(enrollRes.data.enrollments);
        setRecommended(recRes.data.courses);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const totalCourses = enrollments.length;
  const completedCourses = enrollments.filter((e) => e.overallProgress === 100).length;
  const avgProgress = totalCourses
    ? Math.round(enrollments.reduce((sum, e) => sum + e.overallProgress, 0) / totalCourses)
    : 0;
  const lessonsCompleted = enrollments.reduce(
    (sum, e) => sum + (e.progress?.filter((p) => p.completed).length || 0),
    0
  );

  const inProgress = enrollments.filter((e) => e.overallProgress < 100);
  const notEnrolledRecommended = recommended.filter(
    (c) => !enrollments.some((e) => e.course?._id === c._id)
  );

  if (loading) return <p className="text-slate-500 py-16 text-center">Loading your dashboard...</p>;

  return (
    <div className="pb-20">
      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">{error}</div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatCard icon="📚" value={totalCourses} label="Enrolled courses" />
        <StatCard icon="✅" value={completedCourses} label="Completed" />
        <StatCard icon="📈" value={`${avgProgress}%`} label="Average progress" />
        <StatCard icon="🎯" value={lessonsCompleted} label="Lessons finished" />
      </div>

      {/* Continue learning */}
      <div className="mb-12">
        <div className="flex justify-between items-end mb-4">
          <h2 className="font-heading text-xl font-bold text-slate-900">Continue learning</h2>
          <Link to="/courses" className="text-brand-600 hover:text-brand-700 text-sm font-medium">
            Browse more →
          </Link>
        </div>

        {inProgress.length === 0 ? (
          <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-8 text-center">
            <p className="text-slate-500 mb-3">
              {totalCourses === 0
                ? "You haven't enrolled in any courses yet."
                : "You've completed everything you're enrolled in — nice work!"}
            </p>
            <Link to="/courses" className="text-brand-600 hover:text-brand-700 font-medium">
              Browse courses to get started
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {inProgress.map((enrollment) => {
              const theme = getCategoryTheme(enrollment.course?.category);
              return (
                <div
                  key={enrollment._id}
                  className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 flex gap-4"
                >
                  <div
                    className={`w-16 h-16 rounded-xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center text-2xl shrink-0`}
                  >
                    {theme.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-medium text-brand-600">
                      {enrollment.course?.category}
                    </span>
                    <h3 className="font-heading font-semibold text-slate-900 truncate">
                      {enrollment.course?.title}
                    </h3>
                    <p className="text-xs text-slate-500 mb-2">
                      By {enrollment.course?.instructor?.name}
                    </p>
                    <ProgressBar percent={enrollment.overallProgress} />
                    <Link
                      to={`/courses/${enrollment.course?._id}`}
                      className="inline-block mt-2 text-brand-600 hover:text-brand-700 text-sm font-medium"
                    >
                      Continue →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Achievements */}
      {completedCourses > 0 && (
        <div className="mb-12">
          <h2 className="font-heading text-xl font-bold text-slate-900 mb-4">Completed courses</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {enrollments
              .filter((e) => e.overallProgress === 100)
              .map((e) => (
                <div
                  key={e._id}
                  className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 flex items-center gap-3"
                >
                  <span className="w-10 h-10 rounded-full bg-amber-400/20 text-amber-500 flex items-center justify-center text-lg">
                    🏆
                  </span>
                  <div className="min-w-0">
                    <p className="font-medium text-slate-800 truncate">{e.course?.title}</p>
                    <p className="text-xs text-slate-500">Certificate earned</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Recommended */}
      {notEnrolledRecommended.length > 0 && (
        <div>
          <h2 className="font-heading text-xl font-bold text-slate-900 mb-4">Recommended for you</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {notEnrolledRecommended.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const InstructorDashboard = ({ user }) => {
  const [courses, setCourses] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [coursesRes, activityRes] = await Promise.all([getMyCourses(), getRecentActivity()]);
        setCourses(coursesRes.data.courses);
        setActivity(activityRes.data.activity);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <p className="text-slate-500 py-16 text-center">Loading your dashboard...</p>;

  const totalStudents = courses.reduce((sum, c) => sum + (c.studentCount || 0), 0);
  const totalRevenue = courses.reduce((sum, c) => sum + (c.revenue || 0), 0);
  const publishedCount = courses.filter((c) => c.published).length;
  const topCourse = [...courses].sort((a, b) => (b.studentCount || 0) - (a.studentCount || 0))[0];

  return (
    <div className="pb-20">
      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">{error}</div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatCard icon="🎓" value={courses.length} label="Courses" sub={`${publishedCount} published`} />
        <StatCard icon="👥" value={totalStudents} label="Total students" />
        <StatCard icon="৳" value={formatPrice(totalRevenue)} label="Estimated revenue" />
        <StatCard
          icon="⭐"
          value={topCourse ? topCourse.studentCount : 0}
          label="Top course enrollments"
          sub={topCourse?.title}
        />
      </div>

      {/* Course performance table + recent activity */}
      <div className="grid lg:grid-cols-3 gap-6 mb-12">
        <div className="lg:col-span-2">
          <div className="flex justify-between items-end mb-4">
            <h2 className="font-heading text-xl font-bold text-slate-900">Course performance</h2>
            <Link
              to="/instructor/courses/new"
              className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
            >
              + New course
            </Link>
          </div>

          {courses.length === 0 ? (
            <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-8 text-center">
              <p className="text-slate-500">
                You haven't created any courses yet. Click "New course" to get started.
              </p>
            </div>
          ) : (
            <div className="bg-white border border-slate-100 shadow-sm rounded-2xl overflow-hidden overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-cream-50 text-slate-500 text-left">
                  <tr>
                    <th className="px-5 py-3 font-medium">Course</th>
                    <th className="px-5 py-3 font-medium">Category</th>
                    <th className="px-5 py-3 font-medium">Price</th>
                    <th className="px-5 py-3 font-medium">Students</th>
                    <th className="px-5 py-3 font-medium">Revenue</th>
                    <th className="px-5 py-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {courses.map((course) => (
                    <tr key={course._id} className="hover:bg-cream-50/50">
                      <td className="px-5 py-3 font-medium text-slate-800 max-w-xs truncate">
                        {course.title}
                      </td>
                      <td className="px-5 py-3 text-slate-500">{course.category}</td>
                      <td className="px-5 py-3 text-slate-500">{formatPrice(course.price)}</td>
                      <td className="px-5 py-3 text-slate-500">{course.studentCount}</td>
                      <td className="px-5 py-3 font-medium text-amber-500">{formatPrice(course.revenue)}</td>
                      <td className="px-5 py-3 text-right">
                        <Link
                          to={`/courses/${course._id}`}
                          className="text-brand-600 hover:text-brand-700 font-medium"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent activity feed */}
        <div>
          <h2 className="font-heading text-xl font-bold text-slate-900 mb-4">Recent activity</h2>
          <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5">
            {activity.length === 0 ? (
              <p className="text-slate-500 text-sm">No enrollments yet.</p>
            ) : (
              <ul className="space-y-4">
                {activity.map((a) => (
                  <li key={a._id} className="flex items-start gap-3">
                    <span className="w-8 h-8 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center text-sm shrink-0">
                      🎓
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm text-slate-800">
                        <span className="font-medium">{a.student?.name}</span> enrolled in{' '}
                        <span className="font-medium">{a.course?.title}</span>
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {new Date(a.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* My courses grid */}
      {courses.length > 0 && (
        <div>
          <h2 className="font-heading text-xl font-bold text-slate-900 mb-4">My courses</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const HERO_SUBTEXT = {
  student: 'Keep going — a little progress each day adds up.',
  instructor: "Here's how your courses are performing.",
  admin: "Here's what's happening across the platform.",
};

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="px-4 md:px-8 py-6 md:py-8">
      {/* Hero card */}
      <div className="bg-ink-900 rounded-3xl relative overflow-hidden mb-8">
        <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-brand-500/20 blur-3xl" aria-hidden="true" />
        <div className="px-6 md:px-8 py-8 relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-white mb-1">
              {greeting()}, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-slate-300 text-sm">{HERO_SUBTEXT[user?.role] || ''}</p>
          </div>
          <span className="self-start md:self-auto bg-white/10 text-white text-xs font-medium px-3 py-1.5 rounded-full capitalize w-fit">
            {user?.role} account
          </span>
        </div>
      </div>

      {user?.role === 'student' && <StudentDashboard user={user} />}
      {(user?.role === 'instructor' || user?.role === 'admin') && <InstructorDashboard user={user} />}
    </div>
  );
};

export default Dashboard;
