import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCourses } from '../services/courseService';
import CourseCard from '../components/CourseCard';

const CATEGORIES = [
  { name: 'Programming', icon: '💻' },
  { name: 'Design', icon: '🎨' },
  { name: 'Marketing', icon: '📣' },
  { name: 'Business', icon: '📊' },
];

const STATS = [
  { value: '৩০+', label: 'Courses live', sub: 'Across 5 categories' },
  { value: '৫০০+', label: 'Students learning', sub: 'And growing every week' },
  { value: '৯০%', label: 'Completion rate', sub: 'Among enrolled students' },
];

const Home = () => {
  const { user } = useAuth();
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCourses({ limit: 3 })
      .then(({ data }) => setFeatured(data.courses))
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-ink-900 relative overflow-hidden">
        <div
          className="absolute -right-24 -top-24 w-[420px] h-[420px] rounded-full bg-brand-500/20 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="absolute right-10 bottom-0 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl"
          aria-hidden="true"
        />
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28 relative grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-white leading-tight mb-5">
              Learn skills that move your career forward
            </h1>
            <p className="text-slate-300 text-lg mb-8 max-w-md">
              Courses built by working instructors, priced in Taka, with lessons you can finish
              between classes or after work.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/courses"
                className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-full font-medium transition-colors"
              >
                Browse courses
              </Link>
              {!user && (
                <Link
                  to="/register"
                  className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full font-medium transition-colors"
                >
                  Create free account
                </Link>
              )}
            </div>
          </div>

          <div className="relative hidden md:block">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
              <div className="bg-ink-800 rounded-2xl p-5 mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-lg">💻</span>
                  <div>
                    <p className="text-white text-sm font-medium">React for Beginners</p>
                    <p className="text-slate-400 text-xs">Lesson 3 of 8</p>
                  </div>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: '38%' }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {STATS.slice(0, 2).map((s) => (
                  <div key={s.label} className="bg-ink-800 rounded-2xl p-4">
                    <p className="text-2xl font-heading font-bold text-white">{s.value}</p>
                    <p className="text-slate-400 text-xs">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category chips */}
      <section className="max-w-6xl mx-auto px-6 -mt-8 relative">
        <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              to={`/courses?category=${cat.name}`}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-cream-50 transition-colors"
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className="font-medium text-slate-700 text-sm">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured courses */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="font-heading text-2xl font-bold text-slate-900">Featured courses</h2>
            <p className="text-slate-500 text-sm mt-1">Popular picks to start this week</p>
          </div>
          <Link to="/courses" className="text-brand-600 hover:text-brand-700 font-medium text-sm whitespace-nowrap">
            View all →
          </Link>
        </div>

        {loading ? (
          <p className="text-slate-500">Loading courses...</p>
        ) : featured.length === 0 ? (
          <p className="text-slate-500">No courses yet — check back soon.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </section>

      {/* Why learn with us */}
      <section className="bg-cream-50 border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-8">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-heading text-4xl font-bold text-ink-900 mb-2">{s.value}</p>
              <p className="font-medium text-slate-800">{s.label}</p>
              <p className="text-slate-500 text-sm mt-1">{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="max-w-6xl mx-auto px-6 py-16 text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-slate-900 mb-3">
            Ready to start learning?
          </h2>
          <p className="text-slate-500 mb-6">Join for free — no card required.</p>
          <Link
            to="/register"
            className="inline-block bg-ink-900 hover:bg-ink-800 text-white px-8 py-3 rounded-full font-medium transition-colors"
          >
            Create your account
          </Link>
        </section>
      )}
    </div>
  );
};

export default Home;
