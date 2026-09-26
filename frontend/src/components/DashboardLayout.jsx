import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

// Wraps the "logged-in app" pages (Dashboard, Profile, Admin) in the sidebar shell,
// as opposed to the public marketing Navbar used for Home/Login/Courses browsing.
const DashboardLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-cream-50">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <Topbar />
        <main>{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
