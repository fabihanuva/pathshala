import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import DashboardLayout from './components/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CourseList from './pages/CourseList';
import CourseDetails from './pages/CourseDetails';
import LessonPlayer from './pages/LessonPlayer';
import CourseForm from './pages/CourseForm';
import LessonForm from './pages/LessonForm';
import Profile from './pages/Profile';
import AdminUsers from './pages/AdminUsers';

// Wraps a protected page with both auth/role checks AND the sidebar app shell.
const AppPage = ({ children, roles }) => (
  <ProtectedRoute roles={roles}>
    <DashboardLayout>{children}</DashboardLayout>
  </ProtectedRoute>
);

function App() {
  return (
    <Routes>
      {/* Public marketing / content-browsing pages - top Navbar */}
      <Route
        path="/"
        element={
          <div className="min-h-screen bg-cream-50">
            <Navbar />
            <Home />
          </div>
        }
      />
      <Route
        path="/login"
        element={
          <div className="min-h-screen bg-cream-50">
            <Navbar />
            <Login />
          </div>
        }
      />
      <Route
        path="/register"
        element={
          <div className="min-h-screen bg-cream-50">
            <Navbar />
            <Register />
          </div>
        }
      />
      <Route
        path="/courses"
        element={
          <div className="min-h-screen bg-cream-50">
            <Navbar />
            <CourseList />
          </div>
        }
      />
      <Route
        path="/courses/:id"
        element={
          <div className="min-h-screen bg-cream-50">
            <Navbar />
            <CourseDetails />
          </div>
        }
      />
      <Route
        path="/lessons/:id"
        element={
          <ProtectedRoute>
            <div className="min-h-screen bg-cream-50">
              <Navbar />
              <LessonPlayer />
            </div>
          </ProtectedRoute>
        }
      />

      {/* Logged-in app pages - sidebar shell */}
      <Route path="/dashboard" element={<AppPage><Dashboard /></AppPage>} />
      <Route path="/profile" element={<AppPage><Profile /></AppPage>} />
      <Route
        path="/admin/users"
        element={
          <AppPage roles={['admin']}>
            <AdminUsers />
          </AppPage>
        }
      />
      <Route
        path="/instructor/courses/new"
        element={
          <AppPage roles={['instructor', 'admin']}>
            <CourseForm />
          </AppPage>
        }
      />
      <Route
        path="/instructor/courses/:id/edit"
        element={
          <AppPage roles={['instructor', 'admin']}>
            <CourseForm />
          </AppPage>
        }
      />
      <Route
        path="/instructor/courses/:courseId/lessons/new"
        element={
          <AppPage roles={['instructor', 'admin']}>
            <LessonForm />
          </AppPage>
        }
      />
    </Routes>
  );
}

export default App;
