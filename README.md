# Pathshala

Pathshala is a full-stack Learning Management System (LMS) where students browse and
enroll in courses, watch video lessons, and track their progress; instructors create
and manage their own courses; and admins manage every user on the platform. Built as
a final project for the MERN Stack Development course (Batch ES MERN 2501).

## Features

### Authentication
- Registration and login (JWT-based, stored client-side)
- Role-based access: `student`, `instructor`, `admin`
- Password hashing with bcrypt
- Protected routes, both on the API (middleware) and in the React app

### Student
- Dashboard with enrolled courses, completion stats, and progress bars
- Browse and search courses, with category and level filters
- Enroll in a course and track per-lesson progress
- Watch video lessons with a mark-complete toggle and prev/next navigation
- Editable profile

### Instructor
- Dashboard with course performance table (students enrolled, revenue in Taka)
- Recent enrollment activity feed
- Create, edit, and delete their own courses
- Add lessons to a course, with video URL, duration, and ordering
- Upload a real course thumbnail image (via Cloudinary) or paste an image URL

### Admin
- Everything an instructor can do, on any course (not just their own)
- View all registered users, with search and role filtering
- (Suspend/delete user actions are not yet wired up — see Roadmap below)

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose ODM), hosted on MongoDB Atlas |
| Auth | JWT (jsonwebtoken), bcrypt password hashing |
| Backend security | Helmet (secure headers), express-rate-limit (brute-force protection), Morgan (request logging) |
| Image uploads | Multer (in-memory) + Cloudinary |
| Validation | express-validator |
| Frontend | React 18 (Vite), React Router 6 |
| Frontend styling | Tailwind CSS 3 |
| HTTP client | Axios |

## Project Structure

```
pathshala/
├── backend/                Express REST API (Node.js)
│   ├── config/              DB connection, Cloudinary config
│   ├── controllers/         business logic per resource
│   ├── middleware/          auth, RBAC, validation, upload, error handling
│   ├── models/               Mongoose schemas (User, Course, Lesson, Enrollment)
│   ├── routes/                Express routers per resource
│   ├── seed.js                 sample data script (courses, lessons, test accounts)
│   └── server.js                app entry point
└── frontend/                React app (Vite)
    └── src/
        ├── components/       Sidebar, Topbar, Navbar, CourseCard, ProgressBar, etc.
        ├── context/            AuthContext (JWT + user session)
        ├── pages/               Dashboard, CourseList, CourseDetails, LessonPlayer, etc.
        ├── services/            Axios wrappers per API resource
        └── utils/                currency formatting, category/level theming
```

## Database Schema

Four core collections, related as follows:

- **User** — `name, email, password (hashed), role, avatar, enrolledCourses[]`
- **Course** — `title, description, thumbnail, category, level, price, instructor (ref User), lessons[]`
- **Lesson** — `course (ref Course), title, videoUrl, duration, order, resources[]`
- **Enrollment** — `student (ref User), course (ref Course), progress[{lesson, completed, completedAt}], overallProgress`

A course has many lessons; a student's enrollment tracks completion per lesson and
recalculates an overall percentage whenever a lesson is marked complete.

## Getting Started

### Backend
```
cd backend
npm install
cp .env.example .env   # add your MongoDB Atlas URI, a JWT secret, and (optionally) Cloudinary keys
npm run seed             # optional: populate sample courses and test accounts
npm run dev
```
Runs on `http://localhost:5000`.

### Frontend
```
cd frontend
npm install
cp .env.example .env    # point VITE_API_URL at your backend
npm run dev
```
Runs on `http://localhost:5173`.

## API Overview

| Method | Endpoint | Access |
|---|---|---|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| GET | /api/auth/me | Authenticated |
| PUT | /api/users/me | Authenticated |
| GET | /api/users | Admin |
| GET | /api/courses | Public |
| GET | /api/courses/:id | Public |
| GET | /api/courses/my-courses | Instructor/Admin |
| POST | /api/courses | Instructor/Admin |
| PUT | /api/courses/:id | Owning instructor/Admin |
| DELETE | /api/courses/:id | Owning instructor/Admin |
| POST | /api/lessons | Instructor/Admin |
| GET | /api/lessons/course/:courseId | Public |
| GET | /api/lessons/:id | Authenticated + enrolled |
| PUT | /api/lessons/:id | Owning instructor/Admin |
| DELETE | /api/lessons/:id | Owning instructor/Admin |
| POST | /api/enrollments | Student |
| GET | /api/enrollments/my-courses | Student |
| GET | /api/enrollments/:courseId | Student |
| PUT | /api/enrollments/:courseId/progress | Student |
| GET | /api/enrollments/course/:courseId/students | Owning instructor/Admin |
| GET | /api/enrollments/recent-activity | Instructor/Admin |
| POST | /api/upload/image | Instructor/Admin |
| GET | /api/health | Public |

## Roadmap

Planned but not yet implemented:
- Admin: suspend/delete user accounts
- Automated backend test suite (Jest + Supertest)
- Course reviews and ratings
- Payment integration (bKash/SSLCommerz)
- Real-time notifications (Socket.io)
- Certificate generation on course completion

## License

Built for educational purposes as part of the ES MERN 2501 final project assignment.