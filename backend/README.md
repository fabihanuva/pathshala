# LMS Backend

Node.js + Express + MongoDB backend for the Learning Management System final project.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in your values:
   ```
   cp .env.example .env
   ```
   - `MONGO_URI`: your MongoDB Atlas connection string
   - `JWT_SECRET`: any long random string
   - `CLIENT_URL`: your frontend URL (for CORS)

3. Run in development (auto-restart on changes):
   ```
   npm run dev
   ```

4. Server runs at `http://localhost:5000`. Test it:
   ```
   GET http://localhost:5000/api/health
   ```

## What's included

- User model with password hashing (bcrypt)
- JWT-based auth (`register`, `login`, `me`)
- Role-based access control middleware (`student`, `instructor`, `admin`)
- Centralized error handling + 404 handler
- Request validation with express-validator
- Course, Lesson, Enrollment models scaffolded (ready for Day 3 routes/controllers)

## API Endpoints

### Auth
| Method | Route              | Access        | Description         |
|--------|--------------------|---------------|----------------------|
| POST   | /api/auth/register | Public        | Register new user   |
| POST   | /api/auth/login     | Public        | Login, returns JWT  |
| GET    | /api/auth/me          | Authenticated | Get current user    |

### Users
| Method | Route          | Access        | Description        |
|--------|----------------|---------------|----------------------|
| PUT    | /api/users/me   | Authenticated | Update own profile  |
| GET    | /api/users        | Admin only    | List all users       |

### Courses
| Method | Route                   | Access                | Description                                  |
|--------|--------------------------|------------------------|-----------------------------------------------|
| GET    | /api/courses               | Public                 | List courses (supports `?search=&category=&minPrice=&maxPrice=&page=&limit=`) |
| GET    | /api/courses/my-courses     | Instructor/Admin       | Courses the logged-in instructor teaches      |
| GET    | /api/courses/:id             | Public                 | Course detail with populated lessons           |
| POST   | /api/courses                   | Instructor/Admin       | Create a course                                 |
| PUT    | /api/courses/:id                 | Owning instructor/Admin | Update a course                                  |
| DELETE | /api/courses/:id                   | Owning instructor/Admin | Delete a course (cascades lessons + enrollments) |

### Lessons
| Method | Route                        | Access                  | Description                                        |
|--------|-------------------------------|---------------------------|------------------------------------------------------|
| POST   | /api/lessons                     | Instructor (owns course)/Admin | Add a lesson to a course                          |
| GET    | /api/lessons/course/:courseId       | Public                    | List lesson metadata for a course                  |
| GET    | /api/lessons/:id                      | Authenticated + enrolled  | Get one lesson (video URL) — requires enrollment, ownership, or admin |
| PUT    | /api/lessons/:id                        | Owning instructor/Admin   | Update a lesson                                       |
| DELETE | /api/lessons/:id                          | Owning instructor/Admin   | Delete a lesson                                        |

### Enrollments
| Method | Route                                  | Access             | Description                                  |
|--------|------------------------------------------|----------------------|-------------------------------------------------|
| POST   | /api/enrollments                             | Student              | Enroll in a course (body: `{ courseId }`)      |
| GET    | /api/enrollments/my-courses                     | Student              | List the student's enrolled courses + progress |
| GET    | /api/enrollments/:courseId                        | Student              | Get own progress detail for one course          |
| PUT    | /api/enrollments/:courseId/progress                 | Student              | Mark a lesson complete/incomplete (body: `{ lessonId, completed }`) — recalculates overall % |
| GET    | /api/enrollments/course/:courseId/students             | Owning instructor/Admin | See who's enrolled in a course                   |
| GET    | /api/enrollments/recent-activity                          | Instructor/Admin | Latest enrollments across your courses (dashboard feed) |

### Uploads
| Method | Route             | Access              | Description                                          |
|--------|-------------------|----------------------|--------------------------------------------------------|
| POST   | /api/upload/image  | Instructor/Admin     | Upload an image (multipart field `image`), returns `{ url }` hosted on Cloudinary |

To use uploads, create a free account at cloudinary.com, and add your
`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` to `.env`
(see `.env.example`). Without these set, course creation/editing still works — just
paste an image URL directly instead of uploading a file.

## Production-readiness additions

- **helmet** — sets secure HTTP headers by default
- **express-rate-limit** — throttles `/api/auth/*` to 100 requests/15min per IP, blunting brute-force login attempts
- **morgan** — request logging in development (disabled automatically when `NODE_ENV=production`)

## Next steps (Day 4-5)

Backend is now feature-complete for the MVP. Move to the frontend: build the
Course Listing, Course Details, Lesson Player, and Progress UI, wiring them to
these endpoints via `services/api.js` on the frontend.
