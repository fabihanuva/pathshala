import React from 'react';
import { Link } from 'react-router-dom';
import { formatPrice, getCategoryTheme, getLevelTheme } from '../utils/format';

const CourseCard = ({ course }) => {
  const theme = getCategoryTheme(course.category);

  return (
    <Link
      to={`/courses/${course._id}`}
      className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col"
    >
      <div className={`h-36 relative overflow-hidden`}>
        {course.thumbnail ? (
          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${theme.gradient} flex items-center justify-center`}>
            <span className="text-5xl opacity-90">{theme.icon}</span>
          </div>
        )}
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-ink-900 text-xs font-semibold px-2.5 py-1 rounded-full">
          {course.category}
        </span>
        {course.level && (
          <span className={`absolute top-3 right-3 ${getLevelTheme(course.level)} text-xs font-semibold px-2.5 py-1 rounded-full`}>
            {course.level}
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-heading font-semibold text-slate-900 mb-1 line-clamp-2 group-hover:text-brand-600 transition-colors">
          {course.title}
        </h3>
        <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">{course.description}</p>
        <div className="flex justify-between items-center text-sm border-t border-slate-100 pt-3">
          <span className="text-slate-500">{course.instructor?.name}</span>
          <span className="font-heading font-bold text-amber-500">{formatPrice(course.price)}</span>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
