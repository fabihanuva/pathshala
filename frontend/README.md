# LMS Frontend

React (Vite) + Tailwind frontend for the Learning Management System final project.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Copy `.env.example` to `.env`:
   ```
   cp .env.example .env
   ```
   Set `VITE_API_URL` to your backend URL (e.g. `http://localhost:5000/api` for local dev).

3. Run dev server:
   ```
   npm run dev
   ```
   Opens at `http://localhost:5173`.

## What's included

- Vite + React + React Router + Tailwind CSS
- `AuthContext` — handles login/register/logout, persists JWT + user to localStorage
- Axios instance (`services/api.js`) that auto-attaches the JWT to every request and
  auto-logs-out on 401 responses
- `courseService.js` / `enrollmentService.js` — wrap every backend endpoint (courses,
  lessons, enrollments, progress) as simple async functions
- `ProtectedRoute` component — redirects to `/login` if not authenticated, supports
  role restriction: `<ProtectedRoute roles={['admin']}>...</ProtectedRoute>`

### Pages
- **Home** — landing page
- **Login / Register** — with client-side validation
- **Dashboard** — role-aware: students see enrolled courses + progress bars,
  instructors/admins see their own courses with a "Create New Course" action
- **CourseList** (`/courses`) — search, category filter, pagination, pulls from
  `GET /courses`
- **CourseDetails** (`/courses/:id`) — shows lesson list, enroll button for students,
  progress bar once enrolled, edit/add-lesson links for the owning instructor/admin
- **LessonPlayer** (`/lessons/:id`) — video playback, mark-complete toggle, prev/next
  lesson navigation; blocked server-side unless enrolled/owner/admin
- **CourseForm** (`/instructor/courses/new` and `/edit`) — create/edit/delete a course
- **LessonForm** (`/instructor/courses/:courseId/lessons/new`) — add a lesson to a course
- **Profile** (`/profile`) — view/update name and avatar

## Next steps (Day 6)

- Wire up any remaining edge cases (empty states, loading skeletons) you want polished
- Full manual test pass: register → browse → enroll → watch lesson → mark complete →
  instructor creates a course and lesson → admin views everything
- Responsive check on mobile breakpoints
- Then move to Day 7: deployment (backend → Render, frontend → Vercel/Netlify)
