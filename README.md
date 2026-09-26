# LMS Boilerplate — MERN Stack Final Project

Working starter for the Learning Management System project. Auth, RBAC, and the
Course/Lesson/Enrollment schema are scaffolded so you can focus on building out
features from Day 3 onward.

## Structure

```
lms-boilerplate/
├── backend/     Express + MongoDB API (see backend/README.md)
└── frontend/    React (Vite) + Tailwind app (see frontend/README.md)
```

## Quick Start

**Backend:**
```
cd backend
npm install
cp .env.example .env   # fill in MONGO_URI and JWT_SECRET
npm run dev
```

**Frontend** (in a separate terminal):
```
cd frontend
npm install
cp .env.example .env   # point VITE_API_URL at your backend
npm run dev
```

Visit `http://localhost:5173`, register an account, and you'll land on a
role-aware dashboard — auth and RBAC are fully working end to end.

## What's already working

- Register / Login with JWT, passwords hashed with bcrypt
- Role-based access control (student / instructor / admin) enforced on the backend
- Protected routes on the frontend, auto-redirect on expired/invalid tokens
- Centralized error handling and request validation
- Course / Lesson / Enrollment Mongoose models ready for you to build routes around

## What you build next (see main project plan, Days 3-7)

- Course, Lesson, Enrollment controllers/routes on the backend
- Course listing/details, enrollment, lesson player, progress tracking UI on the frontend
- Deployment (Render for backend, Vercel/Netlify for frontend)
