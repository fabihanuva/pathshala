import React, { useEffect, useState } from 'react';
import { getAllUsers } from '../services/userService';

const ROLE_BADGE = {
  student: 'bg-brand-50 text-brand-700',
  instructor: 'bg-sky-50 text-sky-700',
  admin: 'bg-amber-50 text-amber-700',
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  useEffect(() => {
    getAllUsers()
      .then(({ data }) => setUsers(data.users))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load users'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const counts = {
    student: users.filter((u) => u.role === 'student').length,
    instructor: users.filter((u) => u.role === 'instructor').length,
    admin: users.filter((u) => u.role === 'admin').length,
  };

  return (
    <div className="px-4 md:px-8 py-6 md:py-8">
      <h1 className="font-heading text-2xl font-bold text-slate-900 mb-1">Users</h1>
      <p className="text-slate-500 text-sm mb-6">Everyone registered on the platform.</p>

      <div className="grid grid-cols-3 gap-4 mb-8 max-w-xl">
        <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-4 text-center">
          <p className="font-heading text-2xl font-bold text-slate-900">{counts.student}</p>
          <p className="text-xs text-slate-500 mt-1">Students</p>
        </div>
        <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-4 text-center">
          <p className="font-heading text-2xl font-bold text-slate-900">{counts.instructor}</p>
          <p className="text-xs text-slate-500 mt-1">Instructors</p>
        </div>
        <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-4 text-center">
          <p className="font-heading text-2xl font-bold text-slate-900">{counts.admin}</p>
          <p className="text-xs text-slate-500 mt-1">Admins</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="All">All roles</option>
          <option value="student">Student</option>
          <option value="instructor">Instructor</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {error && <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">{error}</div>}

      {loading ? (
        <p className="text-slate-500">Loading users...</p>
      ) : (
        <div className="bg-white border border-slate-100 shadow-sm rounded-2xl overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-cream-50 text-slate-500 text-left">
              <tr>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="px-5 py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((u) => (
                <tr key={u._id} className="hover:bg-cream-50/50">
                  <td className="px-5 py-3 font-medium text-slate-800">{u.name}</td>
                  <td className="px-5 py-3 text-slate-500">{u.email}</td>
                  <td className="px-5 py-3">
                    <span className={`${ROLE_BADGE[u.role]} text-xs font-semibold px-2.5 py-1 rounded-full capitalize`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-500">
                    {new Date(u.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-slate-500">
                    No users match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
