import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getCourses } from '../services/courseService';
import CourseCard from '../components/CourseCard';

const CATEGORIES = ['All', 'Programming', 'Design', 'Marketing', 'Business', 'Other'];
const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced'];

const CourseList = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [level, setLevel] = useState('All');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page };
      if (search) params.search = search;
      if (category !== 'All') params.category = category;
      if (level !== 'All') params.level = level;

      const { data } = await getCourses(params);
      setCourses(data.courses);
      setPages(data.pages);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  }, [search, category, level, page]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchCourses();
  };

  return (
    <div>
      <div className="bg-ink-900 py-10">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-white mb-1">Browse courses</h1>
          <p className="text-slate-400 text-sm">Find your next skill, priced in Taka</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-6">
        <form
          onSubmit={handleSearchSubmit}
          className="bg-white rounded-2xl shadow-md border border-slate-100 p-4 flex flex-col md:flex-row gap-3 mb-8"
        >
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={level}
            onChange={(e) => {
              setLevel(e.target.value);
              setPage(1);
            }}
            className="border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {LEVELS.map((lvl) => (
              <option key={lvl} value={lvl}>{lvl === 'All' ? 'All levels' : lvl}</option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-2.5 rounded-xl font-medium transition-colors"
          >
            Search
          </button>
        </form>

        {error && <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">{error}</div>}

        {loading ? (
          <p className="text-slate-500 pb-16">Loading courses...</p>
        ) : courses.length === 0 ? (
          <p className="text-slate-500 pb-16">No courses found. Try a different search or filter.</p>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
              {courses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>

            {pages > 1 && (
              <div className="flex justify-center gap-2 pb-16">
                {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-full text-sm font-medium transition-colors ${
                      p === page ? 'bg-ink-900 text-white' : 'bg-white border border-slate-200 hover:bg-cream-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CourseList;
